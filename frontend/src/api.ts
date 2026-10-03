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
  areas?: Record<string, { area_id: string; name: string }>;
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
  };
  actions: Record<Phase, Action[]>;
  fallback: {
    lights: Record<string, string>;
    notify: string | null;
    events: NotifyEvent[];
    persistent: boolean;
  };
}

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
  notify: string | null;
}

export interface LightProfile {
  id: string;
  name: string;
  duration: number;
  builtin?: boolean;
  settings: LightSettings;
}

export interface LastCallProfile {
  id: string;
  name: string;
  duration: number;
  targets: Target;
  brightness: number;
  kelvin: number | null;
  actions: Action[];
  builtin?: boolean;
}

export type EditorMode = "simple" | "normal" | "expert";

export interface Snapshot {
  alarms: Alarm[];
  next: { alarm_id: string; time: string } | null;
  settings: Settings;
  holiday_entity: string | null;
  light_profiles: LightProfile[];
  last_call_profiles: LastCallProfile[];
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
  kind: "light" | "last_call",
  profile: Partial<T>,
  confirm = false,
) => hass.callWS<T>({ type: "daybreak/profile/save", kind, profile, confirm });

export const deleteProfile = (hass: HomeAssistant, kind: "light" | "last_call", profileId: string) =>
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
