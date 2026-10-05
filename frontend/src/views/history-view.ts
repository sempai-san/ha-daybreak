import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HistoryEntry, HistoryStep, HomeAssistant, Snapshot } from "../api";
import { t, type StringKey } from "../i18n";
import { shared } from "../styles";
import { define, formatDay, formatTime } from "../util";

const ICONS: Record<string, string> = {
  start: "🌅",
  climate: "🌡",
  music: "🎵",
  ring: "⏰",
  ring_again: "⏰",
  snooze: "💤",
  button: "🔘",
  last_call: "📢",
  skipped: "⏭",
  end: "■",
};

/** The last runs of all alarms as a flow of steps, problems in red. */
export class DbHistoryView extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) snapshot?: Snapshot;
  /** Opened entries; the newest one is open by default. */
  @state() private _open: Record<string, boolean> = {};

  static styles = [
    shared,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .entry {
        padding: 0;
        overflow: hidden;
      }
      .eh {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .dot {
        flex: none;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: 16px;
        background: color-mix(in srgb, var(--db-ok, #3cc864) 22%, transparent);
      }
      .dot.problem {
        background: color-mix(in srgb, var(--error-color, #e5534b) 25%, transparent);
      }
      .dot.skipped,
      .dot.running {
        background: var(--db-tile);
      }
      .badge {
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--db-tile);
        margin-left: 6px;
      }
      .flow {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        gap: 6px;
        padding: 4px 16px 16px;
      }
      .node {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 110px;
        max-width: 220px;
        padding: 8px 10px;
        border-radius: 12px;
        border: 1px solid var(--db-line);
        background: var(--db-tile);
      }
      .node.bad {
        border-color: var(--error-color, #e5534b);
        background: color-mix(in srgb, var(--error-color, #e5534b) 12%, transparent);
      }
      .node .tm {
        font-size: 12px;
        color: var(--db-muted);
        font-variant-numeric: tabular-nums;
      }
      .node .lb {
        font-weight: 600;
      }
      .node .dt {
        font-size: 12px;
        color: var(--db-muted);
        overflow-wrap: anywhere;
      }
      .node.bad .dt {
        color: var(--error-color, #e5534b);
      }
      .arrow {
        align-self: center;
        color: var(--db-muted);
      }
      .empty {
        padding: 24px;
        text-align: center;
      }
    `,
  ];

  private _time(entry: HistoryEntry, iso: string) {
    const hass = this.hass;
    if (!entry.test) return formatTime(hass, iso);
    // Test runs are short: show seconds.
    const d = new Date(iso);
    return `${formatTime(hass, iso)}:${String(d.getSeconds()).padStart(2, "0")}`;
  }

  private _label(step: HistoryStep): string {
    const hass = this.hass;
    if (step.step === "end") return t(hass, `hs_end_${step.reason ?? "stopped"}` as StringKey);
    if (step.step === "skipped") return t(hass, `hs_skipped_${step.reason ?? "away"}` as StringKey);
    return t(hass, `hs_${step.step}` as StringKey);
  }

  private _detail(entry: HistoryEntry, step: HistoryStep): string {
    const hass = this.hass;
    switch (step.step) {
      case "start":
        return [
          step.lights ? t(hass, "hs_lamps", { n: step.lights }) : "",
          step.light_start && step.lights ? t(hass, "hs_light_from", { time: this._time(entry, step.light_start) }) : "",
          step.shift ? t(hass, "hs_shift", { min: step.shift }) : "",
        ]
          .filter(Boolean)
          .join(" · ");
      case "music":
        return step.players ? t(hass, "hs_speakers", { n: step.players }) : "";
      case "snooze":
        return t(hass, "hs_snooze_d", { min: step.minutes ?? 0, n: step.count ?? 1 });
      case "last_call":
        return step.profile ?? "";
      default:
        return step.detail ?? "";
    }
  }

  private _entry(entry: HistoryEntry, index: number) {
    const hass = this.hass;
    const open = this._open[entry.id] ?? index === 0;
    const result = entry.problem ? "problem" : entry.result;
    const icon = result === "problem" ? "⚠" : result === "skipped" ? "⏭" : result === "running" ? "▶" : "✓";
    const cls = result === "problem" ? "problem" : result === "skipped" ? "skipped" : result === "running" ? "running" : "";
    const problems = entry.steps.filter((s) => !s.ok).length;
    return html`<section class="card entry">
      <button class="eh" aria-expanded=${open} @click=${() => (this._open = { ...this._open, [entry.id]: !open })}>
        <span class="dot ${cls}">${icon}</span>
        <span class="grow">
          <b>${entry.name}</b>
          ${entry.test
            ? html`<span class="badge">🧪 ${t(hass, "hs_test")}${entry.speed ? ` · ${t(hass, "tr_lapse", { s: 60 / entry.speed })}` : ""}</span>`
            : nothing}
          <div class="muted">
            ${formatDay(hass, entry.started)} · ${t(hass, "hs_alarm_at", { time: formatTime(hass, entry.alarm_time) })}
            · ${problems ? t(hass, "hs_problems", { n: problems }) : t(hass, `hs_result_${result}` as StringKey)}
          </div>
        </span>
        <span class="muted">${open ? "▴" : "▾"}</span>
      </button>
      ${open
        ? html`<div class="flow">
            ${entry.steps.map(
              (step, i) => html`${i ? html`<span class="arrow">→</span>` : nothing}
                <div class="node ${step.ok ? "" : "bad"}">
                  <span class="tm">${this._time(entry, step.t)}</span>
                  <span class="lb">${step.ok ? ICONS[step.step] ?? "•" : "⚠"} ${this._label(step)}</span>
                  ${this._detail(entry, step) ? html`<span class="dt">${this._detail(entry, step)}</span>` : nothing}
                </div>`,
            )}
          </div>`
        : nothing}
    </section>`;
  }

  render() {
    const hass = this.hass;
    const history = this.snapshot?.history ?? [];
    return html`
      <div class="muted">${t(hass, "hs_hint")}</div>
      ${history.length
        ? history.map((entry, i) => this._entry(entry, i))
        : html`<section class="card empty muted">${t(hass, "hs_empty")}</section>`}
    `;
  }
}

define("db-history-view", DbHistoryView);
