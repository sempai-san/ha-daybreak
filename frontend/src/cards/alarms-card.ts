import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import type { Alarm } from "../api";
import { t } from "../i18n";
import { formatClock, formatTime } from "../util";
import { SnapshotCard, cardLabel, cardStyles, styleSchema, type BaseCardConfig } from "./base";

export interface AlarmsCardConfig extends BaseCardConfig {
  title?: string;
  alarms?: string[];
  show_disabled?: boolean;
  show_controls?: boolean;
}

const hassOf = () => (document.querySelector("home-assistant") as any)?.hass;

/** List of alarms with switches; snooze/stop while one is active. */
export class DaybreakAlarmsCard extends SnapshotCard {
  @state() private _config?: AlarmsCardConfig;

  static getConfigForm() {
    const hass = hassOf();
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "show_disabled", selector: { boolean: {} } },
        { name: "show_controls", selector: { boolean: {} } },
        ...styleSchema(hass),
      ],
      computeLabel: cardLabel(hass),
    };
  }

  static getStubConfig(): Partial<AlarmsCardConfig> {
    return { show_controls: true, show_disabled: true };
  }

  setConfig(config: AlarmsCardConfig) {
    this._config = { show_disabled: true, show_controls: true, style: "ha", ...config };
    this.cardStyle = this._config.style ?? "ha";
    this.accent = !!this._config.accent;
  }

  getCardSize() {
    return 1 + (this.snapshot?.alarms.length ?? 2);
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  static styles = [
    ...cardStyles,
    css`
      .title {
        padding: 16px 16px 4px;
        font-size: 16px;
        font-weight: 500;
      }
      .rows {
        padding: 8px 12px 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .r {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 4px;
        border-radius: 12px;
      }
      .r.off .name {
        color: var(--db-muted);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .features {
        display: flex;
        gap: 8px;
        padding: 4px 4px 6px 56px;
      }
      .empty {
        padding: 20px 16px;
        color: var(--db-muted);
        text-align: center;
      }
    `,
  ];

  private _row(alarm: Alarm) {
    const hass = this.hass;
    const active = this.isActive(alarm);
    const time = alarm.runtime.next_alarm ? formatTime(hass, alarm.runtime.next_alarm) : formatClock(hass, alarm.wake.time);
    const icon = alarm.kind === "sleep" ? "mdi:weather-night" : alarm.kind === "kids" ? "mdi:traffic-light" : "mdi:weather-sunset-up";
    const progress = this.progressOf(alarm);
    return html`<div class="r ${alarm.enabled ? "" : "off"}">
        <span class="icon ${active ? "on" : ""}"><ha-icon .icon=${icon}></ha-icon></span>
        <div class="grow">
          <div class="name">${time} · ${alarm.name}</div>
          <div class="state">${this.repeatText(alarm)} · ${this.stateText(alarm)}</div>
        </div>
        <button class="switch" role="switch" aria-checked=${alarm.enabled} aria-label=${alarm.name}
          @click=${(e: Event) => this.act(alarm.enabled ? "disable" : "enable", alarm, e)}></button>
      </div>
      ${progress !== null
        ? html`<div class="progress" style="margin:0 4px 4px 56px"><div style="width:${progress * 100}%;background:${this.rampOf(alarm)}"></div></div>`
        : nothing}
      ${active && this._config?.show_controls
        ? html`<div class="features">
            ${alarm.kind === "wake" && (alarm.runtime.state === "ringing" || alarm.runtime.state === "snoozed")
              ? html`<button class="feature" @click=${() => this.act("snooze", alarm)}><ha-icon icon="mdi:sleep"></ha-icon>${t(hass, "snooze")}</button>`
              : nothing}
            <button class="feature primary" @click=${() => this.act("stop", alarm)}><ha-icon icon="mdi:alarm-off"></ha-icon>${t(hass, "stop")}</button>
          </div>`
        : nothing}`;
  }

  render() {
    const config = this._config;
    if (!config) return nothing;
    let alarms = [...(this.snapshot?.alarms ?? [])].sort((a, b) =>
      (a.runtime.next_alarm ?? "9").localeCompare(b.runtime.next_alarm ?? "9"),
    );
    if (config.alarms?.length) alarms = alarms.filter((a) => config.alarms!.includes(a.id));
    if (!config.show_disabled) alarms = alarms.filter((a) => a.enabled);
    return html`<ha-card>
      ${config.title ? html`<div class="title">${config.title}</div>` : nothing}
      <div class="rows">
        ${!this.snapshot
          ? html`<div class="empty">…</div>`
          : alarms.length
            ? alarms.map((a) => this._row(a))
            : html`<div class="empty">${t(this.hass, "no_alarms")}</div>`}
      </div>
    </ha-card>`;
  }
}

if (!customElements.get("daybreak-alarms-card")) customElements.define("daybreak-alarms-card", DaybreakAlarmsCard);
