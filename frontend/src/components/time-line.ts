import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../api";
import { t } from "../i18n";
import { shared } from "../styles";
import { clamp, fireEvent, formatClock, toHHMM, toMin, define } from "../util";

/**
 * Light start → wake → (snoozes) → last call / off on one bar.
 * The wake time is a fixed mark (changed in its field). The light start has
 * its own handle; dragging it changes only how early the light begins. The
 * end handle snaps to snooze steps and sets the snooze count; with a last
 * call a further handle sets when the alarm switches off for good.
 * The wake time always sits in the middle; the scale grows or shrinks so
 * every handle fits. With per-lamp starts each lamp gets its own row.
 * Emits "timeline-change" with {time, lead, count, lcDuration} and
 * "lamp-start-change" with {entity, start}.
 */
export interface LampStart {
  entity: string;
  name: string;
  /** Minutes before the wake time. */
  before: number;
  gradient?: string;
}

type Drag = "start" | "end" | "off" | `lamp:${number}`;

export class DbTimeLine extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property() time = "07:00";
  @property({ type: Number }) lead = 30;
  @property({ type: Number }) snooze = 9;
  @property({ type: Number }) count = 3;
  @property({ type: Boolean }) lastCall = false;
  /** Minutes the last call lasts (only with lastCall). */
  @property({ type: Number }) lcDuration = 10;
  /** Minutes the music starts before the alarm; -1 = no music. */
  @property({ type: Number }) audioLead = -1;
  @property({ type: Boolean }) fixedWake = false;
  @property({ type: Boolean }) showSnooze = true;
  @property() startLabel = "";
  @property() wakeLabel = "";
  @property() gradient = "linear-gradient(90deg,#3a1a12,#ff8a4c,#fff3e0)";
  /** Own start per lamp (minutes after the light start); empty = all start together. */
  @property({ attribute: false }) lamps: LampStart[] = [];
  @state() private _drag?: Drag;
  /** Half width (minutes) frozen while dragging; grows when a handle reaches the edge. */
  private _frozen?: number;
  private _grown = 0;
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
      .music {
        position: absolute;
        top: -2px;
        transform: translateX(-50%);
        font-size: 12px;
        color: var(--db-muted);
        white-space: nowrap;
        pointer-events: none;
      }
      .musicline {
        position: absolute;
        top: 16px;
        height: 32px;
        border-left: 2px dotted var(--db-muted);
        pointer-events: none;
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
      .lamps {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-top: 4px;
        touch-action: none;
        user-select: none;
      }
      .lamp {
        position: relative;
        height: 46px;
      }
      .lname {
        position: absolute;
        top: 0;
        font-size: 12px;
        color: var(--db-muted);
        white-space: nowrap;
      }
      .ltrack {
        position: absolute;
        top: 24px;
        height: 10px;
        border-radius: 5px;
        background: var(--db-tile);
      }
      .lseg {
        top: 24px;
        height: 10px;
        border-radius: 5px 0 0 5px;
      }
      .lwake {
        position: absolute;
        top: 18px;
        width: 2px;
        height: 22px;
        margin-left: -1px;
        background: var(--db-text);
        opacity: 0.6;
      }
      .handle.lh {
        top: 9px;
      }
      .handle.lh span {
        width: 18px;
        height: 18px;
        border-color: var(--db-accent);
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

  /** Minutes from the wake mark to each edge; the wake time stays centred. */
  private get _half() {
    if (this._frozen) return this._frozen;
    const before = Math.max(this.lead, this.audioLead);
    const after = this.showSnooze ? this.snooze * this.count + (this.lastCall ? this.lcDuration : 0) : 0;
    return Math.max(15, Math.ceil((Math.max(before, after) + 5) / 15) * 15);
  }

  /** Minutes shown left of the wake mark. */
  private get _room() {
    return this._half;
  }

  /** Total minutes covered by the bar. */
  private get _span() {
    return this._half * 2;
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

  private _down(which: Drag, ev: PointerEvent) {
    this._frozen = this._half;
    this._drag = which;
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
  }

  /** A lamp's start in minutes before the wake time (never before the light start). */
  private _before(l: LampStart) {
    return clamp(l.before, 1, Math.max(1, this.lead));
  }

  /** Grow the frozen scale (in steps) while a handle is pushed against an edge. */
  private _grow(at: number) {
    if (!this._frozen || Math.abs(at) < this._frozen - 2 || Date.now() - this._grown < 300) return;
    this._grown = Date.now();
    this._frozen += 15;
  }

  private _move(ev: PointerEvent) {
    if (!this._drag) return;
    const at = this._minutesAt(ev);
    this._grow(at);
    if (this._drag.startsWith("lamp:")) {
      const lamp = this.lamps[Number(this._drag.slice(5))];
      const before = Math.round(clamp(-at, 1, Math.max(1, this.lead)));
      this._dragText = `${lamp.name} · ${formatClock(this.hass, toHHMM(toMin(this.time) - before))}`;
      fireEvent(this, "lamp-start-change", { entity: lamp.entity, before });
    } else if (this._drag === "start") {
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

  private _key(which: Drag, ev: KeyboardEvent) {
    const step = ev.key === "ArrowRight" || ev.key === "ArrowUp" ? 1 : ev.key === "ArrowLeft" || ev.key === "ArrowDown" ? -1 : 0;
    if (!step) return;
    ev.preventDefault();
    if (which.startsWith("lamp:")) {
      const lamp = this.lamps[Number(which.slice(5))];
      fireEvent(this, "lamp-start-change", { entity: lamp.entity, before: clamp(this._before(lamp) - step, 1, Math.max(1, this.lead)) });
    } else if (which === "start") this._emit({ lead: clamp(this.lead - step, 0, 240) });
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
    const dragPct = this._drag?.startsWith("lamp:")
      ? this._pct(room - this._before(this.lamps[Number(this._drag.slice(5))]))
      : this._drag === "start" ? startPct : this._drag === "off" ? offPct : endPct;
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
        ${this.audioLead >= 0 && this.showSnooze
          ? html`<span class="music" style="left:${this._pct(room - this.audioLead)}%">♪ ${formatClock(hass, toHHMM(wake - this.audioLead))}</span>
              <div class="musicline" style="left:${this._pct(room - this.audioLead)}%"></div>`
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
      ${this.lamps.length
        ? html`<div class="lamps" @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
            ${this.lamps.map((l, i) => {
              const from = this._pct(room - this._before(l));
              return html`<div class="lamp">
                <span class="lname" style="left:${startPct}%">${l.name} · ${formatClock(hass, toHHMM(wake - this._before(l)))}</span>
                <div class="ltrack" style="left:${startPct}%;width:${wakePct - startPct}%"></div>
                <div class="seg lseg" style="left:${from}%;width:${wakePct - from}%;background:${l.gradient ?? this.gradient}"></div>
                <div class="lwake" style="left:${wakePct}%"></div>
                <div class="handle lh" style="left:${from}%" tabindex="0" role="slider"
                  aria-label=${`${t(hass, "tl_lamp_start")}: ${l.name}`}
                  aria-valuetext=${formatClock(hass, toHHMM(wake - this._before(l)))}
                  @pointerdown=${(e: PointerEvent) => this._down(`lamp:${i}`, e)}
                  @keydown=${(e: KeyboardEvent) => this._key(`lamp:${i}`, e)}><span></span></div>
              </div>`;
            })}
          </div>`
        : nothing}
    `;
  }
}

define("db-time-line", DbTimeLine);
