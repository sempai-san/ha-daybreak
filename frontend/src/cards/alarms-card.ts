import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { subscribeAlarms, type HomeAssistant, type Snapshot } from "../api";
import { t } from "../i18n";
import { fireEvent, loadHaComponents } from "../util";
import "../alarm-row";

export interface AlarmsCardConfig {
  type: string;
  title?: string;
  alarms?: string[];
  show_disabled?: boolean;
  show_controls?: boolean;
}

/** Base for cards that need the live alarm snapshot. */
export class SnapshotElement extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
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
}

export class DaybreakAlarmsCard extends SnapshotElement {
  @state() private _config?: AlarmsCardConfig;

  static getConfigElement() {
    return document.createElement("daybreak-alarms-card-editor");
  }

  static getStubConfig(): Partial<AlarmsCardConfig> {
    return { show_controls: true };
  }

  setConfig(config: AlarmsCardConfig) {
    this._config = { show_disabled: true, show_controls: true, ...config };
  }

  getCardSize() {
    return 1 + (this.snapshot?.alarms.length ?? 2) * 2;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, min_rows: 2 };
  }

  render() {
    const config = this._config;
    if (!config) return nothing;
    const hass = this.hass;
    let alarms = [...(this.snapshot?.alarms ?? [])].sort((a, b) => a.time.localeCompare(b.time));
    if (config.alarms?.length) alarms = alarms.filter((a) => config.alarms!.includes(a.id));
    if (!config.show_disabled) alarms = alarms.filter((a) => a.enabled);
    return html`
      <ha-card .header=${config.title}>
        ${!this.snapshot
          ? html`<div class="empty">…</div>`
          : alarms.length
            ? alarms.map(
                (alarm) => html`<daybreak-alarm-row
                  .hass=${hass}
                  .alarm=${alarm}
                  .now=${this.now}
                  .controls=${config.show_controls ?? true}
                ></daybreak-alarm-row>`,
              )
            : html`<div class="empty">${t(hass, "no_alarms")}</div>`}
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      padding: 4px 0;
    }
    daybreak-alarm-row + daybreak-alarm-row {
      border-top: 1px solid var(--divider-color);
    }
    .empty {
      padding: 24px 16px;
      text-align: center;
      color: var(--secondary-text-color);
    }
  `;
}

export class DaybreakAlarmsCardEditor extends SnapshotElement {
  @state() private _config?: AlarmsCardConfig;

  setConfig(config: AlarmsCardConfig) {
    this._config = config;
  }

  connectedCallback() {
    super.connectedCallback();
    loadHaComponents().then(() => this.requestUpdate());
  }

  private _schema() {
    const options = (this.snapshot?.alarms ?? []).map((a) => ({ value: a.id, label: `${a.time} ${a.name}` }));
    return [
      { name: "title", selector: { text: {} } },
      { name: "alarms", selector: { select: { multiple: true, mode: "list", options } } },
      { name: "show_disabled", selector: { boolean: {} } },
      { name: "show_controls", selector: { boolean: {} } },
    ];
  }

  private _label = (field: { name: string }) => t(this.hass, `c_${field.name}` as any);

  render() {
    if (!this._config) return nothing;
    return html`<ha-form
      .hass=${this.hass}
      .data=${{ show_disabled: true, show_controls: true, ...this._config }}
      .schema=${this._schema()}
      .computeLabel=${this._label}
      @value-changed=${(ev: CustomEvent) => fireEvent(this, "config-changed", { config: ev.detail.value })}
    ></ha-form>`;
  }
}

if (!customElements.get("daybreak-alarms-card")) {
  customElements.define("daybreak-alarms-card", DaybreakAlarmsCard);
  customElements.define("daybreak-alarms-card-editor", DaybreakAlarmsCardEditor);
}
