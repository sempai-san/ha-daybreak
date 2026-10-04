import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  deleteProfile,
  preview,
  saveProfile,
  type EditorMode,
  type HomeAssistant,
  type LightProfile,
  type Snapshot,
} from "../api";
import { errorText, t, type StringKey } from "../i18n";
import { curvePoints, defaultSettings, levelAt, levelCss, rampGradient } from "../model";
import { shared } from "../styles";
import { fireEvent, formatClock, toHHMM, define } from "../util";
import "../components/light-settings";

/** Light profiles: list, read-only detail view and editor with lock rules. */
export class DbProfilesView extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) snapshot?: Snapshot;
  @property() mode: EditorMode = "normal";
  @state() private _sel = "natural";
  @state() private _edit?: LightProfile;
  @state() private _editMode?: EditorMode;
  @state() private _confirmed = false;
  @state() private _previewLight = "";
  @state() private _previewAt = 1;

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
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 12px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .item[aria-current="true"] {
        background: color-mix(in srgb, var(--db-accent) 14%, transparent);
      }
      .item i {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        flex: none;
      }
      .item span {
        display: flex;
        flex-direction: column;
        min-width: 0;
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
      .facts {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }
      .facts div {
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--db-tile);
      }
      .facts b {
        display: block;
        margin-top: 2px;
      }
      .ramp {
        height: 56px;
        border-radius: 12px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      th,
      td {
        text-align: left;
        padding: 6px 8px;
        border-bottom: 1px solid var(--db-line);
      }
      th {
        color: var(--db-muted);
        font-weight: 500;
      }
      .sw {
        display: inline-block;
        width: 22px;
        height: 22px;
        border-radius: 6px;
        vertical-align: middle;
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
      .name {
        font-size: 20px;
        height: 44px;
        flex: 1;
        min-width: 200px;
      }
      @media (max-width: 760px) {
        .wrap {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  private get _profiles() {
    return this.snapshot?.light_profiles ?? [];
  }

  private _users(id: string) {
    return (this.snapshot?.alarms ?? []).filter(
      (a) => a.light.profile === id || a.light.overrides.some((o) => o.profile === id),
    );
  }

  private _shared(id: string) {
    const sets = new Set(this._users(id).filter((a) => a.owners.length).map((a) => [...a.owners].sort().join()));
    return sets.size > 1;
  }

  private _error(err: unknown) {
    fireEvent(this, "hass-notification", { message: errorText(this.hass, err) });
  }

  private _startEdit(profile: LightProfile, copy: boolean) {
    const hass = this.hass;
    const draft = structuredClone(profile);
    if (copy) {
      delete (draft as Partial<LightProfile>).id;
      delete draft.builtin;
      draft.name = t(hass, "profile_copy_name", { name: profile.name });
    }
    this._edit = draft;
    this._confirmed = false;
  }

  private _new() {
    this._edit = { id: "", name: t(this.hass, "profile_new_name"), duration: 30, settings: defaultSettings() };
    this._confirmed = false;
  }

  private async _save() {
    const hass = this.hass;
    const draft = this._edit;
    if (!hass || !draft) return;
    if (!draft.name.trim()) {
      this._error(new Error(t(hass, "profile_name_required")));
      return;
    }
    const data: Partial<LightProfile> = { ...draft };
    if (!data.id) delete data.id;
    try {
      const saved = await saveProfile<LightProfile>(hass, "light", data, this._confirmed);
      this._sel = saved.id;
      this._edit = undefined;
    } catch (err) {
      this._error(err);
    }
  }

  private async _delete(profile: LightProfile) {
    if (!this.hass || !confirm(t(this.hass, "profile_delete_confirm", { name: profile.name }))) return;
    try {
      await deleteProfile(this.hass, "light", profile.id);
      this._sel = "natural";
      this._edit = undefined;
    } catch (err) {
      this._error(err);
    }
  }

  render() {
    const hass = this.hass;
    const builtin = this._profiles.filter((p) => p.builtin);
    const own = this._profiles.filter((p) => !p.builtin);
    const item = (p: LightProfile) => html`<button class="item" aria-current=${!this._edit && this._sel === p.id}
      @click=${() => {
        this._sel = p.id;
        this._edit = undefined;
      }}>
      <i style="background:${rampGradient(p.settings)}"></i>
      <span><b>${p.name}</b><span class="muted">${t(hass, `curve_${p.settings.curve}` as StringKey)} · ${p.duration} min</span></span>
    </button>`;
    return html`<p class="muted" style="margin:0">${t(hass, "profiles_intro")}</p>
      <div class="wrap">
        <aside class="card">
          <button class="btn primary" @click=${this._new}>+ ${t(hass, "profile_new_btn")}</button>
          <div class="lbl" style="margin-top:8px">${t(hass, "templates")}</div>
          ${builtin.map(item)}
          <div class="lbl" style="margin-top:8px">${t(hass, "own_profiles")}</div>
          ${own.length ? own.map(item) : html`<span class="muted">${t(hass, "none")}</span>`}
        </aside>
        <main class="card">${this._edit ? this._editor() : this._detail()}</main>
      </div>`;
  }

  private _detail() {
    const hass = this.hass;
    const p = this._profiles.find((x) => x.id === this._sel) ?? this._profiles[0];
    if (!p) return nothing;
    const s = p.settings;
    const users = this._users(p.id);
    const shared = this._shared(p.id);
    const pts = curvePoints(s, "bri");
    const rows = pts.map(([tt], i) => {
      const lv = levelAt(s, tt);
      return {
        n: i + 1,
        pct: Math.round(tt * 100),
        min: Math.round(tt * p.duration),
        bri: Math.round(lv.bri),
        ct: (() => {
          const k = levelAt(s, tt, { ct: true, color: false, dim: true }).kelvin;
          return k ? `${Math.round(k / 10) * 10} K` : "–";
        })(),
        css: levelCss(lv, false),
      };
    });
    const facts: [StringKey, string][] = [
      ["duration", `${p.duration} min`],
      ["curve", t(hass, `curve_${s.curve}` as StringKey)],
      ["ls_brightness", `${Math.round(s.brightness[0])} → ${Math.round(s.brightness[1])} %`],
      s.color_mode === "ct"
        ? ["ls_ct", `${s.kelvin[0]} → ${s.kelvin[1]} K`]
        : ["ls_color", t(hass, `colors_${s.colors}` as StringKey)],
      ["fine_ringing", t(hass, `ringing_${s.ringing}` as StringKey)],
      ["fine_after", t(hass, `after_stop_${s.after_stop}` as StringKey)],
    ];
    return html`
      <div class="row">
        <h2 class="grow">${p.name}</h2>
        ${p.builtin ? html`<span class="chip">${t(hass, "template_ro")}</span>` : nothing}
        ${p.builtin || shared
          ? html`<button class="btn" @click=${() => this._startEdit(p, true)}>${t(hass, "edit_copy")}</button>`
          : html`<button class="btn" @click=${() => this._startEdit(p, false)}>${t(hass, "edit")}</button>`}
        ${!p.builtin && !users.length
          ? html`<button class="btn danger" @click=${() => this._delete(p)}>${t(hass, "delete")}</button>`
          : nothing}
      </div>
      ${shared ? html`<div class="warn">${t(hass, "profile_shared_hint")}</div>` : nothing}
      <div class="ramp" style="background:${rampGradient(s)}"></div>
      <div class="facts">${facts.map(([k, v]) => html`<div><span class="muted">${t(hass, k)}</span><b>${v}</b></div>`)}</div>
      <div class="lbl">${t(hass, "curve_points")}</div>
      <table>
        <thead><tr><th>#</th><th>${t(hass, "ls_share")}</th><th>${t(hass, "minute")}</th><th>${t(hass, "ls_brightness")}</th>
          <th>${t(hass, "ls_ct")}</th><th>${t(hass, "ls_color")}</th></tr></thead>
        <tbody>${rows.map(
          (r) => html`<tr><td>${r.n}</td><td>${r.pct} %</td><td>${r.min}</td><td>${r.bri} %</td><td>${r.ct}</td>
            <td><span class="sw" style="background:${r.css}"></span></td></tr>`,
        )}</tbody>
      </table>
      <div class="muted">
        ${t(hass, "used_by")}: ${users.length ? users.map((a) => a.name).join(", ") : t(hass, "nobody")}
      </div>
    `;
  }

  private _editor() {
    const hass = this.hass;
    const draft = this._edit!;
    const mode = this._editMode ?? this.mode;
    const users = draft.id ? this._users(draft.id) : [];
    const shared = draft.id ? this._shared(draft.id) : false;
    const lights = Object.keys(hass?.states ?? {}).filter((e) => e.startsWith("light."));
    const needsConfirm = users.length > 1;
    return html`
      <div class="row">
        <input class="inp name" .value=${draft.name} aria-label=${t(hass, "f_name")}
          @input=${(ev: Event) => (this._edit = { ...draft, name: (ev.target as HTMLInputElement).value })} />
        <div class="seg" role="group">
          ${(["simple", "normal", "expert"] as EditorMode[]).map(
            (m) => html`<button aria-pressed=${mode === m} @click=${() => (this._editMode = m)}>${t(hass, `mode_${m}` as StringKey)}</button>`,
          )}
        </div>
      </div>
      ${shared
        ? html`<div class="warn"><span class="grow">${t(hass, "profile_shared_hint")}</span>
            <button class="btn" @click=${() => this._startEdit(draft, true)}>${t(hass, "edit_copy")}</button></div>`
        : nothing}
      ${!shared && users.length
        ? html`<label class="warn">
            ${needsConfirm
              ? html`<input type="checkbox" .checked=${this._confirmed} @change=${(ev: Event) => (this._confirmed = (ev.target as HTMLInputElement).checked)} />`
              : nothing}
            <span>${t(hass, "profile_in_use_hint", { n: users.length, names: users.map((a) => a.name).join(", ") })}</span>
          </label>`
        : nothing}
      <label class="row">
        <span>${t(hass, "duration")}</span>
        <input class="inp num" type="number" min="0" max="240" .value=${String(draft.duration)}
          @change=${(ev: Event) => (this._edit = { ...draft, duration: Number((ev.target as HTMLInputElement).value) || 0 })} />
        <span>min</span>
        <span class="muted">${t(hass, "profile_duration_hint")}</span>
      </label>
      <db-light-settings .hass=${hass} .settings=${draft.settings} .mode=${mode} .duration=${draft.duration || 30} .start=${"06:00"}
        .locked=${shared}
        @settings-change=${(ev: CustomEvent) => (this._edit = { ...draft, settings: ev.detail })}></db-light-settings>
      ${hass?.user?.is_admin
        ? html`<div class="tile row">
            <span>${t(hass, "preview_on")}</span>
            <select class="inp" @change=${(ev: Event) => (this._previewLight = (ev.target as HTMLSelectElement).value)}>
              <option value="">–</option>
              ${lights.map((e) => html`<option value=${e} ?selected=${e === this._previewLight}>${hass.states[e].attributes.friendly_name ?? e}</option>`)}
            </select>
            <input class="grow" type="range" min="0" max="1" step="0.01" .value=${String(this._previewAt)}
              ?disabled=${!this._previewLight} style="accent-color:var(--db-accent)"
              @change=${(ev: Event) => {
                this._previewAt = Number((ev.target as HTMLInputElement).value);
                if (this._previewLight) preview(hass, [this._previewLight], draft.settings, this._previewAt).catch((e) => this._error(e));
              }} />
            <span class="tabular">${formatClock(hass, toHHMM(360 + this._previewAt * (draft.duration || 30)))}</span>
          </div>`
        : nothing}
      <div class="row" style="justify-content:flex-end">
        ${draft.id && !users.length && !draft.builtin
          ? html`<button class="btn danger" @click=${() => this._delete(draft)}>${t(hass, "delete")}</button>`
          : nothing}
        <span class="grow"></span>
        <button class="btn" @click=${() => (this._edit = undefined)}>${t(hass, "cancel")}</button>
        <button class="btn primary" ?disabled=${shared || (needsConfirm && !this._confirmed)} @click=${this._save}>
          ${t(hass, "profile_save")}
        </button>
      </div>
    `;
  }
}

define("db-profiles-view", DbProfilesView);
