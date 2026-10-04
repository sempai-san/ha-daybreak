import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../api";
import { t } from "../i18n";
import { shared } from "../styles";
import { clamp, fireEvent, formatClock, toHHMM, toMin, define } from "../util";

export interface ShiftBand {
  key: string;
  label: string;
  /** Minutes earlier; null = depends on a live value that is unknown now. */
  minutes: number | null;
  color: string;
  editable: boolean;
  note?: string;
}

/**
 * The alarm's real time line (light start → wake) with every reason to wake
 * earlier on its own lane, the "at most" limit and the worst case below.
 * Emits "band-change" {key, minutes} and "cap-change" {minutes}.
 */
export class DbShiftLine extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) bands: ShiftBand[] = [];
  @property({ type: Number }) cap = 30;
  @property({ type: Number }) lead = 30;
  @property() combine: "max" | "sum" = "max";
  @property() time = "07:00";
  @property() gradient = "linear-gradient(90deg,#3a1a12,#ff8a4c,#fff3e0)";
  @state() private _drag?: string;
  private _range?: [number, number];
  private _grown = 0;

  static styles = [
    shared,
    css`
      .grid {
        position: relative;
        user-select: none;
        touch-action: none;
      }
      .row {
        position: relative;
        display: grid;
        grid-template-columns: 112px minmax(0, 1fr);
        align-items: center;
        min-height: 34px;
        gap: 8px;
      }
      .name {
        font-size: 13px;
        line-height: 1.2;
      }
      .name small {
        display: block;
        color: var(--db-muted);
        font-size: 11px;
      }
      .lane {
        position: relative;
        height: 34px;
      }
      .bar {
        position: absolute;
        top: 9px;
        height: 16px;
        border-radius: 8px;
      }
      .bar.unknown {
        background: repeating-linear-gradient(90deg, var(--c) 0 6px, transparent 6px 10px) !important;
        opacity: 0.6;
      }
      .handle {
        position: absolute;
        top: -3px;
        width: 40px;
        height: 40px;
        margin-left: -20px;
        border-radius: 20px;
        display: grid;
        place-items: center;
        cursor: ew-resize;
        z-index: 2;
      }
      .handle span {
        width: 16px;
        height: 16px;
        border-radius: 8px;
        background: #fff;
        border: 3px solid var(--c, var(--db-accent));
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
      }
      .val {
        position: absolute;
        top: 8px;
        transform: translateX(calc(-100% - 8px));
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
      }
      .overlay {
        position: absolute;
        top: 0;
        bottom: 22px;
        pointer-events: none;
      }
      .capzone {
        background: repeating-linear-gradient(
          135deg,
          color-mix(in srgb, var(--db-cap) 18%, transparent) 0 6px,
          transparent 6px 12px
        );
        border-right: 2px dashed var(--db-cap);
      }
      .wakeline {
        border-left: 2px solid var(--db-accent);
      }
      .caphandle {
        position: absolute;
        bottom: -2px;
        width: 40px;
        height: 28px;
        margin-left: -20px;
        display: grid;
        place-items: center;
        cursor: ew-resize;
        z-index: 3;
      }
      .caphandle span {
        width: 14px;
        height: 14px;
        border-radius: 3px;
        background: var(--db-cap);
        transform: rotate(45deg);
      }
      .axis {
        position: relative;
        height: 22px;
        font-size: 11px;
        color: var(--db-muted);
      }
      .axis span {
        position: absolute;
        transform: translateX(-50%);
        top: 6px;
        white-space: nowrap;
      }
      .foot {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
      }
      @media (max-width: 520px) {
        .row {
          grid-template-columns: 80px minmax(0, 1fr);
        }
      }
    `,
  ];

  private get _result() {
    const values = this.bands.map((b) => b.minutes ?? 0);
    const total = this.combine === "sum" ? values.reduce((a, b) => a + b, 0) : Math.max(0, ...values);
    return Math.min(total, this.cap);
  }

  /** Clock range of the axis in minutes since midnight (relative to wake). */
  private get _bounds(): [number, number] {
    if (this._range) return this._range;
    const wake = toMin(this.time);
    const earliest = Math.max(this.cap, ...this.bands.map((b) => b.minutes ?? 0)) + this.lead;
    // The wake time stays in the middle.
    const half = Math.max(15, Math.ceil((earliest + 5) / 15) * 15);
    return [wake - half, wake + half];
  }

  private _pct(clock: number) {
    const [lo, hi] = this._bounds;
    return ((clamp(clock, lo, hi) - lo) / (hi - lo)) * 100;
  }

  private _minutesEarlier(ev: PointerEvent) {
    const lane = this.shadowRoot!.querySelector(".lane") as HTMLElement;
    const rect = lane.getBoundingClientRect();
    const [lo, hi] = this._bounds;
    const clock = lo + ((ev.clientX - rect.left) / rect.width) * (hi - lo);
    return clamp(Math.round(toMin(this.time) - clock), 0, 240);
  }

  private _down(key: string, ev: PointerEvent) {
    this._range = this._bounds;
    this._drag = key;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  }

  private _move(ev: PointerEvent) {
    if (!this._drag) return;
    const minutes = this._minutesEarlier(ev);
    // Pushed against the left edge: widen the scale around the wake time.
    if (this._range && toMin(this.time) - minutes <= this._range[0] + 1 && Date.now() - this._grown > 300) {
      this._grown = Date.now();
      this._range = [this._range[0] - 15, this._range[1] + 15];
    }
    if (this._drag === "__cap") fireEvent(this, "cap-change", { minutes });
    else fireEvent(this, "band-change", { key: this._drag, minutes });
  }

  private _up() {
    this._drag = undefined;
    this._range = undefined;
  }

  private _key(key: string, current: number, ev: KeyboardEvent) {
    const step = ev.key === "ArrowLeft" || ev.key === "ArrowUp" ? 1 : ev.key === "ArrowRight" || ev.key === "ArrowDown" ? -1 : 0;
    if (!step) return;
    ev.preventDefault();
    const minutes = clamp(current + step, 0, 240);
    if (key === "__cap") fireEvent(this, "cap-change", { minutes });
    else fireEvent(this, "band-change", { key, minutes });
  }

  render() {
    const hass = this.hass;
    const wake = toMin(this.time);
    const start = wake - this.lead;
    const result = this._result;
    const [lo, hi] = this._bounds;
    const every = hi - lo > 150 ? 30 : hi - lo > 70 ? 15 : 10;
    const ticks: number[] = [];
    for (let m = Math.ceil(lo / every) * every; m <= hi; m += every) ticks.push(m);
    const capPct = this._pct(wake - this.cap);
    const clock = (m: number) => formatClock(hass, toHHMM(m));
    const ramp = (from: number, label: string, sub: string) => html`<div class="row">
      <div class="name">${label}<small>${sub}</small></div>
      <div class="lane">
        <div class="bar" style="left:${this._pct(from)}%;width:${this._pct(from + this.lead) - this._pct(from)}%;background:${this.gradient}"></div>
      </div>
    </div>`;
    return html`
      <div class="grid" @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
        ${ramp(start, t(hass, "shift_row_normal"), `${clock(start)} – ${clock(wake)}`)}
        ${this.bands.map((b) => {
          const m = b.minutes;
          const left = this._pct(wake - (m ?? this.cap));
          return html`<div class="row" style="--c:${b.color}">
            <div class="name">${b.label}${b.note ? html`<small>${b.note}</small>` : nothing}</div>
            <div class="lane">
              <div class="bar ${m === null ? "unknown" : ""}" style="left:${left}%;width:${this._pct(wake) - left}%;background:${b.color}"></div>
              ${m !== null && m > 0 ? html`<span class="val" style="left:${left}%">−${m}</span>` : nothing}
              ${b.editable && m !== null
                ? html`<div class="handle" style="left:${left}%" tabindex="0" role="slider" aria-label=${b.label}
                    aria-valuetext=${`−${m} min`} @pointerdown=${(e: PointerEvent) => this._down(b.key, e)}
                    @keydown=${(e: KeyboardEvent) => this._key(b.key, m, e)}><span></span></div>`
                : nothing}
            </div>
          </div>`;
        })}
        ${ramp(
          start - result,
          t(hass, "shift_row_worst"),
          result ? `${clock(start - result)} – ${clock(wake - result)}` : t(hass, "shift_row_same"),
        )}
        <div class="row">
          <span></span>
          <div class="lane" style="height:22px">
            <div class="axis">${ticks.map((m) => html`<span style="left:${this._pct(m)}%">${clock(m)}</span>`)}</div>
          </div>
        </div>
        <div class="row" style="position:absolute;inset:0 0 0 0;pointer-events:none">
          <span></span>
          <div style="position:relative;height:100%">
            <div class="overlay capzone" style="left:0;width:${capPct}%"></div>
            <div class="overlay wakeline" style="left:${this._pct(wake)}%"></div>
            <div class="caphandle" style="left:${capPct}%;pointer-events:auto" tabindex="0" role="slider"
              aria-label=${t(hass, "shift_cap")} aria-valuetext=${`−${this.cap} min`}
              @pointerdown=${(e: PointerEvent) => this._down("__cap", e)}
              @keydown=${(e: KeyboardEvent) => this._key("__cap", this.cap, e)}><span></span></div>
          </div>
        </div>
      </div>
      <div class="foot">
        <label class="row" style="display:flex;min-height:0">
          <span>${t(hass, "shift_cap")}</span>
          <input class="inp num" type="number" min="0" max="240" .value=${String(this.cap)}
            @change=${(ev: Event) =>
              fireEvent(this, "cap-change", { minutes: clamp(Number((ev.target as HTMLInputElement).value) || 0, 0, 240) })} />
          <span>${t(hass, "min_earlier")}</span>
        </label>
        <span class="grow"></span>
        <span class="muted">${t(hass, this.combine === "sum" ? "shift_hint_sum" : "shift_hint_max")}</span>
      </div>
    `;
  }
}

define("db-shift-line", DbShiftLine);
