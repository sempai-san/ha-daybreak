// Defaults and light maths. Mirrors models.py and curve.py of the backend.
import type { AlarmConfig, AudioSource, ColorPreset, Kind, LightSettings, Point, SequenceStep } from "./api";

export const PRESET_POINTS: Record<string, [number, number][]> = {
  // Long dark phase, bright only near the end (like a real sunrise).
  natural: [
    [0, 0],
    [0.4, 0.04],
    [0.7, 0.2],
    [0.9, 0.6],
    [1, 1],
  ],
  // Soft S-curve.
  gentle: [
    [0, 0],
    [0.25, 0.07],
    [0.5, 0.4],
    [0.75, 0.82],
    [1, 1],
  ],
  linear: [
    [0, 0],
    [1, 1],
  ],
  // Bright early, then levels off.
  fast: [
    [0, 0],
    [0.2, 0.5],
    [0.5, 0.85],
    [1, 1],
  ],
};

export const COLOR_PRESETS: Record<Exclude<ColorPreset, "custom">, string[]> = {
  sunrise: ["#3A0D06", "#A32B10", "#F07A2A", "#FFD28A", "#FFF2DC"],
  dawn: ["#2A0B1E", "#8A2A55", "#F06A5A", "#FFC29A", "#FFE9D6"],
  pastel: ["#2B2340", "#7B6BB0", "#F0A7C0", "#FFD9C8", "#FFF1E6"],
};

export const MATCHING_KELVIN: Record<ColorPreset, [number, number]> = {
  sunrise: [1800, 3600],
  dawn: [1800, 3000],
  pastel: [2200, 4000],
  custom: [1800, 3600],
};

export const MIN_KELVIN = 1500;
export const MAX_KELVIN = 6500;

const DEFAULT_POINTS: Point[] = PRESET_POINTS.natural.map(([t, v]) => ({ t, v }));

export function defaultSettings(): LightSettings {
  return {
    curve: "natural",
    points: structuredClone(DEFAULT_POINTS),
    separate: false,
    points_color: structuredClone(DEFAULT_POINTS),
    brightness: [1, 100],
    color_mode: "ct",
    kelvin: [2200, 4000],
    colors: "sunrise",
    sequence: [],
    plain_kelvin: null,
    step_seconds: 15,
    min_brightness: 1,
    transition: "auto",
    start_offset: 0,
    ringing: "hold",
    after_stop: "keep",
  };
}

export function defaultSource(): AudioSource {
  return { type: "none", media_id: "", media_type: "playlist", name: "", url: "" };
}

export function defaultAlarm(kind: Kind = "wake", name = ""): AlarmConfig {
  const alarm: AlarmConfig = {
    name,
    kind,
    enabled: true,
    owners: [],
    wake: { type: "fixed", time: "07:00", sun_event: "sunrise", offset: 0, earliest: null, latest: null },
    light_lead: 30,
    repeat: {
      type: "weekly",
      days: [0, 1, 2, 3, 4],
      week_cycle: 1,
      weeks: [true],
      interval: 2,
      unit: "days",
      pattern: [true, true, false, false],
      start_date: null,
      date: null,
    },
    wake_on_holidays: false,
    skip_date: null,
    once: null,
    snooze: { preset: null, count: null },
    stop_on_light_off: true,
    last_call: { enabled: false, profile: "all_on", duration: null },
    presence: { entities: [], skip_when_away: true, stop_when_away: true },
    shift: {
      weather: { enabled: false, conditions: [], minutes: {}, cold_below: null, cold_minutes: null },
      travel: { enabled: false, sensor: null, usual: 30, routine: 45, arrive_by: null },
      max: 30,
      combine: "max",
      notify: true,
    },
    light: { targets: {}, profile: null, settings: defaultSettings(), overrides: [], per_lamp_start: false, starts: {} },
    actions: { light_start: [], wake: [], snooze: [], stop: [] },
    fallback: {
      lights: {},
      notify: null,
      events: ["skipped", "shifted", "device_unavailable", "failed"],
      persistent: true,
    },
    audio: {
      enabled: false,
      players: [],
      source: defaultSource(),
      tts: { enabled: false, engine: null, message: "" },
      lead: 5,
      volume: [5, 35],
      ramp: 5,
      curve: [],
      pause_on_snooze: true,
      button: true,
      restore_volume: true,
    },
    push: { enabled: true, owners: true, targets: [], critical_last_call: false },
  };
  if (kind === "sleep") {
    alarm.wake.time = "22:30";
    alarm.light_lead = 30;
    alarm.repeat.days = [0, 1, 2, 3, 4, 5, 6];
    alarm.wake_on_holidays = true;
    alarm.light.settings.curve = "linear";
    alarm.light.settings.brightness = [1, 40];
    alarm.light.settings.kelvin = [2000, 2400];
  }
  if (kind === "kids") {
    alarm.wake.time = "06:45";
    alarm.light_lead = 60;
    alarm.repeat.days = [0, 1, 2, 3, 4, 5, 6];
    alarm.wake_on_holidays = true;
  }
  return alarm;
}

export interface Caps {
  ct: boolean;
  color: boolean;
  dim: boolean;
}

const COLOR_MODES = ["hs", "xy", "rgb", "rgbw", "rgbww"];

export function capsOf(modes: string[] | undefined): Caps {
  const set = new Set(modes ?? []);
  if (!set.size) return { ct: false, color: false, dim: true };
  return {
    ct: set.has("color_temp"),
    color: COLOR_MODES.some((m) => set.has(m)),
    dim: !(set.size === 1 && set.has("onoff")),
  };
}

export function curvePoints(s: LightSettings, channel: "bri" | "col"): [number, number][] {
  if (s.curve !== "custom") return PRESET_POINTS[s.curve];
  const pts = channel === "col" && s.separate ? s.points_color : s.points;
  return pts.map((p) => [p.t, p.v]);
}

function slopes(points: [number, number][]): number[] {
  const n = points.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    d.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0] || 1e-9));
  }
  if (n === 2) return [d[0], d[0]];
  const m = [d[0]];
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : 2 / (1 / d[i - 1] + 1 / d[i]));
  m.push(d[n - 2]);
  return m;
}

/** Monotone cubic interpolation (same as curve.py). */
export function curveValue(points: [number, number][], x: number): number {
  x = Math.min(1, Math.max(0, x));
  if (x <= points[0][0]) return points[0][1];
  if (x >= points[points.length - 1][0]) return points[points.length - 1][1];
  const m = slopes(points);
  for (let i = 0; i < points.length - 1; i++) {
    const [t0, v0] = points[i];
    const [t1, v1] = points[i + 1];
    if (x <= t1) {
      const h = t1 - t0 || 1e-9;
      const r = (x - t0) / h;
      const v =
        (2 * r ** 3 - 3 * r ** 2 + 1) * v0 +
        (r ** 3 - 2 * r ** 2 + r) * h * m[i] +
        (-2 * r ** 3 + 3 * r ** 2) * v1 +
        (r ** 3 - r ** 2) * h * m[i + 1];
      return Math.min(1, Math.max(0, v));
    }
  }
  return points[points.length - 1][1];
}

export function hexToRgb(value: string): [number, number, number] {
  const v = value.replace("#", "");
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function mix(a: [number, number, number], b: [number, number, number], r: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r, a[2] + (b[2] - a[2]) * r];
}

function stops(s: LightSettings): [number, string, number | null][] {
  if (s.colors === "custom" && s.sequence.length >= 2) {
    const total = s.sequence.reduce((sum, step) => sum + step.minutes, 0) || 1;
    const out: [number, string, number | null][] = [];
    let acc = 0;
    for (const step of s.sequence) {
      out.push([acc / total, step.color, step.brightness]);
      acc += step.minutes;
    }
    const last = s.sequence[s.sequence.length - 1];
    out.push([1, last.color, last.brightness]);
    return out;
  }
  const colors = COLOR_PRESETS[s.colors as Exclude<ColorPreset, "custom">] ?? COLOR_PRESETS.sunrise;
  return colors.map((c, i) => [i / (colors.length - 1), c, null]);
}

export function colorAt(s: LightSettings, pos: number): { rgb: [number, number, number]; bri: number | null } {
  const st = stops(s);
  pos = Math.min(1, Math.max(0, pos));
  for (let i = 0; i < st.length - 1; i++) {
    const [p0, c0, b0] = st[i];
    const [p1, c1, b1] = st[i + 1];
    if (pos <= p1) {
      const r = p1 === p0 ? 0 : (pos - p0) / (p1 - p0);
      return { rgb: mix(hexToRgb(c0), hexToRgb(c1), r), bri: b0 === null || b1 === null ? null : b0 + (b1 - b0) * r };
    }
  }
  const last = st[st.length - 1];
  return { rgb: hexToRgb(last[1]), bri: last[2] };
}

export function plainKelvin(s: LightSettings): [number, number] {
  return s.plain_kelvin ?? MATCHING_KELVIN[s.colors];
}

export interface Level {
  bri: number;
  kelvin: number | null;
  rgb: [number, number, number] | null;
}

/** What a lamp with ``caps`` shows at ``progress`` (0 = light start, 1 = alarm). */
export function levelAt(s: LightSettings, progress: number, caps: Caps = { ct: true, color: true, dim: true }): Level {
  const p = Math.min(1, Math.max(0, progress));
  let bri = s.brightness[0] + (s.brightness[1] - s.brightness[0]) * curveValue(curvePoints(s, "bri"), p);
  const col = curveValue(curvePoints(s, "col"), p);
  if (s.color_mode === "color") {
    if (caps.color) {
      const custom = s.colors === "custom" && s.sequence.length >= 2;
      const c = colorAt(s, custom ? p : col);
      if (custom && c.bri !== null) bri = c.bri;
      return { bri, kelvin: null, rgb: c.rgb };
    }
    if (caps.ct) {
      const [k0, k1] = plainKelvin(s);
      return { bri, kelvin: k0 + (k1 - k0) * col, rgb: null };
    }
    return { bri, kelvin: null, rgb: null };
  }
  if (caps.ct || caps.color) return { bri, kelvin: s.kelvin[0] + (s.kelvin[1] - s.kelvin[0]) * col, rgb: null };
  return { bri, kelvin: null, rgb: null };
}

/** Approximate colour of a black-body light source (Tanner Helland). */
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const temp = kelvin / 100;
  let r: number;
  let g: number;
  let b: number;
  if (temp <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(temp) - 161.1195681661;
    b = temp <= 19 ? 0 : 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
    b = 255;
  }
  const clamp = (v: number) => Math.round(Math.min(255, Math.max(0, v)));
  return [clamp(r), clamp(g), clamp(b)];
}

/** CSS colour of a level as seen in the room (dim = darker). */
export function levelCss(level: Level, withBrightness = true): string {
  const base = level.rgb ?? (level.kelvin ? kelvinToRgb(level.kelvin) : [255, 236, 210]);
  const f = withBrightness ? 0.18 + 0.82 * Math.pow(Math.min(100, Math.max(0, level.bri)) / 100, 0.6) : 1;
  return `rgb(${base.map((c) => Math.round(c * f)).join(",")})`;
}

/** CSS gradient of the whole ramp. */
export function rampGradient(s: LightSettings, caps?: Caps, withBrightness = true, steps = 12): string {
  const parts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    parts.push(`${levelCss(levelAt(s, p, caps), withBrightness)} ${Math.round(p * 100)}%`);
  }
  return `linear-gradient(90deg, ${parts.join(", ")})`;
}

export function presetSteps(preset: Exclude<ColorPreset, "custom">, minutes: number): SequenceStep[] {
  const colors = COLOR_PRESETS[preset];
  const per = Math.max(0.5, Math.round((minutes / (colors.length - 1)) * 2) / 2);
  return colors.map((color, i) => ({
    color,
    brightness: Math.round(1 + (99 * i) / (colors.length - 1)),
    minutes: per,
    transition: "smooth" as const,
  }));
}

/** Deep merge of a partial stored object onto defaults (stored values win). */
export function withDefaults<T>(defaults: T, value: unknown): T {
  if (value === undefined || value === null) return defaults;
  if (Array.isArray(defaults) || typeof defaults !== "object" || defaults === null) return value as T;
  if (typeof value !== "object" || Array.isArray(value)) return defaults;
  const out: any = { ...defaults };
  for (const [k, v] of Object.entries(value as object)) {
    out[k] = k in (defaults as object) ? withDefaults((defaults as any)[k], v) : v;
  }
  return out;
}
