import { LitElement, css, html } from "lit";
import { property, state } from "lit/decorators.js";
import {
  createAlarm,
  DEFAULT_MODE_HIDDEN,
  MODE_FEATURES,
  saveProfile,
  saveSettings,
  type AlarmConfig,
  type EditorMode,
  type HomeAssistant,
  type LastCallProfile,
  type LightProfile,
  type ModeFeature,
  type Settings,
  type Snapshot,
  type SnoozePreset,
  type WeatherKey,
} from "../api";
import { errorText, t, type StringKey } from "../i18n";
import { shared } from "../styles";
import { clamp, fireEvent, friendlyName, define } from "../util";
import "../components/entity-picker";

const WEATHER: WeatherKey[] = ["snow", "storm", "rain"];

/** Global settings, snooze presets, weather defaults and import/export. */
export class DbSettingsView extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) snapshot?: Snapshot;
  @state() private _busy = false;

  static styles = [
    shared,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      section {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      h2 {
        margin: 0;
        font-size: 17px;
        font-weight: 600;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 10px;
      }
      .cell {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--db-tile);
      }
      .preset {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) 80px auto auto;
        gap: 8px;
        align-items: center;
      }
      ha-selector {
        display: block;
      }
      .modes {
        display: grid;
        grid-template-columns: minmax(0, 1fr) repeat(3, 64px);
        align-items: center;
        gap: 2px 4px;
      }
      .modes .head {
        font-size: 12px;
        color: var(--db-muted);
        text-align: center;
      }
      .modes .feat {
        padding: 8px 0;
        border-top: 1px solid var(--db-line);
      }
      .modes .box {
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: stretch;
        border-top: 1px solid var(--db-line);
      }
      .modes input {
        width: 20px;
        height: 20px;
      }
      @media (max-width: 480px) {
        .modes {
          grid-template-columns: minmax(0, 1fr) repeat(3, 48px);
        }
      }
    `,
  ];

  private get s(): Settings {
    return this.snapshot!.settings;
  }

  private async _set(change: Partial<Settings>) {
    if (!this.hass) return;
    try {
      await saveSettings(this.hass, change);
    } catch (err) {
      fireEvent(this, "hass-notification", { message: errorText(this.hass, err) });
    }
  }

  private _sel(
    domains: string[],
    value: string | string[] | null,
    change: (v: any) => void,
    label: string,
    opts: { multiple?: boolean; deviceClass?: string } = {},
  ) {
    return html`<db-entity-picker .hass=${this.hass} .domains=${domains} .value=${value} .label=${label}
      .multiple=${!!opts.multiple} .deviceClass=${opts.deviceClass}
      @value-changed=${(ev: CustomEvent) => {
        ev.stopPropagation();
        change(ev.detail.value);
      }}></db-entity-picker>`;
  }

  private _modes() {
    const hass = this.hass;
    const hidden = { ...DEFAULT_MODE_HIDDEN, ...this.s.mode_hidden };
    const toggle = (mode: "simple" | "normal", f: ModeFeature, show: boolean) => {
      const list = hidden[mode].filter((x) => x !== f);
      this._set({ mode_hidden: { ...hidden, [mode]: show ? list : [...list, f] } });
    };
    return html`<section class="card">
      <h2>${t(hass, "settings_modes")}</h2>
      <div class="muted">${t(hass, "settings_modes_hint")}</div>
      <div class="modes">
        <span></span>
        ${(["simple", "normal", "expert"] as EditorMode[]).map((m) => html`<span class="head">${t(hass, `mode_${m}` as StringKey)}</span>`)}
        ${MODE_FEATURES.map(
          (f) => html`<div class="feat"><div>${t(hass, `feat_${f}` as StringKey)}</div>
              <div class="muted">${t(hass, `feat_${f}_d` as StringKey)}</div></div>
            ${(["simple", "normal"] as const).map(
              (m) => html`<label class="box"><input type="checkbox" .checked=${!hidden[m].includes(f)}
                aria-label=${`${t(hass, `feat_${f}` as StringKey)} – ${t(hass, `mode_${m}` as StringKey)}`}
                @change=${(e: Event) => toggle(m, f, (e.target as HTMLInputElement).checked)} /></label>`,
            )}
            <span class="box"><input type="checkbox" checked disabled aria-label=${t(hass, "mode_expert")} /></span>`,
        )}
      </div>
      <div><button class="btn" @click=${() => this._set({ mode_hidden: DEFAULT_MODE_HIDDEN })}>${t(hass, "settings_modes_reset")}</button></div>
    </section>`;
  }

  private _presets() {
    const hass = this.hass;
    const presets = this.s.snooze_presets;
    const set = (next: SnoozePreset[]) => this._set({ snooze_presets: next });
    const edit = (i: number, change: Partial<SnoozePreset>) => set(presets.map((p, j) => (j === i ? { ...p, ...change } : p)));
    return html`
      ${presets.map(
        (p, i) => html`<div class="preset">
          <input type="radio" name="def" .checked=${this.s.default_snooze === p.id} aria-label=${t(hass, "default")}
            @change=${() => this._set({ default_snooze: p.id })} />
          <input class="inp" .value=${p.name} @change=${(ev: Event) => edit(i, { name: (ev.target as HTMLInputElement).value || p.name })} />
          <input class="inp num" type="number" min="1" max="60" .value=${String(p.minutes)}
            @change=${(ev: Event) => edit(i, { minutes: clamp(Number((ev.target as HTMLInputElement).value) || 1, 1, 60) })} />
          <span>min</span>
          <button class="btn" ?disabled=${presets.length <= 1} aria-label=${t(hass, "delete")}
            @click=${() => set(presets.filter((_, j) => j !== i))}>✕</button>
        </div>`,
      )}
      <div class="row">
        <button class="btn" ?disabled=${presets.length >= 12}
          @click=${() => set([...presets, { id: `p${Date.now().toString(36)}`, name: t(hass, "preset_new"), minutes: 10 }])}>
          + ${t(hass, "preset_add")}</button>
        <span class="grow"></span>
        <label class="row"><span>${t(hass, "default_count")}</span>
          <input class="inp num" type="number" min="1" max="10" .value=${String(this.s.default_snooze_count)}
            @change=${(ev: Event) => this._set({ default_snooze_count: clamp(Number((ev.target as HTMLInputElement).value) || 1, 1, 10) })} />
          <span>×</span></label>
      </div>
      <div class="muted">${t(hass, "presets_hint")}</div>
    `;
  }

  private _export() {
    const snap = this.snapshot!;
    const data = {
      daybreak: 2,
      alarms: snap.alarms.map(({ runtime: _r, ...a }) => a),
      light_profiles: snap.light_profiles.filter((p) => !p.builtin),
      last_call_profiles: snap.last_call_profiles.filter((p) => !p.builtin),
      settings: snap.settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `daybreak-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  private async _import(ev: Event) {
    const hass = this.hass;
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!hass || !file) return;
    this._busy = true;
    try {
      const data = JSON.parse(await file.text());
      if (data?.daybreak !== 2) throw new Error(t(hass, "import_invalid"));
      const alarms: AlarmConfig[] = data.alarms ?? [];
      if (!confirm(t(hass, "import_confirm", { n: alarms.length }))) return;
      const lightIds: Record<string, string> = {};
      for (const p of (data.light_profiles ?? []) as LightProfile[]) {
        const { id, ...rest } = p;
        lightIds[id] = (await saveProfile<LightProfile>(hass, "light", rest)).id;
      }
      const lcIds: Record<string, string> = {};
      for (const p of (data.last_call_profiles ?? []) as LastCallProfile[]) {
        const { id, ...rest } = p;
        lcIds[id] = (await saveProfile<LastCallProfile>(hass, "last_call", rest)).id;
      }
      for (const alarm of alarms) {
        const a = structuredClone(alarm);
        delete a.id;
        if (a.light?.profile) a.light.profile = lightIds[a.light.profile] ?? a.light.profile;
        for (const o of a.light?.overrides ?? []) if (o.profile) o.profile = lightIds[o.profile] ?? o.profile;
        if (a.last_call?.profile) a.last_call.profile = lcIds[a.last_call.profile] ?? a.last_call.profile;
        await createAlarm(hass, a);
      }
      fireEvent(this, "hass-notification", { message: t(hass, "import_done", { n: alarms.length }) });
    } catch (err) {
      fireEvent(this, "hass-notification", { message: errorText(hass, err) });
    } finally {
      this._busy = false;
    }
  }

  render() {
    const hass = this.hass;
    if (!this.snapshot) return html``;
    const s = this.s;
    return html`
      <section class="card">
        <h2>${t(hass, "settings_general")}</h2>
        <div class="row">
          <span>${t(hass, "default_mode")}</span>
          <div class="seg" role="group">
            ${(["simple", "normal", "expert"] as EditorMode[]).map(
              (m) => html`<button aria-pressed=${s.default_mode === m} @click=${() => this._set({ default_mode: m })}>
                ${t(hass, `mode_${m}` as StringKey)}</button>`,
            )}
          </div>
        </div>
        <div class="muted">${t(hass, "default_mode_hint")}</div>
        ${this._sel(["binary_sensor"], s.holiday_entity,
          (v) => this._set({ holiday_entity: v || null }), t(hass, "holiday_entity"))}
        <div class="muted">
          ${this.snapshot.holiday_entity
            ? t(hass, "holiday_used", { entity: friendlyName(hass, this.snapshot.holiday_entity) })
            : t(hass, "holidays_none")}
        </div>
        ${this._sel(["notify"], s.notify, (v) => this._set({ notify: v || null }), t(hass, "notify_default"))}
        <div class="muted">${t(hass, "notify_hint")}</div>
      </section>
      ${this._modes()}

      <section class="card">
        <h2>${t(hass, "settings_snooze")}</h2>
        ${this._presets()}
      </section>

      <section class="card">
        <h2>${t(hass, "settings_weather")}</h2>
        <div class="muted">${t(hass, "settings_weather_hint")}</div>
        ${this._sel(["weather"], s.weather_entity, (v) => this._set({ weather_entity: v || null }), t(hass, "weather_entity"))}
        <div class="grid">
          ${WEATHER.map(
            (k) => html`<label class="cell"><span class="grow">${t(hass, `weather_${k}` as StringKey)}</span>
              <input class="inp num" type="number" min="0" max="240" .value=${String(s.weather_minutes[k] ?? 0)}
                @change=${(ev: Event) =>
                  this._set({ weather_minutes: { ...s.weather_minutes, [k]: clamp(Number((ev.target as HTMLInputElement).value), 0, 240) } })} />
              <span>min</span></label>`,
          )}
          <label class="cell"><span class="grow">${t(hass, "cold_below")}</span>
            <input class="inp num" type="number" step="0.5" .value=${String(s.cold_below)}
              @change=${(ev: Event) => this._set({ cold_below: Number((ev.target as HTMLInputElement).value) })} /><span>°C</span></label>
          <label class="cell"><span class="grow">${t(hass, "cold_minutes")}</span>
            <input class="inp num" type="number" min="0" max="240" .value=${String(s.cold_minutes)}
              @change=${(ev: Event) => this._set({ cold_minutes: clamp(Number((ev.target as HTMLInputElement).value), 0, 240) })} /><span>min</span></label>
        </div>
        ${this._sel(["sensor"], s.temperature_entity,
          (v) => this._set({ temperature_entity: v || null }), t(hass, "temperature_entity"), { deviceClass: "temperature" })}
        ${this._sel(["sensor", "binary_sensor"], s.warning_entities,
          (v) => this._set({ warning_entities: v ?? [] }), t(hass, "warning_entities"), { multiple: true })}
        <label class="row"><span>${t(hass, "warning_level")}</span>
          <select class="inp" @change=${(ev: Event) => this._set({ warning_level: Number((ev.target as HTMLSelectElement).value) })}>
            ${[1, 2, 3, 4].map((n) => html`<option value=${n} ?selected=${s.warning_level === n}>${t(hass, `warning_${n}` as StringKey)}</option>`)}
          </select></label>
      </section>

      <section class="card">
        <h2>${t(hass, "settings_backup")}</h2>
        <div class="muted">${t(hass, "backup_hint")}</div>
        <div class="row">
          <button class="btn" @click=${this._export}>${t(hass, "export")}</button>
          <label class="btn" style="cursor:pointer">
            ${t(hass, "import")}<input type="file" accept="application/json,.json" hidden ?disabled=${this._busy} @change=${this._import} />
          </label>
        </div>
      </section>
    `;
  }
}

define("db-settings-view", DbSettingsView);
