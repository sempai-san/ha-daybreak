import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../api";
import { t } from "../i18n";
import { shared } from "../styles";
import { clamp, fireEvent, formatClock, toHHMM, toMin } from "../util";

/**
 * Light start → wake → (snoozes) → last call / stop on one bar.
 * Light start is the fixed left end. Dragging the wake handle keeps the light
 * start, the right handle snaps to snooze steps and sets the snooze count.
 * Emits "timeline-change" with {time, lead, count}.
 */
export class DbTimeLine extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property() time = "07:00";
  @property({ type: Number }) lead = 30;
  @property({ type: Number }) snooze = 9;
  @property({ type: Number }) count = 3;
  @property({ type: Boolean }) lastCall = false;
  @property({ type: Boolean }) fixedWake = false;
  @property({ type: Boolean }) showSnooze = true;
  @property() startLabel = "";
  @property() wakeLabel = "";
  @property() gradient = "linear-gradient(90deg,#3a1a12,#ff8a4c,#fff3e0)";
  @state() private _drag?: "wake" | "end";
  @state() private _dragText = "";

  static styles = [
    shared,
    css`
      .labels {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 14px;
      }
      .labels label {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: var(--db-muted);
      }
      .labels label:nth-child(2) {
        align-items: center;
      }
      .labels label:nth-child(3) {
        align-items: flex-end;
      }
      .labels input {
        font-size: 20px;
        height: 44px;
        width: 160px;
        text-align: center;
      }
      .labels label:nth-child(2) input {
        font-size: 24px;
        font-weight: 600;
        width: 200px;
      }
      .bar {
        position: relative;
        height: 64px;
        touch-action: none;
        user-select: none;
      }
      .track {
        position: absolute;
        left: 0;
        right: 0;
        top: 22px;
        height: 20px;
        border-radius: 10px;
        background: var(--db-tile);
      }
      .seg {
        position: absolute;
        top: 22px;
        height: 20px;
      }
      .ramp {
        border-radius: 10px 0 0 10px;
      }
      .snz {
        background: repeating-linear-gradient(
          90deg,
          color-mix(in srgb, var(--db-accent) 55%, transparent) 0 calc(var(--w) - 2px),
          transparent calc(var(--w) - 2px) var(--w)
        );
      }
      .handle {
        position: absolute;
        top: 12px;
        width: 40px;
        height: 40px;
        margin-left: -20px;
        border-radius: 20px;
        cursor: grab;
        display: grid;
        place-items: center;
        outline-offset: -4px;
      }
      .handle span {
        width: 22px;
        height: 22px;
        border-radius: 11px;
        background: #fff;
        border: 3px solid var(--db-accent-strong);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
      }
      .handle.end span {
        border-radius: 6px;
        border-color: var(--db-muted);
      }
      .handle.fixed {
        cursor: default;
      }
      .handle.fixed span {
        border-style: dashed;
      }
      .start {
        position: absolute;
        left: 0;
        top: 14px;
        width: 4px;
        height: 36px;
        border-radius: 2px;
        background: var(--db-accent);
      }
      .tip {
        position: absolute;
        top: -8px;
        transform: translateX(-50%);
        padding: 2px 8px;
        border-radius: 8px;
        background: var(--db-text);
        color: var(--db-bg);
        font-size: 12px;
        font-weight: 600;
        pointer-events: none;
        white-space: nowrap;
      }
      .ticks {
        position: absolute;
        top: 46px;
        left: 0;
        right: 0;
        height: 18px;
        font-size: 11px;
        color: var(--db-muted);
      }
      .ticks span {
        position: absolute;
        transform: translateX(-50%);
        white-space: nowrap;
      }
      .ticks span.first {
        transform: none;
      }
      .ticks span.last {
        transform: translateX(-100%);
      }
      @media (max-width: 520px) {
        .labels input {
          font-size: 16px;
          width: 112px;
        }
        .labels label:nth-child(2) input {
          font-size: 18px;
          width: 124px;
        }
      }
    `,
  ];

  /** Minutes covered by the bar, from light start. */
  private get _span() {
    const tail = this.showSnooze ? this.snooze * this.count : 0;
    const max = this.showSnooze ? this.snooze * 10 : 0;
    return Math.max(20, this.lead + Math.max(tail, Math.min(max, tail + this.snooze * 2)) + 4);
  }

  private _pct(minutesFromStart: number) {
    return (clamp(minutesFromStart, 0, this._span) / this._span) * 100;
  }

  private _emit(time: string, lead: number, count: number) {
    fireEvent(this, "timeline-change", { time, lead, count });
  }

  private _minutesAt(ev: PointerEvent): number {
    const bar = this.shadowRoot!.querySelector(".bar") as HTMLElement;
    const rect = bar.getBoundingClientRect();
    return ((ev.clientX - rect.left) / rect.width) * this._span;
  }

  private _down(which: "wake" | "end", ev: PointerEvent) {
    if (which === "wake" && this.fixedWake) return;
    this._drag = which;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    this._move(ev);
  }

  private _move(ev: PointerEvent) {
    if (!this._drag) return;
    const at = this._minutesAt(ev);
    const start = toMin(this.time) - this.lead;
    if (this._drag === "wake") {
      const lead = Math.round(clamp(at, 0, 240));
      const time = toHHMM(start + lead);
      this._dragText = formatClock(this.hass, time);
      this._emit(time, lead, this.count);
    } else {
      const count = Math.round(clamp((at - this.lead) / this.snooze, 1, 10));
      this._dragText = `${formatClock(this.hass, toHHMM(toMin(this.time) + count * this.snooze))} · ${count}×`;
      this._emit(this.time, this.lead, count);
    }
  }

  private _up() {
    this._drag = undefined;
  }

  private _key(which: "wake" | "end", ev: KeyboardEvent) {
    const step = ev.key === "ArrowRight" || ev.key === "ArrowUp" ? 1 : ev.key === "ArrowLeft" || ev.key === "ArrowDown" ? -1 : 0;
    if (!step) return;
    ev.preventDefault();
    if (which === "wake" && !this.fixedWake) {
      const lead = clamp(this.lead + step, 0, 240);
      this._emit(toHHMM(toMin(this.time) - this.lead + lead), lead, this.count);
    } else if (which === "end") {
      this._emit(this.time, this.lead, clamp(this.count + step, 1, 10));
    }
  }

  private _setStart(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    if (!value) return;
    let lead = toMin(this.time) - toMin(value);
    if (lead < 0) lead += 1440;
    this._emit(this.time, clamp(lead, 0, 240), this.count);
  }

  private _setWake(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    if (value) this._emit(value, this.lead, this.count);
  }

  private _setEnd(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    if (!value) return;
    let diff = toMin(value) - toMin(this.time);
    if (diff < -720) diff += 1440;
    this._emit(this.time, this.lead, clamp(Math.round(diff / this.snooze), 1, 10));
  }

  render() {
    const hass = this.hass;
    const startTime = toHHMM(toMin(this.time) - this.lead);
    const endMinutes = this.snooze * this.count;
    const endTime = toHHMM(toMin(this.time) + endMinutes);
    const wakePct = this._pct(this.lead);
    const endPct = this._pct(this.lead + endMinutes);
    // Enough room for each label (12 h clocks are wide).
    const maxLabels = Math.max(3, Math.floor((this.clientWidth || 600) / 84));
    const tickEvery = [5, 10, 15, 30, 60, 120].find((m) => this._span / m <= maxLabels) ?? 120;
    const firstTick = Math.ceil(toMin(startTime) / tickEvery) * tickEvery - toMin(startTime);
    const ticks: { pct: number; text: string }[] = [];
    for (let m = firstTick; m <= this._span; m += tickEvery) {
      ticks.push({ pct: this._pct(m), text: formatClock(hass, toHHMM(toMin(startTime) + m)) });
    }
    const endLabel = this.lastCall ? t(hass, "tl_last_call") : t(hass, "tl_stop");
    const dragPct = this._drag === "wake" ? wakePct : endPct;
    return html`
      <div class="labels">
        <label>
          <span>${this.startLabel || t(hass, "tl_light_start")}</span>
          <input class="inp tabular" type="time" .value=${startTime} @change=${this._setStart} />
        </label>
        <label>
          <span>${this.wakeLabel || t(hass, "tl_wake")}</span>
          <input
            class="inp tabular"
            type="time"
            .value=${this.time}
            ?readonly=${this.fixedWake}
            @change=${this._setWake}
          />
        </label>
        ${this.showSnooze
          ? html`<label>
              <span>${endLabel}</span>
              <input class="inp tabular" type="time" step="60" .value=${endTime} @change=${this._setEnd} />
            </label>`
          : html`<span></span>`}
      </div>
      <div class="bar" @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
        <div class="track"></div>
        <div class="seg ramp" style="left:0;width:${wakePct}%;background:${this.gradient}"></div>
        ${this.showSnooze
          ? html`<div
              class="seg snz"
              style="left:${wakePct}%;width:${endPct - wakePct}%;--w:${(100 / Math.max(1, this.count))}%"
              title=${t(hass, "tl_snooze_title", { n: this.count, m: this.snooze })}
            ></div>`
          : nothing}
        <div class="start" title=${t(hass, "tl_light_start")}></div>
        <div
          class="handle ${this.fixedWake ? "fixed" : ""}"
          style="left:${wakePct}%"
          tabindex="0"
          role="slider"
          aria-label=${t(hass, "tl_wake")}
          aria-valuetext=${formatClock(hass, this.time)}
          @pointerdown=${(e: PointerEvent) => this._down("wake", e)}
          @keydown=${(e: KeyboardEvent) => this._key("wake", e)}
        ><span></span></div>
        ${this.showSnooze
          ? html`<div
              class="handle end"
              style="left:${endPct}%"
              tabindex="0"
              role="slider"
              aria-label=${endLabel}
              aria-valuetext=${`${formatClock(hass, endTime)}, ${this.count}×`}
              @pointerdown=${(e: PointerEvent) => this._down("end", e)}
              @keydown=${(e: KeyboardEvent) => this._key("end", e)}
            ><span></span></div>`
          : nothing}
        ${this._drag ? html`<span class="tip" style="left:${dragPct}%">${this._dragText}</span>` : nothing}
        <div class="ticks">${ticks.map(
          (tk) => html`<span class=${tk.pct < 7 ? "first" : tk.pct > 93 ? "last" : ""} style="left:${tk.pct}%">${tk.text}</span>`,
        )}</div>
      </div>
    `;
  }
}

customElements.define("db-time-line", DbTimeLine);
