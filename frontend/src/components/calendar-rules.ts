import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { CalendarAction, CalendarConfig, CalendarPreviewDay, CalendarRule, HomeAssistant } from "../api";
import { t, type StringKey } from "../i18n";
import { defaultCalendarRule } from "../model";
import { shared } from "../styles";
import { clamp, define, fireEvent, formatClock, formatDay, formatTime, friendlyName } from "../util";
import "./entity-picker";

const ACTIONS: CalendarAction[] = ["skip", "time", "before", "alarm"];

/** Ready-made rules to start from. */
const TEMPLATES: { key: StringKey; rule: Partial<CalendarRule> }[] = [
  { key: "calr_tpl_vacation", rule: { keywords: [], action: "skip" } },
  { key: "calr_tpl_early", rule: { action: "time", time: "05:00" } },
  { key: "calr_tpl_event", rule: { action: "before", before: 60, travel: true } },
];

/**
 * Calendar rules of one alarm: "if an event in these calendars contains
 * these words, then ...". Checked from top to bottom; the first rule that
 * matches decides the day. Emits "calendar-change" with the full config.
 */
export class DbCalendarRules extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config!: CalendarConfig;
  /** Other alarms that can take over a day. */
  @property({ attribute: false }) alarms: { id: string; name: string }[] = [];
  @property({ attribute: false }) preview?: CalendarPreviewDay[];
  @property({ type: Boolean }) loading = false;
  @state() private _word: Record<number, string> = {};
  /** The rule that is opened for editing (-1 = none). */
  @state() private _openRule = -1;

  static styles = [
    shared,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .rule {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border: 1px solid var(--db-line);
        border-radius: 14px;
        background: var(--db-tile);
      }
      .divider {
        height: 1px;
        background: var(--db-line);
      }
      .rule.off {
        opacity: 0.6;
      }
      .rhead {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .num {
        display: inline-grid;
        place-items: center;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--db-accent);
        color: #fff;
        font-weight: 700;
        font-size: 13px;
        flex: none;
      }
      .say {
        flex: 1;
        min-width: 0;
        text-align: left;
        border: none;
        background: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        padding: 6px 0;
      }
      .icon {
        min-width: 36px;
        min-height: 36px;
        border-radius: 10px;
        border: 1px solid var(--db-line);
        background: transparent;
        cursor: pointer;
        color: inherit;
      }
      .icon:disabled {
        opacity: 0.3;
        cursor: default;
      }
      .k {
        font-size: 12px;
        color: var(--db-muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .words {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .words input {
        min-width: 140px;
        flex: 1;
      }
      .days {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .day {
        display: grid;
        grid-template-columns: 110px 1fr;
        gap: 10px;
        padding: 6px 8px;
        border-radius: 10px;
        align-items: baseline;
      }
      .day:nth-child(odd) {
        background: var(--db-tile);
      }
      .day .what b {
        margin-right: 6px;
      }
      .tag {
        display: inline-block;
        font-size: 12px;
        padding: 1px 8px;
        border-radius: 999px;
        margin-right: 6px;
        background: color-mix(in srgb, var(--db-accent) 18%, transparent);
      }
      .tag.skip {
        background: color-mix(in srgb, var(--db-muted) 25%, transparent);
      }
      .ev {
        font-size: 12px;
        color: var(--db-muted);
      }
      @media (max-width: 520px) {
        .day {
          grid-template-columns: 1fr;
          gap: 2px;
        }
      }
    `,
  ];

  private _emit(change: Partial<CalendarConfig>) {
    fireEvent(this, "calendar-change", { ...this.config, ...change });
  }

  private _rules(rules: CalendarRule[]) {
    this._emit({ rules });
  }

  private _set(i: number, change: Partial<CalendarRule>) {
    this._rules(this.config.rules.map((r, j) => (j === i ? { ...r, ...change } : r)));
  }

  private _move(i: number, by: number) {
    const rules = [...this.config.rules];
    const [rule] = rules.splice(i, 1);
    rules.splice(i + by, 0, rule);
    if (this._openRule === i) this._openRule = i + by;
    this._rules(rules);
  }

  private get _calendars(): string[] {
    return Object.keys(this.hass?.states ?? {})
      .filter((e) => e.startsWith("calendar."))
      .sort((a, b) => friendlyName(this.hass, a).localeCompare(friendlyName(this.hass, b)));
  }

  private get _waze() {
    return !!(this.hass as unknown as { services?: Record<string, unknown> })?.services?.waze_travel_time;
  }

  private _addWord(i: number) {
    const word = (this._word[i] ?? "").trim();
    if (!word) return;
    const rule = this.config.rules[i];
    if (!rule.keywords.some((w) => w.toLowerCase() === word.toLowerCase())) {
      this._set(i, { keywords: [...rule.keywords, word] });
    }
    this._word = { ...this._word, [i]: "" };
  }

  /** "If an event in Work contains "early" → 05:00" */
  private _sentence(rule: CalendarRule): string {
    const hass = this.hass;
    const cals = rule.calendars.length
      ? rule.calendars.map((c) => friendlyName(hass, c)).join(", ")
      : t(hass, "calr_all_cals");
    const words = rule.keywords.length
      ? rule.keywords.map((w) => `„${w}“`).join(rule.match === "all" ? ` ${t(hass, "calr_and")} ` : ` ${t(hass, "calr_or")} `)
      : t(hass, "calr_any_event");
    return t(hass, "calr_sentence", { cals, words, then: this._then(rule) });
  }

  private _then(rule: CalendarRule): string {
    const hass = this.hass;
    switch (rule.action) {
      case "skip":
        return t(hass, "calr_then_skip");
      case "time":
        return t(hass, "calr_then_time", { time: formatClock(hass, rule.time) });
      case "before":
        return t(hass, rule.travel ? "calr_then_before_travel" : "calr_then_before", { min: rule.before });
      case "alarm":
        return t(hass, "calr_then_alarm", {
          name: this.alarms.find((a) => a.id === rule.alarm)?.name ?? "…",
        });
    }
  }

  private _rule(rule: CalendarRule, i: number) {
    const hass = this.hass;
    const open = this._openRule === i;
    return html`<div class="rule ${rule.enabled ? "" : "off"}">
      <div class="rhead">
        <span class="num">${i + 1}</span>
        <button class="say" aria-expanded=${open} @click=${() => (this._openRule = open ? -1 : i)}>
          ${this._sentence(rule)} <span class="muted">${open ? "▴" : "▾"}</span>
        </button>
        <button class="switch" role="switch" aria-checked=${rule.enabled} aria-label=${t(hass, "calr_enabled")}
          @click=${() => this._set(i, { enabled: !rule.enabled })}></button>
      </div>
      ${open ? this._ruleBody(rule, i) : nothing}
    </div>`;
  }

  private _ruleBody(rule: CalendarRule, i: number) {
    const hass = this.hass;
    const n = this.config.rules.length;
    const calendars = this._calendars;
    return html`

      <div class="k">${t(hass, "calr_if")}</div>
      <div class="row">
        <button class="chip" aria-pressed=${!rule.calendars.length} @click=${() => this._set(i, { calendars: [] })}>
          ${t(hass, "calr_all_cals")}
        </button>
        ${calendars.map((c) => {
          const on = rule.calendars.includes(c);
          return html`<button class="chip" aria-pressed=${on}
            @click=${() => this._set(i, { calendars: on ? rule.calendars.filter((x) => x !== c) : [...rule.calendars, c] })}>
            📅 ${friendlyName(hass, c)}
          </button>`;
        })}
      </div>
      ${!calendars.length ? html`<div class="muted">${t(hass, "calr_no_cals")}</div>` : nothing}

      <div class="words">
        ${rule.keywords.map(
          (w) => html`<span class="chip" aria-pressed="true">${w}<button class="x" aria-label=${t(hass, "remove")}
              @click=${() => this._set(i, { keywords: rule.keywords.filter((x) => x !== w) })}>✕</button></span>`,
        )}
        <input class="inp" .value=${this._word[i] ?? ""} placeholder=${t(hass, "calr_word_ph")}
          @input=${(e: Event) => (this._word = { ...this._word, [i]: (e.target as HTMLInputElement).value })}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              this._addWord(i);
            }
          }}
          @blur=${() => this._addWord(i)} />
      </div>
      ${rule.keywords.length > 1
        ? html`<div class="seg" role="group">
            ${(["any", "all"] as const).map(
              (m) => html`<button aria-pressed=${rule.match === m} @click=${() => this._set(i, { match: m })}>
                ${t(hass, `calr_match_${m}` as StringKey)}
              </button>`,
            )}
          </div>`
        : html`<div class="muted">${t(hass, rule.keywords.length ? "calr_words_hint" : "calr_no_words")}</div>`}

      <div class="k">${t(hass, "calr_then")}</div>
      <div class="seg" role="group">
        ${ACTIONS.map(
          (a) => html`<button aria-pressed=${rule.action === a} @click=${() => this._set(i, { action: a })}>
            ${t(hass, `calr_act_${a}` as StringKey)}
          </button>`,
        )}
      </div>
      ${rule.action === "time"
        ? html`<label class="row"><span>${t(hass, "calr_time")}</span>
            <input class="inp time" type="time" .value=${rule.time}
              @change=${(e: Event) => this._set(i, { time: (e.target as HTMLInputElement).value || rule.time })} /></label>`
        : nothing}
      ${rule.action === "before"
        ? html`<label class="row"><span>${t(hass, rule.travel ? "calr_before_travel" : "calr_before")}</span>
              <input class="inp num" type="number" min="0" max="240" .value=${String(rule.before)}
                @change=${(e: Event) => this._set(i, { before: clamp(Number((e.target as HTMLInputElement).value) || 0, 0, 240) })} />
              min</label>
            <label class="row"><input type="checkbox" .checked=${rule.travel}
              @change=${(e: Event) => this._set(i, { travel: (e.target as HTMLInputElement).checked })} />
              ${t(hass, "calr_travel")}</label>
            <div class="muted">${t(hass, "calr_before_hint")}</div>`
        : nothing}
      ${rule.action === "alarm"
        ? html`<label class="row"><span>${t(hass, "calr_alarm")}</span>
              <select class="inp" @change=${(e: Event) => this._set(i, { alarm: (e.target as HTMLSelectElement).value || null })}>
                <option value="" ?selected=${!rule.alarm}>—</option>
                ${this.alarms.map((a) => html`<option value=${a.id} ?selected=${a.id === rule.alarm}>${a.name}</option>`)}
              </select></label>
            <div class="muted">${t(hass, this.alarms.length ? "calr_alarm_hint" : "calr_alarm_none")}</div>`
        : nothing}
      ${rule.action !== "skip"
        ? html`<label class="row"><input type="checkbox" .checked=${rule.any_day}
              @change=${(e: Event) => this._set(i, { any_day: (e.target as HTMLInputElement).checked })} />
            ${t(hass, "calr_any_day")}</label>`
        : nothing}

      <div class="row" style="justify-content:flex-end">
        <button class="icon" ?disabled=${i === 0} aria-label=${t(hass, "move_up")} @click=${() => this._move(i, -1)}>↑</button>
        <button class="icon" ?disabled=${i === n - 1} aria-label=${t(hass, "move_down")} @click=${() => this._move(i, 1)}>↓</button>
        <button class="icon" aria-label=${t(hass, "remove")}
          @click=${() => {
            this._openRule = -1;
            this._rules(this.config.rules.filter((_, j) => j !== i));
          }}>✕</button>
      </div>`;
  }

  private _travel() {
    const hass = this.hass;
    const tr = this.config.travel;
    const set = (change: Partial<CalendarConfig["travel"]>) => this._emit({ travel: { ...tr, ...change } });
    return html`<div class="lbl">${t(hass, "calr_travel_title")}</div>
      <div class="muted">${t(hass, this._waze ? "calr_travel_hint" : "calr_no_waze")}</div>
      <db-entity-picker .hass=${hass} .domains=${["person", "zone", "device_tracker"]} .value=${tr.origin}
        .label=${t(hass, "calr_origin")}
        @value-changed=${(ev: CustomEvent) => {
          ev.stopPropagation();
          set({ origin: ev.detail.value || null });
        }}></db-entity-picker>
      <div class="muted">${t(hass, "calr_origin_hint")}</div>
      <div class="seg" role="group">
        ${(["car", "motorcycle", "taxi"] as const).map(
          (v) => html`<button aria-pressed=${tr.vehicle === v} @click=${() => set({ vehicle: v })}>
            ${t(hass, `calr_vehicle_${v}` as StringKey)}
          </button>`,
        )}
      </div>
      <div class="row">
        <label class="row"><input type="checkbox" .checked=${tr.avoid_toll}
          @change=${(e: Event) => set({ avoid_toll: (e.target as HTMLInputElement).checked })} />${t(hass, "calr_toll")}</label>
        <label class="row"><span>${t(hass, "calr_region")}</span>
          <select class="inp" @change=${(e: Event) => set({ region: (e.target as HTMLSelectElement).value as CalendarConfig["travel"]["region"] })}>
            ${(["auto", "eu", "us", "na", "il", "au"] as const).map(
              (r) => html`<option value=${r} ?selected=${tr.region === r}>${r === "auto" ? t(hass, "calr_region_auto") : r.toUpperCase()}</option>`,
            )}
          </select></label>
      </div>
      <label class="row"><span>${t(hass, "calr_fallback")}</span>
        <input class="inp num" type="number" min="0" max="240" .value=${String(tr.fallback)}
          @change=${(e: Event) => set({ fallback: clamp(Number((e.target as HTMLInputElement).value) || 0, 0, 240) })} />
        min</label>`;
  }

  private _decision(day: CalendarPreviewDay) {
    const hass = this.hass;
    const d = day.decision;
    if (!d) {
      return day.normal
        ? html`${day.time ? html`<b>${formatTime(hass, day.time)}</b>` : nothing}<span class="tag">${t(hass, "calp_normal")}</span>`
        : html`<span class="muted">${t(hass, "calp_free")}</span>`;
    }
    const rule = d.rule >= 0 ? t(hass, "calp_rule", { n: d.rule + 1 }) : "";
    const what = d.summary ? `${rule} · ${d.summary}` : rule;
    switch (d.action) {
      case "skip":
        return html`<span class="tag skip">${t(hass, "calp_skip")}</span><span class="muted">${what}</span>`;
      case "alarm":
        return html`<span class="tag skip">${t(hass, "calp_alarm", { name: this.alarms.find((a) => a.id === d.alarm)?.name ?? "…" })}</span>
          <span class="muted">${what}</span>`;
      case "ring":
        return html`<span class="tag">${t(hass, "calp_ring", { name: this.alarms.find((a) => a.id === d.alarm)?.name ?? "…" })}</span>
          <span class="muted">${d.summary ?? ""}</span>`;
      default:
        return html`<b>${d.time ? formatTime(hass, d.time) : ""}</b><span class="muted">${what}${d.travel != null
          ? ` · ${t(hass, "calp_travel", { min: d.travel })}`
          : ""}</span>`;
    }
  }

  private _preview() {
    const hass = this.hass;
    const days = this.preview;
    return html`<div class="lbl">${t(hass, "calp_title")}</div>
      ${this.loading && !days ? html`<div class="muted">…</div>` : nothing}
      ${days
        ? html`<div class="days">
            ${days.map(
              (day) => html`<div class="day">
                <span>${formatDay(hass, day.date)}</span>
                <span class="what">
                  ${this._decision(day)}
                  ${day.events.length
                    ? html`<div class="ev">${day.events
                        .map((e) => (e.all_day ? e.summary : `${formatTime(hass, e.start)} ${e.summary}`))
                        .join(" · ")}</div>`
                    : nothing}
                </span>
              </div>`,
            )}
          </div>`
        : nothing}`;
  }

  render() {
    const hass = this.hass;
    const c = this.config;
    const travel = c.rules.some((r) => r.enabled && r.action === "before" && r.travel);
    return html`
      <div class="muted">${t(hass, "calr_hint")}</div>
      ${c.rules.map((r, i) => this._rule(r, i))}
      <div class="row">
        <button class="btn" @click=${() => {
          this._openRule = c.rules.length;
          this._rules([...c.rules, defaultCalendarRule()]);
        }}>＋ ${t(hass, "calr_add")}</button>
        ${TEMPLATES.map(
          (tpl) => html`<button class="chip"
            @click=${() => {
              this._openRule = c.rules.length;
              this._rules([...c.rules, { ...defaultCalendarRule(), ...tpl.rule, keywords: [t(hass, `${tpl.key}_w` as StringKey)] }]);
            }}>
            ＋ ${t(hass, tpl.key)}
          </button>`,
        )}
      </div>
      ${travel ? html`<div class="divider"></div>${this._travel()}` : nothing}
      ${c.rules.length ? html`<div class="divider"></div>${this._preview()}` : nothing}
    `;
  }
}

define("db-calendar-rules", DbCalendarRules);
