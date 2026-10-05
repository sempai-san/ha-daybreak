import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import {
  ACTIVE_STATES,
  alarmAction,
  createAlarm,
  deleteAlarm,
  saveProfile,
  saveSettings,
  setOnce,
  staleFrontend,
  subscribeAlarms,
  updateAlarm,
  type Alarm,
  type AlarmConfig,
  type EditorMode,
  type HomeAssistant,
  type Kind,
  type LightProfile,
  type Snapshot,
} from "./api";
import { errorText, localizeSnapshot, t, weekdayNames, type StringKey } from "./i18n";
import { logo } from "./logo";
import { defaultAlarm, rampGradient, withDefaults } from "./model";
import { shared } from "./styles";
import {
  countdown,
  fireEvent,
  formatClock,
  formatDay,
  formatTime,
  lightsOf,
  loadHaComponents,
  localDate,
  localHHMM,
  repeatSummary,
} from "./util";
import "./alarm-editor";
import "./views/profiles-view";
import "./views/last-call-view";
import "./views/climate-view";
import "./views/settings-view";
import "./views/history-view";

type Tab = "alarms" | "history" | "profiles" | "last_call" | "climate" | "settings";
const KINDS: Kind[] = ["wake", "sleep", "kids"];
const KIND_GRADIENT: Record<Kind, string> = {
  wake: "linear-gradient(90deg,#3a1a12,#b4441f,#ff8a4c,#ffd9a0)",
  sleep: "linear-gradient(90deg,#ffb36b,#b5577a,#3d3a78,#0b1020)",
  kids: "linear-gradient(90deg,#e0402a 0 50%,#3cc864 50% 100%)",
};

/** Sidebar panel: overview, alarm editor, profiles and settings. */
export class DaybreakPanel extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @state() private _snapshot?: Snapshot;
  @state() private _tab: Tab = "alarms";
  @state() private _editing?: { alarm: AlarmConfig; id?: string };
  @state() private _mode?: EditorMode;
  @state() private _saving = false;
  @state() private _now = Date.now();
  @state() private _ready = false;
  @state() private _chooser = false;
  @state() private _onceOpen = false;
  @state() private _onceTime = "";
  private _unsub?: () => void;
  private _timer?: number;

  static styles = [
    shared,
    css`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--primary-background-color);
      }
      .toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        height: var(--header-height, 56px);
        padding: 0 12px;
        background: var(--app-header-background-color, var(--primary-color));
        color: var(--app-header-text-color, var(--text-primary-color, #fff));
        border-bottom: var(--app-header-border-bottom, none);
        position: sticky;
        top: 0;
        z-index: 4;
      }
      .toolbar h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 400;
      }
      .tabs {
        display: flex;
        gap: 2px;
        overflow-x: auto;
        padding: 0 16px;
        border-bottom: 1px solid var(--db-line);
        background: var(--app-header-background-color, var(--primary-background-color));
        position: sticky;
        top: var(--header-height, 56px);
        z-index: 3;
      }
      .tabs button {
        border: none;
        background: none;
        padding: 0 16px;
        min-height: 48px;
        cursor: pointer;
        color: var(--app-header-text-color, var(--db-muted));
        opacity: 0.75;
        border-bottom: 3px solid transparent;
        white-space: nowrap;
      }
      .tabs button[aria-selected="true"] {
        opacity: 1;
        font-weight: 600;
        border-bottom-color: var(--db-accent);
      }
      main {
        max-width: 960px;
        margin: 0 auto;
        padding: 20px 16px 96px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .top {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
        gap: 16px;
      }
      .hero {
        padding: 20px 22px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .hero .times {
        display: flex;
        align-items: flex-end;
        gap: 22px;
        flex-wrap: wrap;
      }
      .big {
        font-size: 48px;
        line-height: 1;
        font-weight: 500;
      }
      .mid {
        font-size: 26px;
        font-weight: 500;
        color: var(--db-accent);
      }
      .ramp {
        height: 10px;
        border-radius: 5px;
      }
      .quick {
        padding: 20px 22px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .quick .btn {
        min-height: 48px;
        justify-content: flex-start;
      }
      .active {
        padding: 18px 22px;
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
        border-color: var(--db-accent);
        background: color-mix(in srgb, var(--db-accent) 12%, var(--db-bg));
      }
      .active .btn {
        min-height: 52px;
        font-size: 16px;
        padding: 0 24px;
      }
      .list {
        overflow: hidden;
      }
      .alarm {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 14px 18px;
        cursor: pointer;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
      }
      .alarm + .alarm {
        border-top: 1px solid var(--db-line);
      }
      .alarm:hover {
        background: var(--db-tile);
      }
      .alarm .time {
        font-size: 34px;
        font-weight: 400;
        line-height: 1.05;
        min-width: 112px;
      }
      .alarm.off .time,
      .alarm.off .nm {
        color: var(--db-muted);
      }
      .nm {
        font-weight: 600;
        font-size: 16px;
      }
      .pills {
        display: flex;
        gap: 4px;
        margin: 4px 0;
      }
      .pills span {
        width: 24px;
        height: 24px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        font-size: 11px;
        background: var(--db-tile);
        color: var(--db-muted);
      }
      .pills span.on {
        background: color-mix(in srgb, var(--db-accent) 35%, transparent);
        color: var(--db-text);
        font-weight: 600;
      }
      .badge {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--db-tile);
        color: var(--db-muted);
        margin-left: 6px;
      }
      .chooser {
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .kinds {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
      }
      .kind {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid var(--db-line);
        background: var(--db-tile);
        cursor: pointer;
        text-align: left;
      }
      .kind i {
        height: 8px;
        border-radius: 4px;
      }
      .fab {
        position: fixed;
        right: 24px;
        bottom: 24px;
        min-height: 56px;
        padding: 0 22px;
        border-radius: 16px;
        font-size: 16px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
        z-index: 5;
      }
      .empty,
      .loading {
        padding: 32px 16px;
        text-align: center;
        color: var(--db-muted);
      }
      @media (max-width: 700px) {
        .top {
          grid-template-columns: 1fr;
        }
        .big {
          font-size: 40px;
        }
        .alarm .time {
          font-size: 24px;
          min-width: 0;
        }
        .pills span {
          width: 20px;
          height: 20px;
          font-size: 10px;
        }
        .alarm {
          gap: 10px;
          padding: 12px;
        }
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this._timer = window.setInterval(() => (this._now = Date.now()), 30000);
    loadHaComponents().then(() => (this._ready = true));
    this._subscribe();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this._timer);
    this._unsub?.();
    this._unsub = undefined;
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("hass")) this._subscribe();
  }

  private _subscribe() {
    if (this._unsub || !this.hass || !this.isConnected) return;
    this._unsub = subscribeAlarms(this.hass, (snapshot) => {
      this._snapshot = localizeSnapshot(this.hass, snapshot);
      this._mode = undefined;
    });
  }

  private get _editorMode(): EditorMode {
    return this._mode ?? this._snapshot?.settings.default_mode ?? "normal";
  }

  private _error(err: any) {
    fireEvent(this, "hass-notification", { message: errorText(this.hass, err) });
  }

  // ------------------------------------------------------------- editing

  private _new(kind: Kind) {
    const hass = this.hass;
    const alarm = defaultAlarm(kind, t(hass, `kind_${kind}_name` as StringKey));
    const settings = this._snapshot?.settings;
    if (settings) alarm.last_call.profile = settings.default_last_call;
    const me = Object.values(hass?.states ?? {}).find(
      (s) => s.entity_id.startsWith("person.") && s.attributes.user_id && (hass as any)?.user?.id === s.attributes.user_id,
    );
    if (me) alarm.owners = [me.entity_id];
    this._chooser = false;
    this._editing = { alarm };
  }

  private _edit(alarm: Alarm) {
    const { runtime: _runtime, id, ...config } = alarm;
    this._editing = { alarm: withDefaults(defaultAlarm(config.kind), config), id };
  }

  private async _save(ev: CustomEvent) {
    if (!this.hass || !this._editing) return;
    this._saving = true;
    try {
      const alarm = structuredClone(ev.detail.alarm as AlarmConfig);
      const newProfile = ev.detail.newProfile as Partial<LightProfile> | undefined;
      if (newProfile) {
        const created = await saveProfile<LightProfile>(this.hass, "light", newProfile);
        alarm.light.profile = created.id;
      }
      delete alarm.id;
      if (this._editing.id) await updateAlarm(this.hass, this._editing.id, alarm);
      else await createAlarm(this.hass, alarm);
      this._editing = undefined;
    } catch (err) {
      this._error(err);
    } finally {
      this._saving = false;
    }
  }

  private async _delete() {
    const editing = this._editing;
    if (!this.hass || !editing?.id) return;
    if (!confirm(t(this.hass, "delete_confirm", { name: editing.alarm.name }))) return;
    try {
      await deleteAlarm(this.hass, editing.id);
      this._editing = undefined;
    } catch (err) {
      this._error(err);
    }
  }

  private async _action(action: Parameters<typeof alarmAction>[1], id?: string, extra: Record<string, unknown> = {}) {
    if (!this.hass) return;
    try {
      await alarmAction(this.hass, action, id, extra);
    } catch (err) {
      this._error(err);
    }
  }

  private _setMode(ev: CustomEvent) {
    // One place for the mode: the editor switch also changes the setting.
    this._mode = ev.detail.mode;
    if (this.hass) saveSettings(this.hass, { default_mode: ev.detail.mode }).catch((err) => this._error(err));
  }

  // -------------------------------------------------------------- render

  render() {
    const hass = this.hass;
    const tabs: Tab[] = ["alarms", "history", "profiles", "last_call", "climate", "settings"];
    return html`
      <div class="toolbar">
        <ha-menu-button .hass=${hass} .narrow=${this.narrow}></ha-menu-button>
        ${logo(28)}
        <h1>${this._editing ? this._editing.alarm.name || t(hass, "new_alarm") : t(hass, "title")}</h1>
      </div>
      ${this._editing
        ? nothing
        : html`<div class="tabs" role="tablist">
            ${tabs.map(
              (tab) => html`<button role="tab" aria-selected=${this._tab === tab} @click=${() => (this._tab = tab)}>
                ${t(hass, `tab_${tab}` as StringKey)}
              </button>`,
            )}
          </div>`}
      <main>
        ${staleFrontend
          ? html`<section class="card active">
              <div class="grow">
                <div class="nm">${t(this.hass, "stale_title")}</div>
                <div class="muted">${t(this.hass, "stale_text")}</div>
              </div>
              <button class="btn primary" @click=${() => window.location.reload()}>${t(this.hass, "stale_reload")}</button>
            </section>`
          : nothing}
        ${this._body()}
      </main>
    `;
  }

  private _body() {
    const snapshot = this._snapshot;
    if (!snapshot || !this._ready) return html`<div class="loading">…</div>`;
    if (this._editing) {
      return html`<daybreak-alarm-editor
        .hass=${this.hass}
        .alarm=${this._editing.alarm}
        .alarmId=${this._editing.id}
        .settings=${snapshot.settings}
        .lightProfiles=${snapshot.light_profiles}
        .lastCallProfiles=${snapshot.last_call_profiles}
        .climateProfiles=${snapshot.climate_profiles ?? []}
        .runtime=${snapshot.alarms.find((a) => a.id === this._editing?.id)?.runtime}
        .holidayEntity=${snapshot.holiday_entity}
        .alarms=${snapshot.alarms.map((a) => ({ id: a.id, name: a.name }))}
        .mode=${this._editorMode}
        .isNew=${!this._editing.id}
        .saving=${this._saving}
        .narrow=${this.narrow}
        @daybreak-save=${this._save}
        @daybreak-cancel=${() => (this._editing = undefined)}
        @daybreak-delete=${this._delete}
        @daybreak-test=${() => this._editing?.id && this._action("test", this._editing.id)}
        @daybreak-mode=${this._setMode}
        @daybreak-tab=${(ev: CustomEvent) => {
          this._editing = undefined;
          this._tab = ev.detail.tab;
        }}
      ></daybreak-alarm-editor>`;
    }
    switch (this._tab) {
      case "profiles":
        return html`<db-profiles-view .hass=${this.hass} .snapshot=${snapshot} .mode=${this._editorMode}></db-profiles-view>`;
      case "last_call":
        return html`<db-last-call-view .hass=${this.hass} .snapshot=${snapshot}></db-last-call-view>`;
      case "climate":
        return html`<db-climate-view .hass=${this.hass} .snapshot=${snapshot}></db-climate-view>`;
      case "history":
        return html`<db-history-view .hass=${this.hass} .snapshot=${snapshot} .narrow=${this.narrow}></db-history-view>`;
      case "settings":
        return html`<db-settings-view .hass=${this.hass} .snapshot=${snapshot}></db-settings-view>`;
      default:
        return this._alarms(snapshot);
    }
  }

  private _alarms(snapshot: Snapshot) {
    const hass = this.hass;
    const active = snapshot.alarms.filter((a) => ACTIVE_STATES.includes(a.runtime.state));
    const sorted = [...snapshot.alarms].sort((a, b) =>
      (a.runtime.next_alarm ?? "9999").localeCompare(b.runtime.next_alarm ?? "9999"),
    );
    return html`
      ${active.map((a) => this._activeCard(a))}
      ${this._top(snapshot)}
      <section class="card list" aria-label=${t(hass, "tab_alarms")}>
        ${sorted.length ? sorted.map((a) => this._row(a)) : html`<div class="empty">${t(hass, "no_alarms")}</div>`}
      </section>
      ${this._chooser
        ? html`<section class="card chooser">
            <b>${t(hass, "new_what")}</b>
            <div class="kinds">
              ${KINDS.map(
                (k) => html`<button class="kind" @click=${() => this._new(k)}>
                  <i style="background:${KIND_GRADIENT[k]}"></i>
                  <b>${t(hass, `kind_${k}` as StringKey)}</b>
                  <span class="muted">${t(hass, `kind_${k}_d` as StringKey)}</span>
                </button>`,
              )}
            </div>
          </section>`
        : nothing}
      <button class="btn primary fab" aria-expanded=${this._chooser} @click=${() => (this._chooser = !this._chooser)}>
        + ${t(hass, "new_alarm")}
      </button>
    `;
  }

  private _activeCard(alarm: Alarm) {
    const hass = this.hass;
    const rt = alarm.runtime;
    const label =
      rt.state === "snoozed" && rt.snooze_until
        ? t(hass, "state_snoozed", { time: formatTime(hass, rt.snooze_until) })
        : t(hass, `state_${rt.state}` as StringKey);
    return html`<section class="card active">
      <div class="grow">
        <div class="nm">${alarm.name}${rt.test ? html`<span class="badge">${t(hass, "test_badge")}</span>` : nothing}</div>
        <div class="muted">${label}${rt.snoozes ? ` · ${t(hass, "snoozed_n", { n: rt.snoozes })}` : ""}</div>
      </div>
      ${alarm.kind === "wake" && (rt.state === "ringing" || rt.state === "snoozed")
        ? html`<button class="btn" @click=${() => this._action("snooze", alarm.id)}>${t(hass, "snooze")}</button>`
        : nothing}
      <button class="btn primary" @click=${() => this._action("stop", alarm.id)}>${t(hass, "stop")}</button>
    </section>`;
  }

  private _top(snapshot: Snapshot) {
    const hass = this.hass;
    const next = snapshot.next;
    const alarm = next ? snapshot.alarms.find((a) => a.id === next.alarm_id) : undefined;
    if (!next || !alarm) {
      return html`<section class="card hero"><div class="lbl">${t(hass, "next_alarm")}</div>
        <div class="muted">${t(hass, "no_next")}</div></section>`;
    }
    const rt = alarm.runtime;
    const profile = snapshot.light_profiles.find((p) => p.id === alarm.light.profile);
    const settings = profile?.settings ?? alarm.light.settings;
    const lights = lightsOf(hass, alarm.light.targets);
    const nextDate = localDate(hass, new Date(next.time));
    return html`<div class="top">
      <section class="card hero">
        <div class="lbl">${t(hass, "next_alarm")} · ${formatDay(hass, next.time)}</div>
        <div class="times">
          ${rt.next_light_start && rt.next_light_start !== next.time
            ? html`<div><div class="muted">${t(hass, "tl_light_start")}</div>
                <div class="mid tabular">${formatTime(hass, rt.next_light_start)}</div></div>`
            : nothing}
          <div><div class="muted">${t(hass, "tl_wake")}</div><div class="big tabular">${formatTime(hass, next.time)}</div></div>
          <span class="grow"></span>
          <div style="text-align:right"><div class="muted">${t(hass, "in_label")}</div>
            <div style="font-size:20px;font-weight:600">${countdown(hass, next.time, this._now)}</div></div>
        </div>
        <div class="ramp" style="background:${rampGradient(settings)}"></div>
        <div class="row">
          <span class="chip">${alarm.name}</span>
          ${lights.length ? html`<span class="chip">${t(hass, "n_lights", { n: lights.length })}</span>` : nothing}
          ${profile ? html`<span class="chip">${profile.name}</span>` : nothing}
          ${rt.shift ? html`<span class="chip" aria-pressed="true">${t(hass, "shifted_by", { min: rt.shift })}</span>` : nothing}
          ${alarm.once?.date === nextDate ? html`<span class="chip" aria-pressed="true">${t(hass, "once_badge")}</span>` : nothing}
        </div>
      </section>
      <section class="card quick">
        <div class="lbl">${t(hass, "quick")}</div>
        <button class="btn" @click=${() => this._action("test", alarm.id)}>▶ ${t(hass, "quick_test")}</button>
        ${alarm.skip_date
          ? html`<button class="btn" @click=${() => this._action("cancel_skip", alarm.id)}>↺ ${t(hass, "cancel_skip")}</button>`
          : html`<button class="btn" @click=${() => this._action("skip_next", alarm.id)}>⇥ ${t(hass, "quick_skip")}</button>`}
        ${alarm.once
          ? html`<button class="btn" @click=${() => this._action("clear_once", alarm.id)}>✕ ${t(hass, "quick_once_clear")}</button>`
          : html`<button class="btn" aria-expanded=${this._onceOpen} @click=${() => {
              this._onceOpen = !this._onceOpen;
              this._onceTime = localHHMM(hass, rt.next_base ?? next.time);
            }}>◷ ${t(hass, "quick_once")}</button>`}
        ${this._onceOpen && !alarm.once
          ? html`<div class="row">
              <input class="inp time" type="time" .value=${this._onceTime}
                @change=${(ev: Event) => (this._onceTime = (ev.target as HTMLInputElement).value)} />
              <button class="btn primary" @click=${async () => {
                if (!hass || !this._onceTime) return;
                try {
                  await setOnce(hass, alarm.id, localDate(hass, new Date(rt.next_base ?? next.time)), this._onceTime);
                  this._onceOpen = false;
                } catch (err) {
                  this._error(err);
                }
              }}>${t(hass, "save")}</button>
            </div>`
          : nothing}
      </section>
    </div>`;
  }

  private _row(alarm: Alarm) {
    const hass = this.hass;
    const rt = alarm.runtime;
    const names = weekdayNames(hass);
    const days =
      alarm.repeat.type === "weekly"
        ? html`<div class="pills">${names.map((n, i) => html`<span class=${alarm.repeat.days.includes(i) ? "on" : ""}>${n.slice(0, 2)}</span>`)}</div>`
        : nothing;
    let status: string;
    if (ACTIVE_STATES.includes(rt.state)) status = t(hass, `state_${rt.state}` as StringKey);
    else if (alarm.skip_date) status = t(hass, "skipped", { date: formatDay(hass, alarm.skip_date) });
    else if (rt.next_alarm) status = `${formatDay(hass, rt.next_alarm)} · ${countdown(hass, rt.next_alarm, this._now)}`;
    else status = t(hass, `state_${rt.state}` as StringKey);
    const time = rt.next_alarm ? formatTime(hass, rt.next_alarm) : alarm.wake.type === "fixed" ? formatClock(hass, alarm.wake.time) : "–";
    return html`<div class="alarm ${alarm.enabled ? "" : "off"}" role="button" tabindex="0"
      @click=${() => this._edit(alarm)} @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this._edit(alarm)}>
      <div>
        <div class="time tabular">${time}</div>
        ${rt.next_light_start && rt.next_light_start !== rt.next_alarm
          ? html`<div class="muted">${t(hass, "light_from", { time: formatTime(hass, rt.next_light_start) })}</div>`
          : nothing}
      </div>
      <div class="grow">
        <div class="nm">${alarm.name}
          ${alarm.kind !== "wake" ? html`<span class="badge">${t(hass, `kind_${alarm.kind}` as StringKey)}</span>` : nothing}
          ${rt.shift ? html`<span class="badge">${t(hass, "shifted_by", { min: rt.shift })}</span>` : nothing}
        </div>
        ${days}
        <div class="muted">${alarm.repeat.type === "weekly" ? "" : repeatSummary(hass, alarm) + " · "}${status}</div>
      </div>
      <button class="switch" role="switch" aria-checked=${alarm.enabled} aria-label=${t(hass, "enabled")}
        @click=${(e: Event) => {
          e.stopPropagation();
          this._action(alarm.enabled ? "disable" : "enable", alarm.id);
        }}></button>
      <span class="muted" aria-hidden="true">›</span>
    </div>`;
  }
}

if (!customElements.get("daybreak-panel")) {
  customElements.define("daybreak-panel", DaybreakPanel);
}
