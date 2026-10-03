import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { ACTIVE_STATES, alarmAction, type Alarm } from "../api";
import { t } from "../i18n";
import { countdown, fireEvent, formatClock, formatDay, formatTime, loadHaComponents } from "../util";
import { SnapshotElement } from "./alarms-card";

export interface NextCardConfig {
  type: string;
  alarm?: string;
}

/** Compact tile: next alarm + countdown; turns into snooze/stop while active. */
export class DaybreakNextCard extends SnapshotElement {
  @state() private _config?: NextCardConfig;

  static getConfigElement() {
    return document.createElement("daybreak-next-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  setConfig(config: NextCardConfig) {
    this._config = config;
  }

  getCardSize() {
    return 2;
  }

  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 4, min_rows: 2 };
  }

  private _pick(): { alarm?: Alarm; active?: Alarm } {
    const alarms = this.snapshot?.alarms ?? [];
    const pool = this._config?.alarm ? alarms.filter((a) => a.id === this._config!.alarm) : alarms;
    const active = pool.find((a) => ACTIVE_STATES.includes(a.runtime.state));
    const upcoming = pool
      .filter((a) => a.runtime.next_alarm)
      .sort((a, b) => a.runtime.next_alarm!.localeCompare(b.runtime.next_alarm!));
    return { active, alarm: upcoming[0] };
  }

  private async _act(action: "snooze" | "stop", alarm: Alarm) {
    try {
      await alarmAction(this.hass!, action, alarm.id);
    } catch (err: any) {
      fireEvent(this, "hass-notification", { message: t(this.hass, "error", { msg: err?.message ?? err }) });
    }
  }

  render() {
    if (!this._config) return nothing;
    const hass = this.hass;
    const { alarm, active } = this._pick();

    if (active) {
      const rt = active.runtime;
      const label =
        rt.state === "snoozed" && rt.snooze_until
          ? t(hass, "state_snoozed", { time: formatTime(hass, rt.snooze_until) })
          : t(hass, `state_${rt.state}` as any);
      return html`<ha-card class="active">
        <div class="top">
          <ha-icon icon="mdi:weather-sunset-up"></ha-icon>
          <div>
            <div class="time">${formatClock(hass, active.time)}</div>
            <div class="sub">${active.name} · ${label}</div>
          </div>
        </div>
        <div class="buttons">
          ${rt.state === "ringing"
            ? html`<button @click=${() => this._act("snooze", active)}>
                <ha-icon icon="mdi:sleep"></ha-icon>${t(hass, "snooze")}
              </button>`
            : nothing}
          <button class="primary" @click=${() => this._act("stop", active)}>
            <ha-icon icon="mdi:alarm-off"></ha-icon>${t(hass, "stop")}
          </button>
        </div>
      </ha-card>`;
    }

    return html`<ha-card>
      <div class="top">
        <ha-icon icon=${alarm ? "mdi:alarm" : "mdi:alarm-off"}></ha-icon>
        <div>
          ${alarm?.runtime.next_alarm
            ? html`<div class="time">${formatTime(hass, alarm.runtime.next_alarm)}</div>
                <div class="sub">
                  ${formatDay(hass, alarm.runtime.next_alarm)} ·
                  ${t(hass, "in", { time: countdown(alarm.runtime.next_alarm, this.now) })}
                </div>
                <div class="sub">${alarm.name}</div>`
            : html`<div class="sub">${this.snapshot ? t(hass, "no_next") : "…"}</div>`}
        </div>
      </div>
    </ha-card>`;
  }

  static styles = css`
    ha-card {
      height: 100%;
      box-sizing: border-box;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12px;
    }
    ha-card.active {
      background: linear-gradient(135deg, #ff9a5a 0%, #ffcf7a 70%, #ffe8b0 100%);
      color: #3a2410;
    }
    .top {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .top > ha-icon {
      --mdc-icon-size: 36px;
      color: var(--state-icon-color, var(--primary-color));
    }
    .active .top > ha-icon {
      color: inherit;
    }
    .time {
      font-size: 2em;
      font-weight: 300;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
    }
    .sub {
      font-size: 0.9em;
      opacity: 0.8;
    }
    .buttons {
      display: flex;
      gap: 8px;
    }
    button {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px;
      border-radius: 12px;
      border: 1px solid rgba(58, 36, 16, 0.3);
      background: rgba(255, 255, 255, 0.5);
      color: inherit;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
    }
    button.primary {
      background: #3a2410;
      color: #ffe8b0;
      border-color: #3a2410;
    }
  `;
}

export class DaybreakNextCardEditor extends SnapshotElement {
  @state() private _config?: NextCardConfig;

  setConfig(config: NextCardConfig) {
    this._config = config;
  }

  connectedCallback() {
    super.connectedCallback();
    loadHaComponents().then(() => this.requestUpdate());
  }

  render() {
    if (!this._config) return nothing;
    const options = (this.snapshot?.alarms ?? []).map((a) => ({ value: a.id, label: `${a.time} ${a.name}` }));
    const schema = [{ name: "alarm", selector: { select: { mode: "dropdown", options } } }];
    return html`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${schema}
      .computeLabel=${() => t(this.hass, "c_alarms")}
      @value-changed=${(ev: CustomEvent) => fireEvent(this, "config-changed", { config: ev.detail.value })}
    ></ha-form>`;
  }
}

if (!customElements.get("daybreak-next-card")) {
  customElements.define("daybreak-next-card", DaybreakNextCard);
  customElements.define("daybreak-next-card-editor", DaybreakNextCardEditor);
}
