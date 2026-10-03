import type { AlarmConfig, HomeAssistant } from "./api";
import { locale, t, weekdayNames } from "./i18n";

// Alarms are defined in Home Assistant's time zone, so always show times there.
export const timeZone = (hass?: HomeAssistant) => hass?.config?.time_zone || undefined;

function hour12(hass?: HomeAssistant): boolean | undefined {
  const fmt = hass?.locale?.time_format;
  if (fmt === "12") return true;
  if (fmt === "24") return false;
  return undefined;
}

export function formatTime(hass: HomeAssistant | undefined, iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat(locale(hass), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: hour12(hass),
    timeZone: timeZone(hass),
  }).format(date);
}

/** Format an "HH:MM" wall-clock time in the user's 12/24 h preference. */
export function formatClock(hass: HomeAssistant | undefined, hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  return new Intl.DateTimeFormat(locale(hass), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: hour12(hass),
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2024, 0, 1, h, m)));
}

export function formatDay(hass: HomeAssistant | undefined, iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso) : iso;
  return new Intl.DateTimeFormat(locale(hass), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: typeof iso === "string" && iso.length === 10 ? "UTC" : timeZone(hass),
  }).format(date);
}

/** "2 h 05 min" / "3 d 4 h" style countdown. */
export function countdown(hass: HomeAssistant | undefined, iso: string, now = Date.now()): string {
  let minutes = Math.max(0, Math.round((new Date(iso).getTime() - now) / 60000));
  const days = Math.floor(minutes / 1440);
  minutes -= days * 1440;
  const hours = Math.floor(minutes / 60);
  minutes -= hours * 60;
  if (days) return t(hass, "dur_dh", { d: days, h: hours });
  if (hours) return t(hass, "dur_hm", { h: hours, m: String(minutes).padStart(2, "0") });
  return t(hass, "dur_m", { m: minutes });
}

// ---- wall-clock arithmetic on "HH:MM" (minutes since midnight, wraps) ----

export const toMin = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const toHHMM = (minutes: number): string => {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/** Local date (YYYY-MM-DD) in HA's time zone. */
export function localDate(hass: HomeAssistant | undefined, when: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timeZone(hass),
  }).format(when);
  return parts;
}

/** Local "HH:MM" of an ISO time in HA's time zone. */
export function localHHMM(hass: HomeAssistant | undefined, iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: timeZone(hass),
  }).format(date);
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const weekdayOf = (isoDate: string): number => (new Date(`${isoDate}T12:00:00Z`).getUTCDay() + 6) % 7;

/** Does the repeat rule select a day? Same logic as scheduler.day_matches. */
export function dayMatches(alarm: AlarmConfig, isoDate: string): boolean {
  const rep = alarm.repeat;
  if (rep.type === "once") return rep.date === null || rep.date === isoDate;
  const anchor = rep.start_date ?? "2024-01-01";
  const diff = Math.round(
    (new Date(`${isoDate}T12:00:00Z`).getTime() - new Date(`${anchor}T12:00:00Z`).getTime()) / 86400000,
  );
  if (rep.type === "weekly") {
    if (!rep.days.includes(weekdayOf(isoDate))) return false;
    if (rep.week_cycle <= 1) return true;
    const mondayDiff = diff + weekdayOf(anchor);
    const week = (((Math.floor(mondayDiff / 7) % rep.week_cycle) + rep.week_cycle) % rep.week_cycle);
    return rep.weeks[week] ?? false;
  }
  if (diff < 0) return false;
  if (rep.type === "interval") return diff % (rep.interval * (rep.unit === "weeks" ? 7 : 1)) === 0;
  return rep.pattern[diff % rep.pattern.length] ?? false;
}

export function repeatSummary(hass: HomeAssistant | undefined, alarm: AlarmConfig): string {
  const rep = alarm.repeat;
  if (rep.type === "once") return rep.date ? t(hass, "on_date", { date: formatDay(hass, rep.date) }) : t(hass, "once");
  if (rep.type === "interval")
    return t(hass, rep.unit === "weeks" ? "every_n_weeks" : "every_n_days", { n: rep.interval });
  if (rep.type === "pattern")
    return t(hass, "pattern_summary", { on: rep.pattern.filter(Boolean).length, n: rep.pattern.length });
  const days = [...rep.days].sort();
  let text: string;
  if (days.length === 7) text = t(hass, "every_day");
  else if (days.join() === "0,1,2,3,4") text = t(hass, "weekdays");
  else if (days.join() === "5,6") text = t(hass, "weekend");
  else text = days.map((d) => weekdayNames(hass)[d]).join(", ");
  if (rep.week_cycle > 1) text += " · " + t(hass, "week_cycle_short", { n: rep.week_cycle });
  return text;
}

export function friendlyName(hass: HomeAssistant | undefined, entityId: string): string {
  return hass?.states[entityId]?.attributes.friendly_name ?? entityId;
}

/** Light entity ids referenced by a target (entities, devices, areas). */
export function lightsOf(hass: HomeAssistant | undefined, target: { entity_id?: string[]; device_id?: string[]; area_id?: string[] }): string[] {
  if (!hass) return target.entity_id ?? [];
  const out = new Set<string>((target.entity_id ?? []).filter((e) => e.startsWith("light.")));
  const entities = Object.values(hass.entities ?? {});
  const devices = hass.devices ?? {};
  for (const ent of entities) {
    if (!ent.entity_id.startsWith("light.")) continue;
    if (ent.device_id && target.device_id?.includes(ent.device_id)) out.add(ent.entity_id);
    const area = ent.area_id ?? (ent.device_id ? devices[ent.device_id]?.area_id : null);
    if (area && target.area_id?.includes(area)) out.add(ent.entity_id);
  }
  return [...out].sort();
}

/**
 * HA lazy-loads ha-form & selectors. Opening any card editor once pulls them
 * in, which is the documented trick for custom panels and card editors.
 */
let loading: Promise<void> | undefined;
export function loadHaComponents(): Promise<void> {
  if (customElements.get("ha-form") && customElements.get("ha-selector")) return Promise.resolve();
  loading ??= (async () => {
    const helpers = await (window as any).loadCardHelpers?.();
    if (helpers) {
      const card = await helpers.createCardElement({ type: "entities", entities: [] });
      await card?.constructor?.getConfigElement?.();
    }
    await customElements.whenDefined("ha-form");
  })();
  return loading;
}

export function fireEvent(node: HTMLElement, type: string, detail: unknown = {}): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
