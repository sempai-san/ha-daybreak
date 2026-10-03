import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import type { Alarm } from "../api";
import { t } from "../i18n";
import { formatDay, formatTime } from "../util";
import { SnapshotCard, cardLabel, cardStyles, styleSchema, type BaseCardConfig } from "./base";

export interface NextCardConfig extends BaseCardConfig {
  alarm?: string;
  size?: "tile" | "large";
  show_buttons?: boolean;
  show_progress?: boolean;
}

const hassOf = () => (document.querySelector("home-assistant") as any)?.hass;

/** Next alarm as an HA-style tile or a big bedside/tablet card. */
export class DaybreakNextCard extends SnapshotCard {
  @state() private _config?: NextCardConfig;

  static getConfigForm() {
    const hass = hassOf();
    return {
      schema: [
        {
          name: "size",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "tile", label: t(hass, "size_tile") },
                { value: "large", label: t(hass, "size_large") },
              ],
            },
          },
        },
        { name: "alarm", selector: { text: {} } },
        { name: "show_buttons", selector: { boolean: {} } },
        { name: "show_progress", selector: { boolean: {} } },
        ...styleSchema(hass),
      ],
      computeLabel: cardLabel(hass),
    };
  }

  static getStubConfig() {
    return { size: "tile", show_buttons: true, show_progress: true };
  }

  setConfig(config: NextCardConfig) {
    this._config = { size: "tile", show_buttons: true, show_progress: true, ...config };
    this.cardStyle = this._config.style ?? "ha";
    this.accent = !!this._config.accent;
  }

  getCardSize() {
    return this._config?.size === "large" ? 5 : 2;
  }

  getGridOptions() {
    return this._config?.size === "large"
      ? { columns: 12, rows: 4, min_columns: 6, min_rows: 3 }
      : { columns: 6, rows: "auto", min_columns: 3 };
  }

  static styles = [
    ...cardStyles,
    css`
      .tile {
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }
      .info {
        min-width: 0;
        flex: 1;
      }
      .features {
        display: flex;
        gap: 8px;
      }
      .large {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: 100%;
        justify-content: center;
      }
      .large .top {
        display: flex;
        justify-content: space-between;
        color: var(--db-muted);
        font-size: 14px;
      }
      .large .big {
        font-size: clamp(48px, 12vw, 96px);
        font-weight: 300;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .large .sub {
        color: var(--db-muted);
      }
      .large .feature {
        min-height: 56px;
        font-size: 16px;
      }
    `,
  ];

  private _pick(): Alarm | undefined {
    const alarms = this.snapshot?.alarms ?? [];
    const pool = this._config?.alarm ? alarms.filter((a) => a.id === this._config!.alarm || a.name === this._config!.alarm) : alarms;
    const active = pool.find((a) => this.isActive(a));
    if (active) return active;
    return pool
      .filter((a) => a.runtime.next_alarm && a.kind === "wake")
      .sort((a, b) => a.runtime.next_alarm!.localeCompare(b.runtime.next_alarm!))[0];
  }

  private _buttons(alarm: Alarm) {
    const hass = this.hass;
    if (!this._config?.show_buttons || !this.isActive(alarm)) return nothing;
    const canSnooze = alarm.kind === "wake" && (alarm.runtime.state === "ringing" || alarm.runtime.state === "snoozed");
    return html`<div class="features">
      ${canSnooze
        ? html`<button class="feature" @click=${() => this.act("snooze", alarm)}><ha-icon icon="mdi:sleep"></ha-icon>${t(hass, "snooze")}</button>`
        : nothing}
      <button class="feature primary" @click=${() => this.act("stop", alarm)}><ha-icon icon="mdi:alarm-off"></ha-icon>${t(hass, "stop")}</button>
    </div>`;
  }

  private _progress(alarm: Alarm) {
    const p = this.progressOf(alarm);
    if (!this._config?.show_progress || p === null) return nothing;
    return html`<div class="progress"><div style="width:${p * 100}%;background:${this.rampOf(alarm)}"></div></div>`;
  }

  render() {
    const config = this._config;
    if (!config) return nothing;
    const hass = this.hass;
    const alarm = this._pick();
    const time = alarm?.runtime.next_alarm ?? alarm?.runtime.alarm_time;
    if (config.size === "large") {
      return html`<ha-card><div class="large">
        <div class="top"><span>${t(hass, "next_alarm")}</span><span>${alarm && time ? formatDay(hass, time) : ""}</span></div>
        <div class="big">${alarm && time ? formatTime(hass, time) : "–"}</div>
        <div class="sub">${alarm ? `${alarm.name} · ${this.stateText(alarm)}` : t(hass, "no_next")}</div>
        ${alarm ? this._progress(alarm) : nothing}
        ${alarm ? this._buttons(alarm) : nothing}
      </div></ha-card>`;
    }
    return html`<ha-card><div class="tile">
      <div class="head">
        <span class="icon ${alarm && this.isActive(alarm) ? "on" : ""}"><ha-icon icon="mdi:weather-sunset-up"></ha-icon></span>
        <div class="info">
          <div class="name">${alarm ? `${time ? formatTime(hass, time) : ""} · ${alarm.name}` : t(hass, "title")}</div>
          <div class="state">${alarm ? this.stateText(alarm) : t(hass, "no_next")}</div>
        </div>
      </div>
      ${alarm ? this._progress(alarm) : nothing}
      ${alarm ? this._buttons(alarm) : nothing}
    </div></ha-card>`;
  }
}

if (!customElements.get("daybreak-next-card")) customElements.define("daybreak-next-card", DaybreakNextCard);
