import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { AlarmInput, CurvePoint, HomeAssistant } from "./api";
import { t, weekdayNames, type StringKey } from "./i18n";
import { fireEvent } from "./util";
import "./curve-preview";

export type EditorMode = "simple" | "normal" | "expert";

export const DEFAULT_ALARM: AlarmInput = {
  name: "",
  enabled: true,
  time: "07:00",
  days: [0, 1, 2, 3, 4],
  date: null,
  skip_date: null,
  light: {
    target: {},
    duration: 30,
    start_brightness: 1,
    end_brightness: 100,
    use_color_temp: true,
    start_kelvin: 2200,
    end_kelvin: 4000,
    curve: "smooth",
    points: [],
    step_seconds: 15,
  },
  behavior: {
    snooze_minutes: 9,
    snooze_light: "keep",
    auto_stop_minutes: 30,
    after_stop: "keep",
    stop_on_light_off: true,
  },
  presence: { entities: [], skip_when_away: true, stop_when_away: true },
  last_call: {
    enabled: false,
    after_minutes: 20,
    duration: 10,
    target: {},
    brightness: 100,
    kelvin: 5000,
    actions: [],
  },
};

type Part = "root" | "light" | "behavior" | "presence" | "last_call";

const DEFAULT_POINTS: CurvePoint[] = [
  { t: 0, brightness: 1, kelvin: 2000 },
  { t: 0.66, brightness: 30, kelvin: 2700 },
  { t: 1, brightness: 100, kelvin: 4000 },
];

type Schema = Record<string, any>;

const num = (min: number, max: number, step = 1, unit?: string, mode: "slider" | "box" = "box") => ({
  number: { min, max, step, mode, unit_of_measurement: unit },
});

/** Full-page editor for one alarm. Emits daybreak-save / daybreak-cancel / daybreak-delete. */
export class DaybreakAlarmEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) alarm?: AlarmInput;
  @property({ attribute: false }) mode: EditorMode = "normal";
  @property({ type: Boolean }) isNew = false;
  @property({ type: Boolean }) saving = false;
  @state() private _draft?: AlarmInput;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("alarm") && this.alarm) {
      this._draft = structuredClone(this.alarm);
    }
  }

  private _label = (field: { name: string }) => t(this.hass, `f_${field.name}` as StringKey);
  private _lcLabel = (field: { name: string }) =>
    t(this.hass, (["duration", "target"].includes(field.name) ? `lc_${field.name}` : `f_${field.name}`) as StringKey);

  private _opts(prefix: string, values: string[]) {
    return values.map((value) => ({ value, label: t(this.hass, `${prefix}_${value}` as StringKey) }));
  }

  private _baseSchema(): Schema[] {
    const schema: Schema[] = [
      { name: "name", selector: { text: {} } },
      { name: "time", required: true, selector: { time: { no_second: true } } },
    ];
    if (this.mode === "expert" && !this._draft?.days.length) {
      schema.push({ name: "date", selector: { date: {} } });
    }
    return schema;
  }

  private _lightSchema(): Schema[] {
    const schema: Schema[] = [
      { name: "target", selector: { target: { entity: { domain: "light" } } } },
      { name: "duration", selector: num(0, 240, 1, "min", "slider") },
    ];
    if (this.mode === "simple") return schema;
    if (this._draft?.light.curve !== "custom") {
      schema.push(
        { name: "start_brightness", selector: num(0, 100, 1, "%", "slider") },
        { name: "end_brightness", selector: num(1, 100, 1, "%", "slider") },
      );
    }
    schema.push({ name: "use_color_temp", selector: { boolean: {} } });
    if (this._draft?.light.use_color_temp && this._draft.light.curve !== "custom") {
      schema.push(
        { name: "start_kelvin", selector: { color_temp: { unit: "kelvin", min: 1500, max: 6500 } } },
        { name: "end_kelvin", selector: { color_temp: { unit: "kelvin", min: 1500, max: 6500 } } },
      );
    }
    return schema;
  }

  private _curveSchema(): Schema[] {
    const curves = this.mode === "expert" ? ["smooth", "linear", "custom"] : ["smooth", "linear"];
    const schema: Schema[] = [
      { name: "curve", required: true, selector: { select: { mode: "dropdown", options: this._opts("curve", curves) } } },
    ];
    if (this.mode === "expert") schema.push({ name: "step_seconds", selector: num(2, 120, 1, "s") });
    return schema;
  }

  private _behaviorSchema(): Schema[] {
    const schema: Schema[] = [
      { name: "snooze_minutes", selector: num(1, 60, 1, "min") },
      { name: "auto_stop_minutes", selector: num(0, 720, 1, "min") },
      {
        name: "after_stop",
        required: true,
        selector: { select: { mode: "dropdown", options: this._opts("after_stop", ["keep", "off"]) } },
      },
    ];
    if (this.mode === "expert") {
      schema.push(
        {
          name: "snooze_light",
          required: true,
          selector: { select: { mode: "dropdown", options: this._opts("snooze_light", ["keep", "dim", "off"]) } },
        },
        { name: "stop_on_light_off", selector: { boolean: {} } },
      );
    }
    return schema;
  }

  private _presenceSchema(): Schema[] {
    const schema: Schema[] = [
      { name: "entities", selector: { entity: { multiple: true, domain: ["person", "device_tracker", "binary_sensor", "input_boolean", "zone", "group"] } } },
    ];
    if (this.mode === "expert" && this._draft?.presence.entities.length) {
      schema.push(
        { name: "skip_when_away", selector: { boolean: {} } },
        { name: "stop_when_away", selector: { boolean: {} } },
      );
    }
    return schema;
  }

  private _lastCallSchema(): Schema[] {
    const schema: Schema[] = [{ name: "enabled", selector: { boolean: {} } }];
    if (!this._draft?.last_call.enabled) return schema;
    schema.push(
      { name: "after_minutes", selector: num(1, 240, 1, "min") },
      { name: "duration", selector: num(1, 120, 1, "min") },
    );
    if (this.mode === "expert") {
      schema.push(
        { name: "target", selector: { target: { entity: { domain: "light" } } } },
        { name: "brightness", selector: num(1, 100, 1, "%", "slider") },
        { name: "kelvin", selector: { color_temp: { unit: "kelvin", min: 1500, max: 6500 } } },
        { name: "actions", selector: { action: {} } },
      );
    }
    return schema;
  }

  private _patch(part: Part, value: Record<string, any>) {
    const draft = structuredClone(this._draft!);
    if (part === "root") {
      Object.assign(draft, value);
      if (typeof draft.time === "string") draft.time = draft.time.slice(0, 5);
      if (!draft.date) draft.date = null;
    } else if (part === "light") {
      const switchedToCustom = value.curve === "custom" && draft.light.curve !== "custom";
      Object.assign(draft.light, value);
      if (switchedToCustom && draft.light.points.length < 2) draft.light.points = structuredClone(DEFAULT_POINTS);
    } else {
      Object.assign(draft[part], value);
    }
    this._draft = draft;
  }

  private _toggleDay(day: number) {
    const days = new Set(this._draft!.days);
    days.has(day) ? days.delete(day) : days.add(day);
    this._patch("root", { days: [...days].sort(), ...(days.size ? { date: null } : {}) });
  }

  private _presetDays(days: number[]) {
    this._patch("root", { days, ...(days.length ? { date: null } : {}) });
  }

  private _setPoint(index: number, key: keyof CurvePoint, raw: string) {
    const points = structuredClone(this._draft!.light.points);
    const value = Number(raw);
    if (Number.isNaN(value)) return;
    if (key === "t") points[index].t = Math.min(1, Math.max(0, value / 100));
    else if (key === "brightness") points[index].brightness = Math.min(100, Math.max(0, value));
    else points[index].kelvin = raw === "" ? null : Math.min(6500, Math.max(1500, value));
    this._patch("light", { points });
  }

  private _addPoint() {
    const points = [...this._draft!.light.points].sort((a, b) => a.t - b.t);
    // Insert in the widest gap.
    let best = 0;
    for (let i = 1; i < points.length - 1; i++) {
      if (points[i + 1].t - points[i].t > points[best + 1].t - points[best].t) best = i;
    }
    const a = points[best];
    const b = points[best + 1] ?? { t: 1, brightness: 100, kelvin: 4000 };
    points.splice(best + 1, 0, {
      t: Math.round(((a.t + b.t) / 2) * 100) / 100,
      brightness: Math.round((a.brightness + b.brightness) / 2),
      kelvin: a.kelvin && b.kelvin ? Math.round((a.kelvin + b.kelvin) / 2) : a.kelvin ?? b.kelvin ?? null,
    });
    this._patch("light", { points });
  }

  private _removePoint(index: number) {
    const points = this._draft!.light.points.filter((_, i) => i !== index);
    this._patch("light", { points });
  }

  private _save() {
    const draft = structuredClone(this._draft!);
    draft.name = draft.name.trim() || t(this.hass, "alarm");
    draft.light.points = [...draft.light.points].sort((a, b) => a.t - b.t);
    fireEvent(this, "daybreak-save", { alarm: draft });
  }

  private _setMode(mode: EditorMode) {
    fireEvent(this, "daybreak-mode", { mode });
  }

  private _form(schema: Schema[], data: Record<string, any>, part: Part) {
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${schema}
      .computeLabel=${part === "last_call" ? this._lcLabel : this._label}
      @value-changed=${(ev: CustomEvent) => this._patch(part, ev.detail.value)}
    ></ha-form>`;
  }

  render() {
    const draft = this._draft;
    if (!draft) return nothing;
    const names = weekdayNames(this.hass);
    const hass = this.hass;
    return html`
      <div class="modes" role="tablist">
        ${(["simple", "normal", "expert"] as EditorMode[]).map(
          (m) => html`<button role="tab" class=${m === this.mode ? "sel" : ""} @click=${() => this._setMode(m)}>
            ${t(hass, `mode_${m}`)}
          </button>`,
        )}
      </div>

      <ha-card>
        <h2><ha-icon icon="mdi:clock-outline"></ha-icon>${t(hass, "section_time")}</h2>
        <div class="content">
          ${this._form(this._baseSchema(), draft, "root")}
          <div class="label">${t(hass, "repeat")}</div>
          <div class="days">
            ${[0, 1, 2, 3, 4, 5, 6].map(
              (d) => html`<button class="day ${draft.days.includes(d) ? "sel" : ""}" @click=${() => this._toggleDay(d)}>
                ${names[d]}
              </button>`,
            )}
          </div>
          <div class="presets">
            <button @click=${() => this._presetDays([0, 1, 2, 3, 4])}>${t(hass, "weekdays")}</button>
            <button @click=${() => this._presetDays([5, 6])}>${t(hass, "weekend")}</button>
            <button @click=${() => this._presetDays([0, 1, 2, 3, 4, 5, 6])}>${t(hass, "every_day")}</button>
            <button @click=${() => this._presetDays([])}>${t(hass, "once")}</button>
          </div>
        </div>
      </ha-card>

      <ha-card>
        <h2><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>${t(hass, "section_light")}</h2>
        <div class="content">${this._form(this._lightSchema(), draft.light, "light")}</div>
      </ha-card>

      ${this.mode !== "simple"
        ? html`<ha-card>
            <h2><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon>${t(hass, "section_curve")}</h2>
            <div class="content">
              <daybreak-curve-preview .hass=${hass} .light=${draft.light}></daybreak-curve-preview>
              ${this._form(this._curveSchema(), draft.light, "light")}
              ${draft.light.curve === "custom" ? this._renderPoints() : nothing}
            </div>
          </ha-card>`
        : html`<ha-card>
            <div class="content">
              <daybreak-curve-preview .hass=${hass} .light=${draft.light}></daybreak-curve-preview>
            </div>
          </ha-card>`}

      ${this.mode !== "simple"
        ? html`<ha-card>
            <h2><ha-icon icon="mdi:sleep"></ha-icon>${t(hass, "section_behavior")}</h2>
            <div class="content">${this._form(this._behaviorSchema(), draft.behavior, "behavior")}</div>
          </ha-card>`
        : nothing}

      ${this.mode !== "simple"
        ? html`<ha-card>
            <h2><ha-icon icon="mdi:account-clock-outline"></ha-icon>${t(hass, "section_no_reaction")}</h2>
            <div class="content">
              <p class="hint">${t(hass, "no_reaction_hint")}</p>
              ${this._form(this._presenceSchema(), draft.presence, "presence")}
              <div class="label">${t(hass, "section_last_call")}</div>
              ${this._form(this._lastCallSchema(), draft.last_call, "last_call")}
            </div>
          </ha-card>`
        : nothing}

      <div class="footer">
        ${!this.isNew
          ? html`<button class="danger" @click=${() => fireEvent(this, "daybreak-delete")}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${t(hass, "delete")}
            </button>`
          : nothing}
        <span class="spacer"></span>
        <button @click=${() => fireEvent(this, "daybreak-cancel")}>${t(hass, "cancel")}</button>
        <button class="primary" ?disabled=${this.saving} @click=${this._save}>${t(hass, "save")}</button>
      </div>
    `;
  }

  private _renderPoints() {
    const hass = this.hass;
    const points = this._draft!.light.points;
    const useCt = this._draft!.light.use_color_temp;
    return html`
      <div class="label">${t(hass, "points")}</div>
      <table class="points">
        <thead>
          <tr>
            <th>${t(hass, "point_time")}</th>
            <th>${t(hass, "point_brightness")}</th>
            ${useCt ? html`<th>${t(hass, "point_kelvin")}</th>` : nothing}
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${points.map(
            (p, i) => html`<tr>
              <td><input type="number" min="0" max="100" .value=${String(Math.round(p.t * 100))}
                @change=${(e: Event) => this._setPoint(i, "t", (e.target as HTMLInputElement).value)} /></td>
              <td><input type="number" min="0" max="100" .value=${String(p.brightness)}
                @change=${(e: Event) => this._setPoint(i, "brightness", (e.target as HTMLInputElement).value)} /></td>
              ${useCt
                ? html`<td><input type="number" min="1500" max="6500" step="50" .value=${p.kelvin ? String(p.kelvin) : ""}
                    @change=${(e: Event) => this._setPoint(i, "kelvin", (e.target as HTMLInputElement).value)} /></td>`
                : nothing}
              <td>
                <button class="icon" title=${t(hass, "remove")} ?disabled=${points.length <= 2}
                  @click=${() => this._removePoint(i)}><ha-icon icon="mdi:close"></ha-icon></button>
              </td>
            </tr>`,
          )}
        </tbody>
      </table>
      <button class="add" @click=${this._addPoint}><ha-icon icon="mdi:plus"></ha-icon>${t(hass, "add_point")}</button>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      margin-bottom: 16px;
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 16px 16px 0;
      font-size: 1.15em;
      font-weight: 500;
    }
    .content {
      padding: 12px 16px 16px;
    }
    .hint {
      margin: 0 0 12px;
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .label {
      margin: 16px 0 8px;
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .modes {
      display: inline-flex;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .modes button {
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      padding: 8px 16px;
      font: inherit;
      cursor: pointer;
    }
    .modes button.sel {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .days {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .day {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
    }
    .day.sel {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .presets {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .presets button,
    .add,
    .footer button {
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-color);
      border-radius: 16px;
      padding: 6px 12px;
      font: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .add {
      margin-top: 8px;
    }
    .points {
      width: 100%;
      border-collapse: collapse;
    }
    .points th {
      text-align: left;
      font-weight: 400;
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }
    .points input {
      width: 100%;
      box-sizing: border-box;
      padding: 6px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
    .points td {
      padding: 3px;
    }
    .icon {
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .footer {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 8px 0 32px;
    }
    .spacer {
      flex: 1;
    }
    .footer .primary {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
      padding: 8px 20px;
    }
    .footer .danger {
      color: var(--error-color, #db4437);
    }
    button[disabled] {
      opacity: 0.5;
      cursor: default;
    }
    daybreak-curve-preview {
      margin-bottom: 12px;
    }
  `;
}

if (!customElements.get("daybreak-alarm-editor")) {
  customElements.define("daybreak-alarm-editor", DaybreakAlarmEditor);
}
