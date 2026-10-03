import { LitElement, css, html, svg } from "lit";
import { property } from "lit/decorators.js";
import type { HomeAssistant, LightConfig } from "./api";
import { t } from "./i18n";
import { kelvinToRgb, levelAt } from "./util";

const W = 300;
const H = 90;
const SAMPLES = 60;

/** Read-only graph of brightness (line) and colour (gradient) over the sunrise. */
export class DaybreakCurvePreview extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) light?: LightConfig;

  render() {
    if (!this.light) return html``;
    const light = this.light;
    const samples = [...Array(SAMPLES + 1).keys()].map((i) => {
      const x = i / SAMPLES;
      return { x, ...levelAt(light, x) };
    });
    const id = `g${Math.random().toString(36).slice(2, 8)}`;
    const stops = samples
      .filter((_, i) => i % 6 === 0 || i === SAMPLES)
      .map((s) => {
        const [r, g, b] = s.kelvin ? kelvinToRgb(s.kelvin) : [255, 214, 170];
        const alpha = 0.15 + 0.85 * (s.brightness / 100);
        return svg`<stop offset=${s.x} stop-color=${`rgb(${r},${g},${b})`} stop-opacity=${alpha}></stop>`;
      });
    const pts = samples.map((s) => `${(s.x * W).toFixed(1)},${(H - (s.brightness / 100) * H).toFixed(1)}`);
    const area = `M0,${H} L${pts.join(" L")} L${W},${H} Z`;
    const line = `M${pts.join(" L")}`;
    const points =
      light.curve === "custom"
        ? light.points.map(
            (p) => svg`<circle cx=${p.t * W} cy=${H - (p.brightness / 100) * H} r="3.5" class="pt"></circle>`,
          )
        : [];

    return html`
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label=${t(this.hass, "preview")}>
        <defs>
          <linearGradient id=${id} x1="0" x2="1" y1="0" y2="0">${stops}</linearGradient>
        </defs>
        <path d=${area} fill=${`url(#${id})`}></path>
        <path d=${line} class="line"></path>
        ${points}
      </svg>
      <div class="axis">
        <span>−${light.duration} min</span>
        <span>${t(this.hass, "alarm")}</span>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    svg {
      width: 100%;
      height: 96px;
      display: block;
      border-radius: 8px;
      background: var(--secondary-background-color, #222);
    }
    .line {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
      opacity: 0.8;
    }
    .pt {
      fill: var(--primary-color);
      stroke: var(--card-background-color, #fff);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .axis {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
  `;
}

if (!customElements.get("daybreak-curve-preview")) {
  customElements.define("daybreak-curve-preview", DaybreakCurvePreview);
}
