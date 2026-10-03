import { LitElement, css, html } from "lit";
import { property, state } from "lit/decorators.js";
import {
  createAlarm,
  deleteAlarm,
  subscribeAlarms,
  updateAlarm,
  type Alarm,
  type AlarmInput,
  type HomeAssistant,
  type Snapshot,
} from "./api";
import { DEFAULT_ALARM, type EditorMode } from "./alarm-editor";
import { t } from "./i18n";
import { countdown, fireEvent, formatDay, formatTime, loadHaComponents } from "./util";
import "./alarm-editor";
import "./alarm-row";

const MODE_KEY = "daybreak-editor-mode";

function storedMode(): EditorMode {
  try {
    const value = localStorage.getItem(MODE_KEY);
    if (value === "simple" || value === "normal" || value === "expert") return value;
  } catch {
    /* storage unavailable */
  }
  return "normal";
}

/** Sidebar panel: list, create, edit and delete alarms. */
export class DaybreakPanel extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @state() private _snapshot?: Snapshot;
  @state() private _editing?: { alarm: AlarmInput; id?: string };
  @state() private _mode: EditorMode = storedMode();
  @state() private _saving = false;
  @state() private _now = Date.now();
  @state() private _ready = false;
  private _unsub?: () => void;
  private _timer?: number;

  connectedCallback() {
    super.connectedCallback();
    this._timer = window.setInterval(() => (this._now = Date.now()), 30000);
    loadHaComponents().then(() => (this._ready = true));
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
    this._unsub = subscribeAlarms(this.hass, (snapshot) => (this._snapshot = snapshot));
  }

  private _new() {
    const alarm = structuredClone(DEFAULT_ALARM);
    alarm.name = t(this.hass, "alarm");
    this._editing = { alarm };
  }

  private _edit(ev: CustomEvent) {
    const { runtime: _runtime, id, ...alarm } = ev.detail.alarm as Alarm;
    this._editing = { alarm, id };
  }

  private async _save(ev: CustomEvent) {
    if (!this.hass || !this._editing) return;
    this._saving = true;
    try {
      const alarm = ev.detail.alarm as AlarmInput;
      if (this._editing.id) await updateAlarm(this.hass, this._editing.id, alarm);
      else await createAlarm(this.hass, alarm);
      this._editing = undefined;
    } catch (err: any) {
      this._notify(t(this.hass, "error", { msg: err?.message ?? String(err) }));
    } finally {
      this._saving = false;
    }
  }

  private async _delete() {
    const editing = this._editing;
    if (!this.hass || !editing?.id) return;
    if (!confirm(t(this.hass, "delete_confirm", { name: editing.alarm.name }))) return;
    await deleteAlarm(this.hass, editing.id);
    this._editing = undefined;
  }

  private _setMode(ev: CustomEvent) {
    this._mode = ev.detail.mode;
    try {
      localStorage.setItem(MODE_KEY, this._mode);
    } catch {
      /* ignore */
    }
  }

  private _notify(message: string) {
    fireEvent(this, "hass-notification", { message });
  }

  render() {
    const hass = this.hass;
    const editing = this._editing;
    return html`
      <div class="toolbar">
        ${editing
          ? html`<button class="icon" title=${t(hass, "back")} @click=${() => (this._editing = undefined)}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>`
          : html`<ha-menu-button .hass=${hass} .narrow=${this.narrow}></ha-menu-button>`}
        <div class="title">${editing ? editing.alarm.name || t(hass, "new_alarm") : t(hass, "title")}</div>
      </div>
      <div class="body">
        ${editing ? this._renderEditor() : this._renderList()}
      </div>
    `;
  }

  private _renderEditor() {
    if (!this._ready) return html`<div class="loading">…</div>`;
    return html`<daybreak-alarm-editor
      .hass=${this.hass}
      .alarm=${this._editing!.alarm}
      .mode=${this._mode}
      .isNew=${!this._editing!.id}
      .saving=${this._saving}
      @daybreak-save=${this._save}
      @daybreak-cancel=${() => (this._editing = undefined)}
      @daybreak-delete=${this._delete}
      @daybreak-mode=${this._setMode}
    ></daybreak-alarm-editor>`;
  }

  private _renderList() {
    const hass = this.hass;
    const snapshot = this._snapshot;
    if (!snapshot) return html`<div class="loading">…</div>`;
    const next = snapshot.next;
    const nextAlarm = next && snapshot.alarms.find((a) => a.id === next.alarm_id);
    const alarms = [...snapshot.alarms].sort((a, b) => a.time.localeCompare(b.time));
    return html`
      <div class="hero">
        <ha-icon icon="mdi:weather-sunset-up"></ha-icon>
        <div>
          <div class="hero-label">${t(hass, "next_alarm")}</div>
          ${next && nextAlarm
            ? html`<div class="hero-time">${formatTime(hass, next.time)}</div>
                <div class="hero-sub">
                  ${formatDay(hass, next.time)} · ${t(hass, "in", { time: countdown(next.time, this._now) })} ·
                  ${nextAlarm.name}
                </div>`
            : html`<div class="hero-sub">${t(hass, "no_next")}</div>`}
        </div>
      </div>

      <ha-card>
        ${alarms.length
          ? alarms.map(
              (alarm) => html`<daybreak-alarm-row
                .hass=${hass}
                .alarm=${alarm}
                .now=${this._now}
                controls
                editable
                @daybreak-edit=${this._edit}
              ></daybreak-alarm-row>`,
            )
          : html`<div class="empty">${t(hass, "no_alarms")}</div>`}
      </ha-card>

      <button class="fab" @click=${this._new}>
        <ha-icon icon="mdi:plus"></ha-icon><span>${t(hass, "new_alarm")}</span>
      </button>
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, inherit);
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      height: var(--header-height, 56px);
      padding: 0 12px;
      box-sizing: border-box;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color, #fff));
      border-bottom: var(--app-header-border-bottom, none);
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .title {
      font-size: 20px;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon {
      border: none;
      background: transparent;
      color: inherit;
      padding: 8px;
      cursor: pointer;
      border-radius: 50%;
    }
    .body {
      max-width: 760px;
      margin: 0 auto;
      padding: 16px;
      padding-bottom: 96px;
    }
    .hero {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      margin-bottom: 16px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: linear-gradient(135deg, #ff9a5a 0%, #ffcf7a 60%, #ffe8b0 100%);
      color: #3a2410;
    }
    .hero > ha-icon {
      --mdc-icon-size: 48px;
    }
    .hero-label {
      font-size: 0.9em;
      opacity: 0.8;
    }
    .hero-time {
      font-size: 2.6em;
      font-weight: 300;
      line-height: 1.1;
    }
    .hero-sub {
      opacity: 0.85;
    }
    ha-card {
      padding: 4px 0;
    }
    daybreak-alarm-row + daybreak-alarm-row {
      border-top: 1px solid var(--divider-color);
    }
    .empty,
    .loading {
      padding: 32px 16px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .fab {
      position: fixed;
      right: 24px;
      bottom: 24px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 20px;
      border: none;
      border-radius: 16px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    }
  `;
}

if (!customElements.get("daybreak-panel")) {
  customElements.define("daybreak-panel", DaybreakPanel);
}
