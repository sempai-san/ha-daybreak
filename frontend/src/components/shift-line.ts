import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../api";
import { t } from "../i18n";
import { shared } from "../styles";
import { clamp, fireEvent, formatClock, toHHMM, toMin } from "../util";

export interface ShiftBand {
  key: string;
  label: string;
  minutes: number;
  color: string;
  /** Can the band end be dragged / typed? */
  editable: boolean;
  note?: string;
}

/**
 * "Wake earlier" axis: 0 (normal time) on the right, earlier to the left.
 * Each rule gets its own lane so overlapping bands never hide each other;
 * the cap is a shaded zone with its own handle. Emits "band-change"
 * {key, minutes} and "cap-change" {minutes}.
 */
export class DbShiftLine extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) bands: ShiftBand[] = [];
  @property({ type: Number }) cap = 30;
  @property() combine: "max" | "sum" = "max";
  @property() time = "07:00";
  @state() private _drag?: string;

  static styles = [
    shared,
    css`
      .axis {
        position: relative;
        user-select: none;
        touch-action: none;
        padding-top: 4px;
      }
      .lane {
        position: relative;
        height: 34px;
        margin-bottom: 6px;
      }
      .lane .bg {
        position: absolute;
        inset: 8px 0;
        border-radius: 9px;
        background: var(--db-tile);
      }
      .band {
        position: absolute;
        top: 8px;
        height: 18px;
        border-radius: 9px;
        mix-blend-mode: screen;
        opacity: 0.85;
      }
      .name {
        position: absolute;
        top: 9px;
        left: 8px;
        font-size: 12px;
        font-weight: 600;
        color: var(--db-text);
        text-shadow: 0 0 4px var(--db-bg);
        pointer-events: none;
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
        cursor: grab;
        z-index: 2;
      }
      .handle span {
        width: 18px;
        height: 18px;
        border-radius: 9px;
        background: #fff;
        border: 3px solid var(--c);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
      }
      .handle.fixed {
        cursor: default;
      }
      .handle.fixed span {
        border-style: dashed;
      }
      .capzone {
        position: absolute;
        top: 0;
        bottom: 22px;
        left: 0;
        background: repeating-linear-gradient(
          135deg,
          color-mix(in srgb, var(--db-cap) 22%, transparent) 0 6px,
          transparent 6px 12px
        );
        border-right: 2px solid var(--db-cap);
        pointer-events: none;
      }
      .result {
        position: absolute;
        top: 0;
        bottom: 22px;
        width: 2px;
        margin-left: -1px;
        background: var(--db-accent);
        pointer-events: none;
      }
      .scale {
        position: relative;
        height: 22px;
        font-size: 11px;
        color: var(--db-muted);
      }
      .scale span {
        position: absolute;
        transform: translateX(-50%);
        top: 4px;
      }
      .caprow {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        margin-top: 8px;
      }
      .caphandle span {
        border-radius: 5px;
        border-color: var(--db-cap);
      }
    `,
  ];

  private get _range() {
    const top = Math.max(this.cap, ...this.bands.map((b) => b.minutes), 15);
    return Math.ceil((top + 10) / 15) * 15;
  }

  /** Position from the left for "N minutes earlier". */
  private _pct(minutes: number) {
    return 100 - (clamp(minutes, 0, this._range) / this._range) * 100;
  }

  private get _result() {
    const values = this.bands.map((b) => b.minutes);
    const total = this.combine === "sum" ? values.reduce((a, b) => a + b, 0) : Math.max(0, ...values);
    return Math.min(total, this.cap);
  }

  private _minutesAt(ev: PointerEvent) {
    const axis = this.shadowRoot!.querySelector(".axis") as HTMLElement;
    const rect = axis.getBoundingClientRect();
    return Math.round(((rect.right - ev.clientX) / rect.width) * this._range);
  }

  private _down(key: string, ev: PointerEvent) {
    this._drag = key;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  }

  private _move(ev: PointerEvent) {
    if (!this._drag) return;
    const minutes = clamp(this._minutesAt(ev), 0, 240);
    if (this._drag === "__cap") fireEvent(this, "cap-change", { minutes });
    else fireEvent(this, "band-change", { key: this._drag, minutes });
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
    const ticks: number[] = [];
    const every = this._range > 90 ? 30 : 15;
    for (let m = 0; m <= this._range; m += every) ticks.push(m);
    const result = this._result;
    return html`
      <div class="axis" @pointermove=${this._move} @pointerup=${() => (this._drag = undefined)}
        @pointercancel=${() => (this._drag = undefined)}>
        <div class="capzone" style="width:${this._pct(this.cap)}%"></div>
        ${this.bands.map(
          (b) => html`<div class="lane" style="--c:${b.color}">
            <div class="bg"></div>
            <div class="band" style="left:${this._pct(b.minutes)}%;right:0;background:${b.color}"></div>
            <span class="name">${b.label}${b.note ? html` · <span class="muted">${b.note}</span>` : nothing}</span>
            <div
              class="handle ${b.editable ? "" : "fixed"}"
              style="left:${this._pct(b.minutes)}%"
              tabindex=${b.editable ? 0 : -1}
              role="slider"
              aria-label=${b.label}
              aria-valuetext=${`−${b.minutes} min`}
              @pointerdown=${(e: PointerEvent) => b.editable && this._down(b.key, e)}
              @keydown=${(e: KeyboardEvent) => b.editable && this._key(b.key, b.minutes, e)}
            ><span></span></div>
          </div>`,
        )}
        <div class="lane" style="--c:var(--db-cap)">
          <div class="handle caphandle" style="left:${this._pct(this.cap)}%;top:-3px" tabindex="0" role="slider"
            aria-label=${t(hass, "shift_cap")} aria-valuetext=${`−${this.cap} min`}
            @pointerdown=${(e: PointerEvent) => this._down("__cap", e)}
            @keydown=${(e: KeyboardEvent) => this._key("__cap", this.cap, e)}><span></span></div>
          <span class="name" style="left:auto;right:4px">${t(hass, "shift_normal", { time: formatClock(hass, this.time) })}</span>
        </div>
        ${result ? html`<div class="result" style="left:${this._pct(result)}%"></div>` : nothing}
        <div class="scale">
          ${ticks.map((m) => html`<span style="left:${this._pct(m)}%">${m ? `−${m}` : "0"}</span>`)}
        </div>
      </div>
      <div class="caprow">
        <label class="row">
          <span>${t(hass, "shift_cap")}</span>
          <input class="inp num" type="number" min="0" max="240" .value=${String(this.cap)}
            @change=${(ev: Event) =>
              fireEvent(this, "cap-change", { minutes: clamp(Number((ev.target as HTMLInputElement).value) || 0, 0, 240) })} />
          <span>min</span>
        </label>
        <span class="grow"></span>
        <span class="muted">
          ${t(hass, "shift_result", {
            min: result,
            time: formatClock(hass, toHHMM(toMin(this.time) - result)),
          })}
        </span>
      </div>
    `;
  }
}

customElements.define("db-shift-line", DbShiftLine);
