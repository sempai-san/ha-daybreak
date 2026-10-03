import type { Alarm, HomeAssistant, LightConfig } from "./api";
import { locale, t, weekdayNames } from "./i18n";

// Alarms are defined in Home Assistant's time zone, so always show times there.
const timeZone = (hass?: HomeAssistant) => hass?.config?.time_zone || undefined;

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

/** Format an "HH:MM" wall-clock alarm time in the user's 12/24 h preference. */
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
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat(locale(hass), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: timeZone(hass),
  }).format(date);
}

/** "2 h 05 min" / "3 d 4 h" style countdown. */
export function countdown(iso: string, now = Date.now()): string {
  let minutes = Math.max(0, Math.round((new Date(iso).getTime() - now) / 60000));
  const days = Math.floor(minutes / 1440);
  minutes -= days * 1440;
  const hours = Math.floor(minutes / 60);
  minutes -= hours * 60;
  if (days) return `${days} d ${hours} h`;
  if (hours) return `${hours} h ${String(minutes).padStart(2, "0")} min`;
  return `${minutes} min`;
}

export function repeatSummary(hass: HomeAssistant | undefined, alarm: Pick<Alarm, "days" | "date">): string {
  const days = [...alarm.days].sort();
  if (!days.length) {
    return alarm.date ? t(hass, "on_date", { date: formatDay(hass, `${alarm.date}T12:00:00Z`) }) : t(hass, "once");
  }
  if (days.length === 7) return t(hass, "every_day");
  if (days.join() === "0,1,2,3,4") return t(hass, "weekdays");
  if (days.join() === "5,6") return t(hass, "weekend");
  const names = weekdayNames(hass);
  return days.map((d) => names[d]).join(", ");
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

/** Same curve maths as the backend (curve.py). */
export function levelAt(light: LightConfig, progress: number): { brightness: number; kelvin: number | null } {
  const x = Math.min(1, Math.max(0, progress));
  const useCt = light.use_color_temp;
  if (light.curve === "custom" && light.points.length >= 2) {
    const pts = [...light.points].sort((a, b) => a.t - b.t);
    const fallback = useCt ? light.end_kelvin : null;
    if (x <= pts[0].t) return { brightness: pts[0].brightness, kelvin: useCt ? pts[0].kelvin || fallback : null };
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      if (x <= b.t) {
        const span = b.t - a.t;
        const ratio = span <= 0 ? 0 : (x - a.t) / span;
        const kelvin =
          a.kelvin && b.kelvin ? a.kelvin + (b.kelvin - a.kelvin) * ratio : a.kelvin || b.kelvin || fallback;
        return { brightness: a.brightness + (b.brightness - a.brightness) * ratio, kelvin: useCt ? kelvin : null };
      }
    }
    const last = pts[pts.length - 1];
    return { brightness: last.brightness, kelvin: useCt ? last.kelvin || fallback : null };
  }
  const eased = light.curve === "linear" ? x : x * x * (3 - 2 * x) * 0.4 + x * x * 0.6;
  return {
    brightness: light.start_brightness + (light.end_brightness - light.start_brightness) * eased,
    kelvin: useCt ? light.start_kelvin + (light.end_kelvin - light.start_kelvin) * x : null,
  };
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
