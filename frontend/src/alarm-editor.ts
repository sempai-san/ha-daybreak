import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  fetchSun,
  type Action,
  type AlarmConfig,
  type EditorMode,
  type HomeAssistant,
  type LastCallProfile,
  type LightOverride,
  type LightProfile,
  type LightSettings,
  type NotifyEvent,
  type Phase,
  type Settings,
  type SunTimes,
  type Target,
  type WeatherKey,
} from "./api";
import { t, weekdayNames, type StringKey } from "./i18n";
import { capsOf, defaultSettings, rampGradient } from "./model";
import { shared } from "./styles";
import { sunWakeMinutes } from "./components/sun-wake";
import type { ShiftBand } from "./components/shift-line";
import {
  addDays,
  clamp,
  dayMatches,
  fireEvent,
  formatClock,
  formatDay,
  friendlyName,
  lightsOf,
  localDate,
  repeatSummary,
  toHHMM,
  toMin,
} from "./util";
import "./components/time-line";
import "./components/sun-wake";
import "./components/shift-line";
import "./components/light-settings";

const PHASES: Phase[] = ["light_start", "wake", "snooze", "stop"];
const WEATHER: WeatherKey[] = ["snow", "storm", "rain"];
const NOTIFY_EVENTS: NotifyEvent[] = ["started", "finished", "skipped", "shifted", "device_unavailable", "failed", "last_call"];
const DAY_PRESETS: [StringKey, number[]][] = [
  ["weekdays", [0, 1, 2, 3, 4]],
  ["weekend", [5, 6]],
  ["every_day", [0, 1, 2, 3, 4, 5, 6]],
];

type Section = "time" | "cond" | "light" | "audio" | "act" | "none" | "fb";

/**
 * Full-page editor for one alarm. Emits daybreak-save {alarm, newProfile?},
 * daybreak-cancel, daybreak-delete, daybreak-test and daybreak-mode.
 */
export class DaybreakAlarmEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) alarm?: AlarmConfig;
  @property({ attribute: false }) settings?: Settings;
  @property({ attribute: false }) lightProfiles: LightProfile[] = [];
  @property({ attribute: false }) lastCallProfiles: LastCallProfile[] = [];
  @property({ attribute: false }) holidayEntity: string | null = null;
  @property() mode: EditorMode = "normal";
  @property({ type: Boolean }) isNew = false;
  @property({ type: Boolean }) saving = false;
  @property({ type: Boolean }) narrow = false;
  @state() private _draft?: AlarmConfig;
  @state() private _open: Record<Section, boolean> = {
    time: true,
    cond: false,
    light: true,
    audio: false,
    act: false,
    none: false,
    fb: false,
  };
  @state() private _ownerPick = false;
  @state() private _morePresence = false;
  @state() private _rule?: "weather" | "travel";
  @state() private _phase: Phase = "wake";
  @state() private _unlocked = false;
  @state() private _newProfileName = "";
  @state() private _sun?: SunTimes;
  @state() private _overrideOpen = -1;
  private _sunDate = "";

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 3;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        padding: 10px 0 12px;
        background: var(--primary-background-color, #111);
      }
      .body {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding-bottom: 40px;
      }
      section.card {
        overflow: hidden;
      }
      .sh {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 18px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
        min-height: 56px;
      }
      .sh b {
        font-size: 16px;
      }
      .sh .sum {
        margin-left: auto;
        color: var(--db-muted);
        font-size: 13px;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 60%;
      }
      .sh .chev {
        color: var(--db-muted);
        transition: transform 0.15s;
      }
      .sh[aria-expanded="true"] .chev {
        transform: rotate(90deg);
      }
      .badge {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--db-tile);
        color: var(--db-muted);
      }
      .sb {
        padding: 0 18px 18px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .head {
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .name {
        font-size: 20px;
        height: 46px;
        width: 100%;
      }
      .avatar {
        width: 26px;
        height: 26px;
        border-radius: 13px;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--db-accent) 30%, transparent);
        font-size: 12px;
        font-weight: 700;
        flex: none;
        overflow: hidden;
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .divider {
        height: 1px;
        background: var(--db-line);
      }
      .days button {
        width: 46px;
        height: 46px;
        padding: 0;
        border-radius: 23px;
        justify-content: center;
      }
      .weeks {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 8px;
      }
      .wtile {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--db-line);
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .wtile[aria-pressed="true"] {
        border-color: var(--db-accent);
        background: color-mix(in srgb, var(--db-accent) 14%, transparent);
      }
      .pattern {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
        gap: 6px;
      }
      .cal {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
        text-align: center;
        font-size: 12px;
      }
      .cal span {
        padding: 6px 0;
        border-radius: 8px;
      }
      .cal .on {
        background: color-mix(in srgb, var(--db-accent) 35%, transparent);
        font-weight: 600;
      }
      .cal .skip {
        text-decoration: line-through;
        color: var(--db-muted);
      }
      .cal .head {
        color: var(--db-muted);
        padding: 0;
      }
      .rules {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 8px;
      }
      .rule {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--db-line);
      }
      .rule.open {
        border-color: var(--db-accent);
      }
      .rule button.t {
        flex: 1;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        padding: 0;
        display: flex;
        flex-direction: column;
      }
      .bar-dot {
        width: 12px;
        height: 12px;
        border-radius: 6px;
        flex: none;
      }
      .grid2 {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 10px;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: var(--db-muted);
      }
      .field .inp {
        width: 100%;
      }
      .cond {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 10px;
        background: var(--db-bg);
      }
      .ladder {
        display: flex;
        flex-direction: column;
      }
      .step {
        display: flex;
        gap: 12px;
      }
      .step .n {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .step .n span {
        width: 28px;
        height: 28px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        background: var(--db-tile);
        font-weight: 700;
        font-size: 13px;
      }
      .step .n i {
        flex: 1;
        width: 2px;
        background: var(--db-line);
        min-height: 14px;
      }
      .step .c {
        padding-bottom: 14px;
        flex: 1;
      }
      .step.off {
        opacity: 0.5;
      }
      .lcp {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 8px;
      }
      .pick {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid var(--db-line);
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .pick[aria-pressed="true"] {
        border-color: var(--db-accent);
        background: color-mix(in srgb, var(--db-accent) 12%, transparent);
      }
      .lock {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--db-tile);
      }
      .lamp {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: var(--db-tile);
        font-size: 13px;
      }
      .cap {
        font-size: 10px;
        padding: 1px 6px;
        border-radius: 6px;
        background: var(--db-bg);
        color: var(--db-muted);
      }
      .notify {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 6px 16px;
        align-items: center;
      }
      .soon {
        opacity: 0.75;
      }
      ha-selector {
        display: block;
      }
      @media (max-width: 600px) {
        .sb {
          padding: 0 12px 14px;
        }
        .sh {
          padding: 14px 12px;
        }
        .head {
          padding: 14px 12px;
        }
      }
    `,
  ];

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("alarm") && this.alarm) {
      this._draft = structuredClone(this.alarm);
      this._unlocked = false;
      this._newProfileName = "";
    }
    const date = this._nextDate();
    if (this.hass && date !== this._sunDate) {
      this._sunDate = date;
      fetchSun(this.hass, date)
        .then((res) => (this._sun = res[date]))
        .catch(() => undefined);
    }
  }

  // ---------------------------------------------------------------- helpers

  private get d(): AlarmConfig {
    return this._draft!;
  }

  private _patch(change: Partial<AlarmConfig>) {
    this._draft = { ...this.d, ...change };
  }

  private _sub<K extends keyof AlarmConfig>(key: K, change: Partial<AlarmConfig[K]>) {
    this._patch({ [key]: { ...(this.d[key] as object), ...change } } as Partial<AlarmConfig>);
  }

  private get _expert() {
    return this.mode === "expert";
  }

  private get _simple() {
    return this.mode === "simple";
  }

  private _selector(selector: Record<string, unknown>, value: unknown, change: (v: any) => void, label?: string) {
    return html`<ha-selector
      .hass=${this.hass}
      .selector=${selector}
      .value=${value}
      .label=${label}
      .required=${false}
      @value-changed=${(ev: CustomEvent) => change(ev.detail.value)}
    ></ha-selector>`;
  }

  private _toggle(checked: boolean, change: (v: boolean) => void, label: string) {
    return html`<button class="switch" role="switch" aria-checked=${checked} aria-label=${label}
      @click=${() => change(!checked)}></button>`;
  }

  private _section(key: Section, title: string, summary: string | TemplateResult, body: () => unknown, badge?: string) {
    const open = this._open[key];
    return html`<section class="card">
      <button class="sh" aria-expanded=${open} @click=${() => (this._open = { ...this._open, [key]: !open })}>
        <span class="chev">▸</span><b>${title}</b>${badge ? html`<span class="badge">${badge}</span>` : nothing}
        <span class="sum">${summary}</span>
      </button>
      ${open ? html`<div class="sb">${body()}</div>` : nothing}
    </section>`;
  }

  private get _snoozeMinutes() {
    const presets = this.settings?.snooze_presets ?? [];
    const id = this.d.snooze.preset ?? this.settings?.default_snooze;
    return presets.find((p) => p.id === id)?.minutes ?? presets[0]?.minutes ?? 9;
  }

  private get _snoozeCount() {
    return this.d.snooze.count ?? this.settings?.default_snooze_count ?? 3;
  }

  /** Date the next occurrence falls on (for sun times and "only once"). */
  private _nextDate(): string {
    const d = this._draft;
    if (!d || !this.hass) return "";
    const today = localDate(this.hass);
    for (let i = 0; i < 62; i++) {
      const day = addDays(today, i);
      if (dayMatches(d, day) && day !== d.skip_date) return day;
    }
    return today;
  }

  /** Effective wake time (computed for sun-based alarms). */
  private get _wakeTime(): string {
    const d = this.d;
    if (d.wake.type === "sun") {
      const m = sunWakeMinutes(this.hass, this._sun, d.wake);
      if (m !== null) return toHHMM(m);
    }
    return d.wake.time;
  }

  private get _lights(): string[] {
    return lightsOf(this.hass, this.d.light.targets);
  }

  private _profile(id: string | null) {
    return id ? this.lightProfiles.find((p) => p.id === id) : undefined;
  }

  // ----------------------------------------------------------------- header

  private _header() {
    const hass = this.hass;
    const modes: EditorMode[] = ["simple", "normal", "expert"];
    return html`<header>
      <button class="btn" style="padding:0 10px" aria-label=${t(hass, "back")} @click=${() => fireEvent(this, "daybreak-cancel")}>←</button>
      <div class="seg" role="group" aria-label=${t(hass, "mode")}>
        ${modes.map(
          (m) => html`<button aria-pressed=${this.mode === m} @click=${() => fireEvent(this, "daybreak-mode", { mode: m })}>
            ${t(hass, `mode_${m}` as StringKey)}
          </button>`,
        )}
      </div>
      <span class="grow"></span>
      ${this.isNew
        ? nothing
        : html`<button class="btn danger" @click=${() => fireEvent(this, "daybreak-delete")}>${t(hass, "delete")}</button>
            <button class="btn" @click=${() => fireEvent(this, "daybreak-test")}>${t(hass, "test")}</button>`}
      <button class="btn" @click=${() => fireEvent(this, "daybreak-cancel")}>${t(hass, "cancel")}</button>
      <button class="btn primary" ?disabled=${this.saving} @click=${this._save}>${t(hass, "save")}</button>
    </header>`;
  }

  private _save() {
    const hass = this.hass;
    if (this._unlocked && !this._newProfileName.trim()) {
      fireEvent(this, "hass-notification", { message: t(hass, "profile_name_required") });
      this._open = { ...this._open, light: true };
      return;
    }
    fireEvent(this, "daybreak-save", {
      alarm: this.d,
      newProfile: this._unlocked
        ? { name: this._newProfileName.trim(), duration: this.d.light_lead, settings: this.d.light.settings }
        : undefined,
    });
  }

  // ------------------------------------------------------------ name/owners

  private _persons() {
    return Object.values(this.hass?.states ?? {}).filter((s) => s.entity_id.startsWith("person."));
  }

  private _avatar(entityId: string) {
    const st = this.hass?.states[entityId];
    const pic = st?.attributes.entity_picture;
    const name = friendlyName(this.hass, entityId);
    return html`<span class="avatar">${pic ? html`<img src=${pic} alt="" />` : name.slice(0, 1).toUpperCase()}</span>`;
  }

  private _head() {
    const hass = this.hass;
    const d = this.d;
    const free = this._persons().filter((p) => !d.owners.includes(p.entity_id));
    return html`<section class="card head">
      <div class="row">
        <label class="lbl grow" for="name">${t(hass, "f_name")}</label>
        <span class="badge">${t(hass, `kind_${d.kind}` as StringKey)}</span>
      </div>
      <input id="name" class="inp name" .value=${d.name} @input=${(ev: Event) => this._patch({ name: (ev.target as HTMLInputElement).value })} />
      <div class="lbl">${t(hass, "owners")}</div>
      <div class="row">
        ${d.owners.map(
          (o) => html`<span class="chip" aria-pressed="true">${this._avatar(o)}${friendlyName(hass, o)}
            <button class="x" aria-label=${t(hass, "remove")} @click=${() => this._patch({ owners: d.owners.filter((x) => x !== o) })}>✕</button>
          </span>`,
        )}
        <button class="chip" aria-expanded=${this._ownerPick} aria-label=${t(hass, "owner_add")}
          @click=${() => (this._ownerPick = !this._ownerPick)}>+</button>
        ${this._ownerPick
          ? free.map(
              (p) => html`<button class="chip" @click=${() => {
                this._patch({ owners: [...d.owners, p.entity_id] });
                this._ownerPick = false;
              }}>${this._avatar(p.entity_id)}${friendlyName(hass, p.entity_id)}</button>`,
            )
          : nothing}
        ${this._ownerPick && !free.length ? html`<span class="muted">${t(hass, "owner_none")}</span>` : nothing}
      </div>
      <div class="muted">${t(hass, "owners_hint")}</div>
    </section>`;
  }

  // ----------------------------------------------------------------- time

  private _timeSection() {
    const hass = this.hass;
    const d = this.d;
    const wake = this._wakeTime;
    const summary = `${formatClock(hass, wake)} · ${repeatSummary(hass, d)}`;
    return this._section("time", t(hass, "section_time"), summary, () => this._timeBody());
  }

  private _timeBody() {
    const hass = this.hass;
    const d = this.d;
    const isWake = d.kind === "wake";
    const settingsLight = this._effectiveSettings();
    const startLabel = d.kind === "sleep" ? t(hass, "tl_sleep_start") : d.kind === "kids" ? t(hass, "tl_kids_start") : "";
    const wakeLabel = d.kind === "sleep" ? t(hass, "tl_sleep_end") : d.kind === "kids" ? t(hass, "tl_kids_end") : "";
    return html`
      ${!this._simple
        ? html`<div class="seg" role="group">
            <button aria-pressed=${d.wake.type === "fixed"} @click=${() => this._sub("wake", { type: "fixed", time: this._wakeTime })}>
              ${t(hass, "wake_fixed")}
            </button>
            <button aria-pressed=${d.wake.type === "sun"} @click=${() => this._sub("wake", { type: "sun" })}>
              ${t(hass, "wake_sun")}
            </button>
          </div>`
        : nothing}
      ${d.wake.type === "sun"
        ? html`<div class="tile"><db-sun-wake .hass=${hass} .wake=${d.wake} .date=${this._nextDate()} .mode=${this.mode}
            @wake-change=${(ev: CustomEvent) => this._patch({ wake: ev.detail })}></db-sun-wake></div>`
        : nothing}
      <div class="tile">
        <db-time-line
          .hass=${hass}
          .time=${this._wakeTime}
          .lead=${d.light_lead}
          .snooze=${this._snoozeMinutes}
          .count=${this._snoozeCount}
          .lastCall=${d.last_call.enabled}
          .fixedWake=${d.wake.type === "sun"}
          .showSnooze=${isWake}
          .startLabel=${startLabel}
          .wakeLabel=${wakeLabel}
          .gradient=${rampGradient(settingsLight)}
          @timeline-change=${(ev: CustomEvent) => {
            const { time, lead, count } = ev.detail;
            this._patch({
              light_lead: lead,
              wake: d.wake.type === "fixed" ? { ...d.wake, time } : d.wake,
              snooze: count === this._snoozeCount ? d.snooze : { ...d.snooze, count },
            });
          }}
        ></db-time-line>
      </div>
      ${isWake ? this._snoozeChoice() : nothing}
      ${this._onceBlock()}
      <div class="divider"></div>
      ${this._repeatBlock()}
      ${this._holidayTile()}
    `;
  }

  private _snoozeChoice() {
    const hass = this.hass;
    const presets = this.settings?.snooze_presets ?? [];
    const current = this.d.snooze.preset ?? this.settings?.default_snooze;
    return html`<div class="row">
      <span class="lbl">${t(hass, "snooze")}</span>
      ${presets.map(
        (p) => html`<button class="chip" aria-pressed=${current === p.id}
          @click=${() => this._sub("snooze", { preset: p.id === this.settings?.default_snooze ? null : p.id })}>
          ${p.name} · ${p.minutes} min
        </button>`,
      )}
      <span class="muted">${t(hass, "snooze_hint")}</span>
    </div>`;
  }

  private _onceBlock() {
    const hass = this.hass;
    const d = this.d;
    if (d.repeat.type === "once") return nothing;
    const date = this._nextDate();
    const once = d.once;
    return html`<div class="row">
        <button class="chip" aria-pressed=${!!once}
          @click=${() => this._patch({ once: once ? null : { date, time: this._wakeTime, light_lead: null } })}>
          ${t(hass, "once_toggle")}
        </button>
        ${once ? html`<span class="muted">${t(hass, "once_hint")}</span>` : nothing}
      </div>
      ${once
        ? html`<div class="tile row">
            <label class="row"><span>${t(hass, "once_on")}</span>
              <input class="inp" type="date" .value=${once.date}
                @change=${(ev: Event) => this._patch({ once: { ...once, date: (ev.target as HTMLInputElement).value } })} /></label>
            <label class="row"><span>${t(hass, "tl_wake")}</span>
              <input class="inp time" type="time" .value=${once.time}
                @change=${(ev: Event) => this._patch({ once: { ...once, time: (ev.target as HTMLInputElement).value } })} /></label>
            <label class="row"><span>${t(hass, "light_lead")}</span>
              <input class="inp num" type="number" min="0" max="240" placeholder=${String(d.light_lead)}
                .value=${once.light_lead === null ? "" : String(once.light_lead)}
                @change=${(ev: Event) => {
                  const v = (ev.target as HTMLInputElement).value;
                  this._patch({ once: { ...once, light_lead: v === "" ? null : clamp(Number(v), 0, 240) } });
                }} /> min</label>
          </div>`
        : nothing}`;
  }

  private _repeatBlock() {
    const hass = this.hass;
    const rep = this.d.repeat;
    const types: AlarmConfig["repeat"]["type"][] = this._simple
      ? ["weekly", "interval", "once"]
      : ["weekly", "interval", "pattern", "once"];
    return html`
      <div class="lbl">${t(hass, "repeat")}</div>
      <div class="seg" role="group">
        ${types.map(
          (ty) => html`<button aria-pressed=${rep.type === ty} @click=${() => this._sub("repeat", { type: ty })}>
            ${t(hass, `repeat_${ty}` as StringKey)}
          </button>`,
        )}
      </div>
      ${rep.type === "weekly" ? this._weekly() : nothing}
      ${rep.type === "interval" ? this._interval() : nothing}
      ${rep.type === "pattern" ? this._pattern() : nothing}
      ${rep.type === "once"
        ? html`<label class="row"><span>${t(hass, "once_date")}</span>
            <input class="inp" type="date" .value=${rep.date ?? ""}
              @change=${(ev: Event) => this._sub("repeat", { date: (ev.target as HTMLInputElement).value || null })} />
            <span class="muted">${t(hass, "once_date_hint")}</span></label>`
        : nothing}
      ${!this._simple && rep.type !== "once" ? this._calendar() : nothing}
    `;
  }

  private _weekly() {
    const hass = this.hass;
    const rep = this.d.repeat;
    const names = weekdayNames(hass);
    const anchor = rep.start_date ?? localDate(hass);
    const monday = addDays(anchor, -((new Date(`${anchor}T12:00:00Z`).getUTCDay() + 6) % 7));
    return html`
      <div class="row days">
        ${names.map(
          (n, i) => html`<button class="chip" aria-pressed=${rep.days.includes(i)}
            @click=${() =>
              this._sub("repeat", {
                days: rep.days.includes(i) ? rep.days.filter((x) => x !== i) : [...rep.days, i].sort(),
              })}>${n}</button>`,
        )}
      </div>
      <div class="row">
        ${DAY_PRESETS.map(
          ([key, days]) => html`<button class="chip" aria-pressed=${rep.days.join() === days.join()}
            @click=${() => this._sub("repeat", { days })}>${t(hass, key)}</button>`,
        )}
      </div>
      ${!this._simple
        ? html`<div class="row">
              <span>${t(hass, "week_cycle")}</span>
              <div class="seg" role="group">
                ${[1, 2, 3, 4].map(
                  (n) => html`<button aria-pressed=${rep.week_cycle === n}
                    @click=${() =>
                      this._sub("repeat", {
                        week_cycle: n,
                        weeks: [...rep.weeks, true, true, true, true].slice(0, n),
                        start_date: n > 1 ? rep.start_date ?? monday : rep.start_date,
                      })}>${n === 1 ? t(hass, "every_week") : t(hass, "week_cycle_short", { n })}</button>`,
                )}
              </div>
            </div>
            ${rep.week_cycle > 1
              ? html`<div class="weeks">
                    ${rep.weeks.map((on, i) => {
                      const from = addDays(monday, i * 7);
                      return html`<button class="wtile" aria-pressed=${on}
                        @click=${() => this._sub("repeat", { weeks: rep.weeks.map((w, j) => (j === i ? !w : w)) })}>
                        <b>${t(hass, "week_n", { n: i + 1 })}</b>
                        <span>${on ? t(hass, "week_on") : t(hass, "week_off")}</span>
                        <span class="muted">${formatDay(hass, from)} – ${formatDay(hass, addDays(from, 6))}</span>
                      </button>`;
                    })}
                  </div>
                  <label class="row"><span class="muted">${t(hass, "week_anchor")}</span>
                    <input class="inp" type="date" .value=${rep.start_date ?? monday}
                      @change=${(ev: Event) => this._sub("repeat", { start_date: (ev.target as HTMLInputElement).value || null })} /></label>`
              : nothing}`
        : nothing}
    `;
  }

  private _interval() {
    const hass = this.hass;
    const rep = this.d.repeat;
    return html`<div class="row">
      <span>${t(hass, "every")}</span>
      <input class="inp num" type="number" min="1" max="60" .value=${String(rep.interval)}
        @change=${(ev: Event) => this._sub("repeat", { interval: clamp(Number((ev.target as HTMLInputElement).value) || 1, 1, 60) })} />
      <select class="inp" @change=${(ev: Event) => this._sub("repeat", { unit: (ev.target as HTMLSelectElement).value as "days" | "weeks" })}>
        <option value="days" ?selected=${rep.unit === "days"}>${t(hass, "unit_days")}</option>
        <option value="weeks" ?selected=${rep.unit === "weeks"}>${t(hass, "unit_weeks")}</option>
      </select>
      <span>${t(hass, "from")}</span>
      <input class="inp" type="date" .value=${rep.start_date ?? localDate(hass)}
        @change=${(ev: Event) => this._sub("repeat", { start_date: (ev.target as HTMLInputElement).value || null })} />
    </div>`;
  }

  private _pattern() {
    const hass = this.hass;
    const rep = this.d.repeat;
    const start = rep.start_date ?? localDate(hass);
    return html`<div class="muted">${t(hass, "pattern_hint")}</div>
      <div class="row">
        <span>${t(hass, "pattern_cycle")}</span>
        <input class="inp num" type="number" min="1" max="42" .value=${String(rep.pattern.length)}
          @change=${(ev: Event) => {
            const n = clamp(Number((ev.target as HTMLInputElement).value) || 1, 1, 42);
            this._sub("repeat", { pattern: Array.from({ length: n }, (_, i) => rep.pattern[i] ?? false) });
          }} />
        <span>${t(hass, "pattern_day1")}</span>
        <input class="inp" type="date" .value=${start}
          @change=${(ev: Event) => this._sub("repeat", { start_date: (ev.target as HTMLInputElement).value || null })} />
      </div>
      <div class="pattern">
        ${rep.pattern.map(
          (on, i) => html`<button class="wtile" aria-pressed=${on}
            @click=${() => this._sub("repeat", { pattern: rep.pattern.map((x, j) => (j === i ? !x : x)), start_date: start })}>
            <b>${t(hass, "day_n", { n: i + 1 })}</b><span class="muted">${on ? t(hass, "week_on") : t(hass, "week_off")}</span>
          </button>`,
        )}
      </div>`;
  }

  private _calendar() {
    const hass = this.hass;
    const d = this.d;
    const today = localDate(hass);
    const monday = addDays(today, -((new Date(`${today}T12:00:00Z`).getUTCDay() + 6) % 7));
    const days = Array.from({ length: 28 }, (_, i) => addDays(monday, i));
    return html`<div class="tile">
      <div class="row" style="margin-bottom:8px">
        <span class="grow">${t(hass, "preview_4w")}</span>
        <span class="muted">${t(hass, "preview_legend")}</span>
      </div>
      <div class="cal">
        ${weekdayNames(hass).map((n) => html`<span class="head">${n}</span>`)}
        ${days.map((day) => {
          const on = day >= today && (dayMatches(d, day) || d.once?.date === day);
          const skip = day === d.skip_date;
          return html`<span class="${on ? "on" : ""} ${skip ? "skip" : ""}" title=${formatDay(hass, day)}>${Number(day.slice(8))}</span>`;
        })}
      </div>
    </div>`;
  }

  private _holidayTile() {
    const hass = this.hass;
    const d = this.d;
    return html`<div class="tile row">
      <div class="grow">
        <div>${t(hass, "holidays")}</div>
        <div class="muted">
          ${this.holidayEntity
            ? t(hass, "holidays_hint", { entity: friendlyName(hass, this.holidayEntity) })
            : t(hass, "holidays_none")}
        </div>
      </div>
      ${this._toggle(d.wake_on_holidays, (v) => this._patch({ wake_on_holidays: v }), t(hass, "holidays"))}
    </div>`;
  }

  // ----------------------------------------------------------- conditions

  private _condSection() {
    const hass = this.hass;
    const d = this.d;
    const parts: string[] = [];
    const presence = d.presence.entities;
    if (presence.length && !this._simple) parts.push(presence.map((e) => friendlyName(hass, e)).join(", "));
    if (d.shift.weather.enabled) parts.push(t(hass, "rule_weather"));
    if (d.shift.travel.enabled) parts.push(t(hass, "rule_travel"));
    if (d.shift.weather.enabled || d.shift.travel.enabled) parts.push(t(hass, "shift_upto", { min: d.shift.max }));
    const title = this._simple ? t(hass, "section_weather") : t(hass, "section_cond");
    return this._section("cond", title, parts.join(" · ") || t(hass, "none"), () =>
      this._simple ? this._simpleWeather() : this._condBody(),
    );
  }

  private _weatherMinutes(key: WeatherKey) {
    return this.d.shift.weather.minutes[key] ?? this.settings?.weather_minutes[key] ?? 0;
  }

  private _simpleWeather() {
    const hass = this.hass;
    const w = this.d.shift.weather;
    return html`<div class="muted">${t(hass, "simple_weather_hint")}</div>
      <div class="row">
        ${WEATHER.map((k) => {
          const on = w.enabled && w.conditions.includes(k);
          return html`<button class="chip" aria-pressed=${on} @click=${() => {
            const conditions = on ? w.conditions.filter((x) => x !== k) : [...w.conditions, k];
            this._sub("shift", { weather: { ...w, enabled: conditions.length > 0, conditions } });
          }}>${t(hass, `weather_${k}` as StringKey)} <span class="muted">−${this._weatherMinutes(k)} min</span></button>`;
        })}
      </div>
      ${!this.settings?.weather_entity ? html`<div class="muted">${t(hass, "weather_entity_missing")}</div>` : nothing}`;
  }

  private _condBody() {
    const hass = this.hass;
    const d = this.d;
    const kindWake = d.kind === "wake";
    return html`
      ${this._presenceBlock()}
      ${kindWake ? html`<div class="divider"></div>${this._shiftBlock()}` : nothing}
      <div class="tile row soon">
        <div class="grow"><div>${t(hass, "calendar_title")}</div><div class="muted">${t(hass, "calendar_hint")}</div></div>
        <span class="badge">${t(hass, "from_version", { v: "0.4" })}</span>
      </div>
    `;
  }

  private _presenceBlock() {
    const hass = this.hass;
    const p = this.d.presence;
    const set = (entities: string[]) => this._sub("presence", { entities });
    return html`<div class="lbl">${t(hass, "presence")}</div>
      <div class="muted">${t(hass, p.entities.length ? "presence_hint" : "presence_off")}</div>
      <div class="row">
        ${this._persons().map((person) => {
          const on = p.entities.includes(person.entity_id);
          return html`<button class="chip" aria-pressed=${on}
            @click=${() => {
              const base = [...p.entities];
              set(on ? base.filter((e) => e !== person.entity_id) : [...base, person.entity_id]);
            }}>${this._avatar(person.entity_id)}${friendlyName(hass, person.entity_id)}
            <span class="muted">${hass?.states[person.entity_id]?.state === "home" ? t(hass, "home") : t(hass, "away")}</span>
          </button>`;
        })}
        ${p.entities
          .filter((e) => !e.startsWith("person."))
          .map(
            (e) => html`<span class="chip" aria-pressed="true">${friendlyName(hass, e)}
              <button class="x" @click=${() => set(p.entities.filter((x) => x !== e))}>✕</button></span>`,
          )}
        <button class="chip" aria-expanded=${this._morePresence} @click=${() => (this._morePresence = !this._morePresence)}>+</button>
      </div>
      ${this._morePresence
        ? this._selector(
            { entity: { multiple: true, filter: [{ domain: ["device_tracker", "binary_sensor", "zone", "person", "input_boolean"] }] } },
            p.entities,
            (v) => set(v ?? []),
            t(hass, "presence_more"),
          )
        : nothing}
      <div class="row">
        <label class="row"><input type="checkbox" .checked=${p.skip_when_away}
          @change=${(ev: Event) => this._sub("presence", { skip_when_away: (ev.target as HTMLInputElement).checked })} />
          ${t(hass, "skip_when_away")}</label>
        <label class="row"><input type="checkbox" .checked=${p.stop_when_away}
          @change=${(ev: Event) => this._sub("presence", { stop_when_away: (ev.target as HTMLInputElement).checked })} />
          ${t(hass, "stop_when_away")}</label>
      </div>`;
  }

  private _shiftBlock() {
    const hass = this.hass;
    const sh = this.d.shift;
    const w = sh.weather;
    const tr = sh.travel;
    const weatherMax = Math.max(0, ...w.conditions.map((k) => this._weatherMinutes(k)));
    const travelState = tr.sensor ? Number(hass?.states[tr.sensor]?.state) : NaN;
    const travelNow = Number.isFinite(travelState) ? Math.max(0, Math.round(travelState - tr.usual)) : 0;
    const bands: ShiftBand[] = [];
    if (w.enabled)
      bands.push({
        key: "weather",
        label: t(hass, "rule_weather"),
        minutes: weatherMax,
        color: "var(--db-weather)",
        editable: this._expert,
      });
    if (tr.enabled)
      bands.push({
        key: "travel",
        label: t(hass, "rule_travel"),
        minutes: Math.min(travelNow, 240),
        color: "var(--db-travel)",
        editable: false,
        note: Number.isFinite(travelState) ? t(hass, "travel_now", { min: Math.round(travelState) }) : t(hass, "travel_unknown"),
      });
    const rule = (key: "weather" | "travel", on: boolean, live: string) => html`<div class="rule ${this._rule === key ? "open" : ""}">
      <span class="bar-dot" style="background:var(--db-${key})"></span>
      <button class="t" aria-expanded=${this._rule === key} @click=${() => (this._rule = this._rule === key ? undefined : key)}>
        <b>${t(hass, `rule_${key}` as StringKey)}</b><span class="muted">${live}</span>
      </button>
      ${this._toggle(on, (v) => {
        this._sub("shift", { [key]: { ...sh[key], enabled: v } } as Partial<AlarmConfig["shift"]>);
        if (v) this._rule = key;
      }, t(hass, `rule_${key}` as StringKey))}
    </div>`;
    return html`<div class="lbl">${t(hass, "shift_title")}</div>
      ${bands.length
        ? html`<div class="tile"><db-shift-line .hass=${hass} .bands=${bands} .cap=${sh.max} .combine=${sh.combine} .time=${this._wakeTime}
            @cap-change=${(ev: CustomEvent) => this._sub("shift", { max: ev.detail.minutes })}
            @band-change=${(ev: CustomEvent) => {
              if (ev.detail.key !== "weather") return;
              const minutes = Object.fromEntries(w.conditions.map((k) => [k, ev.detail.minutes]));
              this._sub("shift", { weather: { ...w, minutes } });
            }}></db-shift-line></div>`
        : html`<div class="muted">${t(hass, "shift_hint")}</div>`}
      <div class="rules">
        ${rule("weather", w.enabled, w.enabled ? w.conditions.map((k) => t(hass, `weather_${k}` as StringKey)).join(", ") || t(hass, "none") : t(hass, "off"))}
        ${rule("travel", tr.enabled, tr.enabled ? (tr.sensor ? friendlyName(hass, tr.sensor) : t(hass, "travel_pick")) : t(hass, "off"))}
      </div>
      ${this._rule === "weather" ? this._weatherDetail() : nothing}
      ${this._rule === "travel" ? this._travelDetail() : nothing}
      ${this._expert
        ? html`<label class="row"><span>${t(hass, "combine")}</span>
            <select class="inp" @change=${(ev: Event) => this._sub("shift", { combine: (ev.target as HTMLSelectElement).value as "max" | "sum" })}>
              <option value="max" ?selected=${sh.combine === "max"}>${t(hass, "combine_max")}</option>
              <option value="sum" ?selected=${sh.combine === "sum"}>${t(hass, "combine_sum")}</option>
            </select></label>`
        : nothing}
      <label class="row"><input type="checkbox" .checked=${sh.notify}
        @change=${(ev: Event) => this._sub("shift", { notify: (ev.target as HTMLInputElement).checked })} />
        ${t(hass, "shift_notify")}</label>`;
  }

  private _weatherDetail() {
    const hass = this.hass;
    const w = this.d.shift.weather;
    const s = this.settings;
    const setW = (change: Partial<AlarmConfig["shift"]["weather"]>) => this._sub("shift", { weather: { ...w, ...change } });
    return html`<div class="tile" style="display:flex;flex-direction:column;gap:10px">
      <div class="muted">
        ${s?.weather_entity ? t(hass, "weather_source", { entity: friendlyName(hass, s.weather_entity) }) : t(hass, "weather_entity_missing")}
      </div>
      <div class="grid2">
        ${WEATHER.map((k) => {
          const on = w.conditions.includes(k);
          return html`<label class="cond">
            <input type="checkbox" .checked=${on}
              @change=${() => setW({ conditions: on ? w.conditions.filter((x) => x !== k) : [...w.conditions, k] })} />
            <span class="grow">${t(hass, `weather_${k}` as StringKey)}</span>
            ${this._expert
              ? html`<input class="inp num" type="number" min="0" max="240" .value=${String(this._weatherMinutes(k))}
                  @change=${(ev: Event) => setW({ minutes: { ...w.minutes, [k]: clamp(Number((ev.target as HTMLInputElement).value), 0, 240) } })} />`
              : html`<span class="tabular">${this._weatherMinutes(k)}</span>`}
            <span>min</span>
          </label>`;
        })}
      </div>
      <div class="muted">${t(hass, "weather_storm_hint", { level: s?.warning_level ?? 2 })}</div>
      ${this._expert
        ? html`<div class="row">
            <span>${t(hass, "cold_below")}</span>
            <input class="inp num" type="number" step="0.5" placeholder=${String(s?.cold_below ?? 0)}
              .value=${w.cold_below === null ? "" : String(w.cold_below)}
              @change=${(ev: Event) => {
                const v = (ev.target as HTMLInputElement).value;
                setW({ cold_below: v === "" ? null : Number(v) });
              }} /><span>°C →</span>
            <input class="inp num" type="number" min="0" max="240" placeholder=${String(s?.cold_minutes ?? 10)}
              .value=${w.cold_minutes === null ? "" : String(w.cold_minutes)}
              @change=${(ev: Event) => {
                const v = (ev.target as HTMLInputElement).value;
                setW({ cold_minutes: v === "" ? null : clamp(Number(v), 0, 240) });
              }} /><span>${t(hass, "min_earlier")}</span>
          </div>`
        : html`<div class="muted">${t(hass, "cold_settings", { below: s?.cold_below ?? 0, min: s?.cold_minutes ?? 10 })}</div>`}
    </div>`;
  }

  private _travelDetail() {
    const hass = this.hass;
    const tr = this.d.shift.travel;
    const setT = (change: Partial<AlarmConfig["shift"]["travel"]>) => this._sub("shift", { travel: { ...tr, ...change } });
    return html`<div class="tile" style="display:flex;flex-direction:column;gap:10px">
      ${this._selector({ entity: { filter: [{ domain: "sensor" }] } }, tr.sensor, (v) => setT({ sensor: v || null }), t(hass, "travel_sensor"))}
      <div class="grid2">
        <label class="field">${t(hass, "travel_usual")}
          <input class="inp" type="number" min="0" max="240" .value=${String(tr.usual)}
            @change=${(ev: Event) => setT({ usual: clamp(Number((ev.target as HTMLInputElement).value), 0, 240) })} /></label>
        <label class="field">${t(hass, "travel_routine")}
          <input class="inp" type="number" min="0" max="240" .value=${String(tr.routine)}
            @change=${(ev: Event) => setT({ routine: clamp(Number((ev.target as HTMLInputElement).value), 0, 240) })} /></label>
        <label class="field">${t(hass, "travel_arrive")}
          <input class="inp" type="time" .value=${tr.arrive_by ?? ""}
            @change=${(ev: Event) => setT({ arrive_by: (ev.target as HTMLInputElement).value || null })} /></label>
      </div>
      <div class="muted">${tr.arrive_by ? t(hass, "travel_arrive_hint") : t(hass, "travel_usual_hint")}</div>
    </div>`;
  }

  // ----------------------------------------------------------------- light

  private _effectiveSettings(): LightSettings {
    const profile = this._profile(this.d.light.profile);
    return profile && !this._unlocked ? profile.settings : this.d.light.settings;
  }

  private _lightSection() {
    const hass = this.hass;
    const d = this.d;
    const lights = this._lights;
    const profile = this._profile(d.light.profile);
    const summary = lights.length
      ? `${t(hass, "n_lights", { n: lights.length })} · ${profile && !this._unlocked ? profile.name : t(hass, `curve_${this._effectiveSettings().curve}` as StringKey)}`
      : t(hass, "no_lights");
    return this._section("light", t(hass, "section_light"), summary, () => this._lightBody());
  }

  private _lampChips(lights: string[]) {
    const hass = this.hass;
    return html`<div class="row">
      ${lights.map((e) => {
        const caps = capsOf(hass?.states[e]?.attributes.supported_color_modes);
        return html`<span class="lamp">${friendlyName(hass, e)}
          ${caps.color ? html`<span class="cap">${t(hass, "cap_color")}</span>` : nothing}
          ${caps.ct ? html`<span class="cap">${t(hass, "cap_ct")}</span>` : nothing}
          ${!caps.color && !caps.ct ? html`<span class="cap">${t(hass, "cap_dim")}</span>` : nothing}
        </span>`;
      })}
    </div>`;
  }

  private _lightBody() {
    const hass = this.hass;
    const d = this.d;
    const lights = this._lights;
    const profile = this._profile(d.light.profile);
    const locked = !!profile && !this._unlocked;
    const settings = this._effectiveSettings();
    const colorLamps = lights.filter((e) => capsOf(hass?.states[e]?.attributes.supported_color_modes).color);
    const plainLamps = lights.filter((e) => !colorLamps.includes(e));
    const start = toHHMM(toMin(this._wakeTime) - d.light_lead);
    return html`
      <div class="lbl">${t(hass, "targets")}</div>
      ${this._selector({ target: { entity: { domain: "light" } } }, d.light.targets, (v: Target) =>
        this._sub("light", { targets: v ?? {} }),
      )}
      ${lights.length ? this._lampChips(lights) : html`<div class="muted">${t(hass, "no_lights")}</div>`}
      <div class="divider"></div>
      <div class="lbl">${this._simple ? t(hass, "light_settings") : t(hass, "light_common")}</div>
      ${!this._simple || profile ? this._profileRow(profile) : nothing}
      <db-light-settings
        .hass=${hass}
        .settings=${settings}
        .mode=${this.mode}
        .locked=${locked}
        .duration=${d.light_lead}
        .start=${start}
        .colorLamps=${colorLamps.map((e) => friendlyName(hass, e))}
        .plainLamps=${plainLamps.map((e) => friendlyName(hass, e))}
        .showFine=${d.kind === "wake"}
        @settings-change=${(ev: CustomEvent) => this._sub("light", { settings: ev.detail })}
      ></db-light-settings>
      ${!this._simple && lights.length > 1 ? this._overrides(lights, start) : nothing}
    `;
  }

  private _profileRow(profile: LightProfile | undefined) {
    const hass = this.hass;
    const d = this.d;
    if (this._unlocked) {
      return html`<div class="lock">
        <span>${t(hass, "profile_new")}</span>
        <input class="inp grow" .value=${this._newProfileName} placeholder=${t(hass, "profile_name_required")}
          @input=${(ev: Event) => (this._newProfileName = (ev.target as HTMLInputElement).value)} />
        <button class="btn" @click=${() => {
          this._unlocked = false;
          this._newProfileName = "";
        }}>${t(hass, "discard")}</button>
      </div>`;
    }
    return html`<div class="lock">
      ${profile ? html`<span class="grow">${t(hass, "profile_locked", { name: profile.name })}</span>` : html`<span class="grow">${t(hass, "profile_own")}</span>`}
      <select class="inp" @change=${(ev: Event) => {
        const id = (ev.target as HTMLSelectElement).value || null;
        const p = this._profile(id);
        this._patch({
          light: { ...d.light, profile: id, settings: p ? structuredClone(p.settings) : d.light.settings },
          light_lead: p && this._simple ? p.duration : d.light_lead,
        });
      }}>
        <option value="" ?selected=${!profile}>${t(hass, "profile_none")}</option>
        ${this.lightProfiles.map((p) => html`<option value=${p.id} ?selected=${p.id === d.light.profile}>${p.name}</option>`)}
      </select>
      ${profile
        ? html`<button class="btn" @click=${() => {
            this._unlocked = true;
            this._newProfileName = t(hass, "profile_copy_name", { name: profile.name });
            this._sub("light", { settings: structuredClone(profile.settings) });
          }}>${t(hass, "customize")}</button>`
        : nothing}
    </div>`;
  }

  private _overrides(lights: string[], start: string) {
    const hass = this.hass;
    const d = this.d;
    const overrides = d.light.overrides;
    const find = (e: string) => overrides.findIndex((o) => o.target.entity_id?.length === 1 && o.target.entity_id[0] === e);
    const setOverrides = (next: LightOverride[]) => this._sub("light", { overrides: next });
    return html`<div class="divider"></div>
      <div class="lbl">${t(hass, "per_target")}</div>
      <div class="muted">${t(hass, "per_target_hint")}</div>
      ${lights.map((e) => {
        const idx = find(e);
        const ov = idx >= 0 ? overrides[idx] : undefined;
        const open = this._overrideOpen === lights.indexOf(e);
        const caps = capsOf(hass?.states[e]?.attributes.supported_color_modes);
        const p = ov ? this._profile(ov.profile) : undefined;
        return html`<div class="tile" style="display:flex;flex-direction:column;gap:10px">
          <button class="t row" style="border:none;background:none;cursor:pointer;padding:0;text-align:left"
            aria-expanded=${open} @click=${() => (this._overrideOpen = open ? -1 : lights.indexOf(e))}>
            <b class="grow">${friendlyName(hass, e)}</b>
            <span class="badge">${ov ? (p ? p.name : t(hass, "own_settings")) : t(hass, "uses_common")}</span>
          </button>
          ${open
            ? html`<div class="row">
                  <label class="row"><input type="checkbox" .checked=${!!ov}
                    @change=${(ev: Event) =>
                      setOverrides(
                        (ev.target as HTMLInputElement).checked
                          ? [...overrides, { target: { entity_id: [e] }, profile: null, settings: structuredClone(this._effectiveSettings()) }]
                          : overrides.filter((_, i) => i !== idx),
                      )} />${t(hass, "use_own")}</label>
                  ${ov
                    ? html`<select class="inp" @change=${(ev: Event) => {
                        const id = (ev.target as HTMLSelectElement).value || null;
                        const next = structuredClone(overrides);
                        next[idx] = { ...next[idx], profile: id };
                        setOverrides(next);
                      }}>
                        <option value="" ?selected=${!ov.profile}>${t(hass, "profile_none")}</option>
                        ${this.lightProfiles.map((pp) => html`<option value=${pp.id} ?selected=${pp.id === ov.profile}>${pp.name}</option>`)}
                      </select>`
                    : nothing}
                </div>
                ${ov
                  ? html`<db-light-settings .hass=${hass} .settings=${p ? p.settings : ov.settings} .mode=${this.mode} .locked=${!!p}
                      .duration=${d.light_lead} .start=${start}
                      .colorLamps=${caps.color ? [friendlyName(hass, e)] : []}
                      .plainLamps=${caps.color ? [] : [friendlyName(hass, e)]}
                      .showFine=${d.kind === "wake"}
                      @settings-change=${(ev: CustomEvent) => {
                        const next = structuredClone(overrides);
                        next[idx] = { ...next[idx], settings: ev.detail };
                        setOverrides(next);
                      }}></db-light-settings>`
                  : nothing}`
            : nothing}
        </div>`;
      })}`;
  }

  // ---------------------------------------------------------------- others

  private _audioSection() {
    const hass = this.hass;
    return this._section("audio", t(hass, "section_audio"), t(hass, "from_version", { v: "0.3" }), () =>
      html`<div class="muted">${t(hass, "audio_soon")}</div>`,
    );
  }

  private _actionsSection() {
    const hass = this.hass;
    const acts = this.d.actions;
    const total = PHASES.reduce((n, p) => n + acts[p].length, 0);
    return this._section(
      "act",
      t(hass, "section_actions"),
      total ? t(hass, "n_actions", { n: total }) : t(hass, "optional"),
      () => html`<div class="seg" role="group">
          ${PHASES.map(
            (p) => html`<button aria-pressed=${this._phase === p} @click=${() => (this._phase = p)}>
              ${t(hass, `phase_${p}` as StringKey)}${acts[p].length ? ` (${acts[p].length})` : ""}
            </button>`,
          )}
        </div>
        <div class="muted">${t(hass, `phase_${this._phase}_hint` as StringKey)}</div>
        ${this._selector({ action: {} }, acts[this._phase], (v: Action[]) =>
          this._patch({ actions: { ...acts, [this._phase]: v ?? [] } }),
        )}`,
    );
  }

  private _noneSection() {
    const hass = this.hass;
    const d = this.d;
    const lc = d.last_call;
    const snooze = this._snoozeMinutes;
    const count = this._snoozeCount;
    const wake = this._wakeTime;
    const end = toHHMM(toMin(wake) + snooze * count);
    const profile = this.lastCallProfiles.find((p) => p.id === lc.profile) ?? this.lastCallProfiles[0];
    const summary = lc.enabled
      ? t(hass, "lc_summary", { time: formatClock(hass, end), name: profile?.name ?? "" })
      : t(hass, "lc_stop_at", { time: formatClock(hass, end) });
    const steps = [
      { title: t(hass, "ladder_ring"), time: formatClock(hass, wake), desc: t(hass, "ladder_ring_d"), on: true },
      {
        title: t(hass, "ladder_snooze", { n: count, m: snooze }),
        time: `${formatClock(hass, wake)} – ${formatClock(hass, end)}`,
        desc: t(hass, "ladder_snooze_d"),
        on: true,
      },
      lc.enabled
        ? {
            title: t(hass, "ladder_last_call"),
            time: `${formatClock(hass, end)} – ${formatClock(hass, toHHMM(toMin(end) + (profile?.duration ?? 10)))}`,
            desc: t(hass, "ladder_last_call_d", { name: profile?.name ?? "" }),
            on: true,
          }
        : { title: t(hass, "ladder_stop"), time: formatClock(hass, end), desc: t(hass, "ladder_stop_d"), on: true },
    ];
    return this._section("none", t(hass, "section_none"), summary, () => html`
      <div class="row">
        <div class="muted grow">${t(hass, "none_hint")}</div>
        <span>${t(hass, "last_call")}</span>
        ${this._toggle(lc.enabled, (v) => this._sub("last_call", { enabled: v }), t(hass, "last_call"))}
      </div>
      <div class="ladder">
        ${steps.map(
          (st, i) => html`<div class="step ${st.on ? "" : "off"}">
            <div class="n"><span>${i + 1}</span>${i < steps.length - 1 ? html`<i></i>` : nothing}</div>
            <div class="c">
              <div class="row"><b class="grow">${st.title}</b><span class="tabular muted">${st.time}</span></div>
              <div class="muted">${st.desc}</div>
            </div>
          </div>`,
        )}
      </div>
      <label class="row">
        <span>${lc.enabled ? t(hass, "lc_at") : t(hass, "stop_at")}</span>
        <input class="inp time" type="time" .value=${end} @change=${(ev: Event) => {
          let diff = toMin((ev.target as HTMLInputElement).value) - toMin(wake);
          if (diff < -720) diff += 1440;
          this._sub("snooze", { count: clamp(Math.round(diff / snooze), 1, 10) });
        }} />
        <span class="muted">${t(hass, "lc_snap", { n: count })}</span>
      </label>
      ${lc.enabled
        ? html`<div class="lcp">
              ${this.lastCallProfiles.map(
                (p) => html`<button class="pick" aria-pressed=${p.id === lc.profile} @click=${() => this._sub("last_call", { profile: p.id })}>
                  <b>${p.name}</b>
                  <span class="muted">${t(hass, "lc_profile_desc", { min: p.duration, bri: Math.round(p.brightness) })}</span>
                </button>`,
              )}
            </div>
            <div><button class="btn" @click=${() => fireEvent(this, "daybreak-tab", { tab: "last_call" })}>${t(hass, "profiles_manage")}</button></div>`
        : nothing}
      <div class="tile row">
        <div class="grow"><div>${t(hass, "stop_on_light_off")}</div><div class="muted">${t(hass, "stop_on_light_off_d")}</div></div>
        ${this._toggle(d.stop_on_light_off, (v) => this._patch({ stop_on_light_off: v }), t(hass, "stop_on_light_off"))}
      </div>
    `);
  }

  private _notifyTargets(): string[] {
    return Object.keys(this.hass?.states ?? {}).filter((e) => e.startsWith("notify."));
  }

  private _fallbackSection() {
    const hass = this.hass;
    const fb = this.d.fallback;
    const lights = this._lights;
    const target = fb.notify ?? this.settings?.notify ?? null;
    const summary = [
      Object.keys(fb.lights).length ? t(hass, "fb_n_spare", { n: Object.keys(fb.lights).length }) : "",
      target ? friendlyName(hass, target) : "",
    ]
      .filter(Boolean)
      .join(" · ");
    const setFb = (change: Partial<AlarmConfig["fallback"]>) => this._sub("fallback", change);
    const notifySelect = html`<div class="field">
      ${t(hass, "fb_notify")}
      <input class="inp" list="db-notify" .value=${fb.notify ?? ""} placeholder=${this.settings?.notify ?? t(hass, "fb_notify_ph")}
        @change=${(ev: Event) => setFb({ notify: (ev.target as HTMLInputElement).value.trim() || null })} />
      <datalist id="db-notify">${this._notifyTargets().map((e) => html`<option value=${e}>${friendlyName(hass, e)}</option>`)}</datalist>
    </div>`;
    const spare = (lamp: string | null) => {
      const value = lamp ? fb.lights[lamp] ?? "" : Object.values(fb.lights)[0] ?? "";
      return this._selector({ entity: { filter: [{ domain: "light" }] } }, value, (v: string) => {
        const next = { ...fb.lights };
        for (const l of lamp ? [lamp] : lights) {
          if (v) next[l] = v;
          else delete next[l];
        }
        setFb({ lights: next });
      }, lamp ? friendlyName(hass, lamp) : t(hass, "fb_spare"));
    };
    return this._section("fb", t(hass, "section_fb"), summary || t(hass, "none"), () =>
      this._simple
        ? html`<div class="muted">${t(hass, "fb_spare_hint")}</div>${spare(null)}${notifySelect}`
        : html`<div class="lbl">${t(hass, "fb_spare")}</div>
            <div class="muted">${t(hass, "fb_spare_hint")}</div>
            ${lights.length ? lights.map((l) => spare(l)) : html`<div class="muted">${t(hass, "no_lights")}</div>`}
            <div class="lbl">${t(hass, "fb_notifications")}</div>
            ${notifySelect}
            <div class="notify">
              ${NOTIFY_EVENTS.map(
                (ev) => html`<span>${t(hass, `ev_${ev}` as StringKey)}</span>
                  <input type="checkbox" .checked=${fb.events.includes(ev)}
                    @change=${(e: Event) =>
                      setFb({
                        events: (e.target as HTMLInputElement).checked ? [...fb.events, ev] : fb.events.filter((x) => x !== ev),
                      })} />`,
              )}
            </div>
            <label class="row"><input type="checkbox" .checked=${fb.persistent}
              @change=${(e: Event) => setFb({ persistent: (e.target as HTMLInputElement).checked })} />${t(hass, "fb_persistent")}</label>`,
    );
  }

  render() {
    if (!this._draft) return nothing;
    const kind = this.d.kind;
    return html`
      ${this._header()}
      <div class="body">
        <div class="muted">${t(this.hass, `mode_${this.mode}_hint` as StringKey)}</div>
        ${this._head()}
        ${this._timeSection()}
        ${kind === "wake" || !this._simple ? this._condSection() : nothing}
        ${this._lightSection()}
        ${kind === "wake" ? this._audioSection() : nothing}
        ${!this._simple ? this._actionsSection() : nothing}
        ${!this._simple && kind === "wake" ? this._noneSection() : nothing}
        ${this._fallbackSection()}
      </div>
    `;
  }
}

customElements.define("daybreak-alarm-editor", DaybreakAlarmEditor);

export { defaultSettings };
