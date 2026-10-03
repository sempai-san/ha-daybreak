import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../api";
import { t } from "../i18n";
import { shared } from "../styles";
import { fireEvent, friendlyName } from "../util";

interface Item {
  id: string;
  name: string;
  area: string;
  group: boolean;
}

/**
 * Own entity picker (no dependency on HA's lazy-loaded selectors).
 * Single or multiple selection, grouped by area; with ``areaPick`` a tap on
 * an area selects only the matching entities in it. Emits "value-changed"
 * {value} with an entity id (single) or a list (multiple).
 */
export class DbEntityPicker extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) domains: string[] = ["light"];
  @property({ attribute: false }) deviceClass?: string;
  /** Prefer entities with these units (e.g. travel times in minutes). */
  @property({ attribute: false }) units?: string[];
  @property({ attribute: false }) value: string | string[] | null = null;
  @property({ type: Boolean }) multiple = false;
  @property({ type: Boolean }) areaPick = false;
  @property() label = "";
  @property() placeholder = "";
  @state() private _open = false;
  @state() private _query = "";

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
      }
      .label {
        font-size: 13px;
        color: var(--db-muted);
        margin-bottom: 4px;
      }
      .panel {
        margin-top: 8px;
        border: 1px solid var(--db-line);
        border-radius: 12px;
        max-height: 360px;
        overflow: auto;
        background: var(--db-bg);
      }
      .search {
        position: sticky;
        top: 0;
        padding: 8px;
        background: var(--db-bg);
        border-bottom: 1px solid var(--db-line);
      }
      .search input {
        width: 100%;
      }
      .area {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px 4px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--db-muted);
      }
      .area button {
        margin-left: auto;
        border: none;
        background: none;
        color: var(--db-accent);
        cursor: pointer;
        font-size: 12px;
        text-transform: none;
        letter-spacing: 0;
      }
      .item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: 44px;
        padding: 6px 12px;
        border: none;
        background: none;
        cursor: pointer;
        text-align: left;
      }
      .item:hover {
        background: var(--db-tile);
      }
      .item[aria-selected="true"] {
        background: color-mix(in srgb, var(--db-accent) 12%, transparent);
      }
      .box {
        width: 20px;
        height: 20px;
        flex: none;
        border-radius: 5px;
        border: 2px solid var(--db-muted);
        display: grid;
        place-items: center;
        font-size: 13px;
        line-height: 1;
      }
      .item[aria-selected="true"] .box {
        background: var(--db-accent);
        border-color: var(--db-accent);
        color: var(--db-on-accent);
      }
      .radio {
        border-radius: 10px;
      }
      .id {
        font-size: 11px;
        color: var(--db-muted);
      }
      .badge {
        font-size: 11px;
        padding: 1px 6px;
        border-radius: 6px;
        background: var(--db-tile);
        color: var(--db-muted);
      }
      .empty {
        padding: 12px;
        color: var(--db-muted);
      }
    `,
  ];

  private get _selected(): string[] {
    if (!this.value) return [];
    return Array.isArray(this.value) ? this.value : [this.value];
  }

  private _items(): Item[] {
    const all = this._allItems();
    if (!this.units?.length || !this.hass) return all;
    const states = this.hass.states;
    const preferred = all.filter((i) => this.units!.includes(states[i.id]?.attributes.unit_of_measurement));
    return preferred.length ? preferred : all;
  }

  private _allItems(): Item[] {
    const hass = this.hass;
    if (!hass) return [];
    const entities = hass.entities ?? {};
    const devices = hass.devices ?? {};
    const areas = hass.areas ?? {};
    return Object.values(hass.states)
      .filter((s) => this.domains.includes(s.entity_id.split(".")[0]))
      .filter((s) => !this.deviceClass || s.attributes.device_class === this.deviceClass)
      .map((s) => {
        const reg = entities[s.entity_id];
        const areaId = reg?.area_id ?? (reg?.device_id ? devices[reg.device_id]?.area_id : null);
        return {
          id: s.entity_id,
          name: friendlyName(hass, s.entity_id),
          area: (areaId && areas[areaId]?.name) || "",
          group: Array.isArray(s.attributes.entity_id),
        };
      })
      .sort((a, b) => (a.area || "~").localeCompare(b.area || "~") || a.name.localeCompare(b.name));
  }

  private _emit(next: string[]) {
    fireEvent(this, "value-changed", { value: this.multiple ? next : next[0] ?? null });
  }

  private _toggle(id: string) {
    const sel = this._selected;
    if (!this.multiple) {
      this._emit(sel[0] === id ? [] : [id]);
      this._open = false;
      return;
    }
    this._emit(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
  }

  private _toggleArea(ids: string[]) {
    const sel = this._selected;
    const all = ids.every((id) => sel.includes(id));
    this._emit(all ? sel.filter((x) => !ids.includes(x)) : [...new Set([...sel, ...ids])]);
  }

  render() {
    const hass = this.hass;
    const sel = this._selected;
    const q = this._query.trim().toLowerCase();
    const items = this._items().filter(
      (i) => !q || i.name.toLowerCase().includes(q) || i.id.includes(q) || i.area.toLowerCase().includes(q),
    );
    const byArea = new Map<string, Item[]>();
    for (const item of items) byArea.set(item.area, [...(byArea.get(item.area) ?? []), item]);
    return html`
      ${this.label ? html`<div class="label">${this.label}</div>` : nothing}
      <div class="head">
        ${sel.map(
          (id) => html`<span class="chip" aria-pressed="true">${friendlyName(hass, id)}
            <button class="x" aria-label=${t(hass, "remove")} @click=${() => this._emit(sel.filter((x) => x !== id))}>✕</button>
          </span>`,
        )}
        <button class="chip" aria-expanded=${this._open} @click=${() => (this._open = !this._open)}>
          ${this._open ? t(hass, "picker_close") : sel.length && !this.multiple ? t(hass, "picker_change") : this.placeholder || t(hass, "picker_add")}
        </button>
      </div>
      ${this._open
        ? html`<div class="panel" role="listbox" aria-multiselectable=${this.multiple}>
            <div class="search">
              <input class="inp" type="search" .value=${this._query} placeholder=${t(hass, "picker_search")}
                @input=${(e: Event) => (this._query = (e.target as HTMLInputElement).value)} />
            </div>
            ${items.length
              ? [...byArea.entries()].map(([area, list]) => {
                  const ids = list.map((i) => i.id);
                  const all = ids.every((id) => sel.includes(id));
                  return html`<div class="area">
                      <span>${area || t(hass, "picker_no_area")}</span>
                      ${this.multiple && this.areaPick && area
                        ? html`<button @click=${() => this._toggleArea(ids)}>
                            ${all ? t(hass, "picker_area_none") : t(hass, "picker_area_all")}
                          </button>`
                        : nothing}
                    </div>
                    ${list.map(
                      (i) => html`<button class="item" role="option" aria-selected=${sel.includes(i.id)} @click=${() => this._toggle(i.id)}>
                        <span class="box ${this.multiple ? "" : "radio"}">${sel.includes(i.id) ? "✓" : ""}</span>
                        <span class="grow"><div>${i.name}</div><div class="id">${i.id}</div></span>
                        ${i.group ? html`<span class="badge">${t(hass, "picker_group")}</span>` : nothing}
                      </button>`,
                    )}`;
                })
              : html`<div class="empty">${t(hass, "picker_none")}</div>`}
          </div>`
        : nothing}
    `;
  }
}

customElements.define("db-entity-picker", DbEntityPicker);
