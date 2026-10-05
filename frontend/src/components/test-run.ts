import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { alarmAction, testRun, type AlarmConfig, type AlarmRuntime, type HomeAssistant, type TestPart } from "../api";
import { t, type StringKey } from "../i18n";
import { shared } from "../styles";
import { define, formatClock, toHHMM, toMin } from "../util";

/** Time lapse choices: real time, 1 min = 10 s, 1 min = 2 s, 1 min = 1 s. */
const SPEEDS = [1, 6, 30, 60];
const STORE = "daybreak-test-speed";

function storedSpeed(): number {
  try {
    const v = Number(localStorage.getItem(STORE));
    return SPEEDS.includes(v) ? v : 6;
  } catch {
    return 6;
  }
}

/**
 * Test run of the current (also unsaved) settings in time lapse: light,
 * music, snooze and last call run faster, e.g. one minute takes 10 seconds.
 * Shows a simulated clock, Snooze/Stop buttons and problems (e.g. a speaker
 * that could not play).
 */
export class DbTestRun extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) alarmId?: string;
  @property({ attribute: false }) draft?: AlarmConfig;
  @property({ attribute: false }) runtime?: AlarmRuntime;
  /** Parts this test area is about (light section: light, audio section: audio). */
  @property({ attribute: false }) parts: TestPart[] = ["light", "audio"];
  /** Start at the light start or right at the alarm time. */
  @property() start: "light" | "ring" = "light";
  @property() wakeTime = "07:00";
  @state() private _speed = storedSpeed();
  @state() private _start?: "light" | "ring";
  @state() private _with?: TestPart[];
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _now = Date.now();
  private _tick?: number;

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .box {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border: 1px dashed var(--db-line);
        border-radius: 14px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
      }
      .live {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--db-tile);
      }
      .clock {
        font-size: 28px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      .bar {
        height: 6px;
        border-radius: 3px;
        background: var(--db-line);
        overflow: hidden;
        flex: 1 1 160px;
      }
      .bar span {
        display: block;
        height: 100%;
        background: var(--db-accent);
      }
      .problem {
        color: var(--error-color, #e5534b);
        font-size: 13px;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this._tick = window.setInterval(() => {
      if (this._running) this._now = Date.now();
    }, 500);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this._tick);
  }

  private get _running() {
    return !!this.runtime?.test && !!this.runtime.alarm_time;
  }

  private get _parts(): TestPart[] {
    const available = this.parts.filter((p) => this._configured(p));
    return (this._with ?? available).filter((p) => available.includes(p));
  }

  private _configured(part: TestPart): boolean {
    const d = this.draft;
    if (!d) return false;
    if (part === "light") return Object.values(d.light.targets).some((v) => (v as string[] | undefined)?.length);
    return d.audio.enabled && d.audio.players.length > 0;
  }

  /** Seconds until the alarm time in the test. */
  private get _leadSeconds() {
    const d = this.draft!;
    const parts = this._parts;
    const light = parts.includes("light") ? d.light_lead : 0;
    const audio = parts.includes("audio") ? d.audio.lead : 0;
    return ((this._start ?? this.start) === "ring" ? 0 : Math.max(light, audio) * 60) / this._speed;
  }

  private _duration(seconds: number): string {
    const s = Math.round(seconds);
    return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} min` : `${s} s`;
  }

  private async _run() {
    if (!this.hass || !this.alarmId || !this.draft) return;
    this._busy = true;
    this._error = "";
    try {
      const { ...alarm } = this.draft as AlarmConfig & { id?: string; runtime?: unknown };
      delete (alarm as { runtime?: unknown }).runtime;
      await testRun(this.hass, this.alarmId, {
        alarm,
        speed: this._speed,
        parts: this._parts,
        start: this._start ?? this.start,
      });
    } catch (err) {
      this._error = (err as { message?: string }).message ?? String(err);
    } finally {
      this._busy = false;
    }
  }

  private _action(action: "snooze" | "stop") {
    if (this.hass && this.alarmId) alarmAction(this.hass, action, this.alarmId).catch(() => undefined);
  }

  private _live() {
    const hass = this.hass;
    const rt = this.runtime!;
    const speed = rt.test_speed || 1;
    const alarmAt = Date.parse(rt.alarm_time!);
    // Simulated time: the alarm time minus the remaining (sped-up) time.
    const left = (alarmAt - this._now) / 1000;
    const simMin = toMin(this.wakeTime) - (left * speed) / 60;
    const clock = formatClock(hass, toHHMM(Math.floor(((simMin % 1440) + 1440) % 1440)));
    const light = rt.light_start ? Date.parse(rt.light_start) : alarmAt;
    const total = Math.max(1, alarmAt - Math.min(light, alarmAt - 1000));
    const done = Math.min(1, Math.max(0, 1 - (alarmAt - this._now) / total));
    const snoozeLeft = rt.snooze_until ? Math.max(0, (Date.parse(rt.snooze_until) - this._now) / 1000) : 0;
    return html`<div class="live">
      <div>
        <div class="muted">${t(hass, "tr_simulated")}</div>
        <div class="clock">${clock}</div>
      </div>
      <div class="grow">
        <div>${t(hass, `tr_state_${rt.state}` as StringKey)}${rt.snooze_until
          ? html` · ${t(hass, "tr_snooze_left", { time: this._duration(snoozeLeft) })}`
          : nothing}</div>
        <div class="bar"><span style="width:${done * 100}%"></span></div>
      </div>
      ${rt.state === "ringing" ? html`<button class="btn" @click=${() => this._action("snooze")}>${t(hass, "tr_snooze")}</button>` : nothing}
      <button class="btn primary" @click=${() => this._action("stop")}>${t(hass, "stop")}</button>
    </div>`;
  }

  render() {
    const hass = this.hass;
    if (!this.draft) return nothing;
    const available = this.parts.filter((p) => this._configured(p));
    const parts = this._parts;
    const start = this._start ?? this.start;
    const problems = this.runtime?.problems ?? [];
    return html`<div class="box">
      <div class="head">🧪 ${t(hass, "tr_title")}</div>
      <div class="muted">${t(hass, "tr_hint")}</div>
      ${!this.alarmId
        ? html`<div class="muted">${t(hass, "tr_save_first")}</div>`
        : !available.length
          ? html`<div class="muted">${t(hass, "tr_nothing")}</div>`
          : html`
              <div class="row">
                <span>${t(hass, "tr_speed")}</span>
                <div class="seg" role="group">
                  ${SPEEDS.map(
                    (s) => html`<button aria-pressed=${this._speed === s} @click=${() => {
                      this._speed = s;
                      try {
                        localStorage.setItem(STORE, String(s));
                      } catch {
                        /* private mode */
                      }
                    }}>${s === 1 ? t(hass, "tr_real") : t(hass, "tr_lapse", { s: 60 / s })}</button>`,
                  )}
                </div>
              </div>
              <div class="row">
                <div class="seg" role="group">
                  ${(["light", "ring"] as const).map(
                    (v) => html`<button aria-pressed=${start === v} @click=${() => (this._start = v)}>
                      ${t(hass, `tr_start_${v}` as StringKey)}
                    </button>`,
                  )}
                </div>
                ${available.length > 1
                  ? available.map(
                      (p) => html`<button class="chip" aria-pressed=${parts.includes(p)}
                        @click=${() => (this._with = parts.includes(p) ? parts.filter((x) => x !== p) : [...parts, p])}>
                        ${t(hass, `tr_part_${p}` as StringKey)}
                      </button>`,
                    )
                  : nothing}
              </div>
              <div class="muted">
                ${start === "light" ? t(hass, "tr_until", { time: this._duration(this._leadSeconds) }) : t(hass, "tr_ring_now")}
                · ${t(hass, "tr_snooze_info")}
              </div>
              ${this._running
                ? this._live()
                : html`<div class="row">
                    <button class="btn primary" ?disabled=${this._busy || !parts.length} @click=${this._run}>▶ ${t(hass, "tr_start")}</button>
                  </div>`}
              ${this._error ? html`<div class="problem">${this._error}</div>` : nothing}
              ${problems.length
                ? html`<div>
                    <div class="lbl">${t(hass, "tr_problems")}</div>
                    ${problems.map(
                      (p) => html`<div class="problem">⚠ ${t(hass, `tr_part_${p.part}` as StringKey)}: ${p.message}</div>`,
                    )}
                  </div>`
                : nothing}
            `}
    </div>`;
  }
}

define("db-test-run", DbTestRun);
