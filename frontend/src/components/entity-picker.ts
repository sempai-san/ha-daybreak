import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../api";
import { t } from "../i18n";
import { shared } from "../styles";
import { fireEvent, friendlyName } from "../util";

interface Leaf {
  id: string;
  name: string;
  group: boolean;
}

interface DeviceNode {
  id: string;
  name: string;
  leaves: Leaf[];
}

interface AreaNode {
  id: string;
  name: string;
  devices: DeviceNode[];
  leaves: Leaf[];
}

interface FloorNode {
  id: string;
  name: string;
  level: number;
  areas: AreaNode[];
}

const NO_FLOOR = "__no_floor";
const NO_AREA = "__no_area";

/**
 * Entity picker in the style of HA's target tree: floor → area → device →
 * entity. Only entities that fit (``domains``, ``deviceClass``, ``units``)
 * are shown; empty areas and devices are hidden. Ticking an area or device
 * selects only the matching entities in it. Emits "value-changed" {value}
 * with an entity id (single) or a list (multiple).
 */
export class DbEntityPicker extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) domains: string[] = ["light"];
  @property({ attribute: false }) deviceClass?: string;
  /** Prefer entities with these units (e.g. travel times in minutes). */
  @property({ attribute: false }) units?: string[];
  @property({ attribute: false }) value: string | string[] | null = null;
  @property({ type: Boolean }) multiple = false;
  /** Kept for compatibility: areas and devices are always pickable with multiple. */
  @property({ type: Boolean }) areaPick = false;
  @property() label = "";
  @property() placeholder = "";
  @state() private _open = false;
  @state() private _query = "";
  @state() private _expanded = new Set<string>();

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
        max-height: 420px;
        overflow: auto;
        background: var(--db-bg);
      }
      .search {
        position: sticky;
        top: 0;
        z-index: 1;
        padding: 8px;
        background: var(--db-bg);
        border-bottom: 1px solid var(--db-line);
      }
      .search input {
        width: 100%;
      }
      .floor {
        padding: 10px 12px 4px;
        font-size: 13px;
        font-weight: 600;
        color: var(--db-muted);
        background: var(--db-tile);
      }
      .node {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        padding: 4px 12px 4px calc(12px + var(--depth, 0) * 22px);
      }
      .node:hover {
        background: var(--db-tile);
      }
      .chev {
        width: 28px;
        height: 28px;
        flex: none;
        border: none;
        background: none;
        cursor: pointer;
        color: var(--db-muted);
        transition: transform 0.15s;
        padding: 0;
      }
      .chev[aria-expanded="true"] {
        transform: rotate(90deg);
      }
      .chev.none {
        visibility: hidden;
      }
      .box {
        width: 22px;
        height: 22px;
        flex: none;
        border-radius: 5px;
        border: 2px solid var(--db-muted);
        background: transparent;
        display: grid;
        place-items: center;
        cursor: pointer;
        color: var(--db-on-accent);
        font-size: 14px;
        line-height: 1;
        padding: 0;
      }
      .box[aria-checked="true"],
      .box[aria-checked="mixed"] {
        background: var(--db-accent);
        border-color: var(--db-accent);
      }
      .box.radio {
        border-radius: 11px;
      }
      .text {
        flex: 1;
        min-width: 0;
        cursor: pointer;
        border: none;
        background: none;
        text-align: left;
        padding: 0;
      }
      .text .id {
        display: block;
        font-size: 11px;
        color: var(--db-muted);
      }
      .count {
        font-size: 12px;
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

  private _matches(entityId: string): boolean {
    const st = this.hass?.states[entityId];
    if (!st || !this.domains.includes(entityId.split(".")[0])) return false;
    if (this.deviceClass && st.attributes.device_class !== this.deviceClass) return false;
    return true;
  }

  private _candidates(): string[] {
    const hass = this.hass;
    if (!hass) return [];
    const all = Object.keys(hass.states).filter((id) => this._matches(id));
    if (!this.units?.length) return all;
    const preferred = all.filter((id) => this.units!.includes(hass.states[id].attributes.unit_of_measurement));
    return preferred.length ? preferred : all;
  }

  /** floor → area → device → entity, only with matching entities. */
  private _tree(q: string): FloorNode[] {
    const hass = this.hass!;
    const entities = hass.entities ?? {};
    const devices = hass.devices ?? {};
    const areas = hass.areas ?? {};
    const floors = hass.floors ?? {};
    const floorMap = new Map<string, FloorNode>();
    const areaMap = new Map<string, AreaNode>();
    const floorOf = (floorId: string): FloorNode => {
      let f = floorMap.get(floorId);
      if (!f) {
        const info = floors[floorId];
        f = {
          id: floorId,
          name: info?.name ?? (floorId === NO_FLOOR ? "" : floorId),
          level: info?.level ?? (floorId === NO_FLOOR ? 999 : 0),
          areas: [],
        };
        floorMap.set(floorId, f);
      }
      return f;
    };
    const areaOf = (areaId: string): AreaNode => {
      let a = areaMap.get(areaId);
      if (!a) {
        const info = areas[areaId];
        a = { id: areaId, name: info?.name ?? t(hass, "picker_no_area"), devices: [], leaves: [] };
        areaMap.set(areaId, a);
        floorOf(info?.floor_id ?? NO_FLOOR).areas.push(a);
      }
      return a;
    };
    for (const id of this._candidates()) {
      const reg = entities[id];
      const device = reg?.device_id ? devices[reg.device_id] : undefined;
      const areaId = reg?.area_id ?? device?.area_id ?? NO_AREA;
      const area = areaOf(areaId);
      const leaf: Leaf = {
        id,
        name: friendlyName(hass, id),
        group: Array.isArray(hass.states[id].attributes.entity_id),
      };
      const deviceName = device ? device.name_by_user || device.name || "" : "";
      const hay = `${leaf.name} ${id} ${area.name} ${deviceName}`.toLowerCase();
      if (q && !hay.includes(q)) continue;
      if (device && reg?.device_id) {
        let node = area.devices.find((d) => d.id === reg.device_id);
        if (!node) {
          node = { id: reg.device_id, name: deviceName || leaf.name, leaves: [] };
          area.devices.push(node);
        }
        node.leaves.push(leaf);
      } else {
        area.leaves.push(leaf);
      }
    }
    const byName = <T extends { name: string }>(a: T, b: T) => a.name.localeCompare(b.name);
    return [...floorMap.values()]
      .map((f) => ({
        ...f,
        areas: f.areas
          .filter((a) => a.devices.length || a.leaves.length)
          .map((a) => ({ ...a, devices: a.devices.sort(byName), leaves: a.leaves.sort(byName) }))
          .sort((a, b) => (a.id === NO_AREA ? 1 : b.id === NO_AREA ? -1 : byName(a, b))),
      }))
      .filter((f) => f.areas.length)
      .sort((a, b) => a.level - b.level || byName(a, b));
  }

  private _emit(next: string[]) {
    fireEvent(this, "value-changed", { value: this.multiple ? next : next[0] ?? null });
  }

  private _toggleIds(ids: string[]) {
    const sel = this._selected;
    if (!this.multiple) {
      this._emit(sel[0] === ids[0] ? [] : [ids[0]]);
      this._open = false;
      return;
    }
    const all = ids.every((id) => sel.includes(id));
    this._emit(all ? sel.filter((x) => !ids.includes(x)) : [...new Set([...sel, ...ids])]);
  }

  private _expand(key: string) {
    const next = new Set(this._expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._expanded = next;
  }

  private _check(ids: string[]): "true" | "false" | "mixed" {
    const sel = this._selected;
    const n = ids.filter((id) => sel.includes(id)).length;
    return n === 0 ? "false" : n === ids.length ? "true" : "mixed";
  }

  private _node(
    depth: number,
    key: string,
    label: string,
    ids: string[],
    children: TemplateResult[] | null,
    extra?: { id?: string; group?: boolean },
  ) {
    const open = this._expanded.has(key) || !!this._query.trim();
    const state = this._check(ids);
    const selectable = this.multiple || !children;
    return html`<div class="node" style="--depth:${depth}">
        <button class="chev ${children ? "" : "none"}" aria-expanded=${open} aria-label=${label}
          @click=${() => children && this._expand(key)}>▸</button>
        ${selectable
          ? html`<button class="box ${this.multiple ? "" : "radio"}" role="checkbox" aria-checked=${state} aria-label=${label}
              @click=${() => this._toggleIds(ids)}>${state === "true" ? "✓" : state === "mixed" ? "–" : ""}</button>`
          : nothing}
        <button class="text" @click=${() => (children ? this._expand(key) : this._toggleIds(ids))}>
          ${label}${extra?.id ? html`<span class="id">${extra.id}</span>` : nothing}
        </button>
        ${extra?.group ? html`<span class="badge">${t(this.hass, "picker_group")}</span>` : nothing}
        ${children ? html`<span class="count">${ids.length}</span>` : nothing}
      </div>
      ${children && open ? children : nothing}`;
  }

  private _leaf(depth: number, leaf: Leaf) {
    return this._node(depth, leaf.id, leaf.name, [leaf.id], null, { id: leaf.id, group: leaf.group });
  }

  render() {
    const hass = this.hass;
    if (!hass) return nothing;
    const sel = this._selected;
    const tree = this._open ? this._tree(this._query.trim().toLowerCase()) : [];
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
        ? html`<div class="panel">
            <div class="search">
              <input class="inp" type="search" .value=${this._query} placeholder=${t(hass, "picker_search")}
                @input=${(e: Event) => (this._query = (e.target as HTMLInputElement).value)} />
            </div>
            ${tree.length
              ? tree.map(
                  (floor) => html`${floor.name || tree.length > 1
                      ? html`<div class="floor">${floor.name || t(hass, "picker_other")}</div>`
                      : nothing}
                    ${floor.areas.map((area) => {
                      const areaIds = [...area.devices.flatMap((d) => d.leaves.map((l) => l.id)), ...area.leaves.map((l) => l.id)];
                      const children = [
                        ...area.devices.map((dev) =>
                          dev.leaves.length === 1
                            ? this._leaf(1, dev.leaves[0])
                            : this._node(1, `d:${dev.id}`, dev.name, dev.leaves.map((l) => l.id), dev.leaves.map((l) => this._leaf(2, l))),
                        ),
                        ...area.leaves.map((l) => this._leaf(1, l)),
                      ];
                      return this._node(0, `a:${area.id}`, area.name, areaIds, children);
                    })}`,
                )
              : html`<div class="empty">${t(hass, "picker_none")}</div>`}
          </div>`
        : nothing}
    `;
  }
}

customElements.define("db-entity-picker", DbEntityPicker);
