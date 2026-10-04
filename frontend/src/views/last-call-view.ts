import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  deleteProfile,
  saveProfile,
  saveSettings,
  type HomeAssistant,
  type LastCallProfile,
  type Snapshot,
} from "../api";
import { errorText, t } from "../i18n";
import { shared } from "../styles";
import { clamp, fireEvent, friendlyName, lightsOf, define } from "../util";
import "../components/entity-picker";
import "../components/audio-source";
import { defaultSource } from "../model";

/** "Last call" profiles: what happens when nobody reacts. */
export class DbLastCallView extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) snapshot?: Snapshot;
  @state() private _sel = "all_on";
  @state() private _edit?: LastCallProfile;
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

  private get _profiles() {
    return this.snapshot?.last_call_profiles ?? [];
  }

  private _users(id: string) {
    return (this.snapshot?.alarms ?? []).filter((a) => a.last_call.profile === id);
  }

  private _shared(id: string) {
    return new Set(this._users(id).filter((a) => a.owners.length).map((a) => [...a.owners].sort().join())).size > 1;
  }

  private _error(err: unknown) {
    fireEvent(this, "hass-notification", { message: errorText(this.hass, err) });
  }

  private _describe(p: LastCallProfile) {
    const hass = this.hass;
    const lights = lightsOf(hass, p.targets);
    return [
      t(hass, "lc_profile_desc", { min: p.duration, bri: Math.round(p.brightness) }),
      lights.length ? lights.map((e) => friendlyName(hass, e)).join(", ") : t(hass, "lc_alarm_lights"),
      p.actions.length ? t(hass, "n_actions", { n: p.actions.length }) : "",
    ]
      .filter(Boolean)
      .join(" · ");
  }

  private _start(p: LastCallProfile, copy: boolean) {
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
    const data: Partial<LastCallProfile> = { ...draft };
    if (!data.id) delete data.id;
    try {
      const saved = await saveProfile<LastCallProfile>(hass, "last_call", data, this._confirmed);
      this._sel = saved.id;
      this._edit = undefined;
    } catch (err) {
      this._error(err);
    }
  }

  render() {
    const hass = this.hass;
    const def = this.snapshot?.settings.default_last_call;
    return html`<p class="muted" style="margin:0">${t(hass, "lc_intro")}</p>
      <div class="wrap">
        <aside class="card">
          <button class="btn primary" @click=${() =>
            this._start(
              {
                id: "",
                name: t(hass, "lc_new_name"),
                duration: 10,
                targets: {},
                brightness: 100,
                kelvin: 5000,
                actions: [],
                audio: defaultSource(),
                volume: null,
              },
              false,
            )}>
            + ${t(hass, "profile_new_btn")}
          </button>
          ${this._profiles.map(
            (p) => html`<button class="item" aria-current=${!this._edit && this._sel === p.id}
              @click=${() => {
                this._sel = p.id;
                this._edit = undefined;
              }}>
              <b>${p.name}${p.id === def ? html` <span class="muted">· ${t(hass, "default")}</span>` : nothing}</b>
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
    const isDefault = this.snapshot?.settings.default_last_call === p.id;
    return html`
      <div class="row">
        <h2 class="grow">${p.name}</h2>
        ${!isDefault
          ? html`<button class="btn" @click=${() => hass && saveSettings(hass, { default_last_call: p.id }).catch((e) => this._error(e))}>
              ${t(hass, "make_default")}</button>`
          : html`<span class="chip">${t(hass, "default")}</span>`}
        ${p.builtin || shared
          ? html`<button class="btn" @click=${() => this._start(p, true)}>${t(hass, "edit_copy")}</button>`
          : html`<button class="btn" @click=${() => this._start(p, false)}>${t(hass, "edit")}</button>`}
      </div>
      <div class="muted">${t(hass, "lc_detail_hint")}</div>
      <div class="tile">${this._describe(p)}${p.kelvin ? ` · ${p.kelvin} K` : ""}</div>
      ${shared ? html`<div class="warn">${t(hass, "profile_shared_hint")}</div>` : nothing}
      <div class="muted">${t(hass, "used_by")}: ${users.length ? users.map((a) => a.name).join(", ") : t(hass, "nobody")}</div>
      <div class="muted">${p.audio?.type && p.audio.type !== "none"
        ? t(hass, "lc_audio_own", { name: p.audio.name || p.audio.media_id || p.audio.url })
        : t(hass, "lc_audio_keep")}${p.volume !== null && p.volume !== undefined ? ` · ${Math.round(p.volume)} %` : ""}</div>
    `;
  }

  private _editor() {
    const hass = this.hass;
    const draft = this._edit!;
    const users = draft.id ? this._users(draft.id) : [];
    const shared = draft.id ? this._shared(draft.id) : false;
    const needsConfirm = users.length > 1;
    const set = (change: Partial<LastCallProfile>) => (this._edit = { ...draft, ...change });
    return html`
      <input class="inp" style="font-size:20px;height:44px" .value=${draft.name} aria-label=${t(hass, "f_name")}
        @input=${(ev: Event) => set({ name: (ev.target as HTMLInputElement).value })} />
      ${shared ? html`<div class="warn">${t(hass, "profile_shared_hint")}</div>` : nothing}
      ${!shared && users.length
        ? html`<label class="warn">
            ${needsConfirm
              ? html`<input type="checkbox" .checked=${this._confirmed} @change=${(ev: Event) => (this._confirmed = (ev.target as HTMLInputElement).checked)} />`
              : nothing}
            <span>${t(hass, "profile_in_use_hint", { n: users.length, names: users.map((a) => a.name).join(", ") })}</span>
          </label>`
        : nothing}
      <div class="grid">
        <label class="field">${t(hass, "lc_duration")}
          <input class="inp" type="number" min="1" max="120" .value=${String(draft.duration)}
            @change=${(ev: Event) => set({ duration: clamp(Number((ev.target as HTMLInputElement).value) || 1, 1, 120) })} /></label>
        <label class="field">${t(hass, "ls_brightness")} (%)
          <input class="inp" type="number" min="0" max="100" .value=${String(draft.brightness)}
            @change=${(ev: Event) => set({ brightness: clamp(Number((ev.target as HTMLInputElement).value), 0, 100) })} /></label>
        <label class="field">${t(hass, "ls_ct")} (K)
          <input class="inp" type="number" min="1500" max="6500" step="50" placeholder="–" .value=${draft.kelvin ? String(draft.kelvin) : ""}
            @change=${(ev: Event) => {
              const v = (ev.target as HTMLInputElement).value;
              set({ kelvin: v ? clamp(Number(v), 1500, 6500) : null });
            }} /></label>
      </div>
      <div class="lbl">${t(hass, "lc_lights")}</div>
      <div class="muted">${t(hass, "lc_lights_hint")}</div>
      <db-entity-picker .hass=${hass} .domains=${["light"]} multiple areaPick .value=${lightsOf(hass, draft.targets)}
        @value-changed=${(ev: CustomEvent) => {
          ev.stopPropagation();
          set({ targets: { entity_id: ev.detail.value ?? [] } });
        }}></db-entity-picker>
      <div class="lbl">${t(hass, "section_audio")}</div>
      <db-audio-source .hass=${hass} .source=${draft.audio ?? defaultSource()} .noneLabel=${t(hass, "lc_audio_keep_short")}
        @source-change=${(ev: CustomEvent) => set({ audio: ev.detail })}></db-audio-source>
      <label class="field" style="max-width:240px">${t(hass, "lc_volume")}
        <input class="inp" type="number" min="0" max="100" placeholder=${t(hass, "lc_volume_ph")}
          .value=${draft.volume === null || draft.volume === undefined ? "" : String(draft.volume)}
          @change=${(ev: Event) => {
            const v = (ev.target as HTMLInputElement).value;
            set({ volume: v === "" ? null : clamp(Number(v), 0, 100) });
          }} /></label>
      <div class="lbl">${t(hass, "lc_actions")}</div>
      <div class="muted">${t(hass, "lc_actions_hint")}</div>
      <ha-selector .required=${false} .hass=${hass} .selector=${{ action: {} }} .value=${draft.actions}
        @value-changed=${(ev: CustomEvent) => set({ actions: ev.detail.value ?? [] })}></ha-selector>
      <div class="row">
        ${draft.id && !users.length && !draft.builtin
          ? html`<button class="btn danger" @click=${async () => {
              if (!hass || !confirm(t(hass, "profile_delete_confirm", { name: draft.name }))) return;
              try {
                await deleteProfile(hass, "last_call", draft.id);
                this._edit = undefined;
                this._sel = "all_on";
              } catch (err) {
                this._error(err);
              }
            }}>${t(hass, "delete")}</button>`
          : nothing}
        <span class="grow"></span>
        <button class="btn" @click=${() => (this._edit = undefined)}>${t(hass, "cancel")}</button>
        <button class="btn primary" ?disabled=${shared || (needsConfirm && !this._confirmed)} @click=${this._save}>
          ${t(hass, "profile_save")}</button>
      </div>
    `;
  }
}

define("db-last-call-view", DbLastCallView);
