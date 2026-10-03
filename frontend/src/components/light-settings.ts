import { LitElement, css, html, nothing, svg } from "lit";
import { property, state } from "lit/decorators.js";
import type { ColorPreset, CurveName, EditorMode, HomeAssistant, LightSettings, Point, SequenceStep } from "../api";
import { t, type StringKey } from "../i18n";
import {
  COLOR_PRESETS,
  MATCHING_KELVIN,
  PRESET_POINTS,
  curvePoints,
  curveValue,
  kelvinToRgb,
  levelAt,
  levelCss,
  plainKelvin,
  presetSteps,
  rampGradient,
} from "../model";
import { shared } from "../styles";
import { clamp, fireEvent, formatClock, toHHMM, toMin } from "../util";

const W = 600;
const H = 180;
const PAD = 14;
const CURVES: Exclude<CurveName, "custom">[] = ["natural", "gentle", "linear", "fast"];

/**
 * Curve first, then brightness and colour bars. Emits "settings-change" with
 * the complete new settings. ``locked`` shows everything but blocks editing.
 */
export class DbLightSettings extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) settings!: LightSettings;
  @property() mode: EditorMode = "normal";
  @property({ type: Boolean, reflect: true }) locked = false;
  @property({ type: Number }) duration = 30;
  @property() start = "06:30";
  @property({ attribute: false }) colorLamps: string[] = [];
  @property({ attribute: false }) plainLamps: string[] = [];
  /** Show the "after stop"/"ringing" fine settings (not for profiles of kids lights). */
  @property({ type: Boolean }) showFine = true;
  @state() private _channel: "bri" | "col" = "bri";
  @state() private _sel = -1;
  @state() private _drag?: { kind: "curve" | "bar"; index: number };
  @state() private _open: Record<string, boolean> = { bri: true, col: true, fine: false };

  static styles = [
    shared,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      :host([locked]) .edit {
        pointer-events: none;
      }
      :host([locked]) input:disabled,
      :host([locked]) select:disabled,
      :host([locked]) button:disabled {
        opacity: 1;
        cursor: default;
      }
      .presets {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 8px;
      }
      .preset {
        display: flex;
        flex-direction: column;
        gap: 6px;
        text-align: left;
        padding: 10px 12px;
        border-radius: 14px;
        border: 1px solid var(--db-line);
        background: transparent;
        cursor: pointer;
      }
      .preset[aria-pressed="true"] {
        border-color: var(--db-accent);
        background: color-mix(in srgb, var(--db-accent) 12%, transparent);
      }
      .preset svg {
        width: 100%;
        height: 30px;
      }
      .preset b {
        font-size: 14px;
      }
      .graph {
        position: relative;
      }
      .graph svg {
        width: 100%;
        height: auto;
        display: block;
        touch-action: none;
        user-select: none;
      }
      .tip {
        position: absolute;
        transform: translate(-50%, -130%);
        padding: 2px 8px;
        border-radius: 8px;
        background: var(--db-text);
        color: var(--db-bg);
        font-size: 12px;
        font-weight: 600;
        pointer-events: none;
        white-space: nowrap;
      }
      .strip {
        height: 14px;
        border-radius: 7px;
        margin-top: 6px;
      }
      .section {
        border: 1px solid var(--db-line);
        border-radius: 14px;
        overflow: hidden;
      }
      .sh {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .sh b {
        font-size: 15px;
      }
      .sh .sum {
        margin-left: auto;
        color: var(--db-muted);
        font-size: 13px;
      }
      .sh .chev {
        transition: transform 0.15s;
        color: var(--db-muted);
      }
      .sh[aria-expanded="true"] .chev {
        transform: rotate(90deg);
      }
      .sb {
        padding: 0 14px 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .bar {
        position: relative;
        padding: 18px 0 20px;
        user-select: none;
        touch-action: none;
      }
      .bar .fill {
        height: 26px;
        border-radius: 8px;
      }
      .mark {
        position: absolute;
        top: 0;
        width: 28px;
        height: 22px;
        margin-left: -14px;
        display: grid;
        place-items: center;
        cursor: ew-resize;
      }
      .mark span {
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 10px solid var(--db-text);
      }
      .tick {
        position: absolute;
        bottom: 0;
        font-size: 11px;
        color: var(--db-muted);
        transform: translateX(-50%);
        white-space: nowrap;
      }
      .tick.first {
        transform: none;
      }
      .tick.last {
        transform: translateX(-100%);
      }
      .tickline {
        position: absolute;
        bottom: 16px;
        width: 1px;
        height: 6px;
        background: var(--db-muted);
      }
      .range {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 8px 12px;
        align-items: center;
      }
      .range input[type="range"] {
        width: 100%;
        accent-color: var(--db-accent);
      }
      .pair {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .swatch {
        width: 100%;
        height: 18px;
        border-radius: 6px;
      }
      .cols {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 8px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      td,
      th {
        padding: 4px;
        text-align: left;
      }
      th {
        color: var(--db-muted);
        font-weight: 500;
      }
      td .inp {
        width: 100%;
        height: 34px;
      }
      .fine {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 10px;
      }
      .fine label {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: var(--db-muted);
      }
      .plain {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    `,
  ];

  private get s() {
    return this.settings;
  }

  private _emit(change: Partial<LightSettings>) {
    if (this.locked) return;
    fireEvent(this, "settings-change", { ...this.settings, ...change });
  }

  private _timeAt(p: number) {
    return formatClock(this.hass, toHHMM(toMin(this.start) + p * this.duration));
  }

  // ------------------------------------------------------------------ curve

  private _points(): Point[] {
    const key = this._channel === "col" && this.s.separate ? "points_color" : "points";
    if (this.s.curve !== "custom") return PRESET_POINTS[this.s.curve].map(([t, v]) => ({ t, v }));
    return this.s[key];
  }

  private _setPoints(points: Point[]) {
    const key = this._channel === "col" && this.s.separate ? "points_color" : "points";
    const change: Partial<LightSettings> = { curve: "custom", [key]: points };
    if (this.s.curve !== "custom") {
      // Leaving a preset: the other channel keeps the preset's shape.
      const preset = PRESET_POINTS[this.s.curve].map(([t, v]) => ({ t, v }));
      if (key === "points") change.points_color = this.s.separate ? preset : structuredClone(points);
      else change.points = preset;
    }
    this._emit(change);
  }

  private _xy(p: Point) {
    return { x: PAD + p.t * (W - 2 * PAD), y: H - PAD - p.v * (H - 2 * PAD) };
  }

  private _fromEvent(ev: PointerEvent): Point {
    const svgEl = this.shadowRoot!.querySelector(".graph svg") as SVGSVGElement;
    const rect = svgEl.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * W;
    const y = ((ev.clientY - rect.top) / rect.height) * H;
    return { t: clamp((x - PAD) / (W - 2 * PAD), 0, 1), v: clamp((H - PAD - y) / (H - 2 * PAD), 0, 1) };
  }

  private _curveDown(index: number, ev: PointerEvent) {
    if (this.locked || this.mode === "simple") return;
    ev.stopPropagation();
    this._sel = index;
    this._drag = { kind: "curve", index };
    (ev.currentTarget as Element).setPointerCapture(ev.pointerId);
  }

  private _curveMove(ev: PointerEvent) {
    if (this._drag?.kind !== "curve") return;
    const pts = structuredClone(this._points());
    const i = this._drag.index;
    const at = this._fromEvent(ev);
    const lo = i === 0 ? 0 : pts[i - 1].t + 0.01;
    const hi = i === pts.length - 1 ? 1 : pts[i + 1].t - 0.01;
    pts[i] = {
      t: i === 0 ? 0 : i === pts.length - 1 ? 1 : Math.round(clamp(at.t, lo, hi) * 1000) / 1000,
      v: Math.round(at.v * 1000) / 1000,
    };
    this._setPoints(pts);
  }

  private _addPoint() {
    const pts = structuredClone(this._points());
    let gap = 0;
    let at = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      if (pts[i + 1].t - pts[i].t > gap) {
        gap = pts[i + 1].t - pts[i].t;
        at = i;
      }
    }
    const t = (pts[at].t + pts[at + 1].t) / 2;
    const v = curveValue(pts.map((p) => [p.t, p.v]), t);
    pts.splice(at + 1, 0, { t: Math.round(t * 1000) / 1000, v: Math.round(v * 1000) / 1000 });
    this._sel = at + 1;
    this._setPoints(pts);
  }

  private _removePoint() {
    const pts = structuredClone(this._points());
    if (this._sel <= 0 || this._sel >= pts.length - 1) return;
    pts.splice(this._sel, 1);
    this._sel = -1;
    this._setPoints(pts);
  }

  private _miniCurve(name: Exclude<CurveName, "custom">) {
    const pts = PRESET_POINTS[name];
    const d = Array.from({ length: 31 }, (_, i) => {
      const x = i / 30;
      return `${i ? "L" : "M"}${x * 100},${30 - curveValue(pts, x) * 28}`;
    }).join(" ");
    return svg`<svg viewBox="0 0 100 31" preserveAspectRatio="none"><path d=${d} fill="none" stroke="var(--db-accent)" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>`;
  }

  private _graph() {
    const hass = this.hass;
    const pts = this._points();
    const channel = this.s.separate ? this._channel : "bri";
    const cp = curvePoints(this.s, channel);
    const path = Array.from({ length: 81 }, (_, i) => {
      const p = this._xy({ t: i / 80, v: curveValue(cp, i / 80) });
      return `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ");
    const area = `${path} L${W - PAD},${H - PAD} L${PAD},${H - PAD} Z`;
    const editable = this.mode !== "simple" && !this.locked;
    const grid = [0.25, 0.5, 0.75].map((v) => this._xy({ t: 0, v }).y);
    const tick = this._tickMinutes();
    const ticks: number[] = [];
    for (let m = tick; m < this.duration; m += tick) ticks.push(m / this.duration);
    const drag = this._drag?.kind === "curve" ? pts[this._drag.index] : undefined;
    const dragXY = drag ? this._xy(drag) : undefined;
    return html`
      <div class="graph edit">
        <svg viewBox="0 0 ${W} ${H}" @pointermove=${this._curveMove} @pointerup=${() => (this._drag = undefined)}
          @pointercancel=${() => (this._drag = undefined)}>
          <defs>
            <linearGradient id="fillg" x1="0" x2="1" y1="0" y2="0">
              ${Array.from({ length: 9 }, (_, i) => svg`<stop offset=${i / 8} stop-color=${levelCss(levelAt(this.s, i / 8), false)} stop-opacity="0.35"/>`)}
            </linearGradient>
          </defs>
          ${grid.map((y) => svg`<line x1=${PAD} x2=${W - PAD} y1=${y} y2=${y} stroke="var(--db-line)" stroke-dasharray="3 5"/>`)}
          ${ticks.map((t) => {
            const x = this._xy({ t, v: 0 }).x;
            return svg`<line x1=${x} x2=${x} y1=${PAD} y2=${H - PAD} stroke="var(--db-line)" stroke-dasharray="2 6"/>`;
          })}
          <path d=${area} fill="url(#fillg)"/>
          <path d=${path} fill="none" stroke="var(--db-accent)" stroke-width="3" stroke-linecap="round"/>
          ${editable || this.s.curve === "custom"
            ? pts.map((p, i) => {
                const { x, y } = this._xy(p);
                return svg`<g style="cursor:${editable ? "grab" : "default"}" @pointerdown=${(e: PointerEvent) => this._curveDown(i, e)}>
                  <circle cx=${x} cy=${y} r="18" fill="transparent"/>
                  <circle cx=${x} cy=${y} r=${i === this._sel ? 8 : 6.5} fill="#fff" stroke="var(--db-accent-strong)" stroke-width="3"/>
                </g>`;
              })
            : nothing}
        </svg>
        ${drag && dragXY
          ? html`<span class="tip" style="left:${(dragXY.x / W) * 100}%;top:${(dragXY.y / H) * 100}%">
              ${this._timeAt(drag.t)} · ${Math.round(drag.v * 100)}%
            </span>`
          : nothing}
        <div class="strip" style="background:${rampGradient(this.s)}" title=${t(hass, "ls_strip")}></div>
      </div>
    `;
  }

  private _curveSection() {
    const hass = this.hass;
    const s = this.s;
    const curves: CurveName[] = this.mode === "simple" ? CURVES : [...CURVES, "custom"];
    const pts = this._points();
    return html`
      <div class="presets edit">
        ${curves.map(
          (c) => html`<button class="preset" aria-pressed=${s.curve === c} ?disabled=${this.locked}
            @click=${() => (c === "custom" ? this._setPoints(structuredClone(pts)) : this._emit({ curve: c }))}>
            ${c === "custom" ? html`<svg viewBox="0 0 100 31"><path d="M0 30 C30 28 40 6 100 2" fill="none"
                  stroke="var(--db-accent)" stroke-width="2.5" stroke-dasharray="4 4"/></svg>` : this._miniCurve(c)}
            <b>${t(hass, `curve_${c}` as StringKey)}</b>
            <span class="muted">${t(hass, `curve_${c}_d` as StringKey)}</span>
          </button>`,
        )}
      </div>
      ${this.mode !== "simple"
        ? html`<div class="row edit">
            <div class="seg" role="group" aria-label=${t(hass, "ls_link")}>
              <button aria-pressed=${!s.separate} ?disabled=${this.locked}
                @click=${() => s.separate && this._emit({ separate: false })}>${t(hass, "ls_shared")}</button>
              <button aria-pressed=${s.separate} ?disabled=${this.locked}
                @click=${() => !s.separate && this._emit({ separate: true, curve: "custom", points_color: structuredClone(pts) })}>
                ${t(hass, "ls_separate")}
              </button>
            </div>
            ${s.separate
              ? html`<div class="seg" role="group">
                  <button aria-pressed=${this._channel === "bri"} @click=${() => (this._channel = "bri")}>
                    ${t(hass, "ls_brightness")}
                  </button>
                  <button aria-pressed=${this._channel === "col"} @click=${() => (this._channel = "col")}>
                    ${t(hass, s.color_mode === "color" ? "ls_color" : "ls_ct")}
                  </button>
                </div>`
              : nothing}
            <span class="grow"></span>
            <button class="btn" ?disabled=${this.locked || pts.length >= 24} @click=${this._addPoint}>
              ${t(hass, "ls_add_point")}
            </button>
            <button class="btn" ?disabled=${this.locked || this._sel <= 0 || this._sel >= pts.length - 1}
              @click=${this._removePoint}>${t(hass, "ls_remove_point")}</button>
          </div>`
        : nothing}
      ${this._graph()}
      ${this.mode === "expert" ? this._pointTable(pts) : nothing}
    `;
  }

  private _pointTable(pts: Point[]) {
    const hass = this.hass;
    const set = (i: number, change: Partial<Point>) => {
      const next = structuredClone(pts);
      next[i] = { ...next[i], ...change };
      if (i === 0) next[i].t = 0;
      if (i === next.length - 1) next[i].t = 1;
      next.sort((a, b) => a.t - b.t);
      this._setPoints(next);
    };
    return html`<table class="edit">
      <thead><tr><th>#</th><th>${t(hass, "ls_time")}</th><th>${t(hass, "ls_share")}</th><th>${t(hass, "ls_value")}</th></tr></thead>
      <tbody>
        ${pts.map(
          (p, i) => html`<tr>
            <td>${i + 1}</td>
            <td><input class="inp" type="time" .value=${toHHMM(toMin(this.start) + p.t * this.duration)}
              ?disabled=${this.locked || i === 0 || i === pts.length - 1}
              @change=${(ev: Event) => {
                let m = toMin((ev.target as HTMLInputElement).value) - toMin(this.start);
                if (m < -720) m += 1440;
                set(i, { t: clamp(m / Math.max(1, this.duration), 0, 1) });
              }} /></td>
            <td><input class="inp" type="number" min="0" max="100" .value=${String(Math.round(p.t * 100))}
              ?disabled=${this.locked || i === 0 || i === pts.length - 1}
              @change=${(ev: Event) => set(i, { t: clamp(Number((ev.target as HTMLInputElement).value) / 100, 0, 1) })} /></td>
            <td><input class="inp" type="number" min="0" max="100" .value=${String(Math.round(p.v * 100))}
              ?disabled=${this.locked}
              @change=${(ev: Event) => set(i, { v: clamp(Number((ev.target as HTMLInputElement).value) / 100, 0, 1) })} /></td>
          </tr>`,
        )}
      </tbody>
    </table>`;
  }

  // ------------------------------------------------------------------- bars

  private _tickMinutes() {
    return this.duration > 90 ? 15 : this.duration > 40 ? 10 : 5;
  }

  /** Label every n-th tick so that 12 h labels never overlap. */
  private _labelEvery() {
    const ticks = this.duration / this._tickMinutes();
    const room = Math.max(3, Math.floor((this.clientWidth || 600) / 84));
    return Math.max(1, Math.ceil(ticks / room));
  }

  private _barMarks(channel: "bri" | "col") {
    if (this.s.curve !== "custom") return [];
    const key = channel === "col" && this.s.separate ? "points_color" : "points";
    return this.s[key].map((p, i) => ({ p, i })).slice(1, -1);
  }

  private _barDown(channel: "bri" | "col", index: number, ev: PointerEvent) {
    if (this.locked || this.mode === "simple") return;
    this._channel = this.s.separate ? channel : "bri";
    this._drag = { kind: "bar", index };
    (ev.currentTarget as Element).setPointerCapture(ev.pointerId);
  }

  private _barMove(ev: PointerEvent) {
    if (this._drag?.kind !== "bar") return;
    const bar = ev.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const pts = structuredClone(this._points());
    const i = this._drag.index;
    const x = clamp((ev.clientX - rect.left) / rect.width, pts[i - 1].t + 0.01, pts[i + 1].t - 0.01);
    pts[i] = { ...pts[i], t: Math.round(x * 1000) / 1000 };
    this._setPoints(pts);
  }

  private _bar(channel: "bri" | "col", gradient: string) {
    const tick = this._tickMinutes();
    const ticks: number[] = [];
    for (let m = 0; m <= this.duration; m += tick) ticks.push(m);
    const marks = this._barMarks(channel);
    const dragging = this._drag?.kind === "bar" ? this._points()[this._drag.index] : undefined;
    return html`<div class="bar edit" @pointermove=${this._barMove} @pointerup=${() => (this._drag = undefined)}
      @pointercancel=${() => (this._drag = undefined)}>
      ${marks.map(
        ({ p, i }) => html`<div class="mark" style="left:${p.t * 100}%" title=${this._timeAt(p.t)}
          @pointerdown=${(e: PointerEvent) => this._barDown(channel, i, e)}><span></span></div>`,
      )}
      ${dragging ? html`<span class="tip" style="left:${dragging.t * 100}%;top:0">${this._timeAt(dragging.t)}</span>` : nothing}
      <div class="fill" style="background:${gradient}"></div>
      ${ticks.map((m) => {
        const pct = (m / Math.max(1, this.duration)) * 100;
        const label = (m / tick) % this._labelEvery() === 0;
        return html`<span class="tickline" style="left:${pct}%"></span>
          ${label ? html`<span class="tick ${pct < 7 ? "first" : pct > 93 ? "last" : ""}" style="left:${pct}%">${this._timeAt(m / Math.max(1, this.duration))}</span>` : nothing}`;
      })}
    </div>`;
  }

  private _section(key: string, title: string, summary: string, body: unknown) {
    const open = this._open[key];
    return html`<div class="section">
      <button class="sh" aria-expanded=${open} @click=${() => (this._open = { ...this._open, [key]: !open })}>
        <span class="chev">▸</span><b>${title}</b><span class="sum">${summary}</span>
      </button>
      ${open ? html`<div class="sb">${body}</div>` : nothing}
    </div>`;
  }

  private _rangeInputs(
    values: [number, number],
    min: number,
    max: number,
    step: number,
    unit: string,
    set: (v: [number, number]) => void,
  ) {
    const hass = this.hass;
    const field = (i: 0 | 1) => html`<input class="inp num" type="number" min=${min} max=${max} step=${step}
      .value=${String(Math.round(values[i]))} ?disabled=${this.locked}
      @change=${(ev: Event) => {
        const v = [...values] as [number, number];
        v[i] = clamp(Number((ev.target as HTMLInputElement).value) || min, min, max);
        set(v);
      }} />`;
    const slider = (i: 0 | 1) => html`<input type="range" min=${min} max=${max} step=${step} .value=${String(values[i])}
      ?disabled=${this.locked} aria-label=${t(hass, i ? "ls_end" : "ls_start")}
      @input=${(ev: Event) => {
        const v = [...values] as [number, number];
        v[i] = Number((ev.target as HTMLInputElement).value);
        set(v);
      }} />`;
    return html`<div class="range edit">
      <span>${t(hass, "ls_start")}</span>${slider(0)}<span class="pair">${field(0)}${unit}</span>
      <span>${t(hass, "ls_end")}</span>${slider(1)}<span class="pair">${field(1)}${unit}</span>
    </div>`;
  }

  private _briBar() {
    const s = this.s;
    const parts: string[] = [];
    for (let i = 0; i <= 16; i++) {
      const lv = levelAt(s, i / 16, { ct: false, color: false, dim: true });
      const g = Math.round(30 + 2.2 * lv.bri);
      parts.push(`rgb(${g},${g},${g}) ${(i / 16) * 100}%`);
    }
    return this._section(
      "bri",
      t(this.hass, "ls_brightness"),
      `${Math.round(s.brightness[0])} → ${Math.round(s.brightness[1])} %`,
      html`${this._bar("bri", `linear-gradient(90deg, ${parts.join(",")})`)}
      ${this._rangeInputs(s.brightness, 0, 100, 1, "%", (v) => this._emit({ brightness: v }))}`,
    );
  }

  private _colorBar() {
    const hass = this.hass;
    const s = this.s;
    const isColor = s.color_mode === "color";
    const ctGradient = (k: [number, number]) => {
      const parts: string[] = [];
      for (let i = 0; i <= 12; i++) {
        const col = curveValue(curvePoints(s, "col"), i / 12);
        parts.push(`rgb(${kelvinToRgb(k[0] + (k[1] - k[0]) * col).join(",")}) ${(i / 12) * 100}%`);
      }
      return `linear-gradient(90deg, ${parts.join(",")})`;
    };
    const summary = isColor
      ? t(hass, `colors_${s.colors}` as StringKey)
      : `${s.kelvin[0]} → ${s.kelvin[1]} K`;
    const body = html`
      <div class="row edit">
        <div class="seg" role="group">
          <button aria-pressed=${!isColor} ?disabled=${this.locked} @click=${() => isColor && this._emit({ color_mode: "ct" })}>
            ${t(hass, "ls_ct")}
          </button>
          <button aria-pressed=${isColor} ?disabled=${this.locked} @click=${() => !isColor && this._emit({ color_mode: "color" })}>
            ${t(hass, "ls_color")}
          </button>
        </div>
        <span class="muted grow">${t(hass, isColor ? "ls_color_hint" : "ls_ct_hint")}</span>
      </div>
      ${this._bar("col", isColor ? rampGradient(s, { ct: true, color: true, dim: true }, false) : ctGradient(s.kelvin))}
      ${isColor ? this._colorBody() : html`${this._rangeInputs(s.kelvin, 1500, 6500, 50, "K", (v) => this._emit({ kelvin: v }))}
          <span class="muted">${t(hass, "ls_kelvin_hint")}</span>`}
    `;
    return this._section("col", t(hass, isColor ? "ls_color" : "ls_ct"), summary, body);
  }

  private _colorBody() {
    const hass = this.hass;
    const s = this.s;
    const presets: ColorPreset[] = this.mode === "expert" ? ["sunrise", "dawn", "pastel", "custom"] : ["sunrise", "dawn", "pastel"];
    const plain = plainKelvin(s);
    const matching = s.plain_kelvin === null;
    return html`
      <div class="cols edit">
        ${presets.map((c) => {
          const colors = c === "custom" ? s.sequence.map((x) => x.color) : COLOR_PRESETS[c];
          const bg = colors.length >= 2 ? `linear-gradient(90deg, ${colors.join(",")})` : "var(--db-tile)";
          return html`<button class="preset" aria-pressed=${s.colors === c} ?disabled=${this.locked}
            @click=${() =>
              this._emit(
                c === "custom" && s.sequence.length < 2
                  ? { colors: c, sequence: presetSteps(s.colors === "custom" ? "sunrise" : s.colors, this.duration) }
                  : { colors: c },
              )}>
            <span class="swatch" style="background:${bg}"></span>
            <b>${t(hass, `colors_${c}` as StringKey)}</b>
          </button>`;
        })}
      </div>
      ${this.mode === "expert" && s.colors === "custom" ? this._sequence() : nothing}
      ${this.plainLamps.length || this.mode !== "simple"
        ? html`<div class="tile plain">
            <div class="row">
              <b class="grow">${this.plainLamps.length ? t(hass, "ls_plain", { lamps: this.plainLamps.join(", ") }) : t(hass, "ls_plain_any")}</b>
              <span class="muted">${t(hass, "ls_plain_follow")}</span>
            </div>
            <div class="swatch" style="background:linear-gradient(90deg, rgb(${kelvinToRgb(plain[0]).join(",")}), rgb(${kelvinToRgb(plain[1]).join(",")}))"></div>
            <div class="row edit">
              <span class="tabular">${plain[0]} K → ${plain[1]} K</span>
              <span class="grow"></span>
              <button class="chip" aria-pressed=${matching} ?disabled=${this.locked}
                @click=${() => this._emit({ plain_kelvin: matching ? [...MATCHING_KELVIN[s.colors]] : null })}>
                ${t(hass, "ls_matching")}
              </button>
            </div>
            ${!matching ? this._rangeInputs(plain, 1500, 6500, 50, "K", (v) => this._emit({ plain_kelvin: v })) : nothing}
          </div>`
        : nothing}
    `;
  }

  private _sequence() {
    const hass = this.hass;
    const seq = this.s.sequence;
    const set = (next: SequenceStep[]) => this._emit({ sequence: next });
    const edit = (i: number, change: Partial<SequenceStep>) => {
      const next = structuredClone(seq);
      next[i] = { ...next[i], ...change };
      set(next);
    };
    const move = (i: number, d: number) => {
      const next = structuredClone(seq);
      const [x] = next.splice(i, 1);
      next.splice(clamp(i + d, 0, next.length), 0, x);
      set(next);
    };
    return html`<table class="edit">
        <thead><tr><th>#</th><th>${t(hass, "seq_color")}</th><th>${t(hass, "ls_brightness")} %</th>
          <th>${t(hass, "seq_minutes")}</th><th>${t(hass, "seq_transition")}</th><th></th></tr></thead>
        <tbody>
          ${seq.map(
            (st, i) => html`<tr>
              <td>${i + 1}</td>
              <td><input class="inp" type="color" .value=${st.color.toLowerCase()} ?disabled=${this.locked}
                @change=${(ev: Event) => edit(i, { color: (ev.target as HTMLInputElement).value.toUpperCase() })} /></td>
              <td><input class="inp" type="number" min="0" max="100" .value=${String(st.brightness)} ?disabled=${this.locked}
                @change=${(ev: Event) => edit(i, { brightness: clamp(Number((ev.target as HTMLInputElement).value), 0, 100) })} /></td>
              <td><input class="inp" type="number" min="0.5" max="240" step="0.5" .value=${String(st.minutes)} ?disabled=${this.locked}
                @change=${(ev: Event) => edit(i, { minutes: clamp(Number((ev.target as HTMLInputElement).value), 0.5, 240) })} /></td>
              <td><select class="inp" ?disabled=${this.locked}
                @change=${(ev: Event) => edit(i, { transition: (ev.target as HTMLSelectElement).value as "smooth" | "step" })}>
                <option value="smooth" ?selected=${st.transition === "smooth"}>${t(hass, "seq_smooth")}</option>
                <option value="step" ?selected=${st.transition === "step"}>${t(hass, "seq_step")}</option>
              </select></td>
              <td class="row" style="flex-wrap:nowrap;gap:2px">
                <button class="btn" style="padding:0 8px" ?disabled=${this.locked || i === 0} @click=${() => move(i, -1)} aria-label="↑">↑</button>
                <button class="btn" style="padding:0 8px" ?disabled=${this.locked || i === seq.length - 1} @click=${() => move(i, 1)} aria-label="↓">↓</button>
                <button class="btn" style="padding:0 8px" ?disabled=${this.locked || seq.length <= 2}
                  @click=${() => set(seq.filter((_, j) => j !== i))} aria-label=${t(hass, "delete")}>✕</button>
              </td>
            </tr>`,
          )}
        </tbody>
      </table>
      <div class="edit">
        <button class="btn" ?disabled=${this.locked || seq.length >= 16}
          @click=${() => set([...seq, { color: "#FFFFFF", brightness: 100, minutes: 5, transition: "smooth" }])}>
          ${t(hass, "seq_add")}
        </button>
      </div>`;
  }

  private _fine() {
    const hass = this.hass;
    const s = this.s;
    const select = <K extends keyof LightSettings>(key: K, values: string[], prefix: string) => html`<select class="inp"
      ?disabled=${this.locked} @change=${(ev: Event) => this._emit({ [key]: (ev.target as HTMLSelectElement).value } as Partial<LightSettings>)}>
      ${values.map((v) => html`<option value=${v} ?selected=${s[key] === v}>${t(hass, `${prefix}_${v}` as StringKey)}</option>`)}
    </select>`;
    const number = (key: keyof LightSettings, min: number, max: number) => html`<input class="inp" type="number" min=${min} max=${max}
      .value=${String(s[key])} ?disabled=${this.locked}
      @change=${(ev: Event) => this._emit({ [key]: clamp(Number((ev.target as HTMLInputElement).value), min, max) } as Partial<LightSettings>)} />`;
    const summary = [
      t(hass, "fine_sum_step", { s: s.step_seconds }),
      t(hass, `transition_${s.transition}` as StringKey),
      t(hass, `ringing_${s.ringing}` as StringKey),
    ].join(" · ");
    return this._section(
      "fine",
      t(hass, "fine_title"),
      summary,
      html`<div class="fine edit">
        <label>${t(hass, "fine_step")}${number("step_seconds", 2, 120)}</label>
        <label>${t(hass, "fine_min_bri")}${number("min_brightness", 0, 100)}</label>
        <label>${t(hass, "fine_transition")}${select("transition", ["auto", "always", "never"], "transition")}</label>
        <label>${t(hass, "fine_offset")}${number("start_offset", 0, 120)}</label>
        ${this.showFine
          ? html`<label>${t(hass, "fine_ringing")}${select("ringing", ["hold", "pulse", "blink"], "ringing")}</label>
              <label>${t(hass, "fine_after")}${select("after_stop", ["keep", "off", "off_later"], "after_stop")}</label>`
          : nothing}
      </div>`,
    );
  }

  render() {
    if (!this.settings) return nothing;
    return html`
      ${this._curveSection()}
      ${this._briBar()}
      ${this._colorBar()}
      ${this.mode === "expert" ? this._fine() : nothing}
    `;
  }
}

customElements.define("db-light-settings", DbLightSettings);
