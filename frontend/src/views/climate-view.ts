import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { deleteProfile, saveProfile, type ClimateProfile, type HomeAssistant, type Snapshot } from "../api";
import { errorText, t, type StringKey } from "../i18n";
import { defaultClimateSettings } from "../model";
import { shared } from "../styles";
import { define, fireEvent } from "../util";
import "../components/climate-settings";

/** Climate profiles: how warm or cool the room should be at the alarm. */
export class DbClimateView extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) snapshot?: Snapshot;
  @state() private _sel = "warm";
  @state() private _edit?: ClimateProfile;
  @state() private _confirmed = false;

  static styles = [
    shared,
    css`
      .wrap {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr);
        gap: 16px;
        align-items: start;
      }
      aside {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .item {
        display: flex;
        flex-direction: column;
        padding: 10px 12px;
        border-radius: 12px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .item[aria-current="true"] {
        background: color-mix(in srgb, var(--db-accent) 14%, transparent);
      }
      main {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      h2 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: var(--db-muted);
      }
      .warn {
        padding: 12px 14px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--warning-color, #ffa600) 16%, transparent);
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
      ha-selector {
        display: block;
      }
      @media (max-width: 760px) {
        .wrap {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  private get _profiles(): ClimateProfile[] {
    return this.snapshot?.climate_profiles ?? [];
  }

  private _users(id: string) {
    return (this.snapshot?.alarms ?? []).filter((a) => a.climate?.profile === id);
  }

  private _shared(id: string) {
    return new Set(this._users(id).filter((a) => a.owners.length).map((a) => [...a.owners].sort().join())).size > 1;
  }

  private _error(err: unknown) {
    fireEvent(this, "hass-notification", { message: errorText(this.hass, err) });
  }

  private _describe(p: ClimateProfile) {
    const hass = this.hass;
    const s = p.settings;
    const temp = ["heat", "cool", "heat_cool", "auto"].includes(s.mode) ? ` ${s.temperature} °C` : "";
    const start = s.start === "fixed" ? t(hass, "cl_start_fixed") + ` (${s.lead} min)` : t(hass, "cl_start_learned");
    return `${t(hass, `clm_${s.mode}` as StringKey)}${temp} · ${start} · ${t(hass, `cl_after_${s.after}` as StringKey)}`;
  }

  private _start(p: ClimateProfile, copy: boolean) {
    const draft = structuredClone(p);
    if (copy) {
      draft.id = "";
      delete draft.builtin;
      draft.name = t(this.hass, "profile_copy_name", { name: p.name });
    }
    this._edit = draft;
    this._confirmed = false;
  }

  private async _save() {
    const hass = this.hass;
    const draft = this._edit;
    if (!hass || !draft) return;
    const data: Partial<ClimateProfile> = { ...draft };
    if (!data.id) delete data.id;
    try {
      const saved = await saveProfile<ClimateProfile>(hass, "climate", data, this._confirmed);
      this._sel = saved.id;
      this._edit = undefined;
    } catch (err) {
      this._error(err);
    }
  }

  render() {
    const hass = this.hass;
    return html`<p class="muted" style="margin:0">${t(hass, "cl_intro")}</p>
      <div class="wrap">
        <aside class="card">
          <button class="btn primary" @click=${() =>
            this._start({ id: "", name: t(hass, "cl_new_name"), settings: defaultClimateSettings() }, false)}>
            + ${t(hass, "profile_new_btn")}
          </button>
          ${this._profiles.map(
            (p) => html`<button class="item" aria-current=${!this._edit && this._sel === p.id}
              @click=${() => {
                this._sel = p.id;
                this._edit = undefined;
              }}>
              <b>${p.name}</b>
              <span class="muted">${this._describe(p)}</span>
            </button>`,
          )}
        </aside>
        <main class="card">${this._edit ? this._editor() : this._detail()}</main>
      </div>`;
  }

  private _detail() {
    const hass = this.hass;
    const p = this._profiles.find((x) => x.id === this._sel) ?? this._profiles[0];
    if (!p) return nothing;
    const users = this._users(p.id);
    const shared = this._shared(p.id);
    return html`
      <div class="row">
        <h2 class="grow">${p.name}</h2>
        ${p.builtin || shared
          ? html`<button class="btn" @click=${() => this._start(p, true)}>${t(hass, "edit_copy")}</button>`
          : html`<button class="btn" @click=${() => this._start(p, false)}>${t(hass, "edit")}</button>`}
      </div>
      ${shared ? html`<div class="warn">${t(hass, "profile_shared_hint")}</div>` : nothing}
      <div class="muted">${t(hass, "used_by")}: ${users.length ? users.map((a) => a.name).join(", ") : t(hass, "nobody")}</div>
      <db-climate-settings .hass=${hass} .settings=${p.settings} locked></db-climate-settings>
    `;
  }

  private _editor() {
    const hass = this.hass;
    const draft = this._edit!;
    const users = draft.id ? this._users(draft.id) : [];
    const shared = draft.id ? this._shared(draft.id) : false;
    const needsConfirm = users.length > 1;
    return html`
      <input class="inp" style="font-size:20px;height:44px" .value=${draft.name} aria-label=${t(hass, "f_name")}
        @input=${(ev: Event) => (this._edit = { ...draft, name: (ev.target as HTMLInputElement).value })} />
      ${shared ? html`<div class="warn">${t(hass, "profile_shared_hint")}</div>` : nothing}
      ${!shared && users.length
        ? html`<label class="warn">
            ${needsConfirm
              ? html`<input type="checkbox" .checked=${this._confirmed} @change=${(ev: Event) => (this._confirmed = (ev.target as HTMLInputElement).checked)} />`
              : nothing}
            <span>${t(hass, "profile_in_use_hint", { n: users.length, names: users.map((a) => a.name).join(", ") })}</span>
          </label>`
        : nothing}
      <db-climate-settings .hass=${hass} .settings=${draft.settings}
        @climate-change=${(ev: CustomEvent) => (this._edit = { ...draft, settings: ev.detail })}></db-climate-settings>
      <div class="row">
        ${draft.id && !users.length && !draft.builtin
          ? html`<button class="btn danger" @click=${async () => {
              if (!hass || !confirm(t(hass, "profile_delete_confirm", { name: draft.name }))) return;
              try {
                await deleteProfile(hass, "climate", draft.id);
                this._edit = undefined;
                this._sel = "warm";
              } catch (err) {
                this._error(err);
              }
            }}>${t(hass, "delete")}</button>`
          : nothing}
        <span class="grow"></span>
        <button class="btn" @click=${() => (this._edit = undefined)}>${t(hass, "cancel")}</button>
        <button class="btn primary" ?disabled=${shared || (needsConfirm && !this._confirmed) || !draft.name.trim()} @click=${this._save}>
          ${t(hass, "profile_save")}</button>
      </div>
    `;
  }
}

define("db-climate-view", DbClimateView);
