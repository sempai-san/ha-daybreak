import { LitElement, css, html, nothing, svg } from "lit";
import { property, state } from "lit/decorators.js";
import type { ClimateMode, ClimateSettings, HomeAssistant } from "../api";
import { t, type StringKey } from "../i18n";
import { shared } from "../styles";
import { clamp, define, fireEvent } from "../util";

const MODES: { mode: ClimateMode; icon: string }[] = [
  { mode: "heat", icon: "🔥" },
  { mode: "cool", icon: "❄️" },
  { mode: "heat_cool", icon: "🌗" },
  { mode: "auto", icon: "♻️" },
  { mode: "dry", icon: "💧" },
  { mode: "fan_only", icon: "🌀" },
];
const MIN_T = 10;
const MAX_T = 30;
// Dial: 240° arc, open at the bottom.
const START_DEG = 150;
const SWEEP = 240;
const R = 80;
const C = 100;

/**
 * Climate settings: what the devices should do (mode, temperature dial,
 * humidity, fan, water), when they start (fixed or learned) and what happens
 * after waking up. Emits "climate-change" with the complete settings.
 */
export class DbClimateSettings extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) settings!: ClimateSettings;
  /** Domains of the chosen devices; empty = show every option (profiles). */
  @property({ attribute: false }) domains: string[] = [];
  @property({ type: Boolean }) locked = false;
  @property({ type: Boolean }) expert = false;
  /** Learned runs so far (shown with the learned start). */
  @property({ type: Number }) samples = -1;
  @state() private _drag = false;

  static styles = [
    shared,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .top {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
        align-items: center;
        justify-items: center;
      }
      .side {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
      }
      .dial {
        position: relative;
        width: 220px;
        touch-action: none;
        user-select: none;
      }
      .dial svg {
        width: 100%;
        height: auto;
        display: block;
      }
      .value {
        position: absolute;
        left: 0;
        right: 0;
        top: 70px;
        text-align: center;
        pointer-events: none;
      }
      .value b {
        font-size: 38px;
        font-weight: 600;
      }
      .steps {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 6px;
        display: flex;
        justify-content: center;
        gap: 40px;
      }
      .steps button {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        border: 1px solid var(--db-line);
        background: var(--db-tile);
        color: var(--db-text);
        font-size: 20px;
        cursor: pointer;
      }
      .modes {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 8px;
      }
      .modes button {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 10px 6px;
        border-radius: 12px;
        border: 1px solid var(--db-line);
        background: var(--db-tile);
        color: var(--db-text);
        cursor: pointer;
        font: inherit;
        font-size: 13px;
      }
      .modes button span {
        font-size: 22px;
      }
      .modes button[aria-pressed="true"] {
        border-color: var(--db-accent);
        background: color-mix(in srgb, var(--db-accent) 18%, transparent);
      }
      .slider {
        display: grid;
        grid-template-columns: 96px minmax(80px, 1fr) 56px;
        gap: 10px;
        align-items: center;
        font-size: 14px;
      }
      .slider input[type="range"] {
        width: 100%;
        accent-color: var(--db-accent);
      }
      .slider b {
        text-align: right;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: var(--db-muted);
      }
      fieldset {
        border: none;
        margin: 0;
        padding: 0;
        display: contents;
      }
    `,
  ];

  private _set(change: Partial<ClimateSettings>) {
    if (this.locked) return;
    fireEvent(this, "climate-change", { ...this.settings, ...change });
  }

  private _shows(domain: string) {
    return !this.domains.length || this.domains.includes(domain);
  }

  private get _usesTemperature() {
    return ["heat", "cool", "heat_cool", "auto"].includes(this.settings.mode) && this._shows("climate");
  }

  // ------------------------------------------------------------------ dial

  private _point(value: number, radius = R) {
    const deg = START_DEG + ((clamp(value, MIN_T, MAX_T) - MIN_T) / (MAX_T - MIN_T)) * SWEEP;
    const rad = (deg * Math.PI) / 180;
    return [C + radius * Math.cos(rad), C + radius * Math.sin(rad)];
  }

  private _arc(from: number, to: number) {
    const [x1, y1] = this._point(from);
    const [x2, y2] = this._point(to);
    const large = ((to - from) / (MAX_T - MIN_T)) * SWEEP > 180 ? 1 : 0;
    return `M${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2}`;
  }

  private _fromPointer(ev: PointerEvent) {
    const el = this.shadowRoot!.querySelector(".dial svg") as SVGSVGElement;
    const rect = el.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * 200 - C;
    const y = ((ev.clientY - rect.top) / rect.height) * 200 - C;
    let deg = (Math.atan2(y, x) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    let rel = deg - START_DEG;
    if (rel < 0) rel += 360;
    // In the gap at the bottom: snap to the nearer end.
    if (rel > SWEEP) rel = rel - SWEEP < (360 - SWEEP) / 2 ? SWEEP : 0;
    const value = MIN_T + (rel / SWEEP) * (MAX_T - MIN_T);
    this._set({ temperature: Math.round(value * 2) / 2 });
  }

  private _dial() {
    const hass = this.hass;
    const s = this.settings;
    const color = s.mode === "cool" ? "#4aa3ff" : s.mode === "heat" ? "#ff8a4c" : "var(--db-accent)";
    const [kx, ky] = this._point(s.temperature);
    const step = (d: number) => this._set({ temperature: clamp(s.temperature + d, MIN_T, MAX_T) });
    return html`<div class="dial"
        @pointermove=${(e: PointerEvent) => this._drag && this._fromPointer(e)}
        @pointerup=${() => (this._drag = false)} @pointercancel=${() => (this._drag = false)}>
        <svg viewBox="0 0 200 200" role="slider" tabindex="0" aria-label=${t(hass, "cl_temperature")}
          aria-valuemin=${MIN_T} aria-valuemax=${MAX_T} aria-valuenow=${s.temperature}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "ArrowUp" || e.key === "ArrowRight") step(0.5);
            else if (e.key === "ArrowDown" || e.key === "ArrowLeft") step(-0.5);
            else return;
            e.preventDefault();
          }}
          @pointerdown=${(e: PointerEvent) => {
            if (this.locked) return;
            this._drag = true;
            (e.currentTarget as Element).setPointerCapture(e.pointerId);
            this._fromPointer(e);
          }}>
          <path d=${this._arc(MIN_T, MAX_T)} fill="none" stroke="var(--db-tile)" stroke-width="16" stroke-linecap="round"/>
          <path d=${this._arc(MIN_T, s.temperature)} fill="none" stroke=${color} stroke-width="16" stroke-linecap="round"/>
          ${[MIN_T, 15, 20, 25, MAX_T].map((v) => {
            const [x, y] = this._point(v, R - 24);
            return svg`<text x=${x} y=${y + 4} text-anchor="middle" font-size="10" fill="var(--db-muted)">${v}°</text>`;
          })}
          <circle cx=${kx} cy=${ky} r="13" fill="#fff" stroke=${color} stroke-width="4" style="cursor:grab"/>
        </svg>
        <div class="value"><b>${s.temperature.toLocaleString(undefined, { minimumFractionDigits: 1 })}</b> °C
          <div class="muted">${t(hass, `clm_${s.mode}` as StringKey)}</div></div>
        ${this.locked
          ? nothing
          : html`<div class="steps">
              <button aria-label="−0.5" @click=${() => step(-0.5)}>−</button>
              <button aria-label="+0.5" @click=${() => step(0.5)}>+</button>
            </div>`}
      </div>`;
  }

  // ---------------------------------------------------------------- render

  private _slider(label: string, value: number, min: number, max: number, unit: string, change: (v: number) => void) {
    return html`<label class="slider">
      <span>${label}</span>
      <input type="range" min=${min} max=${max} .value=${String(value)} ?disabled=${this.locked}
        @input=${(e: Event) => change(Number((e.target as HTMLInputElement).value))} />
      <b>${Math.round(value)} ${unit}</b>
    </label>`;
  }

  private _num(label: string, value: number | null, change: (v: number | null) => void, opts: { min?: number; max?: number; step?: number; ph?: string } = {}) {
    return html`<label class="field">${label}
      <input class="inp" type="number" min=${opts.min ?? 0} max=${opts.max ?? 240} step=${opts.step ?? 1}
        placeholder=${opts.ph ?? ""} ?disabled=${this.locked} .value=${value === null ? "" : String(value)}
        @change=${(e: Event) => {
          const raw = (e.target as HTMLInputElement).value;
          change(raw === "" ? null : clamp(Number(raw), opts.min ?? 0, opts.max ?? 240));
        }} /></label>`;
  }

  render() {
    const hass = this.hass;
    const s = this.settings;
    if (!s) return nothing;
    const modes = this._shows("climate") ? MODES : [];
    return html`
      ${modes.length
        ? html`<div class="modes" role="group" aria-label=${t(hass, "cl_mode")}>
            ${modes.map(
              (m) => html`<button aria-pressed=${s.mode === m.mode} ?disabled=${this.locked} @click=${() => this._set({ mode: m.mode })}>
                <span aria-hidden="true">${m.icon}</span>${t(hass, `clm_${m.mode}` as StringKey)}</button>`,
            )}
          </div>`
        : nothing}
      <div class="top">
        ${this._usesTemperature ? this._dial() : nothing}
        <div class="side">
          ${this._shows("fan") ? this._slider(t(hass, "cl_fan"), s.fan, 0, 100, "%", (v) => this._set({ fan: v })) : nothing}
          ${this._shows("humidifier") ? this._slider(t(hass, "cl_humidity"), s.humidity, 0, 100, "%", (v) => this._set({ humidity: v })) : nothing}
          ${this._shows("water_heater")
            ? this._slider(t(hass, "cl_water"), s.water_temperature, 20, 80, "°C", (v) => this._set({ water_temperature: v }))
            : nothing}
          ${this._usesTemperature
            ? html`<label class="row"><input type="checkbox" .checked=${s.only_if_needed} ?disabled=${this.locked}
                @change=${(e: Event) => this._set({ only_if_needed: (e.target as HTMLInputElement).checked })} />${t(hass, "cl_only_needed")}</label>`
            : nothing}
        </div>
      </div>

      <div class="lbl">${t(hass, "cl_start")}</div>
      <div class="seg" role="group">
        <button aria-pressed=${s.start === "fixed"} ?disabled=${this.locked} @click=${() => this._set({ start: "fixed" })}>${t(hass, "cl_start_fixed")}</button>
        <button aria-pressed=${s.start === "learned"} ?disabled=${this.locked} @click=${() => this._set({ start: "learned" })}>${t(hass, "cl_start_learned")}</button>
      </div>
      <div class="grid">
        ${s.start === "fixed"
          ? this._num(t(hass, "cl_lead"), s.lead, (v) => this._set({ lead: v ?? 0 }))
          : this._num(t(hass, "cl_max_lead"), s.max_lead, (v) => this._set({ max_lead: v ?? 0 }))}
      </div>
      <div class="muted">${s.start === "fixed"
        ? t(hass, "cl_start_fixed_d")
        : t(hass, "cl_start_learned_d") + (this.samples >= 0 ? ` ${t(hass, "cl_samples", { n: this.samples })}` : "")}</div>

      <div class="lbl">${t(hass, "cl_after")}</div>
      <div class="seg" role="group">
        ${(["restore", "off", "presence"] as const).map(
          (a) => html`<button aria-pressed=${s.after === a} ?disabled=${this.locked} @click=${() => this._set({ after: a })}>${t(hass, `cl_after_${a}` as StringKey)}</button>`,
        )}
      </div>
      <div class="grid">
        ${this._num(s.after === "presence" ? t(hass, "cl_minutes_max") : t(hass, "cl_minutes_after"), s.minutes, (v) => this._set({ minutes: v ?? 0 }))}
      </div>
      <div class="muted">${t(hass, `cl_after_${s.after}_d` as StringKey)}</div>

      <div class="lbl">${t(hass, "cl_outdoor")}</div>
      <div class="grid">
        ${this._num(t(hass, "cl_outdoor_below"), s.outdoor_below, (v) => this._set({ outdoor_below: v }), { min: -30, max: 40, step: 0.5, ph: "–" })}
        ${this._num(t(hass, "cl_outdoor_above"), s.outdoor_above, (v) => this._set({ outdoor_above: v }), { min: -30, max: 40, step: 0.5, ph: "–" })}
      </div>
      <div class="muted">${t(hass, "cl_outdoor_d")}</div>
    `;
  }
}

define("db-climate-settings", DbClimateSettings);
