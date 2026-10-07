import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import type { CheckSample, DeviceValues, HistoryDevice, HistoryEntry, HistoryStep, HomeAssistant, Snapshot } from "../api";
import { t, type StringKey } from "../i18n";
import { shared } from "../styles";
import { define, formatDay, formatTime, localDate } from "../util";

/** Phases of a run, in order. */
const PHASES = ["prep", "sunrise", "wake", "end"] as const;
type Phase = (typeof PHASES)[number];

/** The phase a step belongs to; steps without one stay in the current phase. */
const STEP_PHASE: Record<string, Phase> = {
  checks: "prep",
  checks_failed: "prep",
  calendar: "prep",
  holiday_override: "prep",
  climate_wait: "prep",
  climate_start: "prep",
  climate_not_needed: "prep",
  presence: "prep",
  initial: "prep",
  skipped: "prep",
  cancelled: "prep",
  start: "sunrise",
  ring: "wake",
  ring_again: "wake",
  snooze: "wake",
  button: "wake",
  last_call: "wake",
  end: "end",
  restart: "end",
};

const ICONS: Record<string, string> = {
  checks: "🌦",
  checks_failed: "🌦",
  calendar: "📅",
  holiday_override: "📅",
  climate_wait: "🌡",
  climate_start: "🌡",
  climate_not_needed: "🌡",
  presence: "🏠",
  initial: "📋",
  skipped: "⏭",
  cancelled: "✖",
  start: "🌅",
  lights_missing: "💡",
  light_failed: "💡",
  music: "🎵",
  music_playing: "🎵",
  music_retry: "🎵",
  audio_failed: "🔇",
  push: "📱",
  actions: "⚙",
  actions_failed: "⚙",
  ring: "⏰",
  ring_again: "⏰",
  snooze: "💤",
  button: "🔘",
  last_call: "📢",
  end: "🏁",
  device: "🔌",
  restart: "🔄",
};

/** Rough colour of a colour temperature, for the lamp lanes. */
function kelvinColor(k: number): string {
  const x = Math.max(0, Math.min(1, (k - 1800) / (6500 - 1800)));
  const mix = (a: number, b: number) => Math.round(a + (b - a) * x);
  return `rgb(${mix(255, 220)},${mix(150, 232)},${mix(60, 255)})`;
}

type Status = "ok" | "warn" | "problem" | "skipped" | "planned" | "running" | "cancelled";
type Filter = "all" | "problem" | "skipped" | "test";

function status(entry: HistoryEntry): Status {
  if (entry.problem) return "problem";
  if (entry.result === "skipped" || entry.result === "planned" || entry.result === "running" || entry.result === "cancelled") {
    return entry.result;
  }
  return entry.warn ? "warn" : "ok";
}

function level(step: HistoryStep): "ok" | "info" | "warn" | "error" {
  return (step.level as "ok" | "info" | "warn" | "error" | undefined) ?? (step.ok ? "ok" : "error");
}

/**
 * History: all alarm runs (also skipped days and tests), newest first and
 * coloured by their outcome. Picking one shows its course as a time bar and
 * a flow of steps in plain words, with hints for problems.
 */
export class DbHistoryView extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) snapshot?: Snapshot;
  @property({ type: Boolean }) narrow = false;
  @state() private _sel?: string;
  @state() private _filter: Filter = "all";
  @state() private _alarm = "";
  /** Opened device tables ("entry|entity"). */
  @state() private _openDev: Record<string, boolean> = {};

  static styles = [
    shared,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 14px;
        --st-ok: #3cc864;
        --st-warn: #f0b429;
        --st-problem: var(--error-color, #e5534b);
        --st-skipped: #8a8f98;
        --st-planned: #5aa7e6;
        --st-running: #5aa7e6;
        --st-cancelled: #6b6f76;
      }
      .wrap {
        display: grid;
        grid-template-columns: minmax(260px, 360px) minmax(0, 1fr);
        gap: 16px;
        align-items: start;
      }
      .wrap.one {
        grid-template-columns: minmax(0, 1fr);
      }
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        font-size: 12px;
        color: var(--db-muted);
      }
      .legend span::before {
        content: "";
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 3px;
        margin-right: 5px;
        vertical-align: -1px;
        background: var(--c);
      }
      .list {
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .day {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--db-muted);
        padding: 10px 8px 4px;
      }
      .hrow {
        display: grid;
        grid-template-columns: 6px auto 1fr auto;
        gap: 10px;
        align-items: center;
        padding: 8px 10px 8px 0;
        border-radius: 12px;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
        overflow: hidden;
      }
      .hrow:hover {
        background: var(--db-tile);
      }
      .hrow[aria-current="true"] {
        background: color-mix(in srgb, var(--c) 16%, transparent);
      }
      .bar {
        align-self: stretch;
        border-radius: 0 4px 4px 0;
        background: var(--c);
      }
      .hrow.cancelled .bar {
        background: repeating-linear-gradient(180deg, var(--c) 0 4px, transparent 4px 8px);
      }
      .ico {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--c) 22%, transparent);
        font-size: 14px;
      }
      .rt {
        min-width: 0;
      }
      .rt b {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .rt .muted {
        display: block;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tm {
        font-variant-numeric: tabular-nums;
        font-weight: 600;
      }
      .test {
        font-size: 11px;
        padding: 1px 6px;
        border-radius: 999px;
        border: 1px solid #a67cff;
        color: #c9adff;
        margin-left: 6px;
      }
      .detail {
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .placeholder {
        padding: 40px 20px;
        text-align: center;
      }
      .banner {
        display: flex;
        gap: 14px;
        align-items: center;
        padding: 14px 16px;
        border-radius: 14px;
        background: color-mix(in srgb, var(--c) 16%, transparent);
        border: 1px solid color-mix(in srgb, var(--c) 45%, transparent);
      }
      .banner .big {
        font-size: 26px;
      }
      .banner h2 {
        margin: 0;
        font-size: 18px;
      }
      /* time bar */
      .tl {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .track {
        position: relative;
        height: 22px;
        border-radius: 11px;
        background: var(--db-tile);
        overflow: hidden;
      }
      .tseg {
        position: absolute;
        top: 0;
        bottom: 0;
      }
      .tseg.prep {
        background: #5a7fa8;
      }
      .tseg.sunrise {
        background: linear-gradient(90deg, #6b2a17, #e0763b, #ffd08a);
      }
      .tseg.ring {
        background: #ff8a4c;
      }
      .tseg.snooze {
        background: #8a63d2;
      }
      .tseg.last {
        background: #e05a5a;
      }
      .mark {
        position: absolute;
        top: 3px;
        width: 16px;
        height: 16px;
        margin-left: -8px;
        border-radius: 50%;
        background: var(--st-problem);
        border: 2px solid var(--db-bg);
      }
      .mark.warn {
        background: var(--st-warn);
      }
      .ticks {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: var(--db-muted);
        font-variant-numeric: tabular-nums;
      }
      /* flow */
      .phase {
        display: flex;
        flex-direction: column;
      }
      .ph {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        margin-bottom: 6px;
      }
      .ph .n {
        display: inline-grid;
        place-items: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--db-tile);
        font-size: 12px;
      }
      .ph .muted {
        font-weight: 400;
        font-size: 12px;
      }
      .node {
        display: grid;
        grid-template-columns: 40px 1fr;
        gap: 10px;
      }
      .rail {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .dot {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: 15px;
        background: color-mix(in srgb, var(--c) 22%, var(--db-bg));
        border: 2px solid var(--c);
        flex: none;
      }
      .line {
        width: 2px;
        flex: 1;
        min-height: 10px;
        background: var(--db-line);
      }
      .body {
        padding: 4px 0 14px;
        min-width: 0;
      }
      .body .when {
        font-size: 12px;
        color: var(--db-muted);
        font-variant-numeric: tabular-nums;
      }
      .body .title {
        font-weight: 600;
      }
      .body .text {
        color: var(--db-muted);
        overflow-wrap: anywhere;
      }
      .help {
        margin-top: 8px;
        padding: 10px 12px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--c) 12%, transparent);
        border-left: 3px solid var(--c);
        font-size: 13px;
      }
      .help b {
        display: block;
        margin-bottom: 2px;
      }
      .lanes {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .lane {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .lh {
        display: flex;
        gap: 10px;
        align-items: baseline;
        border: none;
        background: none;
        color: inherit;
        font: inherit;
        padding: 0;
        text-align: left;
        cursor: pointer;
      }
      .lh span:first-child {
        font-weight: 600;
      }
      .lh span:nth-child(2) {
        flex: 1;
        font-size: 12px;
      }
      .ltrack {
        position: relative;
        height: 16px;
        border-radius: 8px;
        background: var(--db-tile);
        overflow: hidden;
      }
      .lseg {
        position: absolute;
        top: 0;
        bottom: 0;
      }
      .ldot {
        position: absolute;
        top: 4px;
        width: 8px;
        height: 8px;
        margin-left: -4px;
        border-radius: 50%;
        background: #5a7fa8;
      }
      .ldot.warn {
        background: var(--st-warn);
      }
      .lcmd,
      .lout {
        position: absolute;
        top: 0;
        width: 2px;
        height: 16px;
        margin-left: -1px;
        background: #fff;
        opacity: 0.85;
      }
      .lout {
        background: #c77dff;
        width: 3px;
        opacity: 1;
      }
      .slow {
        color: var(--st-warn);
      }
      .bad {
        color: var(--st-problem);
        font-weight: 600;
      }
      .dtab {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        font-variant-numeric: tabular-nums;
      }
      .dtab th,
      .dtab td {
        text-align: left;
        padding: 4px 6px;
        border-bottom: 1px solid var(--db-line);
        vertical-align: top;
      }
      .dtab th {
        color: var(--db-muted);
        font-weight: 500;
      }
      .dtab tr.cmd td {
        color: var(--db-muted);
      }
      .dtab tr.out td {
        color: #d4b3ff;
      }
      .dtab-wrap {
        overflow-x: auto;
      }
      .facts {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: 2px 12px;
        margin: 6px 0 0;
        padding: 8px 10px;
        border-radius: 10px;
        background: var(--db-tile);
        font-size: 12px;
      }
      .facts dt {
        color: var(--db-muted);
      }
      .facts dd {
        margin: 0;
        overflow-wrap: anywhere;
      }
      @media (max-width: 800px) {
        .wrap {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ];

  // ------------------------------------------------------------ helpers

  private _color(s: Status | "ok" | "info" | "warn" | "error"): string {
    const map: Record<string, string> = {
      ok: "var(--st-ok)",
      info: "var(--st-planned)",
      warn: "var(--st-warn)",
      error: "var(--st-problem)",
      problem: "var(--st-problem)",
      skipped: "var(--st-skipped)",
      planned: "var(--st-planned)",
      running: "var(--st-running)",
      cancelled: "var(--st-cancelled)",
    };
    return map[s];
  }

  private _icon(s: Status): string {
    return { ok: "✓", warn: "!", problem: "⚠", skipped: "⏭", planned: "🕑", running: "▶", cancelled: "✖" }[s];
  }

  private _time(entry: HistoryEntry, iso: string, seconds = entry.test) {
    const hass = this.hass;
    if (!seconds) return formatTime(hass, iso);
    return `${formatTime(hass, iso)}:${String(new Date(iso).getSeconds()).padStart(2, "0")}`;
  }

  private _dayLabel(iso: string): string {
    const hass = this.hass;
    const day = localDate(hass, new Date(iso));
    const today = localDate(hass);
    const yesterday = localDate(hass, new Date(Date.now() - 86400000));
    if (day === today) return t(hass, "hx_today");
    if (day === yesterday) return t(hass, "hx_yesterday");
    return formatDay(hass, day);
  }

  private get _entries(): HistoryEntry[] {
    const all = [...(this.snapshot?.history ?? [])].sort((a, b) => (b.started ?? "").localeCompare(a.started ?? ""));
    return all.filter((e) => {
      if (this._alarm && e.alarm_id !== this._alarm) return false;
      if (this._filter === "problem") return status(e) === "problem" || status(e) === "warn";
      if (this._filter === "skipped") return e.result === "skipped" || e.result === "cancelled";
      if (this._filter === "test") return e.test;
      return true;
    });
  }

  /** One line under the name in the list. */
  private _short(entry: HistoryEntry): string {
    const hass = this.hass;
    const steps = entry.steps;
    const snoozes = steps.filter((s) => s.step === "snooze").length;
    const end = steps.find((s) => s.step === "end");
    const skip = steps.find((s) => s.step === "skipped");
    const problems = steps.filter((s) => level(s) === "error").length;
    const parts: string[] = [];
    if (skip) parts.push(this._skipText(skip));
    else if (entry.result === "planned") parts.push(t(hass, "hx_s_planned"));
    else if (entry.result === "running") parts.push(t(hass, "hx_s_running"));
    else if (entry.result === "cancelled") parts.push(t(hass, "hx_s_cancelled"));
    else if (entry.result === "interrupted") parts.push(t(hass, "hx_restart_t"));
    if (snoozes) parts.push(t(hass, "hx_s_snoozed", { n: snoozes }));
    if (end) parts.push(t(hass, `hx_end_${end.reason ?? "stopped"}_s` as StringKey));
    if (problems) parts.push(t(hass, "hx_s_problems", { n: problems }));
    return parts.join(" · ");
  }

  private _skipText(step: HistoryStep): string {
    return t(this.hass, `hx_skip_${step.reason ?? "away"}` as StringKey, {
      detail: step.detail ?? "",
      rule: step.rule ?? "",
      other: step.other ?? "",
    });
  }

  // -------------------------------------------------------------- texts

  /** Title, plain explanation and (for problems) what to do. */
  private _describe(entry: HistoryEntry, step: HistoryStep): { title: string; text: string; help?: string } {
    const hass = this.hass;
    const k = step.step;
    const v = (key: string, values: Record<string, string | number> = {}) => t(hass, key as StringKey, values);
    switch (k) {
      case "checks": {
        const found: string[] = [];
        if (step.weather) {
          const key = `hx_wx_${step.weather}`;
          const w = v(key);
          found.push(v("hx_checks_weather", { w: w === key ? step.weather : w }));
        }
        if (step.temperature != null) found.push(`${step.temperature} °C`);
        if (step.warning) found.push(v("hx_checks_warning", { n: step.warning }));
        if (step.travel != null) found.push(v("hx_checks_travel", { min: step.travel }));
        const reasons = (step.reasons ?? []).map((r) => v(`hx_reason_${r}`)).join(", ");
        return {
          title: v("hx_checks_t"),
          text: `${found.join(" · ") || v("hx_checks_none")} → ${
            step.minutes ? v("hx_checks_earlier", { min: step.minutes, why: reasons }) : v("hx_checks_same")
          }`,
        };
      }
      case "calendar": {
        const what =
          step.action === "time"
            ? v("hx_cal_time", { time: step.time ? formatTime(hass, step.time) : "" })
            : step.action === "ring"
              ? v("hx_cal_ring", { other: step.other ?? "" })
              : v("hx_cal_other");
        return {
          title: v("hx_calendar_t"),
          text: v("hx_calendar_d", { detail: step.detail ?? "", what, rule: step.rule ?? "" }) +
            (step.travel != null ? ` ${v("hx_checks_travel", { min: step.travel })}` : ""),
        };
      }
      case "climate_wait":
        return {
          title: v("hx_climate_wait_t"),
          text: v(`hx_climate_wait_${step.reason ?? "window"}`, { outdoor: step.outdoor ?? "?" }),
        };
      case "climate_start":
        return {
          title: v("hx_climate_start_t"),
          text: v("hx_climate_start_d", {
            mode: v(`clm_${step.mode ?? "heat"}`),
            target: step.target ?? "",
            lead: step.lead ?? 0,
            how: v(step.learned ? "hx_learned" : "hx_fixed"),
          }) + (step.paused ? ` ${v("hx_climate_paused")}` : ""),
        };
      case "climate_not_needed":
        return {
          title: v("hx_climate_not_needed_t"),
          text: step.room != null ? v("hx_climate_not_needed_d", { room: step.room }) : v("hx_climate_not_needed_x"),
        };
      case "initial":
        return { title: v("hx_initial_t"), text: v("hx_initial_d", { n: step.snapshot?.length ?? 0 }) };
      case "presence":
        return { title: v("hx_presence_t"), text: v("hx_presence_d", { who: step.detail || "?" }) };
      case "skipped":
        return {
          title: v("hx_skipped_t"),
          text: this._skipText(step),
          help: step.reason === "away" ? v("hx_skip_away_h") : undefined,
        };
      case "start":
        return {
          title: v(step.lights ? "hx_start_t" : "hx_start_nolight_t"),
          text: [
            step.lights ? v("hx_start_d", { n: step.lights }) : "",
            step.shift ? v("hx_start_shift", { min: step.shift }) : "",
            entry.test ? v("hx_start_test", { s: entry.speed ? 60 / entry.speed : 60 }) : "",
          ]
            .filter(Boolean)
            .join(" "),
        };
      case "music":
        return { title: v("hx_music_t"), text: v("hx_music_d", { n: step.players ?? 1 }) };
      case "music_playing":
        return { title: v("hx_music_playing_t"), text: step.source ?? "" };
      case "music_retry":
        return { title: v("hx_music_retry_t"), text: v("hx_music_retry_d", { src: step.source ?? "" }), help: v("hx_music_retry_h") };
      case "audio_failed":
        return { title: v("hx_audio_failed_t"), text: step.detail ?? "", help: v("hx_audio_failed_h") };
      case "lights_missing":
      case "light_failed":
        return { title: v(`hx_${k}_t`), text: step.detail ?? "", help: v("hx_light_h") };
      case "push":
        return { title: v("hx_push_t"), text: v(`hx_push_${step.kind ?? "ring"}`) };
      case "actions":
        return { title: v("hx_actions_t"), text: v("hx_actions_d", { phase: v(`phase_${step.phase ?? "wake"}`), n: step.count ?? 1 }) };
      case "actions_failed":
        return { title: v("hx_actions_failed_t"), text: step.detail ?? "", help: v("hx_actions_h") };
      case "checks_failed":
        return { title: v("hx_checks_failed_t"), text: step.detail ?? "", help: v("hx_checks_h") };
      case "device": {
        const word = (x?: string | null) => {
          const key = `hx_st_${x ?? "unknown"}`;
          const w = v(key);
          return w === key ? x ?? "?" : w;
        };
        return {
          title: `${step.domain === "media_player" ? "🔊" : "💡"} ${step.name ?? ""}: ${word(step.old)} → ${word(step.new)}`,
          text: v(step.by === "daybreak" ? "hx_by_daybreak" : "hx_by_outside"),
        };
      }
      case "snooze":
        return { title: v("hx_snooze_t"), text: v("hx_snooze_d", { min: step.minutes ?? 0, n: step.count ?? 1 }) };
      case "last_call":
        return { title: v("hx_last_call_t"), text: v("hx_last_call_d", { profile: step.profile ?? "" }) };
      case "end":
        return { title: v(`hx_end_${step.reason ?? "stopped"}`), text: v(`hx_end_${step.reason ?? "stopped"}_d`) };
      default:
        return { title: v(`hx_${k}_t`), text: v(`hx_${k}_d`) };
    }
  }

  private _headline(entry: HistoryEntry): { title: string; text: string } {
    const hass = this.hass;
    const s = status(entry);
    const steps = entry.steps;
    const problems = steps.filter((x) => level(x) === "error").length;
    const ring = steps.find((x) => x.step === "ring");
    const end = steps.find((x) => x.step === "end");
    const snoozes = steps.filter((x) => x.step === "snooze").length;
    const parts = [t(hass, "hx_sum_alarm", { time: formatTime(hass, entry.alarm_time) })];
    if (ring) parts.push(t(hass, "hx_sum_rang", { time: this._time(entry, ring.t) }));
    if (snoozes) parts.push(t(hass, "hx_s_snoozed", { n: snoozes }));
    if (end) {
      parts.push(t(hass, "hx_sum_end", { time: this._time(entry, end.t) }));
      const start = steps.find((x) => x.step === "start");
      if (start) {
        const min = Math.round((Date.parse(end.t) - Date.parse(start.t)) / 60000);
        if (min > 0) parts.push(t(hass, "hx_sum_duration", { min }));
      }
    }
    const skip = steps.find((x) => x.step === "skipped");
    const title =
      s === "problem"
        ? t(hass, "hx_h_problem", { n: problems })
        : entry.result === "interrupted"
          ? t(hass, "hx_restart_t")
          : s === "skipped" && skip
            ? t(hass, "hx_h_skipped")
          : t(hass, `hx_h_${s}` as StringKey);
    return { title, text: skip ? this._skipText(skip) : parts.join(" · ") };
  }

  // ------------------------------------------------------------- graphic

  /** Common time axis of the steps and all device samples. */
  private _range(entry: HistoryEntry): [number, number] {
    const times = [
      ...entry.steps.map((s) => Date.parse(s.t)),
      ...Object.values(entry.devices ?? {}).flatMap((d) => d.log.map((x) => Date.parse(x.t))),
      ...(entry.checks_log ?? []).map((c) => Date.parse(c.t)),
    ];
    const from = Math.min(...times);
    return [from, Math.max(...times, from + 1000)];
  }

  /** Colour of a device state on its lane. */
  private _laneColor(dev: HistoryDevice, a: DeviceValues): string {
    if (a.s === "unavailable" || a.s === "missing") return "repeating-linear-gradient(45deg,var(--st-problem) 0 4px,transparent 4px 8px)";
    if (dev.domain === "light") {
      if (a.s !== "on") return "#3a3a3a";
      const base = a.c ?? (a.k ? kelvinColor(a.k) : "#ffd08a");
      return `color-mix(in srgb, ${base} ${Math.max(15, a.b ?? 100)}%, #222)`;
    }
    if (dev.domain === "media_player") return a.s === "playing" ? "#3cc864" : a.s === "buffering" ? "#9bd99f" : "#3a3a3a";
    if (dev.domain === "climate") return a.s === "heat" ? "#ff8a4c" : a.s === "cool" ? "#5aa7e6" : a.s === "off" ? "#3a3a3a" : "#c9a3ff";
    return a.s === "on" ? "#ffb547" : "#3a3a3a";
  }

  /** Parallel lanes: one per lamp, speaker or climate device, on the same time axis. */
  private _lanes(entry: HistoryEntry) {
    const hass = this.hass;
    const devices = Object.entries(entry.devices ?? {});
    const checks = entry.checks_log ?? [];
    if (!devices.length && !checks.length) return nothing;
    const [from, to] = this._range(entry);
    const pos = (ms: number) => ((ms - from) / (to - from)) * 100;
    const end = entry.result === "running" ? Math.min(Date.now(), to) : to;
    return html`<div class="lanes">
      <div class="lbl">${t(hass, "hx_devices")}</div>
      <div class="muted">${t(hass, "hx_devices_hint")}</div>
      ${checks.length ? this._checksLane(entry, checks, pos) : nothing}
      ${devices.map(([id, dev]) => {
        const states = dev.log.filter((x) => !x.cmd);
        const cmds = dev.log.filter((x) => x.cmd);
        const slow = states.filter((x) => (x.lat ?? 0) >= 5).length;
        const open = this._openDev[`${entry.id}|${id}`];
        return html`<div class="lane">
          <button class="lh" aria-expanded=${!!open} @click=${() => (this._openDev = { ...this._openDev, [`${entry.id}|${id}`]: !open })}>
            <span>${dev.domain === "media_player" ? "🔊" : dev.domain === "light" ? "💡" : "🌡"} ${dev.name}</span>
            <span class="muted">${t(hass, "hx_dev_sum", { s: states.length, c: cmds.length })}${slow ? html` · <b class="slow">${t(hass, "hx_dev_slow", { n: slow })}</b>` : nothing}</span>
            <span class="muted">${open ? "▴" : "▾"}</span>
          </button>
          <div class="ltrack">
            ${states.map((x, i) => {
              const a = Date.parse(x.t);
              const b = i + 1 < states.length ? Date.parse(states[i + 1].t) : end;
              return html`<span class="lseg" title=${`${this._time(entry, x.t, true)} ${this._values(dev, x.a)}`}
                style="left:${pos(a)}%;width:${Math.max(0.6, pos(b) - pos(a))}%;background:${this._laneColor(dev, x.a)}"></span>`;
            })}
            ${cmds.map((x) => html`<span class="lcmd" style="left:${pos(Date.parse(x.t))}%" title=${`${this._time(entry, x.t, true)} ${x.cmd}`}></span>`)}
            ${states.filter((x) => x.by === "outside").map((x) => html`<span class="lout" style="left:${pos(Date.parse(x.t))}%" title=${t(hass, "hx_by_outside")}></span>`)}
          </div>
          ${open ? this._devTable(entry, dev) : nothing}
        </div>`;
      })}
      <div class="legend">
        <span style="--c:#fff">${t(hass, "hx_lg_cmd")}</span>
        <span style="--c:#c77dff">${t(hass, "hx_lg_outside")}</span>
        <span style="--c:var(--st-problem)">${t(hass, "hx_lg_unavail")}</span>
      </div>
    </div>`;
  }

  /** One dot per weather/travel check before the start; yellow = alarm moved earlier. */
  private _checksLane(entry: HistoryEntry, checks: CheckSample[], pos: (ms: number) => number) {
    const hass = this.hass;
    const key = `${entry.id}|checks`;
    const open = this._openDev[key];
    const first = checks[0];
    const last = checks[checks.length - 1];
    const vals = (c: CheckSample) =>
      [
        c.weather ? this._weather(c.weather) : "",
        c.temperature != null ? `${c.temperature} °C` : "",
        c.warning ? t(hass, "hx_checks_warning", { n: c.warning }) : "",
        c.travel != null ? t(hass, "hx_checks_travel", { min: c.travel }) : "",
      ]
        .filter(Boolean)
        .join(" · ");
    return html`<div class="lane">
      <button class="lh" aria-expanded=${!!open} @click=${() => (this._openDev = { ...this._openDev, [key]: !open })}>
        <span>🌦 ${t(hass, "hx_checks_lane")}</span>
        <span class="muted">${t(hass, "hx_checks_sum", {
          n: checks.length,
          from: this._time(entry, first.t),
          to: this._time(entry, last.t),
        })}</span>
        <span class="muted">${open ? "▴" : "▾"}</span>
      </button>
      <div class="ltrack">
        ${checks.map(
          (c) => html`<span class="ldot ${c.minutes ? "warn" : ""}" style="left:${pos(Date.parse(c.t))}%"
            title=${`${this._time(entry, c.t)} ${vals(c)} → ${c.minutes ? `−${c.minutes} min` : "±0"}`}></span>`,
        )}
      </div>
      ${open
        ? html`<div class="dtab-wrap"><table class="dtab">
            <thead><tr><th>${t(hass, "hx_col_time")}</th><th>${t(hass, "hx_col_values")}</th><th>${t(hass, "hx_col_result")}</th></tr></thead>
            <tbody>${checks.map(
              (c) => html`<tr><td>${this._time(entry, c.t)}</td><td>${vals(c) || "–"}</td>
                <td class=${c.minutes ? "slow" : ""}>${c.minutes ? t(hass, "hx_checks_earlier", { min: c.minutes, why: "" }).replace(" ()", "") : t(hass, "hx_checks_same")}</td></tr>`,
            )}</tbody></table></div>`
        : nothing}
    </div>`;
  }

  private _weather(w: string): string {
    const key = `hx_wx_${w}`;
    const text = t(this.hass, key as StringKey);
    return text === key ? w : text;
  }

  /** Readable values: "on · 45 % · 2700 K" */
  private _values(dev: HistoryDevice, a: DeviceValues | undefined): string {
    if (!a) return "";
    const hass = this.hass;
    const parts: string[] = [];
    if (a.s) {
      const key = `hx_st_${a.s}`;
      const w = t(hass, key as StringKey);
      parts.push(w === key ? a.s : w);
    }
    if (a.b != null) parts.push(`${a.b} %`);
    if (a.k != null) parts.push(`${a.k} K`);
    if (a.c) parts.push(a.c);
    if (a.v != null) parts.push(t(hass, "hx_v_volume", { v: a.v }));
    if (a.m) parts.push(`„${a.m}“`);
    if (a.tt != null) parts.push(t(hass, "hx_v_target", { v: a.tt }));
    if (a.ct != null) parts.push(t(hass, "hx_v_current", { v: a.ct }));
    if (a.a) parts.push(a.a);
    if (a.p != null) parts.push(`${a.p} %`);
    if (a.h != null) parts.push(`${a.h} % rH`);
    if (a.tr != null) parts.push(t(hass, "hx_v_transition", { v: a.tr }));
    return parts.join(" · ") || "–";
  }

  /** Changes only: "45 % → 60 %, 2700 K → 3000 K" */
  private _diff(dev: HistoryDevice, before: DeviceValues | undefined, after: DeviceValues): string {
    if (!before) return this._values(dev, after);
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]) as Set<keyof DeviceValues>;
    const out: string[] = [];
    for (const k of keys) {
      if (before[k] === after[k]) continue;
      out.push(`${this._values(dev, { [k]: before[k] } as DeviceValues) || "–"} → ${this._values(dev, { [k]: after[k] } as DeviceValues) || "–"}`);
    }
    return out.join(", ") || this._values(dev, after);
  }

  private _devTable(entry: HistoryEntry, dev: HistoryDevice) {
    const hass = this.hass;
    let prev: DeviceValues | undefined;
    let lastCmd: number | null = null;
    const rows = dev.log.map((x, i) => {
      if (x.cmd) {
        // "No reaction" only when the device changed later but never because of
        // DayBreak within 30 s (a command that changes nothing has no answer).
        const at = Date.parse(x.t);
        const later = dev.log.slice(i + 1).filter((y) => !y.cmd);
        const answered =
          !later.length ||
          later.some((y) => y.by === "daybreak" && Date.parse(y.t) - at <= 30000) ||
          !later.some((y) => Date.parse(y.t) - at > 30000) ||
          JSON.stringify(x.a) === "{}";
        lastCmd = Date.parse(x.t);
        return html`<tr class="cmd"><td>${this._time(entry, x.t, true)}</td><td>➜ ${t(hass, "hx_cmd")}</td>
          <td>${x.cmd} · ${this._values(dev, x.a)}</td><td>${answered ? "" : html`<span class="slow">${t(hass, "hx_no_answer")}</span>`}</td></tr>`;
      }
      const row = html`<tr class=${x.by === "outside" ? "out" : ""}><td>${this._time(entry, x.t, true)}</td>
        <td>${x.by === "before" ? t(hass, "hx_before") : x.by === "daybreak" ? t(hass, "hx_by_db_short") : t(hass, "hx_by_out_short")}</td>
        <td>${x.by === "before" ? this._values(dev, x.a) : this._diff(dev, prev, x.a)}</td>
        <td>${x.lat != null
          ? html`<span class=${x.lat >= 15 ? "bad" : x.lat >= 5 ? "slow" : ""}>${t(hass, "hx_lat", { s: x.lat.toLocaleString() })}</span>`
          : nothing}</td></tr>`;
      prev = x.a;
      return row;
    });
    void lastCmd;
    return html`<div class="dtab-wrap"><table class="dtab">
      <thead><tr><th>${t(hass, "hx_col_time")}</th><th>${t(hass, "hx_col_what")}</th><th>${t(hass, "hx_col_change")}</th><th>${t(hass, "hx_col_reaction")}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
  }

  /** Details of a step as label/value pairs (entities, values, what was recognised). */
  private _facts(entry: HistoryEntry, step: HistoryStep): [string, string][] {
    const hass = this.hass;
    const f: [string, string][] = [];
    const add = (key: string, value: unknown) => {
      if (value === null || value === undefined || value === "" || (Array.isArray(value) && !value.length)) return;
      f.push([t(hass, `hx_f_${key}` as StringKey), String(value)]);
    };
    switch (step.step) {
      case "calendar":
        add("calendar", step.calendar);
        add("event", step.detail);
        add("event_start", step.all_day ? t(hass, "hx_all_day") : step.event_start ? formatTime(hass, step.event_start) : null);
        add("location", step.location);
        add("keywords", step.keywords?.map((w) => `„${w}“`).join(step.match === "all" ? " + " : " / "));
        add("found", step.found?.map((w) => `„${w}“`).join(", "));
        add("before_min", step.before != null ? `${step.before} min` : null);
        add("travel", step.travel != null ? `${step.travel} min` : null);
        add("result_time", step.time ? formatTime(hass, step.time) : null);
        break;
      case "checks":
        add("weather_entity", step.weather_entity);
        add("travel_entity", step.travel_entity);
        add("usual", step.usual != null ? `${step.usual} min` : null);
        add("parts", step.parts?.map((p) => `${t(hass, `hx_reason_${p.reason}` as StringKey)} −${p.minutes} min`).join(", "));
        add("combine", step.combine ? t(hass, `hx_combine_${step.combine}` as StringKey) : null);
        add("limit", step.limit != null ? `${step.limit} min` : null);
        break;
      case "presence":
      case "skipped":
      case "climate_wait":
        add("entities", step.states?.map((x) => `${x.name}: ${this._values({ domain: "", name: "", log: [] }, { s: x.state })}`).join(", "));
        add("outdoor", step.outdoor != null ? `${step.outdoor} °C` : null);
        add("limit_below", step.limit_below != null ? `${step.limit_below} °C` : null);
        add("limit_above", step.limit_above != null ? `${step.limit_above} °C` : null);
        break;
      case "initial":
        for (const d of step.snapshot ?? []) {
          f.push([d.name, this._values({ domain: d.domain, name: d.name, log: [] }, d.a)]);
        }
        break;
      case "climate_start":
      case "climate_not_needed":
        add("room", step.room != null ? `${step.room} °C` : null);
        add("target", step.target != null ? `${step.target} °C` : null);
        add("outdoor", step.outdoor != null ? `${step.outdoor} °C` : null);
        add("samples", step.samples || null);
        add("skipped_devices", step.skipped?.join(", "));
        break;
    }
    return f;
  }

  /** Time bar: preparation, sunrise, ringing, snoozes and last call, problems as dots. */
  private _timeBar(entry: HistoryEntry) {
    const steps = entry.steps;
    if (steps.length < 2) return nothing;
    const [from, to] = this._range(entry);
    const pos = (ms: number) => ((ms - from) / (to - from)) * 100;
    const segs: { cls: string; a: number; b: number }[] = [];
    let cur: { cls: string; at: number } | null = null;
    const open = (cls: string, at: number) => {
      if (cur) segs.push({ cls: cur.cls, a: cur.at, b: at });
      cur = { cls, at };
    };
    for (const s of steps) {
      const at = Date.parse(s.t);
      const phase = STEP_PHASE[s.step];
      if (phase === "prep" && !cur) open("prep", at);
      else if (s.step === "start") open("sunrise", at);
      else if (s.step === "ring" || s.step === "ring_again") open("ring", at);
      else if (s.step === "snooze") open("snooze", at);
      else if (s.step === "last_call") open("last", at);
      else if (s.step === "end" && cur) {
        segs.push({ cls: (cur as { cls: string }).cls, a: (cur as { at: number }).at, b: at });
        cur = null;
      }
    }
    if (cur) segs.push({ cls: (cur as { cls: string }).cls, a: (cur as { at: number }).at, b: entry.result === "running" ? Date.now() : to });
    const marks = steps.filter((s) => level(s) === "error" || level(s) === "warn");
    const hass = this.hass;
    return html`<div class="tl">
      <div class="track">
        ${segs.map(
          (g) => html`<span class="tseg ${g.cls}" style="left:${pos(g.a)}%;width:${Math.max(0.8, pos(Math.min(g.b, to)) - pos(g.a))}%"></span>`,
        )}
        ${marks.map(
          (m) => html`<span class="mark ${level(m) === "warn" ? "warn" : ""}" style="left:${pos(Date.parse(m.t))}%"
            title=${this._describe(entry, m).title}></span>`,
        )}
      </div>
      <div class="ticks"><span>${this._time(entry, new Date(from).toISOString())}</span>
        <span>${this._time(entry, new Date(to).toISOString())}</span></div>
      <div class="legend">
        ${(["prep", "sunrise", "ring", "snooze", "last"] as const)
          .filter((c) => segs.some((g) => g.cls === c))
          .map((c) => html`<span style="--c:${{ prep: "#5a7fa8", sunrise: "#e0763b", ring: "#ff8a4c", snooze: "#8a63d2", last: "#e05a5a" }[c]}">${t(hass, `hx_seg_${c}` as StringKey)}</span>`)}
        ${marks.length ? html`<span style="--c:var(--st-problem)">${t(hass, "hx_seg_problem")}</span>` : nothing}
      </div>
    </div>`;
  }

  /** Flow: phases with their steps, each in plain words; problems with help. */
  private _flow(entry: HistoryEntry) {
    const hass = this.hass;
    const groups: { phase: Phase; steps: HistoryStep[] }[] = [];
    let current: Phase = "prep";
    for (const step of entry.steps) {
      const natural = STEP_PHASE[step.step];
      if (natural && PHASES.indexOf(natural) > PHASES.indexOf(current)) current = natural;
      const last = groups[groups.length - 1];
      if (last && last.phase === current) last.steps.push(step);
      else groups.push({ phase: current, steps: [step] });
    }
    const all = groups.flatMap((g) => g.steps);
    return groups.map(
      (g) => html`<div class="phase">
        <div class="ph"><span class="n">${PHASES.indexOf(g.phase) + 1}</span>${t(hass, `hx_ph_${g.phase}` as StringKey)}
          <span class="muted">${t(hass, `hx_ph_${g.phase}_d` as StringKey)}</span></div>
        ${g.steps.map((step) => {
          const d = this._describe(entry, step);
          const lv = level(step);
          const lastStep = step === all[all.length - 1];
          const help: TemplateResult | typeof nothing =
            d.help && (lv === "error" || lv === "warn")
              ? html`<div class="help" style="--c:${this._color(lv)}"><b>${t(hass, "hx_what_to_do")}</b>${d.help}</div>`
              : nothing;
          return html`<div class="node" style="--c:${this._color(lv)}">
            <div class="rail"><span class="dot">${lv === "error" ? "⚠" : ICONS[step.step] ?? "•"}</span>${lastStep ? nothing : html`<span class="line"></span>`}</div>
            <div class="body">
              <div class="when">${this._time(entry, step.t)}</div>
              <div class="title">${d.title}</div>
              ${d.text ? html`<div class="text">${d.text}</div>` : nothing}
              ${(() => {
                const facts = this._facts(entry, step);
                return facts.length
                  ? html`<dl class="facts">${facts.map(([k, v]) => html`<dt>${k}</dt><dd>${v}</dd>`)}</dl>`
                  : nothing;
              })()}
              ${help}
            </div>
          </div>`;
        })}
      </div>`,
    );
  }

  // --------------------------------------------------------------- render

  private _list(entries: HistoryEntry[]) {
    const hass = this.hass;
    let day = "";
    return html`<section class="card list">
      ${entries.length
        ? entries.map((e) => {
            const s = status(e);
            const label = this._dayLabel(e.started ?? e.alarm_time);
            const head = label !== day ? html`<div class="day">${label}</div>` : nothing;
            day = label;
            return html`${head}<button class="hrow ${s}" style="--c:${this._color(s)}" aria-current=${this._sel === e.id}
              @click=${() => (this._sel = e.id)}>
              <span class="bar"></span>
              <span class="ico">${this._icon(s)}</span>
              <span class="rt"><b>${e.name}${e.test ? html`<span class="test">🧪 ${t(hass, "hs_test")}</span>` : nothing}</b>
                <span class="muted">${this._short(e) || t(hass, `hx_h_${s}` as StringKey)}</span></span>
              <span class="tm">${formatTime(hass, e.alarm_time)}</span>
            </button>`;
          })
        : html`<div class="placeholder muted">${t(hass, "hs_empty")}</div>`}
    </section>`;
  }

  private _detail(entry: HistoryEntry | undefined) {
    const hass = this.hass;
    if (!entry) return html`<section class="card placeholder muted">👈 ${t(hass, "hx_pick")}</section>`;
    const s = status(entry);
    const head = this._headline(entry);
    return html`<section class="card detail">
      ${this.narrow ? html`<button class="btn" @click=${() => (this._sel = undefined)}>← ${t(hass, "hx_back")}</button>` : nothing}
      <div class="banner" style="--c:${this._color(s)}">
        <span class="big">${this._icon(s)}</span>
        <div>
          <h2>${head.title}</h2>
          <div><b>${entry.name}</b>${entry.test ? html`<span class="test">🧪 ${t(hass, "hs_test")}</span>` : nothing}
            · ${formatDay(hass, entry.started ?? entry.alarm_time)}</div>
          <div class="muted">${head.text}</div>
        </div>
      </div>
      ${this._timeBar(entry)}
      ${this._lanes(entry)}
      <div>${this._flow(entry)}</div>
    </section>`;
  }

  render() {
    const hass = this.hass;
    const entries = this._entries;
    const selected = entries.find((e) => e.id === this._sel);
    const alarms = [...new Map((this.snapshot?.history ?? []).map((e) => [e.alarm_id, e.name])).entries()];
    const single = this.narrow && !!selected;
    return html`
      <div class="muted">${t(hass, "hx_hint")}</div>
      ${single
        ? nothing
        : html`<div class="filters">
            <div class="seg" role="group">
              ${(["all", "problem", "skipped", "test"] as const).map(
                (f) => html`<button aria-pressed=${this._filter === f} @click=${() => (this._filter = f)}>${t(hass, `hx_f_${f}` as StringKey)}</button>`,
              )}
            </div>
            ${alarms.length > 1
              ? html`<select class="inp" @change=${(e: Event) => (this._alarm = (e.target as HTMLSelectElement).value)}>
                  <option value="">${t(hass, "hx_all_alarms")}</option>
                  ${alarms.map(([id, name]) => html`<option value=${id} ?selected=${this._alarm === id}>${name}</option>`)}
                </select>`
              : nothing}
          </div>
          <div class="legend">
            ${(["ok", "warn", "problem", "skipped", "planned"] as const).map(
              (s) => html`<span style="--c:${this._color(s)}">${t(hass, `hx_l_${s}` as StringKey)}</span>`,
            )}
          </div>`}
      <div class="wrap ${this.narrow ? "one" : ""}">
        ${single ? nothing : this._list(entries)}
        ${this.narrow && !selected ? nothing : this._detail(selected)}
      </div>
    `;
  }
}

define("db-history-view", DbHistoryView);
