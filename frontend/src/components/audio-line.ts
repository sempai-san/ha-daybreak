import { LitElement, css, html, nothing, svg } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../api";
import { t } from "../i18n";
import { curveValue } from "../model";
import { shared } from "../styles";
import { clamp, define, fireEvent, formatClock, toHHMM, toMin } from "../util";

const W = 600;
const H = 150;
const PAD_X = 12;
const PAD_TOP = 12;
const PAD_BOTTOM = 26;
const MAX_POINTS = 8;

/** A point of the volume curve: minutes relative to the alarm, volume in %. */
interface Pt {
  m: number;
  v: number;
}

export interface AudioChange {
  lead: number;
  ramp: number;
  volume: [number, number];
  curve: [number, number][];
}

/**
 * Volume over time on the alarm's clock. The music starts quietly, follows a
 * smooth curve through any number of points and keeps the end volume. The
 * wake time always sits in the middle. Points can be dragged in time and
 * volume; the selected point shows its time and volume as editable fields.
 * Emits "audio-change" with {lead, ramp, volume, curve}.
 */
export class DbAudioLine extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property() time = "07:00";
  @property({ type: Number }) lead = 5;
  @property({ type: Number }) ramp = 5;
  @property({ attribute: false }) volume: [number, number] = [5, 35];
  @property({ attribute: false }) curve: [number, number][] = [];
  @property({ type: Boolean }) simple = false;
  @state() private _drag?: number;
  @state() private _sel = 1;
  /** Half width (minutes) frozen while dragging; grows when a point reaches the edge. */
  private _frozen?: number;
  private _grown = 0;

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
      .tools {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 6px;
      }
      .tools .muted {
        font-size: 12px;
      }
    `,
  ];

  /** All points: start, the curve points, end. */
  private get _pts(): Pt[] {
    const m0 = -this.lead;
    return [
      { m: m0, v: this.volume[0] },
      ...this.curve.map(([x, y]) => ({ m: m0 + x * this.ramp, v: y })),
      { m: m0 + this.ramp, v: this.volume[1] },
    ];
  }

  /** Minutes from the wake line to each edge; the wake time stays centred. */
  private get _half() {
    if (this._frozen) return this._frozen;
    const reach = Math.max(this.lead, Math.abs(this.ramp - this.lead));
    return Math.max(10, Math.ceil((reach + 3) / 5) * 5);
  }

  private _x(m: number) {
    const h = this._half;
    return PAD_X + ((clamp(m, -h, h) + h) / (2 * h)) * (W - 2 * PAD_X);
  }

  private _y(v: number) {
    return PAD_TOP + (1 - clamp(v, 0, 100) / 100) * (H - PAD_TOP - PAD_BOTTOM);
  }

  /** Volume (%) at a minute, smooth through the points like the backend. */
  private _volAt(m: number, pts = this._pts): number {
    const m0 = pts[0].m;
    const span = pts[pts.length - 1].m - m0;
    if (m <= m0) return pts[0].v;
    if (span <= 0 || m >= m0 + span) return pts[pts.length - 1].v;
    return curveValue(pts.map((p) => [(p.m - m0) / span, p.v / 100]), (m - m0) / span) * 100;
  }

  private _emit(pts: Pt[]) {
    const m0 = pts[0].m;
    const end = pts[pts.length - 1];
    const ramp = Math.max(0, end.m - m0);
    const change: AudioChange = {
      lead: Math.round(-m0),
      ramp: Math.round(ramp),
      volume: [Math.round(pts[0].v), Math.round(end.v)],
      curve: pts.slice(1, -1).map((p) => [ramp ? Math.round(((p.m - m0) / ramp) * 1000) / 1000 : 0, Math.round(p.v)]),
    };
    fireEvent(this, "audio-change", change);
  }

  /** Move point i to (m, v), keeping the order of the points. */
  private _set(i: number, m: number | null, v: number | null) {
    const pts = this._pts.map((p) => ({ ...p }));
    const last = pts.length - 1;
    if (m !== null) {
      const lo = i === 0 ? -60 : pts[i - 1].m;
      const hi = i === last ? pts[0].m + 60 : pts[i + 1].m;
      pts[i].m = Math.round(clamp(m, lo, hi));
      if (i === 0) pts[i].m = Math.min(0, pts[i].m);
    }
    if (v !== null && !(this.simple && i === 0)) pts[i].v = Math.round(clamp(v, 0, 100));
    this._emit(pts);
  }

  private _fromEvent(ev: PointerEvent): Pt {
    const el = this.shadowRoot!.querySelector("svg") as SVGSVGElement;
    const rect = el.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * W;
    const y = ((ev.clientY - rect.top) / rect.height) * H;
    const h = this._half;
    return {
      m: -h + ((x - PAD_X) / (W - 2 * PAD_X)) * 2 * h,
      v: (1 - (y - PAD_TOP) / (H - PAD_TOP - PAD_BOTTOM)) * 100,
    };
  }

  private _down(i: number, ev: PointerEvent) {
    this._frozen = this._half;
    this._drag = i;
    this._sel = i;
    (ev.currentTarget as Element).setPointerCapture(ev.pointerId);
  }

  private _move(ev: PointerEvent) {
    if (this._drag === undefined) return;
    const p = this._fromEvent(ev);
    if (this._frozen && Math.abs(p.m) > this._frozen - 1 && Date.now() - this._grown > 300) {
      this._grown = Date.now();
      this._frozen += 10;
    }
    this._set(this._drag, p.m, p.v);
  }

  private _up() {
    this._drag = undefined;
    this._frozen = undefined;
  }

  private _add() {
    const pts = this._pts;
    if (pts.length - 2 >= MAX_POINTS) return;
    // Into the widest gap, on the current curve, so the sound does not change.
    let gap = 0;
    for (let i = 1; i < pts.length - 1; i++) if (pts[i + 1].m - pts[i].m > pts[gap + 1].m - pts[gap].m) gap = i;
    const m = (pts[gap].m + pts[gap + 1].m) / 2;
    const next = [...pts.slice(0, gap + 1), { m, v: this._volAt(m, pts) }, ...pts.slice(gap + 1)];
    this._sel = gap + 1;
    this._emit(next);
  }

  private _remove() {
    const pts = this._pts;
    if (this._sel <= 0 || this._sel >= pts.length - 1) return;
    const next = pts.filter((_, i) => i !== this._sel);
    this._sel = Math.min(this._sel, next.length - 2);
    this._emit(next);
  }

  render() {
    const hass = this.hass;
    const wake = toMin(this.time);
    const pts = this._pts;
    const last = pts.length - 1;
    const sel = clamp(this._sel, 0, last);
    const h = this._half;
    const base = this._y(0);
    const wx = this._x(0);
    const right = this._x(h);
    // Smooth path from the first to the last point, then flat to the edge.
    const m0 = pts[0].m;
    const m1 = pts[last].m;
    const samples: string[] = [];
    const n = Math.max(2, Math.min(80, Math.round((m1 - m0) * 4)));
    for (let k = 0; k <= n; k++) {
      const m = m0 + ((m1 - m0) * k) / n;
      samples.push(`${this._x(m).toFixed(1)},${this._y(this._volAt(m, pts)).toFixed(1)}`);
    }
    const line = `M${samples.join(" L")} L${right},${this._y(pts[last].v)}`;
    const area = `M${this._x(m0)},${base} L${samples.join(" L")} L${right},${this._y(pts[last].v)} L${right},${base} Z`;
    const every = 2 * h > 40 ? 10 : 5;
    const ticks: number[] = [];
    for (let m = Math.ceil(-h / every) * every; m <= h; m += every) ticks.push(m);
    const clock = (m: number) => formatClock(hass, toHHMM(wake + Math.round(m)));
    const sp = pts[sel];
    const sx = this._x(sp.m);
    const label = sel === 0 ? `♪ ${t(hass, "audio_start_at")}` : sel === last ? `🔊 ${t(hass, "audio_loud_at")}` : "•";
    const setTime = (value: string) => {
      if (!value) return;
      let diff = toMin(value) - wake;
      if (diff > 720) diff -= 1440;
      if (diff < -720) diff += 1440;
      this._set(sel, diff, null);
    };
    return html`<div class="wrap">
        <div class="pill" style="left:clamp(0px, calc(${(sx / W) * 100}% - 90px), calc(100% - 230px))">
          ${label}
          <input type="time" .value=${toHHMM(wake + Math.round(sp.m))} aria-label=${t(hass, "audio_start_at")}
            @change=${(e: Event) => setTime((e.target as HTMLInputElement).value)} />
          ${this.simple && sel === 0
            ? nothing
            : html`<input type="number" min="0" max="100" .value=${String(Math.round(sp.v))}
                  aria-label=${sel === 0 ? t(hass, "audio_vol_start") : t(hass, "audio_vol_end")}
                  @change=${(e: Event) => this._set(sel, null, Number((e.target as HTMLInputElement).value))} />%`}
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
              text-anchor=${m <= -h ? "start" : m >= h ? "end" : "middle"}>${clock(m)}</text>`,
          )}
          ${pts.map(
            (p, i) => svg`<g style="cursor:grab" @pointerdown=${(e: PointerEvent) => this._down(i, e)}>
              <circle cx=${this._x(p.m)} cy=${this._y(p.v)} r="20" fill="transparent"/>
              <circle cx=${this._x(p.m)} cy=${this._y(p.v)} r=${i === sel ? 9 : i === 0 || i === last ? 8 : 6}
                fill=${i === sel ? "var(--db-accent)" : "#fff"}
                stroke=${i === last ? "var(--db-accent-strong)" : "var(--db-accent)"} stroke-width="3"/>
            </g>`,
          )}
        </svg>
      </div>
      <div class="tools">
        <button class="btn" ?disabled=${last - 1 >= MAX_POINTS} @click=${this._add}>${t(hass, "audio_add_point")}</button>
        <button class="btn" ?disabled=${sel === 0 || sel === last} @click=${this._remove}>${t(hass, "audio_remove_point")}</button>
        <span class="muted">${t(hass, "audio_point_hint")}</span>
      </div>`;
  }
}

define("db-audio-line", DbAudioLine);
