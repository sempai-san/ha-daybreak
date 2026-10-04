import { LitElement, css, html, svg } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../api";
import { t } from "../i18n";
import { shared } from "../styles";
import { clamp, fireEvent, formatClock, toHHMM, toMin } from "../util";

const W = 600;
const H = 150;
const PAD_X = 12;
const PAD_TOP = 12;
const PAD_BOTTOM = 26;

/**
 * Volume over time on the alarm's clock: music starts at a quiet volume,
 * gets louder over the ramp and keeps the end volume. Two handles can be
 * dragged in both directions (time and volume); the values sit as small
 * editable chips right above them. Emits "audio-change" {lead, ramp, volume}.
 */
export class DbAudioLine extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property() time = "07:00";
  @property({ type: Number }) lead = 5;
  @property({ type: Number }) ramp = 5;
  @property({ attribute: false }) volume: [number, number] = [5, 35];
  @property({ type: Boolean }) simple = false;
  @state() private _drag?: "start" | "end";
  private _frozen?: [number, number];

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .wrap {
        position: relative;
        padding-top: 52px;
      }
      svg {
        width: 100%;
        height: auto;
        display: block;
        touch-action: none;
        user-select: none;
      }
      .pill {
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 6px;
        border-radius: 12px;
        background: var(--db-tile);
        border: 1px solid var(--db-line);
        font-size: 12px;
        white-space: nowrap;
      }
      .pill input {
        height: 30px;
        border-radius: 8px;
        border: 1px solid var(--db-line);
        background: var(--db-bg);
        color: var(--db-text);
        font: inherit;
        padding: 0 4px;
      }
      .pill input[type="number"] {
        width: 52px;
        text-align: right;
      }
      .pill input[type="time"] {
        width: 92px;
      }
      .pill input[type="time"]::-webkit-calendar-picker-indicator {
        display: none;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 16px;
        font-size: 12px;
        color: var(--db-muted);
        margin-top: 6px;
      }
    `,
  ];

  /** Visible range in minutes relative to the alarm: [left, right]. */
  private get _range(): [number, number] {
    if (this._frozen) return this._frozen;
    const rampEnd = -this.lead + this.ramp;
    const left = -Math.max(10, Math.ceil((this.lead + 5) / 5) * 5);
    const right = Math.max(5, Math.ceil((rampEnd + 4) / 5) * 5);
    return [left, right];
  }

  private _x(m: number) {
    const [lo, hi] = this._range;
    return PAD_X + ((clamp(m, lo, hi) - lo) / (hi - lo)) * (W - 2 * PAD_X);
  }

  private _y(v: number) {
    return PAD_TOP + (1 - clamp(v, 0, 100) / 100) * (H - PAD_TOP - PAD_BOTTOM);
  }

  private _emit(change: { lead?: number; ramp?: number; volume?: [number, number] }) {
    fireEvent(this, "audio-change", { lead: this.lead, ramp: this.ramp, volume: this.volume, ...change });
  }

  private _fromEvent(ev: PointerEvent): { m: number; v: number } {
    const el = this.shadowRoot!.querySelector("svg") as SVGSVGElement;
    const rect = el.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * W;
    const y = ((ev.clientY - rect.top) / rect.height) * H;
    const [lo, hi] = this._range;
    return {
      m: lo + ((x - PAD_X) / (W - 2 * PAD_X)) * (hi - lo),
      v: (1 - (y - PAD_TOP) / (H - PAD_TOP - PAD_BOTTOM)) * 100,
    };
  }

  private _down(which: "start" | "end", ev: PointerEvent) {
    const [lo, hi] = this._range;
    this._frozen = [lo - (which === "start" ? 10 : 0), hi + (which === "end" ? 10 : 0)];
    this._drag = which;
    (ev.currentTarget as Element).setPointerCapture(ev.pointerId);
  }

  private _move(ev: PointerEvent) {
    if (!this._drag) return;
    const { m, v } = this._fromEvent(ev);
    const vol = Math.round(clamp(v, 0, 100));
    if (this._drag === "start") {
      const lead = Math.round(clamp(-m, 0, 60));
      // Keep the end of the ramp where it is.
      const ramp = clamp(Math.round(this.ramp + (lead - this.lead)), 0, 60);
      this._emit({ lead, ramp, volume: [this.simple ? this.volume[0] : vol, this.volume[1]] });
    } else {
      const ramp = Math.round(clamp(m + this.lead, 0, 60));
      this._emit({ ramp, volume: [this.volume[0], vol] });
    }
  }

  private _up() {
    this._drag = undefined;
    this._frozen = undefined;
  }

  private _pillLeft(x: number) {
    return `clamp(0px, calc(${(x / W) * 100}% - 60px), calc(100% - 170px))`;
  }

  render() {
    const hass = this.hass;
    const wake = toMin(this.time);
    const [lo, hi] = this._range;
    const sx = this._x(-this.lead);
    const ex = this._x(-this.lead + this.ramp);
    const sy = this._y(this.volume[0]);
    const ey = this._y(this.volume[1]);
    const base = this._y(0);
    const wx = this._x(0);
    const every = hi - lo > 40 ? 10 : 5;
    const ticks: number[] = [];
    for (let m = Math.ceil(lo / every) * every; m <= hi; m += every) ticks.push(m);
    const area = `M${sx},${base} L${sx},${sy} L${ex},${ey} L${this._x(hi)},${ey} L${this._x(hi)},${base} Z`;
    const line = `M${sx},${sy} L${ex},${ey} L${this._x(hi)},${ey}`;
    const clock = (m: number) => formatClock(hass, toHHMM(wake + m));
    const setTime = (value: string, which: "start" | "end") => {
      if (!value) return;
      let diff = toMin(value) - wake;
      if (diff > 720) diff -= 1440;
      if (diff < -720) diff += 1440;
      if (which === "start") {
        const lead = clamp(-diff, 0, 60);
        this._emit({ lead, ramp: clamp(this.ramp + (lead - this.lead), 0, 60) });
      } else {
        this._emit({ ramp: clamp(diff + this.lead, 0, 60) });
      }
    };
    return html`<div class="wrap">
        <div class="pill" style="left:${this._pillLeft(sx)}">
          ♪
          <input type="time" .value=${toHHMM(wake - this.lead)} aria-label=${t(hass, "audio_start_at")}
            @change=${(e: Event) => setTime((e.target as HTMLInputElement).value, "start")} />
          ${this.simple
            ? html``
            : html`<input type="number" min="0" max="100" .value=${String(Math.round(this.volume[0]))} aria-label=${t(hass, "audio_vol_start")}
                @change=${(e: Event) => this._emit({ volume: [clamp(Number((e.target as HTMLInputElement).value), 0, 100), this.volume[1]] })} />%`}
        </div>
        <div class="pill" style="left:${this._pillLeft(ex)};top:${ex - sx < 190 ? "-2px" : "0"};transform:translateY(${ex - sx < 190 ? "-110%" : "0"})">
          🔊
          <input type="time" .value=${toHHMM(wake - this.lead + this.ramp)} aria-label=${t(hass, "audio_loud_at")}
            @change=${(e: Event) => setTime((e.target as HTMLInputElement).value, "end")} />
          <input type="number" min="0" max="100" .value=${String(Math.round(this.volume[1]))} aria-label=${t(hass, "audio_vol_end")}
            @change=${(e: Event) => this._emit({ volume: [this.volume[0], clamp(Number((e.target as HTMLInputElement).value), 0, 100)] })} />%
        </div>
        <svg viewBox="0 0 ${W} ${H}" @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
          ${[25, 50, 75, 100].map(
            (v) => svg`<line x1=${PAD_X} x2=${W - PAD_X} y1=${this._y(v)} y2=${this._y(v)} stroke="var(--db-line)" stroke-dasharray="3 5"/>
              <text x=${W - PAD_X} y=${this._y(v) - 3} text-anchor="end" font-size="10" fill="var(--db-muted)">${v}%</text>`,
          )}
          <path d=${area} fill="color-mix(in srgb, var(--db-accent) 22%, transparent)"/>
          <path d=${line} fill="none" stroke="var(--db-accent)" stroke-width="3" stroke-linejoin="round"/>
          <line x1=${wx} x2=${wx} y1=${PAD_TOP - 6} y2=${base} stroke="var(--db-text)" stroke-width="2"/>
          <text x=${wx + 4} y=${PAD_TOP + 4} font-size="11" fill="var(--db-text)">${t(hass, "tl_wake")}</text>
          ${ticks.map(
            (m) => svg`<text x=${this._x(m)} y=${H - 8} font-size="10" fill="var(--db-muted)"
              text-anchor=${m === lo ? "start" : m === hi ? "end" : "middle"}>${clock(m)}</text>`,
          )}
          <g style="cursor:grab" @pointerdown=${(e: PointerEvent) => this._down("start", e)}>
            <circle cx=${sx} cy=${sy} r="20" fill="transparent"/>
            <circle cx=${sx} cy=${sy} r="8" fill="#fff" stroke="var(--db-accent)" stroke-width="3"/>
          </g>
          <g style="cursor:grab" @pointerdown=${(e: PointerEvent) => this._down("end", e)}>
            <circle cx=${ex} cy=${ey} r="20" fill="transparent"/>
            <circle cx=${ex} cy=${ey} r="8" fill="#fff" stroke="var(--db-accent-strong)" stroke-width="3"/>
          </g>
        </svg>
      </div>
      <div class="legend">
        <span>♪ ${t(hass, "audio_start_at")}: ${clock(-this.lead)}</span>
        <span>🔊 ${t(hass, "audio_loud_at")}: ${clock(-this.lead + this.ramp)}</span>
        <span>${t(hass, "audio_drag_hint")}</span>
      </div>`;
  }
}

customElements.define("db-audio-line", DbAudioLine);
