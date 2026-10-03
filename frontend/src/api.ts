// Types and websocket helpers shared by panel and cards.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
}

export interface Connection {
  subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>): Promise<() => void>;
}

export interface HomeAssistant {
  connection: Connection;
  language: string;
  locale?: { language: string; time_format?: string };
  config?: { time_zone: string };
  states: Record<string, HassEntity>;
  user?: { is_admin: boolean };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

export interface Target {
  entity_id?: string[];
  area_id?: string[];
  device_id?: string[];
  floor_id?: string[];
  label_id?: string[];
}

export interface CurvePoint {
  t: number;
  brightness: number;
  kelvin?: number | null;
}

export interface LightConfig {
  target: Target;
  duration: number;
  start_brightness: number;
  end_brightness: number;
  use_color_temp: boolean;
  start_kelvin: number;
  end_kelvin: number;
  curve: "linear" | "smooth" | "custom";
  points: CurvePoint[];
  step_seconds: number;
}

export interface BehaviorConfig {
  snooze_minutes: number;
  snooze_light: "keep" | "dim" | "off";
  auto_stop_minutes: number;
  after_stop: "keep" | "off";
  stop_on_light_off: boolean;
}

export interface PresenceConfig {
  entities: string[];
  skip_when_away: boolean;
  stop_when_away: boolean;
}

export interface LastCallConfig {
  enabled: boolean;
  after_minutes: number;
  duration: number;
  target: Target;
  brightness: number;
  kelvin: number | null;
  actions: Record<string, unknown>[];
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
  next_sunrise: string | null;
  test: boolean;
  alarm_time: string | null;
  sunrise_start: string | null;
  ring_started: string | null;
  snooze_until: string | null;
  last_call_started: string | null;
}

export interface Alarm {
  id: string;
  name: string;
  enabled: boolean;
  time: string;
  days: number[];
  date: string | null;
  skip_date: string | null;
  light: LightConfig;
  behavior: BehaviorConfig;
  presence: PresenceConfig;
  last_call: LastCallConfig;
  runtime: AlarmRuntime;
}

export type AlarmInput = Omit<Alarm, "id" | "runtime"> & { id?: string };

export interface Snapshot {
  alarms: Alarm[];
  next: { alarm_id: string; time: string } | null;
}

export type AlarmAction =
  | "snooze"
  | "stop"
  | "skip_next"
  | "cancel_skip"
  | "test"
  | "enable"
  | "disable";

export const ACTIVE_STATES: AlarmState[] = ["sunrise", "ringing", "snoozed", "last_call"];

export const createAlarm = (hass: HomeAssistant, alarm: Partial<AlarmInput>) =>
  hass.callWS<Alarm>({ type: "daybreak/alarm/create", alarm });

export const updateAlarm = (hass: HomeAssistant, alarmId: string, changes: Partial<AlarmInput>) =>
  hass.callWS<Alarm>({ type: "daybreak/alarm/update", alarm_id: alarmId, changes });

export const deleteAlarm = (hass: HomeAssistant, alarmId: string) =>
  hass.callWS<void>({ type: "daybreak/alarm/delete", alarm_id: alarmId });

export const alarmAction = (
  hass: HomeAssistant,
  action: AlarmAction,
  alarmId?: string,
  extra: Record<string, unknown> = {},
) => hass.callWS<void>({ type: "daybreak/alarm/action", action, alarm_id: alarmId, ...extra });

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
