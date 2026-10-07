import { LitElement, css, html, nothing, svg } from "lit";
import { property, state } from "lit/decorators.js";
import type { DeviceValues, EditorMode, HistoryCommand, HistoryEntry, HomeAssistant } from "../api";
import { t, type StringKey } from "../i18n";
import { shared } from "../styles";
import { define, formatTime } from "../util";

/** A point of the run shown on the "course" row (a step of the history). */
export interface ChartMarker {
  t: string;
  /** Step name ("start", "ring", ...). */
  step: string;
  icon: string;
  label: string;
  level: "ok" | "info" | "warn" | "error";
  phase: "prep" | "sunrise" | "wake" | "end";
}

interface Sample {
  t: number;
  a: DeviceValues;
}

type Role = "light" | "speaker" | "climate" | "window" | "presence" | "sensor" | "weather" | "travel";
const ROLE_ORDER: Role[] = ["light", "speaker", "climate", "window", "presence", "sensor", "weather", "travel"];
const ROLE_ICON: Record<Role, string> = {
  light: "💡",
  speaker: "🔊",
  climate: "🌡",
  window: "🪟",
  presence: "🏠",
  sensor: "🌡",
  weather: "🌦",
  travel: "🚗",
};

/** Values that matter for an alarm, from a recorder state. */
export function toValues(entityId: string, s: string, a: Record<string, any> = {}): DeviceValues {
  const domain = entityId.split(".")[0];
  const v: DeviceValues = { s };
  if (domain === "light" && s === "on") {
    if (a.brightness != null) v.b = Math.round((a.brightness / 255) * 100);
    if ((a.color_mode === "color_temp" || !a.rgb_color) && a.color_temp_kelvin) v.k = a.color_temp_kelvin;
    else if (a.rgb_color) v.c = `#${a.rgb_color.slice(0, 3).map((x: number) => Math.round(x).toString(16).padStart(2, "0")).join("")}`;
  } else if (domain === "media_player") {
    if (a.volume_level != null) v.v = Math.round(a.volume_level * 100);
    if (a.media_title) v.m = String(a.media_title).slice(0, 60);
  } else if (domain === "climate" || domain === "water_heater") {
    if (a.temperature != null) v.tt = a.temperature;
    if (a.current_temperature != null) v.ct = a.current_temperature;
    if (a.hvac_action) v.a = a.hvac_action;
  } else if (domain === "weather") {
    if (a.temperature != null) v.ct = a.temperature;
  }
  return v;
}

/** "on · 45 % · 2700 K" */
export function formatValues(hass: HomeAssistant | undefined, a: DeviceValues | undefined): string {
  if (!a) return "";
  const parts: string[] = [];
  if (a.s) {
    const key = `hx_st_${a.s}`;
    const w = t(hass, key as StringKey);
    parts.push(w === key ? weatherWord(hass, a.s) : w);
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

function weatherWord(hass: HomeAssistant | undefined, w: string): string {
  const key = `hx_wx_${w}`;
  const text = t(hass, key as StringKey);
  return text === key ? w : text;
}

function kelvinColor(k: number): string {
  const x = Math.max(0, Math.min(1, (k - 1800) / (6500 - 1800)));
  const mix = (a: number, b: number) => Math.round(a + (b - a) * x);
  return `rgb(${mix(255, 220)},${mix(150, 232)},${mix(60, 255)})`;
}

/** The number drawn as a line on a lane (0..100 % of the lane height). */
function lineValue(role: Role, a: DeviceValues, s: string): number | null {
  if (role === "light") return a.s === "on" ? a.b ?? 100 : 0;
  if (role === "speaker") return a.v ?? null;
  if (role === "climate" || role === "weather") return a.ct ?? null;
  if (role === "sensor" || role === "travel") {
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Graphic course of one history entry: a shared, zoomable time axis with the
 * steps, one lane per entity (state colours and a value line from the
 * recorder), DayBreak's commands with their timing chain and the outside
 * services. How much is shown depends on the editor mode.
 */
export class DbHistoryChart extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) entry?: HistoryEntry;
  @property({ attribute: false }) markers: ChartMarker[] = [];
  @property() mode: EditorMode = "normal";
  @state() private _hist: Record<string, Sample[]> = {};
  @state() private _loading = false;
  @state() private _error = "";
  @state() private _zoom: [number, number] | null = null;
  @state() private _open = "";
  private _loadedFor = "";

  static styles = [
    shared,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .zoom {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .grid {
        display: grid;
        grid-template-columns: minmax(90px, 160px) 1fr;
        column-gap: 10px;
        row-gap: 6px;
        align-items: center;
      }
      .name {
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: none;
        background: none;
        color: inherit;
        font-family: inherit;
        text-align: left;
        padding: 0;
        cursor: pointer;
      }
      .name.group {
        font-weight: 600;
        color: var(--db-muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-size: 11px;
        cursor: default;
        padding-top: 6px;
      }
      .track {
        position: relative;
        height: 22px;
        border-radius: 6px;
        background: var(--db-tile);
        overflow: hidden;
      }
      .track.course {
        height: 30px;
        overflow: visible;
        background: transparent;
      }
      .track.small {
        height: 14px;
      }
      .bseg {
        position: absolute;
        top: 0;
        bottom: 0;
      }
      .course .bseg {
        top: 11px;
        bottom: 11px;
        border-radius: 4px;
      }
      svg.line {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      .mk {
        position: absolute;
        top: 3px;
        width: 24px;
        height: 24px;
        margin-left: -12px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: 12px;
        background: var(--db-bg);
        border: 2px solid var(--c);
        z-index: 1;
      }
      .cmd {
        position: absolute;
        top: 0;
        width: 2px;
        height: 100%;
        margin-left: -1px;
        background: #fff;
        opacity: 0.85;
      }
      .cmd.slow {
        background: #f0b429;
        width: 3px;
        opacity: 1;
      }
      .cmd.bad {
        background: #e5534b;
        width: 3px;
        opacity: 1;
      }
      .call {
        position: absolute;
        top: 1px;
        height: 12px;
        min-width: 3px;
        border-radius: 3px;
        background: #8a63d2;
      }
      .call.fail {
        background: #e5534b;
      }
      .axis {
        position: relative;
        height: 16px;
        font-size: 11px;
        color: var(--db-muted);
        font-variant-numeric: tabular-nums;
      }
      .axis span {
        position: absolute;
        transform: translateX(-50%);
        white-space: nowrap;
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
      .tab-wrap {
        grid-column: 1 / -1;
        overflow-x: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        font-variant-numeric: tabular-nums;
      }
      th,
      td {
        text-align: left;
        padding: 4px 6px;
        border-bottom: 1px solid var(--db-line);
        vertical-align: top;
      }
      th {
        color: var(--db-muted);
        font-weight: 500;
      }
      .slow {
        color: #f0b429;
      }
      .bad {
        color: var(--error-color, #e5534b);
        font-weight: 600;
      }
      .chain {
        display: inline-flex;
        gap: 4px;
        align-items: center;
        white-space: nowrap;
      }
      .chain i {
        font-style: normal;
        color: var(--db-muted);
      }
    `,
  ];

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("entry") && this.entry && this.entry.id + this.entry.ended !== this._loadedFor) {
      this._loadedFor = this.entry.id + this.entry.ended;
      this._zoom = null;
      this._load();
    }
  }

  private get _deep() {
    return this.mode !== "simple";
  }

  private get _expert() {
    return this.mode === "expert";
  }

  /** Full time range of the entry: steps, commands and service calls. */
  private get _full(): [number, number] {
    const e = this.entry!;
    const times = [
      ...e.steps.map((s) => Date.parse(s.t)),
      ...(e.cmds ?? []).map((c) => Date.parse(c.t)),
      ...(e.calls ?? []).filter((c) => c.t).map((c) => Date.parse(c.t!)),
    ];
    const from = Math.min(...times);
    let to = Math.max(...times, from + 60000);
    if (e.result === "running") to = Math.max(to, Date.now());
    return [from, to];
  }

  private async _load() {
    const e = this.entry;
    const ids = Object.keys(e?.entities ?? {});
    if (!this.hass || !e || !ids.length) {
      this._hist = {};
      return;
    }
    const [from, to] = this._full;
    this._loading = true;
    this._error = "";
    try {
      const res = await this.hass.callWS<Record<string, { s: string; a?: Record<string, any>; lu: number; lc?: number }[]>>({
        type: "history/history_during_period",
        start_time: new Date(from - 120000).toISOString(),
        end_time: new Date(to + 60000).toISOString(),
        entity_ids: ids,
        minimal_response: false,
        no_attributes: false,
        significant_changes_only: false,
      });
      const hist: Record<string, Sample[]> = {};
      for (const [id, states] of Object.entries(res ?? {})) {
        let attrs: Record<string, any> = {};
        hist[id] = states.map((st) => {
          if (st.a) attrs = st.a;
          return { t: (st.lu ?? st.lc ?? 0) * 1000, a: toValues(id, st.s, attrs) };
        });
      }
      this._hist = hist;
    } catch (err) {
      this._error = (err as { message?: string }).message ?? String(err);
    } finally {
      this._loading = false;
    }
  }

  /** Commands shown in this mode: all (expert), staggered (advanced), the key ones (simple). */
  private _visibleCmds(entityId: string): HistoryCommand[] {
    const all = (this.entry?.cmds ?? []).filter((c) => c.e === entityId);
    if (this._expert || all.length <= 3) return all;
    const keyTimes = this.markers
      .filter((m) => ["ring", "ring_again", "snooze", "last_call", "end", "start"].includes(m.step) || m.phase !== "sunrise")
      .map((m) => Date.parse(m.t));
    const nearKey = (c: HistoryCommand) => keyTimes.some((k) => Math.abs(Date.parse(c.t) - k) <= 3000);
    const slow = (c: HistoryCommand) => (c.seen ?? 0) >= 5 || (c.ack ?? 0) >= 5 || c.ok === false;
    const out: HistoryCommand[] = [];
    let last: HistoryCommand | undefined;
    all.forEach((c, i) => {
      const edge = i === 0 || i === all.length - 1;
      let keep = edge || nearKey(c) || slow(c);
      if (!keep && this._deep && last) {
        const db = Math.abs((c.a.b ?? 0) - (last.a.b ?? 0));
        const dv = Math.abs((c.a.v ?? 0) - (last.a.v ?? 0));
        keep = c.s !== last.s || db >= 10 || dv >= 10;
      }
      if (keep) {
        out.push(c);
        last = c;
      }
    });
    return out;
  }

  private _segColor(role: Role, a: DeviceValues): string {
    if (a.s === "unavailable" || a.s === "unknown") return "repeating-linear-gradient(45deg,#e5534b 0 4px,transparent 4px 8px)";
    switch (role) {
      case "light": {
        if (a.s !== "on") return "#2e2e2e";
        const base = a.c ?? (a.k ? kelvinColor(a.k) : "#ffd08a");
        return `color-mix(in srgb, ${base} ${Math.max(20, a.b ?? 100)}%, #222)`;
      }
      case "speaker":
        return a.s === "playing" ? "#2f8f4e" : a.s === "buffering" ? "#6fae7f" : "#2e2e2e";
      case "climate":
        return a.s === "heat" ? "#a85a2e" : a.s === "cool" ? "#2e6aa8" : a.s === "off" ? "#2e2e2e" : "#6b4fa0";
      case "window":
        return a.s === "on" ? "#a8862e" : "#2e2e2e";
      case "presence":
        return a.s === "home" || a.s === "on" ? "#2f6f8f" : "#2e2e2e";
      default:
        return "#2e3440";
    }
  }

  private _axis(from: number, to: number) {
    const n = 6;
    return html`<div></div><div class="axis">
      ${Array.from({ length: n + 1 }, (_, i) => {
        const ms = from + ((to - from) * i) / n;
        return html`<span style="left:${(i / n) * 100}%">${this._clock(ms, to - from < 600000)}</span>`;
      })}
    </div>`;
  }

  private _clock(ms: number, seconds: boolean) {
    const iso = new Date(ms).toISOString();
    const base = formatTime(this.hass, iso);
    return seconds ? `${base}:${String(new Date(ms).getSeconds()).padStart(2, "0")}` : base;
  }

  private _lane(id: string, role: Role, from: number, to: number) {
    const pos = (ms: number) => ((ms - from) / (to - from)) * 100;
    const samples = this._samples(id);
    const end = this.entry!.result === "running" ? Math.min(Date.now(), to) : to;
    const segs = samples
      .map((s, i) => ({ a: s.t, b: i + 1 < samples.length ? samples[i + 1].t : end, v: s.a }))
      .filter((g) => g.b > from && g.a < to);
    // Value line (brightness, volume, temperature, numeric sensors).
    const pts: [number, number][] = [];
    const nums = samples.map((s) => lineValue(role, s.a, s.a.s ?? ""));
    const finite = nums.filter((n): n is number => n != null);
    const lo = role === "light" || role === "speaker" ? 0 : Math.min(...finite);
    const hi = role === "light" || role === "speaker" ? 100 : Math.max(...finite, lo + 1);
    samples.forEach((s, i) => {
      const n = nums[i];
      if (n == null) return;
      const x = Math.max(0, Math.min(100, pos(Math.max(s.t, from))));
      const y = 100 - ((n - lo) / (hi - lo || 1)) * 90 - 5;
      if (pts.length) pts.push([x, pts[pts.length - 1][1]]);
      pts.push([x, y]);
    });
    if (pts.length) pts.push([pos(end), pts[pts.length - 1][1]]);
    const cmds = this._visibleCmds(id).filter((c) => Date.parse(c.t) >= from && Date.parse(c.t) <= to);
    return html`<div class="track">
      ${segs.map(
        (g) => html`<span class="bseg" title=${`${this._clock(g.a, true)} ${formatValues(this.hass, g.v)}`}
          style="left:${Math.max(0, pos(g.a))}%;width:${Math.max(0.4, Math.min(100, pos(g.b)) - Math.max(0, pos(g.a)))}%;background:${this._segColor(role, g.v)}"></span>`,
      )}
      ${pts.length > 1
        ? html`<svg class="line" viewBox="0 0 100 100" preserveAspectRatio="none">${svg`<polyline
            points=${pts.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="rgba(255,255,255,0.8)"
            stroke-width="1.5" vector-effect="non-scaling-stroke"></polyline>`}</svg>`
        : nothing}
      ${cmds.map((c) => {
        const slowest = Math.max(c.ack ?? 0, c.seen ?? 0);
        const cls = c.ok === false ? "bad" : slowest >= 15 ? "bad" : slowest >= 5 ? "slow" : "";
        return html`<span class="cmd ${cls}" style="left:${pos(Date.parse(c.t))}%"
          title=${`${this._clock(Date.parse(c.t), true)} ${c.s} ${formatValues(this.hass, c.a)} · ${this._chainText(c)}`}></span>`;
      })}
    </div>`;
  }

  private _chainText(c: HistoryCommand): string {
    const hass = this.hass;
    const parts = [t(hass, "hx_chain_sent")];
    parts.push(c.ok === false ? t(hass, "hx_chain_refused") : c.ack != null ? t(hass, "hx_chain_ack", { s: c.ack }) : "?");
    parts.push(c.seen != null ? t(hass, "hx_chain_seen", { s: c.seen }) : t(hass, "hx_chain_unseen"));
    return parts.join(" → ");
  }

  /**
   * Samples of an entity: the recorder, and for lamps (whose brightness and
   * colour the recorder does not keep) the values they reported to DayBreak.
   */
  private _samples(id: string): Sample[] {
    const rec = this._hist[id] ?? [];
    if (!id.startsWith("light.")) return rec;
    const e = this.entry!;
    const own: Sample[] = [
      ...(e.cmds ?? [])
        .filter((c) => c.e === id && c.got && c.seen != null)
        .map((c) => ({ t: Date.parse(c.t) + c.seen! * 1000, a: c.got! })),
      ...(e.ext ?? []).filter((x) => x.e === id).map((x) => ({ t: Date.parse(x.t), a: x.a })),
    ];
    const start = e.steps.find((st) => st.step === "initial")?.snapshot?.find((x) => x.domain === "light" && x.name === e.entities?.[id]?.n);
    if (start) own.push({ t: Date.parse(e.steps.find((st) => st.step === "initial")!.t), a: start.a });
    // The recorder still knows on/off and unavailable.
    const merged = [...own, ...rec.filter((r) => r.a.s !== "on" || !own.length)];
    return merged.sort((a, b) => a.t - b.t);
  }

  /** Value of an entity at a time. */
  private _at(id: string, ms: number): DeviceValues | undefined {
    const samples = this._samples(id);
    let found: DeviceValues | undefined;
    for (const s of samples) {
      if (s.t <= ms) found = s.a;
      else break;
    }
    return found;
  }

  /** Changes of one entity (advanced) and DayBreak's commands with timing (expert). */
  private _table(id: string, from: number, to: number) {
    const hass = this.hass;
    const samples = this._samples(id).filter((s) => s.t >= from - 1 && s.t <= to);
    const cmds = this._visibleCmds(id).filter((c) => Date.parse(c.t) >= from && Date.parse(c.t) <= to);
    type Row = { t: number; kind: "state" | "cmd"; s?: Sample; prev?: DeviceValues; c?: HistoryCommand };
    const rows: Row[] = [
      ...samples.map((s) => ({ t: s.t, kind: "state" as const, s, prev: this._at(id, s.t - 1) })),
      ...(this._deep ? cmds.map((c) => ({ t: Date.parse(c.t), kind: "cmd" as const, c })) : []),
    ].sort((a, b) => a.t - b.t);
    const diff = (before: DeviceValues | undefined, after: DeviceValues) => {
      if (!before) return formatValues(hass, after);
      const keys = new Set([...Object.keys(before), ...Object.keys(after)]) as Set<keyof DeviceValues>;
      const out: string[] = [];
      for (const k of keys) {
        if (before[k] === after[k]) continue;
        out.push(`${formatValues(hass, { [k]: before[k] } as DeviceValues)} → ${formatValues(hass, { [k]: after[k] } as DeviceValues)}`);
      }
      return out.join(", ") || formatValues(hass, after);
    };
    return html`<div class="tab-wrap"><table>
      <thead><tr><th>${t(hass, "hx_col_time")}</th><th>${t(hass, "hx_col_what")}</th><th>${t(hass, "hx_col_change")}</th>
        ${this._expert ? html`<th>${t(hass, "hx_col_chain")}</th>` : html`<th>${t(hass, "hx_col_reaction")}</th>`}</tr></thead>
      <tbody>${rows.map((r) => {
        if (r.kind === "cmd" && r.c) {
          const c = r.c;
          const after = c.seen != null ? this._at(id, Date.parse(c.t) + c.seen * 1000 + 50) : undefined;
          return html`<tr><td>${this._clock(r.t, true)}</td><td>➜ ${c.s}</td>
            <td>${t(hass, "hx_target")}: ${formatValues(hass, c.a)}${this._expert && after ? html`<br /><span class="slow">${t(hass, "hx_actual")}: ${formatValues(hass, after)}</span>` : nothing}</td>
            <td>${this._expert ? this._chain(c) : this._reaction(c)}</td></tr>`;
        }
        return html`<tr><td>${this._clock(r.t, true)}</td><td>${t(hass, "hx_state")}</td>
          <td>${diff(r.prev, r.s!.a)}</td><td></td></tr>`;
      })}</tbody></table></div>`;
  }

  private _reaction(c: HistoryCommand) {
    const s = c.seen ?? c.ack;
    if (c.ok === false) return html`<span class="bad">${t(this.hass, "hx_chain_refused")}</span>`;
    if (s == null) return nothing;
    return html`<span class=${s >= 15 ? "bad" : s >= 5 ? "slow" : ""}>${t(this.hass, "hx_lat", { s: s.toLocaleString() })}</span>`;
  }

  private _chain(c: HistoryCommand) {
    const hass = this.hass;
    const cls = (s: number | null | undefined) => (s == null ? "" : s >= 15 ? "bad" : s >= 5 ? "slow" : "");
    return html`<span class="chain">${t(hass, "hx_chain_sent")}<i>→</i>
      <span class=${c.ok === false ? "bad" : cls(c.ack)}>${c.ok === false ? t(hass, "hx_chain_refused") : c.ack != null ? t(hass, "hx_chain_ack", { s: c.ack }) : "?"}</span><i>→</i>
      <span class=${cls(c.seen)}>${c.seen != null ? t(hass, "hx_chain_seen", { s: c.seen }) : t(hass, "hx_chain_unseen")}</span></span>`;
  }

  private _calls(from: number, to: number) {
    const hass = this.hass;
    const calls = (this.entry?.calls ?? []).filter((c) => c.t && Date.parse(c.t) >= from && Date.parse(c.t) <= to);
    if (!calls.length) return nothing;
    const pos = (ms: number) => ((ms - from) / (to - from)) * 100;
    const open = this._open === "calls";
    return html`<button class="name" @click=${() => (this._open = open ? "" : "calls")}>🛰 ${t(hass, "hx_calls")} ${open ? "▴" : "▾"}</button>
      <div class="track small">
        ${calls.map((c) => {
          const end = Date.parse(c.t!);
          const start = end - c.ms;
          return html`<span class="call ${c.ok ? "" : "fail"}" style="left:${pos(start)}%;width:${Math.max(0.3, pos(end) - pos(start))}%"
            title=${`${this._clock(end, true)} ${t(hass, `hx_call_${c.k}` as StringKey)} · ${c.ms} ms`}></span>`;
      })}
      </div>
      ${open
        ? html`<div class="tab-wrap"><table>
            <thead><tr><th>${t(hass, "hx_col_time")}</th><th>${t(hass, "hx_col_what")}</th><th>${t(hass, "hx_col_duration")}</th></tr></thead>
            <tbody>${calls.map(
              (c) => html`<tr><td>${this._clock(Date.parse(c.t!), true)}</td>
                <td>${t(hass, `hx_call_${c.k}` as StringKey)}${c.what ? ` (${c.what})` : ""}${c.phase ? ` (${c.phase})` : ""}${c.minutes ? ` → −${c.minutes} min` : ""}</td>
                <td class=${c.ok ? (c.ms >= 5000 ? "bad" : c.ms >= 2000 ? "slow" : "") : "bad"}>${c.ok ? `${c.ms.toLocaleString()} ms` : t(hass, "hx_failed_after", { ms: c.ms })}</td></tr>`,
            )}</tbody></table></div>`
        : nothing}`;
  }

  /** Zoom to the whole run or one phase; ± around the middle. */
  private _zoomBar(full: [number, number], range: [number, number]) {
    const hass = this.hass;
    const at = (steps: string[]) => this.markers.find((m) => steps.includes(m.step))?.t;
    const start = at(["start"]);
    const ring = at(["ring"]);
    const end = at(["end", "restart"]);
    const phases: [string, number | undefined, number | undefined][] = [
      ["hx_seg_prep", full[0], start ? Date.parse(start) : undefined],
      ["hx_seg_sunrise", start ? Date.parse(start) : undefined, ring ? Date.parse(ring) : undefined],
      ["hx_ph_wake", ring ? Date.parse(ring) : undefined, end ? Date.parse(end) : full[1]],
    ];
    const zoomBy = (f: number) => {
      const mid = (range[0] + range[1]) / 2;
      const half = Math.max(5000, ((range[1] - range[0]) / 2) * f);
      const a = Math.max(full[0], mid - half);
      const b = Math.min(full[1], mid + half);
      this._zoom = b - a >= full[1] - full[0] - 1 ? null : [a, b];
    };
    return html`<div class="zoom">
      <span class="muted">${t(hass, "hx_zoom")}</span>
      <button class="chip" aria-pressed=${!this._zoom} @click=${() => (this._zoom = null)}>${t(hass, "hx_zoom_all")}</button>
      ${phases
        .filter(([, a, b]) => a != null && b != null && b - a! > 1000)
        .map(
          ([key, a, b]) => html`<button class="chip" aria-pressed=${!!this._zoom && this._zoom[0] === a && this._zoom[1] === b}
            @click=${() => (this._zoom = [a!, b!])}>${t(hass, key as StringKey)}</button>`,
        )}
      <button class="chip" @click=${() => zoomBy(0.5)}>＋</button>
      <button class="chip" @click=${() => zoomBy(2)}>－</button>
    </div>`;
  }

  render() {
    const hass = this.hass;
    const e = this.entry;
    if (!e) return nothing;
    const full = this._full;
    const [from, to] = this._zoom ?? full;
    const pos = (ms: number) => ((ms - from) / (to - from)) * 100;
    const markers = this.markers.filter((m) => {
      const ms = Date.parse(m.t);
      return ms >= from && ms <= to && (this._deep || m.level !== "info" || ["start", "ring", "end"].includes(m.step));
    });
    // Phase bands on the course row.
    const bands: { cls: string; a: number; b: number }[] = [];
    const order = this.markers;
    for (let i = 0; i < order.length; i++) {
      const a = Date.parse(order[i].t);
      const b = i + 1 < order.length ? Date.parse(order[i + 1].t) : e.result === "running" ? Date.now() : full[1];
      const color = { prep: "#5a7fa8", sunrise: "#e0763b", wake: "#ff8a4c", end: "#555" }[order[i].phase];
      bands.push({ cls: color, a, b });
    }
    const entities = Object.entries(e.entities ?? {}).filter(([, info]) => {
      const role = info.r as Role;
      return this._deep || ["light", "speaker", "climate"].includes(role);
    });
    const groups = ROLE_ORDER.map((role) => ({ role, items: entities.filter(([, info]) => info.r === role) })).filter((g) => g.items.length);
    return html`
      ${this._zoomBar(full, [from, to])}
      ${this._loading ? html`<div class="muted">…</div>` : nothing}
      ${this._error ? html`<div class="muted">${t(hass, "hx_no_recorder")} (${this._error})</div>` : nothing}
      ${this._deep ? html`<div class="muted">${t(hass, "hx_lamp_note")}</div>` : nothing}
      <div class="grid">
        ${this._axis(from, to)}
        <div class="name group">${t(hass, "hx_course")}</div>
        <div class="track course">
          ${bands
            .filter((g) => g.b > from && g.a < to)
            .map((g) => html`<span class="bseg" style="left:${Math.max(0, pos(g.a))}%;width:${Math.max(0.3, Math.min(100, pos(g.b)) - Math.max(0, pos(g.a)))}%;background:${g.cls}"></span>`)}
          ${markers.map(
            (m) => html`<span class="mk" title=${`${this._clock(Date.parse(m.t), true)} ${m.label}`}
              style="left:${pos(Date.parse(m.t))}%;--c:${{ ok: "#3cc864", info: "#5aa7e6", warn: "#f0b429", error: "#e5534b" }[m.level]}">${m.icon}</span>`,
          )}
        </div>
        ${groups.map(
          (g) => html`<div class="name group">${ROLE_ICON[g.role]} ${t(hass, `hx_role_${g.role}` as StringKey)}</div><div></div>
            ${g.items.map(([id, info]) => {
              const open = this._open === id;
              return html`<button class="name" title=${info.n} @click=${() => (this._open = open ? "" : id)}
                  ?disabled=${!this._deep}>${info.n}${this._deep ? (open ? " ▴" : " ▾") : ""}</button>
                ${this._lane(id, g.role, from, to)}
                ${open ? this._table(id, from, to) : nothing}`;
            })}`,
        )}
        ${this._deep ? this._calls(from, to) : nothing}
      </div>
      <div class="legend">
        <span style="--c:#fff">${t(hass, "hx_lg_cmd")}</span>
        <span style="--c:#f0b429">${t(hass, "hx_lg_slow")}</span>
        <span style="--c:#e5534b">${t(hass, "hx_lg_bad")}</span>
        <span style="--c:rgba(255,255,255,0.8)">${t(hass, "hx_lg_line")}</span>
        ${this._deep ? html`<span style="--c:#8a63d2">${t(hass, "hx_calls")}</span>` : nothing}
      </div>
    `;
  }
}

define("db-history-chart", DbHistoryChart);
