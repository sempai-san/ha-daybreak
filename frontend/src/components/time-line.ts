import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../api";
import { t } from "../i18n";
import { shared } from "../styles";
import { clamp, fireEvent, formatClock, toHHMM, toMin } from "../util";

/**
 * Light start → wake → (snoozes) → last call / off on one bar.
 * The wake time is a fixed mark (changed in its field). The light start has
 * its own handle; dragging it changes only how early the light begins. The
 * end handle snaps to snooze steps and sets the snooze count; with a last
 * call a further handle sets when the alarm switches off for good.
 * Emits "timeline-change" with {time, lead, count, lcDuration}.
 */
export class DbTimeLine extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property() time = "07:00";
  @property({ type: Number }) lead = 30;
  @property({ type: Number }) snooze = 9;
  @property({ type: Number }) count = 3;
  @property({ type: Boolean }) lastCall = false;
  /** Minutes the last call lasts (only with lastCall). */
  @property({ type: Number }) lcDuration = 10;
  @property({ type: Boolean }) fixedWake = false;
  @property({ type: Boolean }) showSnooze = true;
  @property() startLabel = "";
  @property() wakeLabel = "";
  @property() gradient = "linear-gradient(90deg,#3a1a12,#ff8a4c,#fff3e0)";
  @state() private _drag?: "start" | "end" | "off";
  /** Scale frozen while dragging, so it does not run away: [lead room, span]. */
  private _frozen?: [number, number];
  @state() private _dragText = "";
  @state() private _width = 600;
  private _ro?: ResizeObserver;

  connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver((entries) => {
      const w = Math.round(entries[0].contentRect.width);
      if (w && Math.abs(w - this._width) > 20) this._width = w;
    });
    this._ro.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
      }
      .labels {
        display: grid;
        grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr));
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
      .labels label:last-child {
        align-items: flex-end;
      }
      .labels label:nth-child(3):not(:last-child) {
        align-items: center;
      }
      .labels input {
        font-size: clamp(15px, 3.6vw, 20px);
        height: 44px;
        width: 100%;
        max-width: 170px;
        text-align: center;
        padding: 0 6px;
      }
      .labels label:nth-child(2) input {
        font-size: clamp(17px, 4.4vw, 24px);
        font-weight: 600;
        max-width: 210px;
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
      .track {
        opacity: 0.6;
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
      .lc {
        background: repeating-linear-gradient(
          135deg,
          color-mix(in srgb, var(--db-cap) 70%, transparent) 0 6px,
          color-mix(in srgb, var(--db-cap) 40%, transparent) 6px 12px
        );
        border-radius: 0 10px 10px 0;
      }
      .handle.off span {
        border-radius: 4px;
        border-color: var(--db-cap);
        background: var(--db-cap);
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
      .wake {
        position: absolute;
        top: 10px;
        width: 4px;
        height: 44px;
        margin-left: -2px;
        border-radius: 2px;
        background: var(--db-text);
      }
      .handle.start span {
        border-color: var(--db-accent);
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
        .labels {
          gap: 6px;
        }
        .labels input {
          height: 40px;
          padding: 0 2px;
        }
        .labels input::-webkit-calendar-picker-indicator {
          display: none;
        }
      }
    `,
  ];

  /** Minutes shown left of the wake mark (room to drag the light start). */
  private get _room() {
    if (this._frozen) return this._frozen[0];
    return Math.max(30, Math.ceil((this.lead + 15) / 15) * 15);
  }

  /** Total minutes covered by the bar. */
  private get _span() {
    if (this._frozen) return this._frozen[1];
    if (!this.showSnooze) return this._room + 6;
    const tail = this.snooze * this.count + (this.lastCall ? this.lcDuration : 0);
    return this._room + tail + Math.max(this.snooze, 8);
  }

  /** Position (%) of "minutes after the left edge of the bar". */
  private _pct(m: number) {
    return (clamp(m, 0, this._span) / this._span) * 100;
  }

  private _emit(change: { time?: string; lead?: number; count?: number; lcDuration?: number }) {
    fireEvent(this, "timeline-change", {
      time: this.time,
      lead: this.lead,
      count: this.count,
      lcDuration: this.lcDuration,
      ...change,
    });
  }

  /** Pointer position in minutes relative to the wake time. */
  private _minutesAt(ev: PointerEvent): number {
    const bar = this.shadowRoot!.querySelector(".bar") as HTMLElement;
    const rect = bar.getBoundingClientRect();
    return ((ev.clientX - rect.left) / rect.width) * this._span - this._room;
  }

  private _down(which: "start" | "end" | "off", ev: PointerEvent) {
    const extra = which === "start" ? 30 : which === "end" ? this.snooze * 3 : 20;
    this._frozen = [this._room + (which === "start" ? 30 : 0), this._span + extra];
    this._drag = which;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  }

  private _move(ev: PointerEvent) {
    if (!this._drag) return;
    const at = this._minutesAt(ev);
    if (this._drag === "start") {
      const lead = Math.round(clamp(-at, 0, 240));
      this._dragText = formatClock(this.hass, toHHMM(toMin(this.time) - lead));
      this._emit({ lead });
    } else if (this._drag === "end") {
      const count = Math.round(clamp(at / this.snooze, 1, 10));
      this._dragText = `${formatClock(this.hass, toHHMM(toMin(this.time) + count * this.snooze))} · ${count}×`;
      this._emit({ count });
    } else {
      const lcDuration = Math.round(clamp(at - this.snooze * this.count, 1, 120));
      this._dragText = formatClock(this.hass, toHHMM(toMin(this.time) + this.snooze * this.count + lcDuration));
      this._emit({ lcDuration });
    }
  }

  private _up() {
    this._drag = undefined;
    this._frozen = undefined;
  }

  private _key(which: "start" | "end" | "off", ev: KeyboardEvent) {
    const step = ev.key === "ArrowRight" || ev.key === "ArrowUp" ? 1 : ev.key === "ArrowLeft" || ev.key === "ArrowDown" ? -1 : 0;
    if (!step) return;
    ev.preventDefault();
    if (which === "start") this._emit({ lead: clamp(this.lead - step, 0, 240) });
    else if (which === "end") this._emit({ count: clamp(this.count + step, 1, 10) });
    else this._emit({ lcDuration: clamp(this.lcDuration + step, 1, 120) });
  }

  private _diff(value: string, from: string) {
    let diff = toMin(value) - toMin(from);
    if (diff < -720) diff += 1440;
    return diff;
  }

  private _setStart(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    if (!value) return;
    let lead = toMin(this.time) - toMin(value);
    if (lead < 0) lead += 1440;
    this._emit({ lead: clamp(lead, 0, 240) });
  }

  private _setWake(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    if (value) this._emit({ time: value });
  }

  private _setEnd(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    if (value) this._emit({ count: clamp(Math.round(this._diff(value, this.time) / this.snooze), 1, 10) });
  }

  private _setOff(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    if (!value) return;
    this._emit({ lcDuration: clamp(this._diff(value, this.time) - this.snooze * this.count, 1, 120) });
  }

  render() {
    const hass = this.hass;
    const room = this._room;
    const wake = toMin(this.time);
    const startTime = toHHMM(wake - this.lead);
    const endMinutes = this.snooze * this.count;
    const endTime = toHHMM(wake + endMinutes);
    const lc = this.showSnooze && this.lastCall;
    const offTime = toHHMM(wake + endMinutes + this.lcDuration);
    const startPct = this._pct(room - this.lead);
    const wakePct = this._pct(room);
    const endPct = this._pct(room + endMinutes);
    const offPct = this._pct(room + endMinutes + this.lcDuration);
    // Enough room for each label (12 h clocks are wide).
    const maxLabels = Math.max(3, Math.floor(this._width / 84));
    const tickEvery = [5, 10, 15, 30, 60, 120].find((m) => this._span / m <= maxLabels) ?? 120;
    const left = wake - room;
    const ticks: { pct: number; text: string }[] = [];
    for (let m = Math.ceil(left / tickEvery) * tickEvery - left; m <= this._span; m += tickEvery) {
      ticks.push({ pct: this._pct(m), text: formatClock(hass, toHHMM(left + m)) });
    }
    const endLabel = this.lastCall ? t(hass, "tl_last_call") : t(hass, "tl_stop");
    const dragPct = this._drag === "start" ? startPct : this._drag === "off" ? offPct : endPct;
    return html`
      <div class="labels" style="--cols:${lc ? 4 : 3}">
        <label>
          <span>${this.startLabel || t(hass, "tl_light_start")}</span>
          <input class="inp tabular" type="time" .value=${startTime} @change=${this._setStart} />
        </label>
        <label>
          <span>${this.wakeLabel || t(hass, "tl_wake")}</span>
          <input class="inp tabular" type="time" .value=${this.time} ?readonly=${this.fixedWake} @change=${this._setWake} />
        </label>
        ${this.showSnooze
          ? html`<label>
              <span>${endLabel}</span>
              <input class="inp tabular" type="time" step="60" .value=${endTime} @change=${this._setEnd} />
            </label>`
          : html`<span></span>`}
        ${lc
          ? html`<label>
              <span>${t(hass, "tl_off")}</span>
              <input class="inp tabular" type="time" .value=${offTime} @change=${this._setOff} />
            </label>`
          : nothing}
      </div>
      <div class="bar" @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
        <div class="track"></div>
        <div class="seg ramp" style="left:${startPct}%;width:${wakePct - startPct}%;background:${this.gradient}"></div>
        ${this.showSnooze
          ? html`<div
              class="seg snz"
              style="left:${wakePct}%;width:${endPct - wakePct}%;--w:${100 / Math.max(1, this.count)}%"
              title=${t(hass, "tl_snooze_title", { n: this.count, m: this.snooze })}
            ></div>`
          : nothing}
        ${lc
          ? html`<div class="seg lc" style="left:${endPct}%;width:${offPct - endPct}%" title=${t(hass, "tl_last_call")}></div>`
          : nothing}
        <div class="wake" style="left:${wakePct}%" title=${this.wakeLabel || t(hass, "tl_wake")}></div>
        <div
          class="handle start"
          style="left:${startPct}%"
          tabindex="0"
          role="slider"
          aria-label=${this.startLabel || t(hass, "tl_light_start")}
          aria-valuetext=${formatClock(hass, startTime)}
          @pointerdown=${(e: PointerEvent) => this._down("start", e)}
          @keydown=${(e: KeyboardEvent) => this._key("start", e)}
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
        ${lc
          ? html`<div
              class="handle off"
              style="left:${offPct}%"
              tabindex="0"
              role="slider"
              aria-label=${t(hass, "tl_off")}
              aria-valuetext=${formatClock(hass, offTime)}
              @pointerdown=${(e: PointerEvent) => this._down("off", e)}
              @keydown=${(e: KeyboardEvent) => this._key("off", e)}
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
