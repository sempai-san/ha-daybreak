import { LitElement, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ACTIVE_STATES, alarmAction, subscribeAlarms, type Alarm, type HomeAssistant, type Snapshot } from "../api";
import { errorText, t, type StringKey } from "../i18n";
import { rampGradient } from "../model";
import { shared } from "../styles";
import { countdown, fireEvent, formatDay, formatTime, repeatSummary } from "../util";

export type CardStyle = "ha" | "mushroom" | "bubble";

export interface BaseCardConfig {
  type: string;
  style?: CardStyle;
  accent?: boolean;
}

/** Base for cards that need the live alarm snapshot. */
export class SnapshotCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ reflect: true, attribute: "card-style" }) cardStyle: CardStyle = "ha";
  @property({ type: Boolean, reflect: true }) accent = false;
  @state() protected snapshot?: Snapshot;
  @state() protected now = Date.now();
  private _unsub?: () => void;
  private _timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this._timer = window.setInterval(() => (this.now = Date.now()), 30000);
    this._subscribe();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this._timer);
    this._unsub?.();
    this._unsub = undefined;
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("hass")) this._subscribe();
  }

  private _subscribe() {
    if (this._unsub || !this.hass || !this.isConnected) return;
    this._unsub = subscribeAlarms(this.hass, (snapshot) => (this.snapshot = snapshot));
  }

  protected async act(action: "snooze" | "stop" | "enable" | "disable", alarm: Alarm, ev?: Event) {
    ev?.stopPropagation();
    try {
      await alarmAction(this.hass!, action, alarm.id);
    } catch (err) {
      fireEvent(this, "hass-notification", { message: errorText(this.hass, err) });
    }
  }

  protected isActive(alarm: Alarm) {
    return ACTIVE_STATES.includes(alarm.runtime.state);
  }

  protected stateText(alarm: Alarm): string {
    const hass = this.hass;
    const rt = alarm.runtime;
    if (rt.state === "snoozed" && rt.snooze_until) return t(hass, "state_snoozed", { time: formatTime(hass, rt.snooze_until) });
    if (this.isActive(alarm)) return t(hass, `state_${rt.state}` as StringKey);
    if (alarm.skip_date) return t(hass, "skipped", { date: formatDay(hass, alarm.skip_date) });
    if (rt.next_alarm) return `${formatDay(hass, rt.next_alarm)} · ${countdown(hass, rt.next_alarm, this.now)}`;
    return t(hass, `state_${rt.state}` as StringKey);
  }

  protected repeatText(alarm: Alarm) {
    return repeatSummary(this.hass, alarm);
  }

  protected rampOf(alarm: Alarm) {
    const profile = this.snapshot?.light_profiles.find((p) => p.id === alarm.light.profile);
    return rampGradient(profile?.settings ?? alarm.light.settings);
  }

  /** Progress 0..1 of a running sunrise. */
  protected progressOf(alarm: Alarm): number | null {
    const rt = alarm.runtime;
    if (rt.state !== "sunrise" || !rt.light_start || !rt.alarm_time) return null;
    const a = new Date(rt.light_start).getTime();
    const b = new Date(rt.alarm_time).getTime();
    return b > a ? Math.min(1, Math.max(0, (this.now - a) / (b - a))) : 1;
  }
}

export const cardStyles = [
  shared,
  css`
    :host {
      display: block;
      --db-icon-bg: color-mix(in srgb, var(--state-icon-color, var(--primary-color)) 20%, transparent);
      --db-icon: var(--state-icon-color, var(--primary-color));
      --db-active: var(--primary-color);
    }
    :host([accent]) {
      --db-icon-bg: color-mix(in srgb, var(--db-accent) 22%, transparent);
      --db-icon: var(--db-accent-strong);
      --db-active: var(--db-accent);
    }
    :host(:not([accent])) .switch[aria-checked="true"] {
      background: var(--switch-checked-track-color, var(--primary-color));
    }
    ha-card {
      height: 100%;
      overflow: hidden;
    }
    .icon {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      display: grid;
      place-items: center;
      flex: none;
      background: var(--db-icon-bg);
      color: var(--db-icon);
      --mdc-icon-size: 24px;
    }
    .icon.on {
      background: color-mix(in srgb, var(--db-active) 30%, transparent);
    }
    .name {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .state {
      font-size: 12px;
      line-height: 16px;
      color: var(--db-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .feature {
      flex: 1;
      min-height: 42px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      background: color-mix(in srgb, var(--db-active) 18%, transparent);
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      --mdc-icon-size: 20px;
    }
    .feature:hover {
      background: color-mix(in srgb, var(--db-active) 28%, transparent);
    }
    .feature.primary {
      background: var(--db-active);
      color: var(--text-primary-color, #fff);
    }
    :host([accent]) .feature.primary {
      color: var(--db-on-accent);
    }
    .progress {
      height: 6px;
      border-radius: 3px;
      background: var(--db-tile);
      overflow: hidden;
    }
    .progress div {
      height: 100%;
    }
    /* Mushroom: square-ish icon shape, tighter spacing */
    :host([card-style="mushroom"]) ha-card {
      border-radius: var(--ha-card-border-radius, 12px);
    }
    :host([card-style="mushroom"]) .icon {
      border-radius: 12px;
      width: 38px;
      height: 38px;
    }
    :host([card-style="mushroom"]) .feature {
      border-radius: 10px;
      min-height: 38px;
    }
    /* Bubble: pill shapes */
    :host([card-style="bubble"]) ha-card {
      border-radius: 32px;
    }
    :host([card-style="bubble"]) .icon {
      width: 44px;
      height: 44px;
      border-radius: 22px;
    }
    :host([card-style="bubble"]) .feature {
      border-radius: 999px;
    }
  `,
];

/** Schema helpers shared by the card editors (HA config forms). */
export const styleSchema = (hass?: HomeAssistant) => [
  {
    name: "style",
    selector: {
      select: {
        mode: "dropdown",
        options: (["ha", "mushroom", "bubble"] as CardStyle[]).map((v) => ({ value: v, label: t(hass, `style_${v}` as StringKey) })),
      },
    },
  },
  { name: "accent", selector: { boolean: {} } },
];

export const cardLabel = (hass?: HomeAssistant) => (field: { name: string }) => t(hass, `c_${field.name}` as StringKey);
