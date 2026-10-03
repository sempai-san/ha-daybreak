import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { ACTIVE_STATES, alarmAction, updateAlarm, type Alarm, type AlarmAction, type HomeAssistant } from "./api";
import { t } from "./i18n";
import { countdown, fireEvent, formatClock, formatDay, formatTime, repeatSummary } from "./util";

/** One alarm: time, name, repeat, state, toggle and context actions. */
export class DaybreakAlarmRow extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) alarm?: Alarm;
  /** Show test / skip buttons. */
  @property({ type: Boolean }) controls = false;
  /** Clicking the row opens the editor (panel only). */
  @property({ type: Boolean }) editable = false;
  @property({ type: Number }) now = Date.now();

  private async _action(action: AlarmAction, ev?: Event) {
    ev?.stopPropagation();
    if (!this.hass || !this.alarm) return;
    try {
      await alarmAction(this.hass, action, this.alarm.id);
    } catch (err: any) {
      fireEvent(this, "hass-notification", { message: t(this.hass, "error", { msg: err?.message ?? err }) });
    }
  }

  private async _toggle(ev: Event) {
    ev.stopPropagation();
    if (!this.hass || !this.alarm) return;
    const enabled = (ev.target as HTMLInputElement).checked;
    await updateAlarm(this.hass, this.alarm.id, { enabled });
  }

  private _open() {
    if (this.editable) fireEvent(this, "daybreak-edit", { alarm: this.alarm });
  }

  private _status() {
    const alarm = this.alarm!;
    const rt = alarm.runtime;
    const hass = this.hass;
    if (rt.state === "snoozed" && rt.snooze_until) {
      return t(hass, "state_snoozed", { time: formatTime(hass, rt.snooze_until) });
    }
    if (ACTIVE_STATES.includes(rt.state)) return t(hass, `state_${rt.state}` as any);
    if (alarm.skip_date) return t(hass, "skipped", { date: formatDay(hass, `${alarm.skip_date}T12:00:00Z`) });
    if (rt.next_alarm) {
      return `${formatDay(hass, rt.next_alarm)} · ${t(hass, "in", { time: countdown(rt.next_alarm, this.now) })}`;
    }
    return t(hass, `state_${rt.state}` as any);
  }

  render() {
    const alarm = this.alarm;
    if (!alarm) return nothing;
    const rt = alarm.runtime;
    const active = ACTIVE_STATES.includes(rt.state);
    const hasLights = Object.values(alarm.light.target).some((v) => v?.length);
    return html`
      <div class="row ${active ? "active" : ""} ${alarm.enabled ? "" : "off"} ${this.editable ? "clickable" : ""}"
           @click=${this._open}>
        <div class="main">
          <div class="time">${formatClock(this.hass, alarm.time)}</div>
          <div class="meta">
            <div class="name">
              ${alarm.name}
              ${rt.test ? html`<span class="badge">${t(this.hass, "test_badge")}</span>` : nothing}
            </div>
            <div class="sub">
              ${repeatSummary(this.hass, alarm)}
              ${hasLights && alarm.light.duration
                ? html` · <ha-icon icon="mdi:weather-sunset-up"></ha-icon>${alarm.light.duration} min`
                : nothing}
            </div>
            <div class="status">${this._status()}</div>
          </div>
          <ha-switch .checked=${alarm.enabled} @change=${this._toggle} @click=${(e: Event) => e.stopPropagation()}></ha-switch>
        </div>
        ${active
          ? html`<div class="actions big">
              ${rt.state === "ringing"
                ? html`<button class="btn" @click=${(e: Event) => this._action("snooze", e)}>
                    <ha-icon icon="mdi:sleep"></ha-icon>${t(this.hass, "snooze")}
                  </button>`
                : nothing}
              <button class="btn primary" @click=${(e: Event) => this._action("stop", e)}>
                <ha-icon icon="mdi:alarm-off"></ha-icon>${t(this.hass, "stop")}
              </button>
            </div>`
          : this.controls && alarm.enabled
            ? html`<div class="actions">
                ${alarm.skip_date
                  ? html`<button class="btn flat" @click=${(e: Event) => this._action("cancel_skip", e)}>
                      <ha-icon icon="mdi:undo"></ha-icon>${t(this.hass, "cancel_skip")}
                    </button>`
                  : rt.next_alarm
                    ? html`<button class="btn flat" @click=${(e: Event) => this._action("skip_next", e)}>
                        <ha-icon icon="mdi:debug-step-over"></ha-icon>${t(this.hass, "skip_next")}
                      </button>`
                    : nothing}
                <button class="btn flat" title=${t(this.hass, "test_hint")} @click=${(e: Event) => this._action("test", e)}>
                  <ha-icon icon="mdi:play-circle-outline"></ha-icon>${t(this.hass, "test")}
                </button>
              </div>`
            : nothing}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    .row {
      padding: 12px 16px;
      border-radius: 12px;
      transition: background 0.2s;
    }
    .row.clickable {
      cursor: pointer;
    }
    .row.clickable:hover {
      background: var(--secondary-background-color);
    }
    .row.active {
      background: linear-gradient(90deg, rgba(255, 166, 77, 0.22), rgba(255, 214, 140, 0.08));
    }
    .row.off .time,
    .row.off .name {
      opacity: 0.5;
    }
    .main {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .time {
      font-size: 2.2em;
      font-weight: 300;
      font-variant-numeric: tabular-nums;
      line-height: 1;
      min-width: 3.1em;
    }
    .meta {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sub,
    .status {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .sub ha-icon {
      --mdc-icon-size: 16px;
      vertical-align: -3px;
      margin-right: 2px;
    }
    .badge {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-radius: 8px;
      padding: 0 6px;
      font-size: 0.75em;
      margin-left: 6px;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .actions.big .btn {
      flex: 1;
      justify-content: center;
      padding: 12px;
      font-size: 1.05em;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      border-radius: 20px;
      padding: 6px 12px;
      font: inherit;
      cursor: pointer;
    }
    .btn.primary {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .btn.flat {
      border-color: transparent;
      background: transparent;
      color: var(--primary-color);
      padding: 4px 8px;
    }
    .btn ha-icon {
      --mdc-icon-size: 18px;
    }
  `;
}

if (!customElements.get("daybreak-alarm-row")) {
  customElements.define("daybreak-alarm-row", DaybreakAlarmRow);
}
