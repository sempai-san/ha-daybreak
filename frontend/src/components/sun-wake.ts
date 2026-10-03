import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { fetchSun, type AlarmConfig, type HomeAssistant, type SunEvent, type SunTimes } from "../api";
import { t, type StringKey } from "../i18n";
import { shared } from "../styles";
import { clamp, fireEvent, formatClock, formatDay, localHHMM, toHHMM, toMin } from "../util";

type Wake = AlarmConfig["wake"];

const RISE: SunEvent[] = ["astronomical_dawn", "nautical_dawn", "civil_dawn", "sunrise"];
const SET: SunEvent[] = ["sunset", "civil_dusk", "nautical_dusk", "astronomical_dusk"];
const COLOR: Record<string, string> = {
  astronomical: "var(--db-astro)",
  nautical: "var(--db-nautical)",
  civil: "var(--db-civil)",
  sun: "var(--db-sun)",
};
const colorOf = (ev: SunEvent) =>
  ev.startsWith("astronomical") ? COLOR.astronomical : ev.startsWith("nautical") ? COLOR.nautical : ev.startsWith("civil") ? COLOR.civil : COLOR.sun;

/** Local wake minute for a day's sun times, like scheduler.wake_time_on. */
export function sunWakeMinutes(hass: HomeAssistant | undefined, sun: SunTimes | undefined, wake: Wake): number | null {
  const iso = sun?.[wake.sun_event];
  if (!iso) return null;
  let m = toMin(localHHMM(hass, iso)) + wake.offset;
  if (wake.earliest) m = Math.max(m, toMin(wake.earliest));
  if (wake.latest) m = Math.min(m, toMin(wake.latest));
  return m;
}

/** Wake relative to the sun: event choice, offset and a colour-coded day graphic. */
export class DbSunWake extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) wake!: Wake;
  @property() date = "";
  @property() mode: "simple" | "normal" | "expert" = "normal";
  @state() private _sun?: SunTimes;
  private _loaded = "";

  static styles = [
    shared,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .ev {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .ev .chip {
        gap: 8px;
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        flex: none;
      }
      .sky {
        position: relative;
        height: 86px;
        border-radius: 12px;
        overflow: hidden;
        margin-top: 4px;
      }
      .mark {
        position: absolute;
        top: 0;
        bottom: 22px;
        width: 2px;
        margin-left: -1px;
        opacity: 0.85;
      }
      .mark.sel {
        width: 3px;
        opacity: 1;
      }
      .mlabel {
        position: absolute;
        bottom: 2px;
        transform: translateX(-50%);
        font-size: 11px;
        color: var(--db-muted);
        white-space: nowrap;
      }
      .wake {
        position: absolute;
        top: 8px;
        transform: translateX(-50%);
        padding: 3px 9px;
        border-radius: 10px;
        background: var(--db-accent);
        color: var(--db-on-accent);
        font-weight: 700;
        font-size: 13px;
        white-space: nowrap;
      }
      .wakeline {
        position: absolute;
        top: 30px;
        bottom: 22px;
        width: 2px;
        margin-left: -1px;
        background: var(--db-accent);
      }
      .limit {
        position: absolute;
        top: 0;
        bottom: 22px;
        background: repeating-linear-gradient(135deg, rgba(0, 0, 0, 0.35) 0 6px, transparent 6px 12px);
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 14px;
        font-size: 12px;
        color: var(--db-muted);
      }
      .legend span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
    `,
  ];

  willUpdate() {
    if (this.hass && this.date && this._loaded !== this.date) {
      this._loaded = this.date;
      fetchSun(this.hass, this.date)
        .then((res) => (this._sun = res[this.date]))
        .catch(() => undefined);
    }
  }

  private _set(change: Partial<Wake>) {
    fireEvent(this, "wake-change", { ...this.wake, ...change });
  }

  private _local(ev: SunEvent): number | null {
    const iso = this._sun?.[ev];
    return iso ? toMin(localHHMM(this.hass, iso)) : null;
  }

  wakeMinutes(): number | null {
    return sunWakeMinutes(this.hass, this._sun, this.wake);
  }

  private _graphic() {
    const hass = this.hass;
    const rising = RISE.includes(this.wake.sun_event);
    const events = rising ? RISE : SET;
    const times = events.map((e) => this._local(e));
    const known = times.filter((x): x is number => x !== null);
    const wake = this.wakeMinutes();
    if (!known.length) return html`<div class="muted">${t(hass, "sun_none")}</div>`;
    const lo = Math.min(...known, wake ?? Infinity) - 40;
    const hi = Math.max(...known, wake ?? -Infinity) + 40;
    const pct = (m: number) => ((clamp(m, lo, hi) - lo) / (hi - lo)) * 100;
    // Sky gradient: night → astro → nautical → civil → day (or reverse).
    const night = "#0b1020";
    const stops = rising
      ? [night, "#1b2550", "#3d3a78", "#b5577a", "#ffb36b", "#ffe2a8"]
      : ["#ffe2a8", "#ffb36b", "#b5577a", "#3d3a78", "#1b2550", night];
    const positions = rising
      ? [pct(times[0] ?? lo) - 4, ...times.map((x) => (x === null ? 0 : pct(x))), pct(times[3] ?? hi) + 8]
      : [pct(times[0] ?? lo) - 8, ...times.map((x) => (x === null ? 100 : pct(x))), pct(times[3] ?? hi) + 4];
    const sky = `linear-gradient(90deg, ${stops.map((c, i) => `${c} ${clamp(positions[i], 0, 100)}%`).join(", ")})`;
    const earliest = this.wake.earliest ? pct(toMin(this.wake.earliest)) : null;
    const latest = this.wake.latest ? pct(toMin(this.wake.latest)) : null;
    return html`
      <div class="sky" style="background:${sky}">
        ${earliest !== null ? html`<div class="limit" style="left:0;width:${earliest}%"></div>` : nothing}
        ${latest !== null ? html`<div class="limit" style="left:${latest}%;right:0"></div>` : nothing}
        ${events.map((e, i) =>
          times[i] === null
            ? nothing
            : html`<div
                  class="mark ${e === this.wake.sun_event ? "sel" : ""}"
                  style="left:${pct(times[i]!)}%;background:${colorOf(e)}"
                  title=${t(hass, `sun_${e}` as StringKey)}
                ></div>
                ${e === this.wake.sun_event
                  ? html`<span class="mlabel" style="left:${pct(times[i]!)}%">${formatClock(hass, toHHMM(times[i]!))}</span>`
                  : nothing}`,
        )}
        ${wake !== null
          ? html`<div class="wakeline" style="left:${pct(wake)}%"></div>
              <span class="wake" style="left:${pct(wake)}%">${formatClock(hass, toHHMM(wake))}</span>`
          : nothing}
      </div>
      <div class="legend">
        ${events.map(
          (e) => html`<span><i class="dot" style="background:${colorOf(e)}"></i>${t(hass, `sun_${e}` as StringKey)}</span>`,
        )}
        <span>${formatDay(hass, this.date)}</span>
      </div>
    `;
  }

  render() {
    const hass = this.hass;
    const w = this.wake;
    const rising = RISE.includes(w.sun_event);
    const events = rising ? RISE : SET;
    const before = w.offset < 0;
    return html`
      <div class="row">
        <div class="seg" role="group">
          <button aria-pressed=${rising} @click=${() => !rising && this._set({ sun_event: "sunrise" })}>
            ${t(hass, "sun_rise")}
          </button>
          <button aria-pressed=${!rising} @click=${() => rising && this._set({ sun_event: "sunset" })}>
            ${t(hass, "sun_set")}
          </button>
        </div>
      </div>
      <div class="ev">
        ${events.map(
          (e) => html`<button class="chip" aria-pressed=${w.sun_event === e} @click=${() => this._set({ sun_event: e })}>
            <i class="dot" style="background:${colorOf(e)}"></i>${t(hass, `sun_${e}` as StringKey)}
            ${this._local(e) !== null
              ? html`<span class="muted tabular">${formatClock(hass, toHHMM(this._local(e)!))}</span>`
              : nothing}
          </button>`,
        )}
      </div>
      <div class="row">
        <input
          class="inp num"
          type="number"
          min="0"
          max="240"
          .value=${String(Math.abs(w.offset))}
          aria-label=${t(hass, "sun_offset")}
          @change=${(ev: Event) => {
            const v = clamp(Number((ev.target as HTMLInputElement).value) || 0, 0, 240);
            this._set({ offset: before ? -v : v });
          }}
        />
        <span>min</span>
        <div class="seg" role="group">
          <button aria-pressed=${before} @click=${() => !before && this._set({ offset: -Math.abs(w.offset) || -15 })}>
            ${t(hass, "sun_before")}
          </button>
          <button aria-pressed=${!before} @click=${() => before && this._set({ offset: Math.abs(w.offset) })}>
            ${t(hass, "sun_after")}
          </button>
        </div>
        ${this.mode !== "simple"
          ? html`<span class="grow"></span>
              ${this.mode === "expert"
                ? html`<label class="row">
                    <span class="muted">${t(hass, "sun_earliest")}</span>
                    <input class="inp time" type="time" .value=${w.earliest ?? ""}
                      @change=${(ev: Event) => this._set({ earliest: (ev.target as HTMLInputElement).value || null })} />
                  </label>`
                : nothing}
              <label class="row">
                <span class="muted">${t(hass, "sun_latest")}</span>
                <input class="inp time" type="time" .value=${w.latest ?? ""}
                  @change=${(ev: Event) => this._set({ latest: (ev.target as HTMLInputElement).value || null })} />
              </label>`
          : nothing}
      </div>
      ${this._graphic()}
    `;
  }
}

customElements.define("db-sun-wake", DbSunWake);
