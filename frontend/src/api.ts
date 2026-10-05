// Types and websocket helpers shared by panel and cards (data model v2).

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed?: string;
}

export interface Connection {
  subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>): Promise<() => void>;
}

export interface HomeAssistant {
  connection: Connection;
  language: string;
  locale?: { language: string; time_format?: string };
  config?: { time_zone: string; latitude?: number; longitude?: number };
  states: Record<string, HassEntity>;
  entities?: Record<string, { entity_id: string; device_id?: string | null; area_id?: string | null; platform?: string }>;
  devices?: Record<string, { id: string; area_id?: string | null; name?: string | null; name_by_user?: string | null }>;
  // entity registry display entries also carry these

  areas?: Record<string, { area_id: string; name: string; floor_id?: string | null; icon?: string | null }>;
  floors?: Record<string, { floor_id: string; name: string; level?: number | null; icon?: string | null }>;
  user?: { is_admin: boolean; name?: string };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
}

export interface Target {
  entity_id?: string[];
  area_id?: string[];
  device_id?: string[];
  floor_id?: string[];
  label_id?: string[];
}

export interface Point {
  t: number;
  v: number;
}

export type CurveName = "natural" | "gentle" | "linear" | "fast" | "custom";
export type ColorPreset = "sunrise" | "dawn" | "pastel" | "custom";

export interface SequenceStep {
  color: string;
  brightness: number;
  minutes: number;
  transition: "smooth" | "step";
}

export interface LightSettings {
  curve: CurveName;
  points: Point[];
  separate: boolean;
  points_color: Point[];
  brightness: [number, number];
  color_mode: "ct" | "color";
  kelvin: [number, number];
  colors: ColorPreset;
  sequence: SequenceStep[];
  plain_kelvin: [number, number] | null;
  step_seconds: number;
  min_brightness: number;
  transition: "auto" | "always" | "never";
  start_offset: number;
  ringing: "hold" | "pulse" | "blink";
  after_stop: "keep" | "off" | "off_later";
}

export interface LightOverride {
  target: Target;
  profile: string | null;
  settings: LightSettings;
}

export type Kind = "wake" | "sleep" | "kids";
export type SunEvent =
  | "astronomical_dawn"
  | "nautical_dawn"
  | "civil_dawn"
  | "sunrise"
  | "sunset"
  | "civil_dusk"
  | "nautical_dusk"
  | "astronomical_dusk";

export interface Repeat {
  type: "once" | "weekly" | "interval" | "pattern";
  days: number[];
  week_cycle: number;
  weeks: boolean[];
  interval: number;
  unit: "days" | "weeks";
  pattern: boolean[];
  start_date: string | null;
  date: string | null;
}

export interface AudioSource {
  type: "none" | "music_assistant" | "url";
  media_id: string;
  media_type: "playlist" | "radio" | "album" | "track" | "artist" | "podcast" | "audiobook";
  name: string;
  url: string;
}

export interface AudioConfig {
  enabled: boolean;
  players: string[];
  source: AudioSource;
  tts: { enabled: boolean; engine: string | null; message: string };
  lead: number;
  volume: [number, number];
  ramp: number;
  /** Points between start and end volume: [share of the ramp 0..1, volume %]. */
  curve: [number, number][];
  pause_on_snooze: boolean;
  button: boolean;
  restore_volume: boolean;
}

export interface PushConfig {
  enabled: boolean;
  owners: boolean;
  targets: string[];
  critical_last_call: boolean;
}

export interface MaItem {
  name: string;
  uri: string;
  media_type: AudioSource["media_type"];
  image?: string | null;
  artist?: string;
}

export interface Phones {
  services: string[];
  persons: Record<string, string[]>;
  music_assistant: boolean;
  tts: string[];
}

export type WeatherKey = "snow" | "storm" | "rain";
export type Action = Record<string, unknown>;
export type Phase = "light_start" | "wake" | "snooze" | "stop";
export type NotifyEvent =
  | "started"
  | "finished"
  | "skipped"
  | "shifted"
  | "device_unavailable"
  | "failed"
  | "last_call";

export interface AlarmConfig {
  id?: string;
  name: string;
  kind: Kind;
  enabled: boolean;
  owners: string[];
  wake: {
    type: "fixed" | "sun";
    time: string;
    sun_event: SunEvent;
    offset: number;
    earliest: string | null;
    latest: string | null;
  };
  light_lead: number;
  repeat: Repeat;
  wake_on_holidays: boolean;
  skip_date: string | null;
  once: { date: string; time: string; light_lead: number | null } | null;
  snooze: { preset: string | null; count: number | null };
  stop_on_light_off: boolean;
  last_call: { enabled: boolean; profile: string; duration: number | null };
  presence: { entities: string[]; skip_when_away: boolean; stop_when_away: boolean };
  shift: {
    weather: {
      enabled: boolean;
      conditions: WeatherKey[];
      minutes: Partial<Record<WeatherKey, number>>;
      cold_below: number | null;
      cold_minutes: number | null;
    };
    travel: {
      enabled: boolean;
      sensor: string | null;
      usual: number;
      routine: number;
      arrive_by: string | null;
    };
    max: number;
    combine: "max" | "sum";
    notify: boolean;
  };
  light: {
    targets: Target;
    profile: string | null;
    settings: LightSettings;
    overrides: LightOverride[];
    /** Own start per lamp in minutes before the alarm (missing = with the light start). */
    per_lamp_start: boolean;
    starts: Record<string, number>;
  };
  actions: Record<Phase, Action[]>;
  fallback: {
    lights: Record<string, string>;
    notify: string | null;
    events: NotifyEvent[];
    persistent: boolean;
  };
  audio: AudioConfig;
  push: PushConfig;
  climate: ClimateConfig;
  calendar: CalendarConfig;
}

export type CalendarAction = "skip" | "time" | "before" | "alarm";

export interface CalendarRule {
  enabled: boolean;
  /** Empty = every calendar. */
  calendars: string[];
  /** Empty = every event. */
  keywords: string[];
  match: "any" | "all";
  action: CalendarAction;
  time: string;
  before: number;
  travel: boolean;
  any_day: boolean;
  alarm: string | null;
}

export interface CalendarConfig {
  enabled: boolean;
  rules: CalendarRule[];
  travel: {
    origin: string | null;
    region: "auto" | "eu" | "us" | "na" | "il" | "au";
    vehicle: "car" | "taxi" | "motorcycle";
    avoid_toll: boolean;
    fallback: number;
  };
}

/** What a calendar rule decided for a day. */
export interface CalendarDecision {
  action: "skip" | "time" | "ring" | "alarm";
  rule: number;
  time: string | null;
  summary: string | null;
  event_start: string | null;
  location: string | null;
  travel: number | null;
  alarm: string | null;
}

export interface CalendarPreviewDay {
  date: string;
  normal: boolean;
  holiday: boolean;
  /** Usual alarm time on a normal day. */
  time: string | null;
  events: { summary: string; start: string; all_day: boolean }[];
  decision: CalendarDecision | null;
}

export const calendarPreview = (hass: HomeAssistant, alarm: Partial<AlarmConfig> & { id?: string }) =>
  hass.callWS<{ days: CalendarPreviewDay[] }>({ type: "daybreak/calendar/preview", alarm });

export type AlarmState =
  | "disabled"
  | "idle"
  | "scheduled"
  | "sunrise"
  | "ringing"
  | "snoozed"
  | "last_call";

export interface AlarmRuntime {
  state: AlarmState;
  next_alarm: string | null;
  next_base: string | null;
  next_light_start: string | null;
  shift: number;
  shift_parts: { rule: string; reason: string; minutes: number }[];
  run_shift: number;
  snooze_minutes: number;
  snooze_count: number;
  test: boolean;
  alarm_time: string | null;
  light_start: string | null;
  ring_started: string | null;
  snooze_until: string | null;
  snoozes: number;
  snooze_end: string | null;
  last_call_started: string | null;
  climate_at?: string | null;
  climate_active?: boolean;
  climate_samples?: number;
  calendar?: CalendarDecision | null;
  calendar_days?: (CalendarDecision & { date: string })[];
}

export interface Alarm extends AlarmConfig {
  id: string;
  runtime: AlarmRuntime;
}

export interface SnoozePreset {
  id: string;
  name: string;
  minutes: number;
}

export interface Settings {
  snooze_presets: SnoozePreset[];
  default_snooze: string;
  default_snooze_count: number;
  default_last_call: string;
  weather_entity: string | null;
  warning_entities: string[];
  warning_level: number;
  weather_minutes: Record<WeatherKey, number>;
  cold_below: number;
  cold_minutes: number;
  temperature_entity: string | null;
  holiday_entity: string | null;
  default_mode: EditorMode;
  /** Editor options hidden per mode (expert always shows all). */
  mode_hidden?: Partial<Record<"simple" | "normal", ModeFeature[]>>;
  notify: string | null;
}

export interface LightProfile {
  id: string;
  name: string;
  duration: number;
  builtin?: boolean;
  settings: LightSettings;
}

export type ClimateMode = "heat" | "cool" | "heat_cool" | "auto" | "dry" | "fan_only";

export interface ClimateSettings {
  mode: ClimateMode;
  temperature: number;
  humidity: number;
  fan: number;
  water_temperature: number;
  start: "fixed" | "learned";
  lead: number;
  max_lead: number;
  after: "restore" | "off" | "presence";
  minutes: number;
  only_if_needed: boolean;
  outdoor_below: number | null;
  outdoor_above: number | null;
}

export interface ClimateConfig {
  enabled: boolean;
  devices: string[];
  profile: string | null;
  settings: ClimateSettings;
  room_sensor: string | null;
  windows: string[];
  presence: boolean;
}

export interface ClimateProfile {
  id: string;
  name: string;
  settings: ClimateSettings;
  builtin?: boolean;
}

export const CLIMATE_DOMAINS = ["climate", "fan", "humidifier", "water_heater", "switch", "input_boolean"];

export interface LastCallProfile {
  id: string;
  name: string;
  duration: number;
  targets: Target;
  brightness: number;
  kelvin: number | null;
  actions: Action[];
  audio: AudioSource;
  volume: number | null;
  builtin?: boolean;
}

export type EditorMode = "simple" | "normal" | "expert";

/** Editor options that can be switched off per mode (mirrors MODE_FEATURES). */
export const MODE_FEATURES = [
  "sun",
  "pattern",
  "week_cycle",
  "calendar",
  "conditions",
  "overrides",
  "lamp_start",
  "audio",
  "tts",
  "climate",
  "push",
  "actions",
  "none",
  "fallback",
] as const;
export type ModeFeature = (typeof MODE_FEATURES)[number];
export const DEFAULT_MODE_HIDDEN: Record<"simple" | "normal", ModeFeature[]> = {
  simple: ["sun", "pattern", "week_cycle", "calendar", "overrides", "lamp_start", "tts", "climate", "actions", "none"],
  normal: [],
};

export interface Snapshot {
  alarms: Alarm[];
  next: { alarm_id: string; time: string } | null;
  settings: Settings;
  holiday_entity: string | null;
  light_profiles: LightProfile[];
  last_call_profiles: LastCallProfile[];
  climate_profiles?: ClimateProfile[];
  version?: string;
}

export type AlarmAction =
  | "snooze"
  | "stop"
  | "skip_next"
  | "cancel_skip"
  | "test"
  | "enable"
  | "disable"
  | "clear_once";

export type SunTimes = Record<SunEvent, string | null>;

export const ACTIVE_STATES: AlarmState[] = ["sunrise", "ringing", "snoozed", "last_call"];

export const createAlarm = (hass: HomeAssistant, alarm: Partial<AlarmConfig>) =>
  hass.callWS<Alarm>({ type: "daybreak/alarm/create", alarm });

export const updateAlarm = (hass: HomeAssistant, alarmId: string, changes: Partial<AlarmConfig>) =>
  hass.callWS<Alarm>({ type: "daybreak/alarm/update", alarm_id: alarmId, changes });

export const deleteAlarm = (hass: HomeAssistant, alarmId: string) =>
  hass.callWS<void>({ type: "daybreak/alarm/delete", alarm_id: alarmId });

export const alarmAction = (
  hass: HomeAssistant,
  action: AlarmAction,
  alarmId?: string,
  extra: Record<string, unknown> = {},
) => hass.callWS<void>({ type: "daybreak/alarm/action", action, alarm_id: alarmId, ...extra });

export const setOnce = (
  hass: HomeAssistant,
  alarmId: string,
  date: string,
  time: string,
  lightLead: number | null = null,
) => hass.callWS<Alarm>({ type: "daybreak/alarm/once", alarm_id: alarmId, date, time, light_lead: lightLead });

export const saveSettings = (hass: HomeAssistant, changes: Partial<Settings>) =>
  hass.callWS<Settings>({ type: "daybreak/settings", changes });

export const saveProfile = <T>(
  hass: HomeAssistant,
  kind: ProfileKind,
  profile: Partial<T>,
  confirm = false,
) => hass.callWS<T>({ type: "daybreak/profile/save", kind, profile, confirm });

export type ProfileKind = "light" | "last_call" | "climate";

export const deleteProfile = (hass: HomeAssistant, kind: ProfileKind, profileId: string) =>
  hass.callWS<void>({ type: "daybreak/profile/delete", kind, profile_id: profileId });

const sunCache = new Map<string, Promise<Record<string, SunTimes>>>();
export function fetchSun(hass: HomeAssistant, date: string, days = 1): Promise<Record<string, SunTimes>> {
  const key = `${date}/${days}`;
  let hit = sunCache.get(key);
  if (!hit) {
    hit = hass.callWS<Record<string, SunTimes>>({ type: "daybreak/sun", date, days });
    hit.catch(() => sunCache.delete(key));
    sunCache.set(key, hit);
  }
  return hit;
}

export const preview = (hass: HomeAssistant, entityIds: string[], settings: LightSettings, progress: number) =>
  hass.callWS<void>({ type: "daybreak/preview", entity_id: entityIds, settings, progress });

declare const __DAYBREAK_VERSION__: string;
export const FRONTEND_VERSION: string = __DAYBREAK_VERSION__;

/** True when the page still runs an older DayBreak than Home Assistant has installed. */
export let staleFrontend = false;

/**
 * After an update Home Assistant serves the new bundle, but an open page keeps
 * the old one. Reload once per new version; if that did not help (app cache),
 * remember it so the panel can show how to clear the cache.
 */
function checkVersion(version: string | undefined): void {
  if (!version || version === FRONTEND_VERSION) return;
  const key = `daybreak-reloaded-${version}`;
  try {
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      window.location.reload();
      return;
    }
  } catch {
    /* storage blocked: do not risk a reload loop */
  }
  staleFrontend = true;
}

// One shared subscription per connection, used by every panel/card instance.
type Listener = (snapshot: Snapshot) => void;
interface Sub {
  listeners: Set<Listener>;
  last?: Snapshot;
  unsub?: Promise<() => void>;
}
const subs = new WeakMap<Connection, Sub>();

export function subscribeAlarms(hass: HomeAssistant, listener: Listener): () => void {
  let sub = subs.get(hass.connection);
  if (!sub) {
    sub = { listeners: new Set() };
    subs.set(hass.connection, sub);
  }
  const current = sub;
  current.listeners.add(listener);
  if (current.last) listener(current.last);
  if (!current.unsub) {
    current.unsub = hass.connection.subscribeMessage<Snapshot>(
      (snapshot) => {
        checkVersion(snapshot.version);
        current.last = snapshot;
        current.listeners.forEach((l) => l(snapshot));
      },
      { type: "daybreak/subscribe" },
    );
    current.unsub.catch(() => {
      current.unsub = undefined;
    });
  }
  return () => {
    current.listeners.delete(listener);
    if (current.listeners.size === 0 && current.unsub) {
      const unsub = current.unsub;
      current.unsub = undefined;
      current.last = undefined;
      unsub.then((fn) => fn()).catch(() => undefined);
    }
  };
}

export const maSearch = (hass: HomeAssistant, query: string, mediaType?: string) =>
  hass.callWS<MaItem[]>({ type: "daybreak/ma_search", query, media_type: mediaType ?? null });

let phonesCache: Promise<Phones> | undefined;
export function fetchPhones(hass: HomeAssistant): Promise<Phones> {
  phonesCache ??= hass.callWS<Phones>({ type: "daybreak/phones" });
  phonesCache.catch(() => (phonesCache = undefined));
  return phonesCache;
}
