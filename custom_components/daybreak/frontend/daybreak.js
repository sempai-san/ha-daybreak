const ct = "0.6.0", zt = window.__daybreakVersion ?? (customElements.get("daybreak-panel") ? "old" : void 0);
if (zt && zt !== ct) {
  const l = `daybreak-reloaded-${ct}`;
  let e = !1;
  try {
    e = !sessionStorage.getItem(l), sessionStorage.setItem(l, "1");
  } catch {
  }
  throw e && window.location.reload(), new Error(`DayBreak ${zt} is already running; reload the page to use ${ct}.`);
}
window.__daybreakVersion = ct;
const mi = (l, e) => l.callWS({ type: "daybreak/calendar/preview", alarm: e }), gi = (l, e, t) => l.callWS({ type: "daybreak/alarm/test", alarm_id: e, ...t }), fi = ["climate", "fan", "humidifier", "water_heater", "switch", "input_boolean"], bi = [
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
  "fallback"
], Dt = {
  simple: ["sun", "pattern", "week_cycle", "calendar", "overrides", "lamp_start", "tts", "climate", "actions", "none"],
  normal: []
}, Nt = ["sunrise", "ringing", "snoozed", "last_call"], Ks = (l, e) => l.callWS({ type: "daybreak/alarm/create", alarm: e }), vi = (l, e, t) => l.callWS({ type: "daybreak/alarm/update", alarm_id: e, changes: t }), $i = (l, e) => l.callWS({ type: "daybreak/alarm/delete", alarm_id: e }), Ft = (l, e, t, s = {}) => l.callWS({ type: "daybreak/alarm/action", action: e, alarm_id: t, ...s }), xi = (l, e, t, s, i = null) => l.callWS({ type: "daybreak/alarm/once", alarm_id: e, date: t, time: s, light_lead: i }), jt = (l, e) => l.callWS({ type: "daybreak/settings", changes: e }), Me = (l, e, t, s = !1) => l.callWS({ type: "daybreak/profile/save", kind: e, profile: t, confirm: s }), Ht = (l, e, t) => l.callWS({ type: "daybreak/profile/delete", kind: e, profile_id: t }), St = /* @__PURE__ */ new Map();
function Us(l, e, t = 1) {
  const s = `${e}/${t}`;
  let i = St.get(s);
  return i || (i = l.callWS({ type: "daybreak/sun", date: e, days: t }), i.catch(() => St.delete(s)), St.set(s, i)), i;
}
const wi = (l, e, t, s) => l.callWS({ type: "daybreak/preview", entity_id: e, settings: t, progress: s }), Is = "0.6.0";
let qs = !1;
function yi(l) {
  if (!l || l === Is) return;
  const e = `daybreak-reloaded-${l}`;
  try {
    if (!sessionStorage.getItem(e)) {
      sessionStorage.setItem(e, "1"), window.location.reload();
      return;
    }
  } catch {
  }
  qs = !0;
}
const bs = /* @__PURE__ */ new WeakMap();
function Vs(l, e) {
  let t = bs.get(l.connection);
  t || (t = { listeners: /* @__PURE__ */ new Set() }, bs.set(l.connection, t));
  const s = t;
  return s.listeners.add(e), s.last && e(s.last), s.unsub || (s.unsub = l.connection.subscribeMessage(
    (i) => {
      yi(i.version), s.last = i, s.listeners.forEach((n) => n(i));
    },
    { type: "daybreak/subscribe" }
  ), s.unsub.catch(() => {
    s.unsub = void 0;
  })), () => {
    if (s.listeners.delete(e), s.listeners.size === 0 && s.unsub) {
      const i = s.unsub;
      s.unsub = void 0, s.last = void 0, i.then((n) => n()).catch(() => {
      });
    }
  };
}
const ki = (l, e, t) => l.callWS({ type: "daybreak/ma_search", query: e, media_type: t ?? null });
let at;
function zi(l) {
  return at ??= l.callWS({ type: "daybreak/phones" }), at.catch(() => at = void 0), at;
}
const $t = {
  title: "DayBreak",
  stale_title: "A new DayBreak version is installed",
  stale_text: "This device still shows the old version. Reload the page; in the Home Assistant app use Settings → Companion App → Debugging → Reset frontend cache.",
  stale_reload: "Reload",
  tab_alarms: "Alarms",
  tab_profiles: "Light profiles",
  tab_last_call: "Last call",
  tab_settings: "Settings",
  tab_climate: "Climate",
  section_climate: "Climate",
  feat_climate: "Climate",
  feat_climate_d: "Heating, cooling, fans or humidity before waking up",
  cl_intro: "Climate profiles: how warm or cool it should be when you wake up. Every alarm can use one of them or its own settings.",
  cl_new_name: "New climate profile",
  builtin_warm: "Wake up warm",
  builtin_cool: "Wake up cool",
  cl_on: "Climate before waking up",
  cl_on_d: "Heat, cool, ventilate or set the humidity so the room is ready at the alarm time.",
  cl_devices: "Devices",
  cl_devices_hint: "Thermostats, air conditioners, fans, (de)humidifiers, water heaters or switches",
  cl_settings: "Climate settings",
  cl_room: "Room temperature (optional)",
  cl_room_hint: "Without a sensor the thermostat's own reading is used.",
  cl_windows: "Window and door contacts (optional)",
  cl_windows_hint: "While one is open nothing starts; a running climate pauses until it is closed.",
  cl_presence: "Only when somebody is home",
  cl_presence_none: "No presence entities are set in this alarm's conditions, so this counts as home.",
  cl_mode: "Mode",
  clm_heat: "Heat",
  clm_cool: "Cool",
  clm_heat_cool: "Heat/cool",
  clm_auto: "Auto",
  clm_dry: "Dry",
  clm_fan_only: "Fan",
  cl_temperature: "Target temperature",
  cl_fan: "Fan",
  cl_humidity: "Humidity",
  cl_water: "Water",
  cl_only_needed: "Only if the room is not at the target yet",
  cl_start: "Start",
  cl_start_fixed: "Fixed time",
  cl_start_learned: "Automatic (learned)",
  cl_lead: "Minutes before the alarm",
  cl_max_lead: "At most minutes before the alarm",
  cl_start_fixed_d: "Starts the same time before every alarm.",
  cl_start_learned_d: "DayBreak learns how fast the room warms up or cools down and starts just in time. In the evening it plans with the weather forecast, shortly before with the current temperature.",
  cl_samples: "Learned from {n} mornings.",
  cl_after: "After waking up",
  cl_after_restore: "Previous state",
  cl_after_off: "Switch off",
  cl_after_presence: "While somebody is home",
  cl_after_restore_d: "The devices go back to how they were before (after the minutes above; 0 = right away).",
  cl_after_off_d: "The devices switch off (after the minutes above; 0 = right away).",
  cl_after_presence_d: "Keeps running until everybody has left, then goes back to the previous state. The minutes are a limit (0 = none).",
  cl_minutes_after: "After minutes",
  cl_minutes_max: "At most minutes",
  cl_outdoor: "Outdoor temperature",
  cl_outdoor_below: "Only when colder than (°C)",
  cl_outdoor_above: "Only when warmer than (°C)",
  cl_outdoor_d: "Uses the weather or temperature sensor from the settings. Empty = always.",
  tl_climate: "Climate",
  cl_planned: "starts about {time}",
  cl_active: "running",
  new_alarm: "New",
  new_what: "What would you like to create?",
  kind_wake: "Wake-up light",
  kind_wake_d: "Sunrise before the alarm, snooze, last call.",
  kind_wake_name: "Alarm",
  kind_sleep: "Sleep light",
  kind_sleep_d: "Light slowly fades out while you fall asleep.",
  kind_sleep_name: "Sleep light",
  kind_kids: "OK-to-wake light",
  kind_kids_d: "Red means stay in bed, green means you may get up.",
  kind_kids_name: "OK to wake",
  no_alarms: "No alarms yet. Create your first sunrise alarm.",
  next_alarm: "Next alarm",
  no_next: "No alarm scheduled",
  in_label: "in",
  quick: "Quick actions",
  quick_test: "Test next alarm",
  quick_skip: "Skip next alarm",
  quick_once: "Only next time: other time",
  quick_once_clear: "Undo one-time change",
  once_badge: "Changed once",
  shifted_by: "{min} min earlier",
  light_from: "Light from {time}",
  enabled: "Enabled",
  dur_dh: "{d} d {h} h",
  dur_hm: "{h} h {m} min",
  dur_m: "{m} min",
  edit: "Edit",
  edit_copy: "Edit as copy",
  delete: "Delete",
  delete_confirm: 'Delete alarm "{name}"?',
  remove: "Remove",
  save: "Save",
  cancel: "Cancel",
  back: "Back",
  discard: "Discard",
  customize: "Customize",
  test: "Test",
  test_badge: "Test",
  skipped: "Skipped on {date}",
  cancel_skip: "Don't skip",
  snooze: "Snooze",
  snoozed_n: "snoozed {n}×",
  stop: "Stop",
  none: "None",
  nobody: "nobody",
  off: "Off",
  optional: "optional",
  default: "Default",
  from_version: "from {v}",
  home: "home",
  away: "away",
  state_disabled: "Disabled",
  state_idle: "No upcoming time",
  state_scheduled: "Scheduled",
  state_sunrise: "Sunrise running",
  state_ringing: "Ringing",
  state_snoozed: "Snoozed until {time}",
  state_last_call: "Last call",
  error: "Error: {msg}",
  err_profile_builtin: "Templates cannot be changed. Edit a copy instead.",
  err_profile_shared: "This profile is used by alarms of different people. Save your changes as a new profile.",
  err_profile_confirm: "This profile is used by several alarms. Please confirm the change.",
  err_profile_in_use: "The profile is still used by alarms.",
  err_unknown_profile: "The profile no longer exists.",
  err_unknown_alarm: "The alarm no longer exists.",
  err_no_upcoming: "The alarm has no upcoming time.",
  // modes
  mode: "Mode",
  mode_simple: "Simple",
  mode_normal: "Advanced",
  mode_expert: "Expert",
  mode_simple_hint: "Simple: time, days, lights and a ready-made curve.",
  mode_normal_hint: "Advanced: conditions, profiles, own curves, settings per lamp, actions and the last call.",
  mode_expert_hint: "Expert: everything, including colour sequences, per-alarm weather times and fine tuning.",
  // header / owners
  f_name: "Name",
  owners: "Belongs to",
  owner_add: "Add person",
  owner_none: "No more persons in Home Assistant.",
  owners_hint: "Shows whose alarm this is and protects shared profiles.",
  // time
  section_time: "Time & repeat",
  wake_fixed: "Fixed time",
  wake_sun: "Follow the sun",
  tl_light_start: "Light from",
  tl_wake: "Alarm",
  tl_last_call: "Last call",
  tl_stop: "Off at",
  tl_off: "Off at",
  tl_sleep_start: "Fade starts",
  tl_sleep_end: "Lights out",
  tl_kids_start: "Red from",
  tl_kids_end: "Green at",
  tl_snooze_title: "{n} × {m} min snooze",
  light_lead: "Light lead",
  snooze_hint: "Durations are set in the settings.",
  lc_row_hint: "If the alarm is still not stopped after the snoozes: all lights on for a short time.",
  once_toggle: "Only once different",
  once_hint: "Afterwards the normal time applies again.",
  once_on: "On",
  repeat: "Repeat",
  repeat_weekly: "Weekdays",
  repeat_interval: "Every X days",
  repeat_pattern: "Pattern",
  repeat_once: "Once",
  once: "Once",
  once_date: "Date",
  once_date_hint: "Empty = next possible time",
  on_date: "On {date}",
  every_day: "Every day",
  weekdays: "Weekdays",
  weekend: "Weekend",
  every_week: "Every week",
  week_cycle: "Week rhythm",
  week_cycle_short: "every {n} weeks",
  week_n: "Week {n}",
  week_on: "rings",
  week_off: "free",
  week_anchor: "Week 1 starts",
  every: "Every",
  every_n_days: "Every {n} days",
  every_n_weeks: "Every {n} weeks",
  unit_days: "days",
  unit_weeks: "weeks",
  from: "from",
  pattern_hint: "Your own cycle, e.g. for shift work: tap the days of the repeating cycle that ring.",
  pattern_cycle: "Cycle",
  pattern_day1: "days, day 1 is",
  pattern_summary: "{on} of {n} days",
  day_n: "Day {n}",
  preview_4w: "Preview: next 4 weeks",
  preview_legend: "highlighted = rings",
  holidays: "Ring on public holidays",
  holidays_hint: "Off = skipped on holidays (from {entity}).",
  holidays_none: "No workday sensor found. Add the Workday integration to skip holidays.",
  // sun
  sun_rise: "Sunrise",
  sun_set: "Sunset",
  sun_astronomical_dawn: "Astronomical dawn",
  sun_nautical_dawn: "Nautical dawn",
  sun_civil_dawn: "Civil dawn",
  sun_sunrise: "Sunrise",
  sun_sunset: "Sunset",
  sun_civil_dusk: "Civil dusk",
  sun_nautical_dusk: "Nautical dusk",
  sun_astronomical_dusk: "Astronomical dusk",
  sun_offset: "Minutes",
  sun_before: "before",
  sun_after: "after",
  sun_earliest: "earliest",
  sun_latest: "latest",
  sun_none: "This sun event does not happen on that day.",
  // conditions
  section_cond: "Conditions",
  section_weather: "Weather",
  simple_weather_hint: "Wake earlier in bad weather. The minutes are set once in the DayBreak settings.",
  weather_snow: "Snow / ice",
  weather_storm: "Storm",
  weather_rain: "Heavy rain",
  weather_entity_missing: "No weather entity set yet (settings).",
  weather_source: "Weather from {entity} (forecast for the alarm time).",
  weather_storm_hint: "Storm also counts official weather warnings from level {level} (settings).",
  presence: "Presence",
  presence_hint: "Only ring when someone is home. Stops when everybody leaves.",
  presence_off: "No presence check: the alarm always rings. Tap persons to ring only when someone is home.",
  presence_more: "Trackers, presence sensors, zones",
  skip_when_away: "Skip when nobody is home",
  stop_when_away: "Stop when everybody leaves",
  shift_title: "Wake earlier automatically",
  shift_intro: "Rings earlier when a reason applies. The light start moves along. The graphic shows your alarm and how far each reason can move it.",
  rule_weather_d: "Snow, storm, heavy rain, cold",
  rule_travel_d: "Longer drive than usual (e.g. Waze)",
  shift_row_normal: "Normal",
  shift_row_worst: "Worst case",
  shift_row_same: "no change",
  shift_cold: "Cold < {below} °C",
  shift_from_settings: "from the settings",
  shift_drag_hint: "drag to change",
  travel_depends: "depends on the drive",
  shift_hint_max: "Only the strongest reason counts, never more than the limit.",
  shift_hint_sum: "All reasons are added up, never more than the limit.",
  shift_hint: "Turn on a rule below to wake earlier for bad weather or a longer drive.",
  shift_cap: "At most",
  shift_normal: "normal {time}",
  shift_result: "worst case −{min} min → {time}",
  shift_upto: "up to −{min} min",
  shift_notify: "Notify me when the alarm moves",
  rule_weather: "Weather",
  rule_travel: "Travel time",
  travel_now: "now {min} min",
  travel_unknown: "no value",
  travel_pick: "choose sensor",
  travel_sensor: "Travel time sensor (e.g. Waze)",
  travel_usual: "Usual travel time (min)",
  travel_routine: "Morning routine until leaving (min)",
  travel_arrive: "Arrive by (optional)",
  travel_usual_hint: "Wakes earlier by as much as the drive takes longer than usual.",
  travel_arrive_hint: "Wakes so that routine + current drive end at the arrival time.",
  combine: "Several rules",
  combine_max: "Only the strongest rule",
  combine_sum: "Add all rules",
  cold_below: "Below",
  cold_minutes: "Cold: minutes earlier",
  min_earlier: "min earlier",
  cold_settings: "Cold: below {below} °C → {min} min earlier (settings).",
  // light
  section_light: "Light",
  targets: "Lights & rooms",
  picker_add: "Choose …",
  picker_change: "Change",
  picker_close: "Done",
  picker_search: "Search name, area or entity id",
  picker_no_area: "No area",
  picker_area_all: "Select all in this area",
  picker_area_none: "Deselect area",
  picker_group: "group",
  picker_other: "Other",
  picker_none: "Nothing found",
  targets_hint: "Lamps and light groups by floor, area and device. Ticking an area or device selects only its lamps; each one can be removed again.",
  no_lights: "No lights selected",
  n_lights: "Lamps: {n}",
  cap_color: "colour",
  cap_ct: "white",
  cap_dim: "dim",
  light_settings: "Light",
  light_common: "Shared settings",
  profile_none: "Own values (no profile)",
  profile_own: "Own values for this alarm.",
  profile_locked: 'Profile "{name}": values are shown but locked. "Customize" creates a new profile.',
  profile_new: "New profile:",
  profile_name_required: "Name required when saving",
  profile_copy_name: "{name} (copy)",
  per_target: "Settings per lamp (optional)",
  per_target_hint: "Own settings replace the shared ones completely for that lamp.",
  own_settings: "own settings",
  uses_common: "shared settings",
  use_own: "Use own settings",
  curve: "Curve",
  curve_natural: "Natural",
  curve_natural_d: "Starts very gently",
  curve_gentle: "Gentle",
  curve_gentle_d: "Even and soft",
  curve_linear: "Linear",
  curve_linear_d: "Steady rise",
  curve_fast: "Fast",
  curve_fast_d: "Bright early",
  curve_custom: "Custom",
  curve_custom_d: "Drag your own points",
  curve_points: "Curve points",
  ls_link: "Curves",
  ls_shared: "One curve",
  ls_separate: "Separate curves",
  ls_add_point: "+ Point",
  ls_remove_point: "Remove point",
  ls_strip: "Light colour over time",
  ls_time: "Time",
  ls_share: "Share",
  ls_value: "Value %",
  ls_brightness: "Brightness",
  ls_ct: "Colour temperature",
  ls_color: "Colour",
  ls_start: "Start",
  ls_end: "End",
  ls_ct_hint: "Warm to cool white. All lamps that can show white follow it.",
  ls_color_hint: "Colour lamps show the gradient, white lamps a matching colour temperature.",
  ls_kelvin_hint: "1800 K warm · 6500 K cool",
  ls_plain: "Lamps without colour: {lamps}",
  ls_plain_any: "Lamps without colour",
  ls_plain_follow: "follow the colour temperature",
  ls_matching: "matching",
  colors_sunrise: "Sunrise",
  colors_dawn: "Dawn",
  colors_pastel: "Pastel",
  colors_custom: "Own sequence",
  seq_color: "Colour",
  seq_minutes: "Minutes",
  seq_transition: "Transition",
  seq_smooth: "Smooth",
  seq_step: "Instant",
  seq_add: "+ Colour step",
  fine_title: "Fine tuning",
  fine_sum_step: "every {s} s",
  fine_step: "Update every (s)",
  fine_min_bri: "Minimum brightness (%)",
  fine_transition: "Transition",
  fine_offset: "Start later (min)",
  fine_ringing: "While ringing",
  fine_after: "After stopping",
  transition_auto: "Automatic",
  transition_always: "Always",
  transition_never: "Never (spares radio)",
  ringing_hold: "Keep light",
  ringing_pulse: "Gentle pulse",
  ringing_blink: "Blink (accessibility)",
  after_stop_keep: "Leave on",
  after_stop_off: "Switch off",
  after_stop_off_later: "Off after 30 min",
  // audio / actions
  section_audio: "Audio",
  audio_on: "Play audio",
  audio_on_d: "Music, radio or a sound on a speaker, quietly at first and then louder.",
  audio_players: "Speakers",
  audio_what: "What to play",
  audio_volume: "Volume & timing",
  audio_vol_start: "Start volume (%)",
  audio_vol_end: "End volume (%)",
  audio_lead: "Music starts before the alarm (min)",
  audio_ramp: "Gets louder over (min)",
  audio_start_at: "Music starts",
  audio_loud_at: "Full volume",
  audio_drag_hint: "Drag the points or type the values directly.",
  settings_modes: "What each mode shows",
  settings_modes_hint: "Choose which options the alarm editor offers in Simple and Advanced. Expert always shows everything. Options an alarm already uses stay visible.",
  settings_modes_reset: "Restore defaults",
  feat_sun: "Sun-based alarm",
  feat_sun_d: "Wake at sunrise or another sun position",
  feat_pattern: "Repeat pattern",
  feat_pattern_d: "Own day pattern, e.g. for shift work",
  feat_week_cycle: "Week cycle",
  feat_week_cycle_d: "Only every 2nd, 3rd or 4th week",
  feat_calendar: "Calendar",
  feat_calendar_d: "Skip or move alarms by calendar events",
  "hx_wx_clear-night": "clear night",
  hx_wx_cloudy: "cloudy",
  hx_wx_exceptional: "extreme weather",
  hx_wx_fog: "fog",
  hx_wx_hail: "hail",
  hx_wx_lightning: "thunderstorm",
  "hx_wx_lightning-rainy": "thunderstorm with rain",
  hx_wx_partlycloudy: "partly cloudy",
  hx_wx_pouring: "heavy rain",
  hx_wx_rainy: "rain",
  hx_wx_snowy: "snow",
  "hx_wx_snowy-rainy": "sleet",
  hx_wx_sunny: "sunny",
  hx_wx_windy: "windy",
  "hx_wx_windy-variant": "windy and cloudy",
  phase_last_call: "Last call",
  hx_hint: "Every alarm: rung, skipped, planned and test runs, newest first. Pick one to see step by step what happened, from the checks before the light to the end.",
  hx_pick: "Pick an alarm on the left to see its course.",
  hx_back: "All alarms",
  hx_today: "Today",
  hx_yesterday: "Yesterday",
  hx_f_all: "All",
  hx_f_problem: "Problems",
  hx_f_skipped: "Skipped",
  hx_f_test: "Test runs",
  hx_all_alarms: "All alarms",
  hx_l_ok: "worked",
  hx_l_warn: "worked, with notes",
  hx_l_problem: "problem",
  hx_l_skipped: "skipped / cancelled",
  hx_l_planned: "planned / running",
  hx_h_ok: "Everything worked",
  hx_h_warn: "Worked – with notes",
  hx_h_problem: "There was {n} problem(s)",
  hx_h_skipped: "Skipped",
  hx_h_planned: "Planned – preparing",
  hx_h_running: "Running right now",
  hx_h_cancelled: "Cancelled",
  hx_s_planned: "planned",
  hx_s_running: "running",
  hx_s_cancelled: "cancelled",
  hx_s_snoozed: "{n}× snoozed",
  hx_s_problems: "{n} problem(s)",
  hx_sum_alarm: "alarm time {time}",
  hx_sum_rang: "rang {time}",
  hx_sum_end: "ended {time}",
  hx_sum_duration: "{min} min in total",
  hx_seg_prep: "Preparation",
  hx_seg_sunrise: "Sunrise",
  hx_seg_ring: "Ringing",
  hx_seg_snooze: "Snoozing",
  hx_seg_last: "Last call",
  hx_seg_problem: "Problem / note",
  hx_ph_prep: "Preparation",
  hx_ph_prep_d: "checks before the light",
  hx_ph_sunrise: "Sunrise",
  hx_ph_sunrise_d: "light and music get stronger",
  hx_ph_wake: "Waking up",
  hx_ph_wake_d: "ringing, snoozing, last call",
  hx_ph_end: "End",
  hx_ph_end_d: "how it ended",
  hx_what_to_do: "What you can do",
  hx_checks_t: "Weather and travel time checked",
  hx_checks_none: "nothing special",
  hx_checks_weather: "weather: {w}",
  hx_checks_warning: "warning level {n}",
  hx_checks_travel: "travel {min} min",
  hx_checks_earlier: "alarm {min} min earlier ({why})",
  hx_checks_same: "no change needed",
  hx_reason_snow: "snow / ice",
  hx_reason_storm: "storm",
  hx_reason_rain: "heavy rain",
  hx_reason_warning: "weather warning",
  hx_reason_cold: "cold",
  hx_reason_travel: "longer travel time",
  hx_checks_failed_t: "Checks failed",
  hx_checks_h: "Check in the DayBreak settings that the weather entity and the travel time sensor still work. The alarm rings at its normal time.",
  hx_calendar_t: "Calendar",
  hx_calendar_d: "“{detail}” → {what} (rule {rule}).",
  hx_cal_time: "wake at {time}",
  hx_cal_ring: "rings instead of “{other}”",
  hx_cal_other: "rings",
  hx_holiday_override_t: "Public holiday",
  hx_holiday_override_d: "Today is a public holiday, but a calendar rule asks for the alarm.",
  hx_climate_wait_t: "Climate waits",
  hx_climate_wait_away: "Nobody is at home, so heating/cooling waits.",
  hx_climate_wait_outdoor: "Outside it is {outdoor} °C – not needed under your limit.",
  hx_climate_wait_window: "A window or door is open – nothing starts until it is closed.",
  hx_climate_start_t: "Climate started",
  hx_climate_start_d: "{mode} to {target} °C, {lead} min before the alarm ({how}).",
  hx_learned: "learned start",
  hx_fixed: "fixed start",
  hx_climate_paused: "Paused because a window is open.",
  hx_climate_not_needed_t: "Climate not needed",
  hx_climate_not_needed_d: "The room already has {room} °C.",
  hx_climate_not_needed_x: "The room is already at the target.",
  hx_presence_t: "Somebody is home",
  hx_presence_d: "{who} at home – the alarm starts.",
  hx_skipped_t: "Skipped",
  hx_skip_away: "Nobody was at home, so the alarm did not ring.",
  hx_skip_away_h: "Was somebody at home after all? Check the presence entities of the alarm (Conditions): a phone that lost its location counts as away.",
  hx_skip_calendar: "Calendar: “{detail}” (rule {rule}) – no alarm on this day.",
  hx_skip_handed_over: "“{other}” rang instead (calendar: “{detail}”).",
  hx_skip_holiday: "Public holiday – this alarm is off on holidays.",
  hx_skip_manual: "You skipped this alarm once.",
  hx_cancelled_t: "Cancelled",
  hx_cancelled_d: "This occurrence fell away: the alarm time or days were changed or the alarm was switched off.",
  hx_start_t: "Sunrise starts",
  hx_start_nolight_t: "Alarm starts",
  hx_start_d: "{n} lamps start dimly and get brighter.",
  hx_start_shift: "{min} min earlier than usual.",
  hx_start_test: "Test run in time lapse (1 min = {s} s).",
  hx_music_t: "Music starts",
  hx_music_d: "Quietly on {n} speaker(s), then louder.",
  hx_music_playing_t: "Music is playing",
  hx_music_retry_t: "Music only on the second try",
  hx_music_retry_d: "“{src}” was not found at first; it played after a second try.",
  hx_music_retry_h: "Pick the music in the alarm again with the search, then it plays on the first try.",
  hx_audio_failed_t: "Music could not play",
  hx_audio_failed_h: "Check in Music Assistant that the title or station is still available and the speaker is reachable. Then pick the music in the alarm again and try it with the test run.",
  hx_lights_missing_t: "Lamps not reachable",
  hx_light_failed_t: "A lamp did not react",
  hx_light_h: "Check in Home Assistant that the lamp is online (power, Wi-Fi/Zigbee). Under Safety & notifications you can choose a spare lamp.",
  hx_push_t: "Phone notification",
  hx_push_ring: "“Alarm” with Snooze and Stop sent.",
  hx_push_snoozed: "“Snoozing” sent.",
  hx_push_last_call: "“Last call” sent.",
  hx_actions_t: "Own actions",
  hx_actions_d: "{n} action(s) at “{phase}” started.",
  hx_actions_failed_t: "An action failed",
  hx_actions_h: "Open the alarm → Actions and check the action; the full error is in the Home Assistant log.",
  hx_ring_t: "Alarm time reached",
  hx_ring_d: "Full light, the alarm rings.",
  hx_ring_again_t: "Rings again",
  hx_ring_again_d: "The snooze time is over.",
  hx_snooze_t: "Snoozed",
  hx_snooze_d: "{min} min (snooze {n}).",
  hx_button_t: "Speaker button",
  hx_button_d: "Pause was pressed on the speaker.",
  hx_last_call_t: "Last call",
  hx_last_call_d: "Nobody reacted: “{profile}” started.",
  hx_end_stopped: "Stopped",
  hx_end_stopped_d: "The alarm was stopped.",
  hx_end_stopped_s: "stopped",
  hx_end_auto_stop: "Ended by itself",
  hx_end_auto_stop_d: "Nobody stopped it; it ended after the snooze time.",
  hx_end_auto_stop_s: "ended by itself",
  hx_end_manual_light_off: "Lamp switched off",
  hx_end_manual_light_off_d: "A lamp was switched off by hand, which stops the alarm.",
  hx_end_manual_light_off_s: "lamp switched off",
  hx_end_away: "Everybody left",
  hx_end_away_d: "Everybody left home, so the alarm stopped.",
  hx_end_away_s: "everybody left",
  hx_end_last_call_timeout: "Last call over",
  hx_end_last_call_timeout_d: "The last call ended without anybody reacting.",
  hx_end_last_call_timeout_s: "last call over",
  hx_end_disabled: "Switched off",
  hx_end_disabled_d: "The alarm was switched off while it was running.",
  hx_end_disabled_s: "switched off",
  tr_state_sunrise: "Sunrise running",
  tr_state_ringing: "Ringing",
  tr_state_snoozed: "Snoozing",
  tr_state_last_call: "Last call",
  tr_snooze: "Snooze",
  tab_history: "History",
  hs_hint: "The last 10 runs of all alarms, tests and skipped alarms included. Problems are marked red; more details are in the Home Assistant log (Settings → System → Logs).",
  hs_empty: "No alarm has run yet. Start a test run in the alarm editor.",
  hs_test: "Test",
  hs_alarm_at: "alarm {time}",
  hs_problems: "{n} problem(s)",
  hs_result_running: "running",
  hs_result_skipped: "skipped",
  hs_result_stopped: "stopped",
  hs_result_auto_stop: "ended by itself",
  hs_result_manual_light_off: "stopped by switching a lamp off",
  hs_result_away: "stopped, everybody left",
  hs_result_last_call_timeout: "last call ended",
  hs_result_disabled: "switched off",
  hs_start: "Start",
  hs_climate: "Climate is running",
  hs_music: "Music starts",
  hs_ring: "Rings",
  hs_ring_again: "Rings again",
  hs_snooze: "Snooze",
  hs_button: "Speaker button",
  hs_last_call: "Last call",
  hs_lights_missing: "Lamps missing",
  hs_light_failed: "Lamp did not react",
  hs_audio_failed: "Audio problem",
  hs_skipped_away: "Skipped: nobody home",
  hs_end_stopped: "Stopped",
  hs_end_auto_stop: "Ended by itself",
  hs_end_manual_light_off: "Lamp switched off",
  hs_end_away: "Everybody left",
  hs_end_last_call_timeout: "Last call over",
  hs_end_disabled: "Switched off",
  hs_lamps: "{n} lamps",
  hs_light_from: "light from {time}",
  hs_shift: "{min} min earlier",
  hs_speakers: "{n} speaker(s)",
  hs_snooze_d: "{min} min · {n}.",
  tr_title: "Test run",
  tr_hint: "Runs with the settings shown here, also unsaved ones, in time lapse. Snooze, last call and the music ramp run faster too.",
  tr_save_first: "Save the alarm once to test it.",
  tr_nothing: "Choose lamps or speakers first.",
  tr_speed: "Time lapse",
  tr_real: "Real time",
  tr_lapse: "1 min = {s} s",
  tr_start_light: "From the light start",
  tr_start_ring: "Right at the alarm",
  tr_part_light: "Light",
  tr_part_audio: "Audio",
  tr_until: "Alarm in {time}",
  tr_ring_now: "Rings right away",
  tr_snooze_info: "Snooze and Stop work as in the morning",
  tr_start: "Start test run",
  tr_simulated: "Simulated time",
  tr_snooze_left: "ringing again in {time}",
  tr_problems: "Problems in the last run",
  section_calendar: "Calendar",
  calr_on: "Use calendar rules",
  calr_on_d: "Skip or move the alarm by appointments, e.g. vacation, early shift or the first meeting.",
  calr_hint: "Checked from top to bottom: the first rule that matches decides the day.",
  calr_enabled: "Rule active",
  calr_if: "If an event in",
  calr_then: "then",
  calr_all_cals: "all calendars",
  calr_no_cals: "No calendars found in Home Assistant.",
  calr_word_ph: "Keyword, then Enter",
  calr_words_hint: "Found in the title or the description, upper/lower case does not matter.",
  calr_no_words: "Without keywords every event counts.",
  calr_match_any: "one of the words",
  calr_match_all: "all words",
  calr_and: "and",
  calr_or: "or",
  calr_any_event: "any event",
  calr_sentence: "{cals}: {words} → {then}",
  calr_then_skip: "no alarm",
  calr_then_time: "wake at {time}",
  calr_then_before: "{min} min before it starts",
  calr_then_before_travel: "{min} min + travel before it starts",
  calr_then_alarm: "“{name}” rings instead",
  calr_act_skip: "No alarm",
  calr_act_time: "Other time",
  calr_act_before: "Before the event",
  calr_act_alarm: "Other alarm",
  calr_time: "Wake at",
  calr_before: "Wake up before the event",
  calr_before_travel: "Time to get ready",
  calr_travel: "Add the travel time to the event location",
  calr_before_hint: "Uses the first matching event of the day that has a start time.",
  calr_alarm: "Instead ring",
  calr_alarm_hint: "This alarm stays silent on that day; the chosen alarm rings at its own time, even on days it is not set for. If it is switched off, this alarm rings as usual.",
  calr_alarm_none: "Create another alarm first.",
  calr_any_day: "Also on days this alarm is not set for",
  calr_add: "Rule",
  calr_tpl_vacation: "Vacation",
  calr_tpl_vacation_w: "Vacation",
  calr_tpl_early: "Early shift",
  calr_tpl_early_w: "Early shift",
  calr_tpl_event: "Appointment",
  calr_tpl_event_w: "Appointment",
  calr_travel_title: "Travel time",
  calr_travel_hint: "Waze calculates the trip from the start to the location of the event, with live traffic in the last 3 hours.",
  calr_no_waze: "Waze Travel Time is not set up in Home Assistant: the fixed travel time below is used.",
  calr_origin: "Start (empty = home)",
  calr_origin_hint: "A person, zone or device tracker. Empty: your home location.",
  calr_vehicle_car: "Car",
  calr_vehicle_motorcycle: "Motorcycle",
  calr_vehicle_taxi: "Taxi",
  calr_toll: "Avoid toll roads",
  calr_region: "Region",
  calr_region_auto: "Automatic",
  calr_fallback: "Without Waze or location",
  calp_title: "Next days",
  calp_normal: "as usual",
  calp_free: "no alarm",
  calp_rule: "Rule {n}",
  calp_skip: "skipped",
  calp_alarm: "“{name}” rings",
  calp_ring: "instead of “{name}”",
  calp_travel: "{min} min travel",
  cal_summary: "{n} rules",
  move_up: "Move up",
  move_down: "Move down",
  feat_conditions: "Conditions & weather",
  feat_conditions_d: "Presence, shift and weather",
  feat_overrides: "Per-lamp settings",
  feat_overrides_d: "Own brightness or colour for single lamps",
  feat_lamp_start: "Start per lamp",
  feat_lamp_start_d: "Each lamp can start later, one row per lamp on the time line",
  tl_lamp_start: "Lamp starts",
  lamp_start_on: "Start per lamp",
  lamp_start_on_d: "Each lamp gets its own row and can start later. It still reaches its target at the alarm time.",
  all_own_settings: "Every lamp has its own settings (below), so there are no common settings.",
  audio_add_point: "+ Point",
  audio_remove_point: "− Point",
  audio_point_hint: "Tap a point to change its time and volume.",
  feat_audio: "Audio",
  feat_audio_d: "Music or sound on speakers",
  feat_tts: "Announcement",
  feat_tts_d: "Speak time, weather or a text",
  feat_push: "Phone",
  feat_push_d: "Push with Snooze and Stop buttons",
  feat_actions: "Actions",
  feat_actions_d: "Own actions at start, alarm, snooze and stop",
  feat_none: "If nobody reacts",
  feat_none_d: "What happens if nobody reacts",
  feat_fallback: "Safety & notifications",
  feat_fallback_d: "Spare lamps and notifications on errors",
  audio_behaviour: "Speaker behaviour",
  audio_button: "Pause on the speaker (e.g. HomePod) = snooze, during the last call = stop",
  audio_button_hint: "Pausing on the speaker (e.g. tapping the HomePod) snoozes; during the last call it stops the alarm.",
  audio_pause: "Pause the music while snoozing",
  audio_restore: "Put the old volume back afterwards",
  tts_title: "Announcement",
  tts_short: "announcement",
  tts_on: "Spoken greeting at the alarm time",
  tts_on_d: "Read out by the speakers, e.g. the time and the weather.",
  tts_ph: "Good morning! It is {{ time }}, outside {{ temperature }} degrees.",
  tts_vars: "You can use {{ time }}, {{ name }}, {{ temperature }}, {{ weather }} and {{ shift }} (minutes earlier). Templates like in Home Assistant work too.",
  tts_engine: "Voice",
  tts_auto: "Automatic",
  src_music_assistant: "Music Assistant",
  src_url: "Sound / URL",
  src_none: "No music",
  ma_missing: "Music Assistant is not set up in Home Assistant.",
  ma_search_ph: "Search playlist, radio station, album, track …",
  ma_manual: "Enter an address manually",
  media_all: "Everything",
  media_playlist: "Playlist",
  media_radio: "Radio",
  media_album: "Album",
  media_track: "Track",
  media_artist: "Artist",
  media_podcast: "Podcast",
  media_audiobook: "Audiobook",
  search: "Search",
  change: "Change",
  url_hint: "A sound file or stream (http/https or media-source). It is played again if it ends while the alarm is ringing.",
  section_push: "Phone",
  push_on: "Notification with Snooze and Stop",
  push_on_d: "The alarm also appears on the phone, with buttons to snooze or stop it.",
  push_owners: "Send to the phones of the owners",
  push_found: "Found: {devices}",
  push_none_found: "No Home Assistant app found for the owners.",
  push_no_owner: "No owner set (see the top of the editor).",
  push_no_device: "no device",
  push_more: "More devices",
  push_no_apps: "No Home Assistant companion app is set up yet.",
  push_critical: "Last call as a critical alert",
  push_critical_d: "Rings even when the phone is silent or in Do Not Disturb (iPhone; Android uses the alarm channel).",
  lc_audio_own: "Own audio: {name}",
  lc_audio_keep: "Keeps the alarm's music, only louder if set.",
  lc_audio_keep_short: "Keep alarm music",
  lc_volume: "Volume (%)",
  lc_volume_ph: "as at the end of the alarm",
  audio_lc_soon: "Audio for the last call follows in version 0.3.",
  section_actions: "Actions",
  n_actions: "{n} actions",
  phase_light_start: "Light starts",
  phase_wake: "Alarm",
  phase_snooze: "Snooze",
  phase_stop: "Stop",
  phase_light_start_hint: "Runs when the light starts, e.g. open the blinds a little.",
  phase_wake_hint: "Runs at the alarm time, e.g. start the coffee machine.",
  phase_snooze_hint: "Runs every time the alarm is snoozed.",
  phase_stop_hint: "Runs when the alarm ends, however it ends.",
  // no reaction
  section_none: "If nobody reacts",
  none_hint: "What happens when the alarm is not stopped. Snoozing does not count as a reaction.",
  last_call: "Last call",
  ladder_ring: "Alarm",
  ladder_ring_d: "Light at full level, actions start.",
  ladder_snooze: "{n} × snooze of {m} min",
  ladder_snooze_d: "Snoozing is possible during this time.",
  ladder_last_call: "Last call",
  ladder_last_call_d: 'Profile "{name}": all lights on, actions, ends by itself.',
  ladder_stop: "Stop",
  ladder_stop_d: "The alarm stops by itself.",
  lc_at: "Last call at",
  stop_at: "Stop at",
  lc_snap: "Snaps to snooze steps (after {n}× snooze) and moves along with an earlier alarm.",
  lc_summary: "{time} · {name}",
  lc_stop_at: "stops at {time}",
  lc_profile_desc: "{min} min · {bri} %",
  profiles_manage: "Manage profiles →",
  stop_on_light_off: "Switching a lamp off stops the alarm",
  stop_on_light_off_d: "A lamp switched off by hand or by a switch counts as a reaction.",
  // fallback
  section_fb: "Safety & notifications",
  fb_spare: "Spare lamp",
  fb_spare_hint: "Used if a lamp cannot be reached at the start.",
  fb_n_spare: "{n} spare lamps",
  fb_notify: "Notify via",
  fb_notify_ph: "e.g. notify.mobile_app_phone",
  fb_notifications: "Notifications",
  fb_persistent: "Also show problems as a notification in Home Assistant",
  ev_started: "Sunrise started",
  ev_finished: "Alarm finished",
  ev_skipped: "Alarm skipped",
  ev_shifted: "Alarm moved",
  ev_device_unavailable: "Lamp not reachable",
  ev_failed: "Lamp could not be switched",
  ev_last_call: "Last call started",
  // profiles
  profiles_intro: "Light profiles define curve, brightness and colour. Every alarm can use a profile or its own values.",
  templates: "Templates",
  own_profiles: "Your profiles",
  template_ro: "Template · read-only",
  profile_new_btn: "New profile",
  profile_new_name: "New profile",
  profile_save: "Save profile",
  profile_delete_confirm: 'Delete profile "{name}"?',
  profile_shared_hint: "Locked: alarms of different people use this profile. Changing it would change someone else's alarm.",
  profile_in_use_hint: "Used by {n} alarms ({names}). Changes apply there immediately – I understand.",
  profile_duration_hint: "Suggested light lead when an alarm picks this profile.",
  used_by: "Used by",
  duration: "Duration",
  minute: "Minute",
  preview_on: "Preview on",
  // last call
  lc_intro: "What happens when nobody reacts despite the alarm. Every alarm can choose one of these profiles.",
  lc_new_name: "New last call",
  lc_detail_hint: "Starts only if the alarm was not stopped and ends by itself after the duration.",
  lc_duration: "Duration (min)",
  lc_lights: "Lights",
  lc_lights_hint: "Empty = the lights of the alarm.",
  lc_actions: "More actions",
  lc_actions_hint: "E.g. a loud speaker announcement or a scene.",
  lc_alarm_lights: "alarm lights",
  make_default: "Make default",
  // settings
  settings_general: "General",
  default_mode: "Editor mode",
  default_mode_hint: "How much the alarm editor shows: Simple = only the basics, Advanced = conditions, profiles and actions, Expert = everything. You can also switch at the top of the editor; DayBreak remembers the choice here.",
  holiday_entity: "Holiday source (Workday sensor)",
  holiday_used: "Used: {entity}",
  notify_default: "Default notification target",
  notify_hint: "Used for alarm notifications unless an alarm sets its own target.",
  settings_snooze: "Snooze",
  preset_add: "Snooze option",
  preset_new: "New",
  default_count: "Default number of snoozes",
  presets_hint: "Every alarm chooses one of these options. The radio button marks the default.",
  settings_weather: "Weather & warnings",
  settings_weather_hint: "Default minutes for waking earlier. Experts can change them per alarm.",
  weather_entity: "Weather entity",
  temperature_entity: "Outside temperature (optional, more precise)",
  warning_entities: "Weather warning sensors (e.g. DWD)",
  warning_level: "Warnings count from",
  warning_1: "Level 1 – weather warning",
  warning_2: "Level 2 – significant",
  warning_3: "Level 3 – severe",
  warning_4: "Level 4 – extreme",
  settings_backup: "Backup & share",
  backup_hint: "Export alarms and your own profiles as a file, or import them into another Home Assistant.",
  export: "Export",
  import: "Import …",
  import_invalid: "This is not a DayBreak export.",
  import_confirm: "Import {n} alarms and the profiles in the file? Existing alarms stay.",
  import_done: "{n} alarms imported.",
  builtin_natural: "Natural sunrise",
  builtin_gentle: "Gentle",
  builtin_linear: "Linear",
  builtin_fast: "Fast & bright",
  builtin_all_on: "All lights on",
  preset_standard: "Standard",
  preset_short: "Short",
  preset_long: "Long",
  // cards
  card_name: "DayBreak alarms",
  card_desc: "Your DayBreak alarms with switches, snooze and stop.",
  next_card_name: "DayBreak next alarm",
  next_card_desc: "Next alarm as a tile or a big bedside card.",
  c_title: "Title",
  c_show_disabled: "Show disabled alarms",
  c_show_controls: "Show snooze/stop while active",
  c_style: "Style",
  c_accent: "DayBreak colours",
  c_size: "Size",
  c_alarm: "Alarm (name or id, empty = next)",
  c_show_buttons: "Show buttons",
  c_show_progress: "Show sunrise progress",
  style_ha: "Home Assistant",
  style_mushroom: "Mushroom",
  style_bubble: "Bubble",
  size_tile: "Tile",
  size_large: "Large (bedside / tablet)"
}, Si = {
  title: "DayBreak",
  stale_title: "Eine neue DayBreak-Version ist installiert",
  stale_text: "Dieses Gerät zeigt noch die alte Version. Lade die Seite neu; in der Home-Assistant-App: Einstellungen → Companion App → Debugging → Frontend-Cache zurücksetzen.",
  stale_reload: "Neu laden",
  tab_alarms: "Wecker",
  tab_profiles: "Lichtprofile",
  tab_last_call: "Letzter Versuch",
  tab_settings: "Einstellungen",
  tab_climate: "Klima",
  section_climate: "Klima",
  feat_climate: "Klima",
  feat_climate_d: "Heizen, Kühlen, Lüften oder Luftfeuchte vor dem Wecken",
  cl_intro: "Klima-Profile: wie warm oder kühl es beim Aufwachen sein soll. Jeder Wecker kann eines davon oder eigene Einstellungen nutzen.",
  cl_new_name: "Neues Klima-Profil",
  builtin_warm: "Warm aufwachen",
  builtin_cool: "Kühl aufwachen",
  cl_on: "Klima vor dem Wecken",
  cl_on_d: "Heizen, kühlen, lüften oder die Luftfeuchte einstellen, damit der Raum zur Weckzeit passt.",
  cl_devices: "Geräte",
  cl_devices_hint: "Thermostate, Klimaanlagen, Ventilatoren, (Ent-)Feuchter, Warmwasser oder Schalter",
  cl_settings: "Klima-Einstellungen",
  cl_room: "Raumtemperatur (optional)",
  cl_room_hint: "Ohne Sensor wird der Messwert des Thermostats verwendet.",
  cl_windows: "Fenster- und Türkontakte (optional)",
  cl_windows_hint: "Solange einer offen ist, startet nichts; ein laufendes Klima pausiert, bis wieder zu ist.",
  cl_presence: "Nur wenn jemand zu Hause ist",
  cl_presence_none: "In den Bedingungen dieses Weckers sind keine Anwesenheits-Entitäten eingestellt, daher gilt: zu Hause.",
  cl_mode: "Modus",
  clm_heat: "Heizen",
  clm_cool: "Kühlen",
  clm_heat_cool: "Heizen/Kühlen",
  clm_auto: "Automatik",
  clm_dry: "Entfeuchten",
  clm_fan_only: "Lüften",
  cl_temperature: "Zieltemperatur",
  cl_fan: "Ventilator",
  cl_humidity: "Luftfeuchte",
  cl_water: "Warmwasser",
  cl_only_needed: "Nur wenn der Raum das Ziel noch nicht erreicht hat",
  cl_start: "Start",
  cl_start_fixed: "Feste Zeit",
  cl_start_learned: "Automatisch (gelernt)",
  cl_lead: "Minuten vor dem Wecken",
  cl_max_lead: "Höchstens Minuten vor dem Wecken",
  cl_start_fixed_d: "Startet immer gleich lange vor dem Wecken.",
  cl_start_learned_d: "DayBreak lernt, wie schnell der Raum warm oder kühl wird, und startet rechtzeitig. Abends plant es mit der Wettervorhersage, kurz vorher mit der aktuellen Temperatur.",
  cl_samples: "Gelernt aus {n} Morgen.",
  cl_after: "Nach dem Wecken",
  cl_after_restore: "Vorheriger Zustand",
  cl_after_off: "Ausschalten",
  cl_after_presence: "Solange jemand da ist",
  cl_after_restore_d: "Die Geräte gehen zurück auf den vorherigen Zustand (nach den Minuten oben; 0 = sofort).",
  cl_after_off_d: "Die Geräte schalten aus (nach den Minuten oben; 0 = sofort).",
  cl_after_presence_d: "Läuft weiter, bis alle weg sind, dann zurück auf den vorherigen Zustand. Die Minuten sind eine Obergrenze (0 = keine).",
  cl_minutes_after: "Nach Minuten",
  cl_minutes_max: "Höchstens Minuten",
  cl_outdoor: "Außentemperatur",
  cl_outdoor_below: "Nur wenn kälter als (°C)",
  cl_outdoor_above: "Nur wenn wärmer als (°C)",
  cl_outdoor_d: "Nutzt die Wetter-Entität bzw. den Temperatursensor aus den Einstellungen. Leer = immer.",
  tl_climate: "Klima",
  cl_planned: "startet ca. {time}",
  cl_active: "läuft",
  new_alarm: "Neu",
  new_what: "Was möchtest du anlegen?",
  kind_wake: "Lichtwecker",
  kind_wake_d: "Sonnenaufgang vor dem Wecken, Snooze, letzter Versuch.",
  kind_wake_name: "Wecker",
  kind_sleep: "Einschlaflicht",
  kind_sleep_d: "Das Licht wird beim Einschlafen langsam dunkler.",
  kind_sleep_name: "Einschlaflicht",
  kind_kids: "Aufsteh-Ampel",
  kind_kids_d: "Rot heißt liegen bleiben, grün heißt aufstehen erlaubt.",
  kind_kids_name: "Aufsteh-Ampel",
  no_alarms: "Noch keine Wecker. Leg deinen ersten Lichtwecker an.",
  next_alarm: "Nächster Wecker",
  no_next: "Kein Wecker geplant",
  in_label: "in",
  quick: "Schnellaktionen",
  quick_test: "Nächsten testen",
  quick_skip: "Nächsten überspringen",
  quick_once: "Nur nächstes Mal: andere Zeit",
  quick_once_clear: "Einmalige Änderung aufheben",
  once_badge: "Einmalig geändert",
  shifted_by: "{min} Min. früher",
  light_from: "Licht ab {time}",
  enabled: "Aktiv",
  dur_dh: "{d} T {h} Std",
  dur_hm: "{h} Std {m} Min",
  dur_m: "{m} Min",
  edit: "Bearbeiten",
  edit_copy: "Als Kopie bearbeiten",
  delete: "Löschen",
  delete_confirm: "Wecker „{name}“ löschen?",
  remove: "Entfernen",
  save: "Speichern",
  cancel: "Abbrechen",
  back: "Zurück",
  discard: "Verwerfen",
  customize: "Anpassen",
  test: "Testen",
  test_badge: "Test",
  skipped: "Übersprungen am {date}",
  cancel_skip: "Nicht überspringen",
  snooze: "Snooze",
  snoozed_n: "{n}× Snooze",
  stop: "Stopp",
  none: "Keine",
  nobody: "niemand",
  off: "Aus",
  optional: "optional",
  default: "Standard",
  from_version: "ab {v}",
  home: "zu Hause",
  away: "unterwegs",
  state_disabled: "Deaktiviert",
  state_idle: "Kein nächster Termin",
  state_scheduled: "Geplant",
  state_sunrise: "Sonnenaufgang läuft",
  state_ringing: "Klingelt",
  state_snoozed: "Snooze bis {time}",
  state_last_call: "Letzter Versuch",
  error: "Fehler: {msg}",
  err_profile_builtin: "Vorlagen lassen sich nicht ändern. Bearbeite stattdessen eine Kopie.",
  err_profile_shared: "Dieses Profil nutzen Wecker verschiedener Personen. Speichere deine Änderung als neues Profil.",
  err_profile_confirm: "Dieses Profil nutzen mehrere Wecker. Bitte bestätige die Änderung.",
  err_profile_in_use: "Das Profil wird noch von Weckern genutzt.",
  err_unknown_profile: "Das Profil gibt es nicht mehr.",
  err_unknown_alarm: "Den Wecker gibt es nicht mehr.",
  err_no_upcoming: "Der Wecker hat keinen nächsten Termin.",
  mode: "Modus",
  mode_simple: "Einfach",
  mode_normal: "Erweitert",
  mode_expert: "Experte",
  mode_simple_hint: "Einfach: Zeit, Tage, Lampen und eine fertige Kurve.",
  mode_normal_hint: "Erweitert: Bedingungen, Profile, eigene Kurven, Einstellungen pro Lampe, Aktionen und letzter Versuch.",
  mode_expert_hint: "Experte: alles, auch Farbfolgen, Wetterzeiten pro Wecker und Feineinstellungen.",
  f_name: "Name",
  owners: "Gehört zu",
  owner_add: "Person hinzufügen",
  owner_none: "Keine weiteren Personen in Home Assistant.",
  owners_hint: "Zeigt, wem der Wecker gehört, und schützt gemeinsam genutzte Profile.",
  section_time: "Zeit & Wiederholung",
  wake_fixed: "Feste Uhrzeit",
  wake_sun: "Nach der Sonne",
  tl_light_start: "Licht ab",
  tl_wake: "Weckzeit",
  tl_last_call: "Letzter Versuch",
  tl_stop: "Aus um",
  tl_off: "Aus um",
  tl_sleep_start: "Dimmen ab",
  tl_sleep_end: "Licht aus",
  tl_kids_start: "Rot ab",
  tl_kids_end: "Grün um",
  tl_snooze_title: "{n} × {m} Min. Snooze",
  light_lead: "Lichtvorlauf",
  snooze_hint: "Die Dauer legst du in den Einstellungen fest.",
  lc_row_hint: "Wird der Wecker nach den Snoozes immer noch nicht gestoppt: kurz alle Lampen an.",
  once_toggle: "Nur einmal anders",
  once_hint: "Danach gilt wieder die normale Zeit.",
  once_on: "Am",
  repeat: "Wiederholung",
  repeat_weekly: "Wochentage",
  repeat_interval: "Alle X Tage",
  repeat_pattern: "Muster",
  repeat_once: "Einmalig",
  once: "Einmalig",
  once_date: "Datum",
  once_date_hint: "Leer = nächstmöglicher Termin",
  on_date: "Am {date}",
  every_day: "Täglich",
  weekdays: "Werktags",
  weekend: "Wochenende",
  every_week: "Jede Woche",
  week_cycle: "Wochen-Rhythmus",
  week_cycle_short: "alle {n} Wochen",
  week_n: "Woche {n}",
  week_on: "weckt",
  week_off: "frei",
  week_anchor: "Woche 1 beginnt",
  every: "Alle",
  every_n_days: "Alle {n} Tage",
  every_n_weeks: "Alle {n} Wochen",
  unit_days: "Tage",
  unit_weeks: "Wochen",
  from: "ab",
  pattern_hint: "Eigenes Muster, z. B. für Schichtarbeit: die Tage des wiederkehrenden Zyklus antippen, an denen geweckt wird.",
  pattern_cycle: "Zyklus",
  pattern_day1: "Tage, Tag 1 ist",
  pattern_summary: "{on} von {n} Tagen",
  day_n: "Tag {n}",
  preview_4w: "Vorschau: die nächsten 4 Wochen",
  preview_legend: "markiert = weckt",
  holidays: "An Feiertagen wecken",
  holidays_hint: "Aus = an Feiertagen wird übersprungen (aus {entity}).",
  holidays_none: "Kein Workday-Sensor gefunden. Richte die Integration „Workday“ ein, um Feiertage auszulassen.",
  sun_rise: "Sonnenaufgang",
  sun_set: "Sonnenuntergang",
  sun_astronomical_dawn: "Astronomische Dämmerung",
  sun_nautical_dawn: "Nautische Dämmerung",
  sun_civil_dawn: "Bürgerliche Dämmerung",
  sun_sunrise: "Sonnenaufgang",
  sun_sunset: "Sonnenuntergang",
  sun_civil_dusk: "Bürgerliche Dämmerung",
  sun_nautical_dusk: "Nautische Dämmerung",
  sun_astronomical_dusk: "Astronomische Dämmerung",
  sun_offset: "Minuten",
  sun_before: "vorher",
  sun_after: "nachher",
  sun_earliest: "frühestens",
  sun_latest: "spätestens",
  sun_none: "Dieses Sonnenereignis gibt es an dem Tag nicht.",
  section_cond: "Bedingungen",
  section_weather: "Wetter",
  simple_weather_hint: "Bei schlechtem Wetter früher wecken. Die Minuten legst du einmal in den DayBreak-Einstellungen fest.",
  weather_snow: "Schnee / Glätte",
  weather_storm: "Unwetter",
  weather_rain: "Starkregen",
  weather_entity_missing: "Noch keine Wetter-Entität gewählt (Einstellungen).",
  weather_source: "Wetter aus {entity} (Vorhersage für die Weckzeit).",
  weather_storm_hint: "Unwetter zählt auch amtliche Warnungen ab Stufe {level} (Einstellungen).",
  presence: "Anwesenheit",
  presence_hint: "Nur wecken, wenn jemand zu Hause ist. Stoppt, wenn alle gehen.",
  presence_off: "Keine Anwesenheitsprüfung: Der Wecker klingelt immer. Tippe Personen an, damit er nur weckt, wenn jemand zu Hause ist.",
  presence_more: "Tracker, Präsenzsensoren, Zonen",
  skip_when_away: "Auslassen, wenn niemand da ist",
  stop_when_away: "Stoppen, wenn alle gehen",
  shift_title: "Weckzeit automatisch vorverlegen",
  shift_intro: "Weckt früher, wenn ein Grund zutrifft. Der Lichtstart wandert mit. Die Grafik zeigt deinen Wecker und wie weit ihn jeder Grund vorverlegen kann.",
  rule_weather_d: "Schnee, Unwetter, Starkregen, Kälte",
  rule_travel_d: "Längere Fahrt als üblich (z. B. Waze)",
  shift_row_normal: "Normal",
  shift_row_worst: "Schlimmstenfalls",
  shift_row_same: "keine Änderung",
  shift_cold: "Kälte < {below} °C",
  shift_from_settings: "aus den Einstellungen",
  shift_drag_hint: "zum Ändern ziehen",
  travel_depends: "abhängig von der Fahrt",
  shift_hint_max: "Es zählt nur der stärkste Grund, nie mehr als die Grenze.",
  shift_hint_sum: "Alle Gründe werden addiert, nie mehr als die Grenze.",
  shift_hint: "Schalte unten eine Regel ein, um bei schlechtem Wetter oder längerer Fahrt früher zu wecken.",
  shift_cap: "Höchstens",
  shift_normal: "normal {time}",
  shift_result: "schlimmstenfalls −{min} Min. → {time}",
  shift_upto: "bis −{min} Min.",
  shift_notify: "Benachrichtigen, wenn die Weckzeit vorverlegt wird",
  rule_weather: "Wetter",
  rule_travel: "Fahrzeit",
  travel_now: "jetzt {min} Min.",
  travel_unknown: "kein Wert",
  travel_pick: "Sensor wählen",
  travel_sensor: "Fahrzeit-Sensor (z. B. Waze)",
  travel_usual: "Übliche Fahrzeit (Min.)",
  travel_routine: "Morgenroutine bis zur Abfahrt (Min.)",
  travel_arrive: "Spätestens ankommen (optional)",
  travel_usual_hint: "Weckt um so viel früher, wie die Fahrt länger dauert als üblich.",
  travel_arrive_hint: "Weckt so, dass Morgenroutine und aktuelle Fahrt zur Ankunftszeit fertig sind.",
  combine: "Mehrere Regeln",
  combine_max: "Nur die stärkste Regel",
  combine_sum: "Alle addieren",
  cold_below: "Unter",
  cold_minutes: "Kälte: Minuten früher",
  min_earlier: "Min. früher",
  cold_settings: "Kälte: unter {below} °C → {min} Min. früher (Einstellungen).",
  section_light: "Licht",
  targets: "Lampen & Räume",
  picker_add: "Auswählen …",
  picker_change: "Ändern",
  picker_close: "Fertig",
  picker_search: "Name, Bereich oder Entitäts-ID suchen",
  picker_no_area: "Ohne Bereich",
  picker_area_all: "Alle in diesem Bereich",
  picker_area_none: "Bereich abwählen",
  picker_group: "Gruppe",
  picker_other: "Weitere",
  picker_none: "Nichts gefunden",
  targets_hint: "Lampen und Lampengruppen nach Etage, Bereich und Gerät. Ein Häkchen beim Bereich oder Gerät wählt nur dessen Lampen; jede lässt sich einzeln wieder abwählen.",
  no_lights: "Keine Lampen gewählt",
  n_lights: "Lampen: {n}",
  cap_color: "Farbe",
  cap_ct: "Weiß",
  cap_dim: "dimmbar",
  light_settings: "Licht",
  light_common: "Gemeinsame Einstellungen",
  profile_none: "Eigene Werte (ohne Profil)",
  profile_own: "Eigene Werte für diesen Wecker.",
  profile_locked: "Profil „{name}“: Werte sichtbar, aber gesperrt. „Anpassen“ erstellt daraus ein neues Profil.",
  profile_new: "Neues Profil:",
  profile_name_required: "Name beim Speichern erforderlich",
  profile_copy_name: "{name} (Kopie)",
  per_target: "Einstellungen pro Lampe (optional)",
  per_target_hint: "Eigene Einstellungen ersetzen für diese Lampe die gemeinsamen vollständig.",
  own_settings: "eigene Einstellungen",
  uses_common: "gemeinsame Einstellungen",
  use_own: "Eigene Einstellungen verwenden",
  curve: "Verlauf",
  curve_natural: "Natürlich",
  curve_natural_d: "Startet ganz sanft",
  curve_gentle: "Sanft",
  curve_gentle_d: "Gleichmäßig und weich",
  curve_linear: "Linear",
  curve_linear_d: "Gleichmäßiger Anstieg",
  curve_fast: "Schnell",
  curve_fast_d: "Früh hell",
  curve_custom: "Eigene",
  curve_custom_d: "Eigene Punkte ziehen",
  curve_points: "Kurvenpunkte",
  ls_link: "Kurven",
  ls_shared: "Eine Kurve",
  ls_separate: "Getrennte Kurven",
  ls_add_point: "+ Punkt",
  ls_remove_point: "Punkt entfernen",
  ls_strip: "Lichtfarbe im Verlauf",
  ls_time: "Uhrzeit",
  ls_share: "Anteil",
  ls_value: "Wert %",
  ls_brightness: "Helligkeit",
  ls_ct: "Farbtemperatur",
  ls_color: "Farbe",
  ls_start: "Start",
  ls_end: "Ende",
  ls_ct_hint: "Warm- bis kaltweiß. Alle Lampen, die Weiß können, folgen.",
  ls_color_hint: "Farblampen zeigen den Farbverlauf, Weiß-Lampen eine passende Farbtemperatur.",
  ls_kelvin_hint: "1800 K warm · 6500 K kalt",
  ls_plain: "Lampen ohne Farbe: {lamps}",
  ls_plain_any: "Lampen ohne Farbe",
  ls_plain_follow: "folgen der Farbtemperatur",
  ls_matching: "passend",
  colors_sunrise: "Sonnenaufgang",
  colors_dawn: "Morgenröte",
  colors_pastel: "Pastell",
  colors_custom: "Eigene Farbfolge",
  seq_color: "Farbe",
  seq_minutes: "Minuten",
  seq_transition: "Übergang",
  seq_smooth: "Fließend",
  seq_step: "Sofort",
  seq_add: "+ Farbschritt",
  fine_title: "Feineinstellungen",
  fine_sum_step: "alle {s} s",
  fine_step: "Aktualisierung alle (s)",
  fine_min_bri: "Einschaltschwelle (%)",
  fine_transition: "Übergang",
  fine_offset: "Später starten (Min.)",
  fine_ringing: "Beim Klingeln",
  fine_after: "Nach dem Stoppen",
  transition_auto: "Automatisch",
  transition_always: "Immer",
  transition_never: "Nie (Funknetz schonen)",
  ringing_hold: "Licht halten",
  ringing_pulse: "Sanft pulsieren",
  ringing_blink: "Blinken (Barrierefreiheit)",
  after_stop_keep: "Anlassen",
  after_stop_off: "Ausschalten",
  after_stop_off_later: "Nach 30 Min. aus",
  section_audio: "Audio",
  audio_on: "Audio abspielen",
  audio_on_d: "Musik, Radio oder ein Klang auf einem Lautsprecher, erst leise, dann lauter.",
  audio_players: "Lautsprecher",
  audio_what: "Was abspielen",
  audio_volume: "Lautstärke & Zeit",
  audio_vol_start: "Start-Lautstärke (%)",
  audio_vol_end: "End-Lautstärke (%)",
  audio_lead: "Musik startet vor dem Wecken (Min.)",
  audio_ramp: "Wird lauter über (Min.)",
  audio_start_at: "Musik startet",
  audio_loud_at: "Volle Lautstärke",
  audio_drag_hint: "Punkte ziehen oder Werte direkt eintippen.",
  settings_modes: "Was die Modi zeigen",
  settings_modes_hint: "Lege fest, welche Optionen der Wecker-Editor in Einfach und Erweitert anbietet. Experte zeigt immer alles. Optionen, die ein Wecker schon nutzt, bleiben sichtbar.",
  settings_modes_reset: "Standard wiederherstellen",
  feat_sun: "Sonnen-Wecker",
  feat_sun_d: "Wecken zum Sonnenaufgang oder einem anderen Sonnenstand",
  feat_pattern: "Wiederholungsmuster",
  feat_pattern_d: "Eigenes Tagesmuster, z. B. für Schichtarbeit",
  feat_week_cycle: "Wochenrhythmus",
  feat_week_cycle_d: "Nur jede 2., 3. oder 4. Woche",
  feat_calendar: "Kalender",
  feat_calendar_d: "Wecker per Kalendertermin aussetzen oder verschieben",
  "hx_wx_clear-night": "klare Nacht",
  hx_wx_cloudy: "bewölkt",
  hx_wx_exceptional: "Extremwetter",
  hx_wx_fog: "Nebel",
  hx_wx_hail: "Hagel",
  hx_wx_lightning: "Gewitter",
  "hx_wx_lightning-rainy": "Gewitter mit Regen",
  hx_wx_partlycloudy: "teilweise bewölkt",
  hx_wx_pouring: "Starkregen",
  hx_wx_rainy: "Regen",
  hx_wx_snowy: "Schnee",
  "hx_wx_snowy-rainy": "Schneeregen",
  hx_wx_sunny: "sonnig",
  hx_wx_windy: "windig",
  "hx_wx_windy-variant": "windig und bewölkt",
  phase_last_call: "Letzter Versuch",
  hx_hint: "Alle Wecker: geklingelt, ausgelassen, geplant und Probeläufe, die neuesten oben. Wähle einen aus, um Schritt für Schritt zu sehen, was passiert ist, von den Prüfungen vor dem Licht bis zum Ende.",
  hx_pick: "Wähle links einen Wecker, um seinen Ablauf zu sehen.",
  hx_back: "Alle Wecker",
  hx_today: "Heute",
  hx_yesterday: "Gestern",
  hx_f_all: "Alle",
  hx_f_problem: "Probleme",
  hx_f_skipped: "Ausgelassen",
  hx_f_test: "Probeläufe",
  hx_all_alarms: "Alle Wecker",
  hx_l_ok: "hat geklappt",
  hx_l_warn: "geklappt, mit Hinweis",
  hx_l_problem: "Problem",
  hx_l_skipped: "ausgelassen / entfallen",
  hx_l_planned: "geplant / läuft",
  hx_h_ok: "Alles hat geklappt",
  hx_h_warn: "Hat geklappt – mit Hinweisen",
  hx_h_problem: "Es gab {n} Problem(e)",
  hx_h_skipped: "Ausgelassen",
  hx_h_planned: "Geplant – Vorbereitung läuft",
  hx_h_running: "Läuft gerade",
  hx_h_cancelled: "Entfallen",
  hx_s_planned: "geplant",
  hx_s_running: "läuft",
  hx_s_cancelled: "entfallen",
  hx_s_snoozed: "{n}× geschlummert",
  hx_s_problems: "{n} Problem(e)",
  hx_sum_alarm: "Weckzeit {time}",
  hx_sum_rang: "geklingelt {time}",
  hx_sum_end: "beendet {time}",
  hx_sum_duration: "insgesamt {min} min",
  hx_seg_prep: "Vorbereitung",
  hx_seg_sunrise: "Sonnenaufgang",
  hx_seg_ring: "Klingeln",
  hx_seg_snooze: "Schlummern",
  hx_seg_last: "Letzter Versuch",
  hx_seg_problem: "Problem / Hinweis",
  hx_ph_prep: "Vorbereitung",
  hx_ph_prep_d: "Prüfungen vor dem Licht",
  hx_ph_sunrise: "Sonnenaufgang",
  hx_ph_sunrise_d: "Licht und Musik werden stärker",
  hx_ph_wake: "Wecken",
  hx_ph_wake_d: "Klingeln, Schlummern, letzter Versuch",
  hx_ph_end: "Ende",
  hx_ph_end_d: "wie der Wecker endete",
  hx_what_to_do: "Was du tun kannst",
  hx_checks_t: "Wetter und Fahrzeit geprüft",
  hx_checks_none: "nichts Besonderes",
  hx_checks_weather: "Wetter: {w}",
  hx_checks_warning: "Warnstufe {n}",
  hx_checks_travel: "Fahrt {min} min",
  hx_checks_earlier: "Wecker {min} min früher ({why})",
  hx_checks_same: "keine Änderung nötig",
  hx_reason_snow: "Schnee / Glätte",
  hx_reason_storm: "Sturm",
  hx_reason_rain: "Starkregen",
  hx_reason_warning: "Unwetterwarnung",
  hx_reason_cold: "Kälte",
  hx_reason_travel: "längere Fahrzeit",
  hx_checks_failed_t: "Prüfung fehlgeschlagen",
  hx_checks_h: "Prüfe in den DayBreak-Einstellungen, ob die Wetter-Entität und der Fahrzeit-Sensor noch funktionieren. Der Wecker klingelt zur normalen Zeit.",
  hx_calendar_t: "Kalender",
  hx_calendar_d: "„{detail}“ → {what} (Regel {rule}).",
  hx_cal_time: "wecken um {time}",
  hx_cal_ring: "weckt statt „{other}“",
  hx_cal_other: "weckt",
  hx_holiday_override_t: "Feiertag",
  hx_holiday_override_d: "Heute ist Feiertag, aber eine Kalender-Regel verlangt den Wecker.",
  hx_climate_wait_t: "Klima wartet",
  hx_climate_wait_away: "Niemand ist zu Hause, deshalb wartet Heizen/Kühlen.",
  hx_climate_wait_outdoor: "Draußen sind es {outdoor} °C – laut deiner Grenze nicht nötig.",
  hx_climate_wait_window: "Ein Fenster oder eine Tür ist offen – es startet erst, wenn alles zu ist.",
  hx_climate_start_t: "Klima gestartet",
  hx_climate_start_d: "{mode} auf {target} °C, {lead} min vor dem Wecken ({how}).",
  hx_learned: "gelernter Start",
  hx_fixed: "fester Start",
  hx_climate_paused: "Pausiert, weil ein Fenster offen ist.",
  hx_climate_not_needed_t: "Klima nicht nötig",
  hx_climate_not_needed_d: "Der Raum hat schon {room} °C.",
  hx_climate_not_needed_x: "Der Raum hat das Ziel schon erreicht.",
  hx_presence_t: "Jemand ist zu Hause",
  hx_presence_d: "{who} zu Hause – der Wecker startet.",
  hx_skipped_t: "Ausgelassen",
  hx_skip_away: "Niemand war zu Hause, deshalb hat der Wecker nicht geklingelt.",
  hx_skip_away_h: "War doch jemand zu Hause? Prüfe die Anwesenheit im Wecker (Bedingungen): Ein Handy ohne Standort zählt als abwesend.",
  hx_skip_calendar: "Kalender: „{detail}“ (Regel {rule}) – an diesem Tag kein Wecker.",
  hx_skip_handed_over: "„{other}“ hat stattdessen geweckt (Kalender: „{detail}“).",
  hx_skip_holiday: "Feiertag – an Feiertagen ist dieser Wecker aus.",
  hx_skip_manual: "Du hast diesen Wecker einmalig übersprungen.",
  hx_cancelled_t: "Entfallen",
  hx_cancelled_d: "Dieser Termin ist weggefallen: Weckzeit oder Tage wurden geändert oder der Wecker ausgeschaltet.",
  hx_start_t: "Sonnenaufgang startet",
  hx_start_nolight_t: "Wecker startet",
  hx_start_d: "{n} Lampen starten gedimmt und werden heller.",
  hx_start_shift: "{min} min früher als sonst.",
  hx_start_test: "Probelauf im Zeitraffer (1 min = {s} s).",
  hx_music_t: "Musik startet",
  hx_music_d: "Leise auf {n} Lautsprecher(n), dann lauter.",
  hx_music_playing_t: "Musik läuft",
  hx_music_retry_t: "Musik erst im zweiten Versuch",
  hx_music_retry_d: "„{src}“ wurde zuerst nicht gefunden, lief aber beim zweiten Versuch.",
  hx_music_retry_h: "Wähle die Musik im Wecker einmal neu über die Suche aus, dann klappt es beim ersten Versuch.",
  hx_audio_failed_t: "Musik konnte nicht spielen",
  hx_audio_failed_h: "Prüfe in Music Assistant, ob Titel bzw. Sender noch verfügbar sind und der Lautsprecher erreichbar ist. Wähle die Musik dann im Wecker neu aus und teste sie mit dem Probelauf.",
  hx_lights_missing_t: "Lampen nicht erreichbar",
  hx_light_failed_t: "Eine Lampe hat nicht reagiert",
  hx_light_h: "Prüfe in Home Assistant, ob die Lampe online ist (Strom, WLAN/Zigbee). Unter „Absicherung & Benachrichtigungen“ kannst du eine Ersatzlampe wählen.",
  hx_push_t: "Handy-Benachrichtigung",
  hx_push_ring: "„Wecker“ mit Schlummern und Stopp gesendet.",
  hx_push_snoozed: "„Schlummert“ gesendet.",
  hx_push_last_call: "„Letzter Versuch“ gesendet.",
  hx_actions_t: "Eigene Aktionen",
  hx_actions_d: "{n} Aktion(en) bei „{phase}“ gestartet.",
  hx_actions_failed_t: "Eine Aktion ist fehlgeschlagen",
  hx_actions_h: "Öffne den Wecker → Aktionen und prüfe die Aktion; der genaue Fehler steht im Home-Assistant-Protokoll.",
  hx_ring_t: "Weckzeit erreicht",
  hx_ring_d: "Volles Licht, der Wecker klingelt.",
  hx_ring_again_t: "Klingelt wieder",
  hx_ring_again_d: "Die Schlummerzeit ist vorbei.",
  hx_snooze_t: "Geschlummert",
  hx_snooze_d: "{min} min ({n}. Mal).",
  hx_button_t: "Taste am Lautsprecher",
  hx_button_d: "Am Lautsprecher wurde Pause gedrückt.",
  hx_last_call_t: "Letzter Versuch",
  hx_last_call_d: "Niemand hat reagiert: „{profile}“ gestartet.",
  hx_end_stopped: "Gestoppt",
  hx_end_stopped_d: "Der Wecker wurde gestoppt.",
  hx_end_stopped_s: "gestoppt",
  hx_end_auto_stop: "Von selbst beendet",
  hx_end_auto_stop_d: "Niemand hat gestoppt; er endete nach der Schlummerzeit.",
  hx_end_auto_stop_s: "von selbst beendet",
  hx_end_manual_light_off: "Lampe ausgeschaltet",
  hx_end_manual_light_off_d: "Eine Lampe wurde von Hand ausgeschaltet, das stoppt den Wecker.",
  hx_end_manual_light_off_s: "Lampe ausgeschaltet",
  hx_end_away: "Alle weg",
  hx_end_away_d: "Alle haben das Haus verlassen, deshalb wurde der Wecker gestoppt.",
  hx_end_away_s: "alle weg",
  hx_end_last_call_timeout: "Letzter Versuch vorbei",
  hx_end_last_call_timeout_d: "Der letzte Versuch endete, ohne dass jemand reagiert hat.",
  hx_end_last_call_timeout_s: "letzter Versuch vorbei",
  hx_end_disabled: "Ausgeschaltet",
  hx_end_disabled_d: "Der Wecker wurde während des Laufs ausgeschaltet.",
  hx_end_disabled_s: "ausgeschaltet",
  tr_state_sunrise: "Sonnenaufgang läuft",
  tr_state_ringing: "Klingelt",
  tr_state_snoozed: "Schlummert",
  tr_state_last_call: "Letzter Versuch",
  tr_snooze: "Schlummern",
  tab_history: "Verlauf",
  hs_hint: "Die letzten 10 Läufe aller Wecker, auch Probeläufe und ausgelassene Wecker. Probleme sind rot markiert; mehr Details stehen im Home-Assistant-Protokoll (Einstellungen → System → Protokolle).",
  hs_empty: "Noch kein Wecker ist gelaufen. Starte im Wecker-Editor einen Probelauf.",
  hs_test: "Probelauf",
  hs_alarm_at: "Weckzeit {time}",
  hs_problems: "{n} Problem(e)",
  hs_result_running: "läuft",
  hs_result_skipped: "ausgelassen",
  hs_result_stopped: "gestoppt",
  hs_result_auto_stop: "von selbst beendet",
  hs_result_manual_light_off: "per Lampe ausgeschaltet",
  hs_result_away: "gestoppt, alle weg",
  hs_result_last_call_timeout: "letzter Versuch beendet",
  hs_result_disabled: "ausgeschaltet",
  hs_start: "Start",
  hs_climate: "Klima läuft",
  hs_music: "Musik startet",
  hs_ring: "Klingelt",
  hs_ring_again: "Klingelt wieder",
  hs_snooze: "Schlummern",
  hs_button: "Taste am Lautsprecher",
  hs_last_call: "Letzter Versuch",
  hs_lights_missing: "Lampen fehlen",
  hs_light_failed: "Lampe reagiert nicht",
  hs_audio_failed: "Audio-Problem",
  hs_skipped_away: "Ausgelassen: niemand zu Hause",
  hs_end_stopped: "Gestoppt",
  hs_end_auto_stop: "Von selbst beendet",
  hs_end_manual_light_off: "Lampe ausgeschaltet",
  hs_end_away: "Alle weg",
  hs_end_last_call_timeout: "Letzter Versuch vorbei",
  hs_end_disabled: "Ausgeschaltet",
  hs_lamps: "{n} Lampen",
  hs_light_from: "Licht ab {time}",
  hs_shift: "{min} min früher",
  hs_speakers: "{n} Lautsprecher",
  hs_snooze_d: "{min} min · {n}.",
  tr_title: "Probelauf",
  tr_hint: "Läuft mit den Einstellungen, die hier stehen, auch ungespeicherten, im Zeitraffer. Schlummern, letzter Versuch und das Lauterwerden der Musik laufen ebenfalls schneller.",
  tr_save_first: "Speichere den Wecker einmal, um ihn zu testen.",
  tr_nothing: "Wähle zuerst Lampen oder Lautsprecher.",
  tr_speed: "Zeitraffer",
  tr_real: "Echtzeit",
  tr_lapse: "1 min = {s} s",
  tr_start_light: "Ab Lichtstart",
  tr_start_ring: "Direkt Weckzeit",
  tr_part_light: "Licht",
  tr_part_audio: "Audio",
  tr_until: "Weckzeit in {time}",
  tr_ring_now: "Klingelt sofort",
  tr_snooze_info: "Schlummern und Stoppen funktionieren wie am Morgen",
  tr_start: "Probelauf starten",
  tr_simulated: "Simulierte Uhrzeit",
  tr_snooze_left: "klingelt wieder in {time}",
  tr_problems: "Probleme beim letzten Lauf",
  section_calendar: "Kalender",
  calr_on: "Kalender-Regeln nutzen",
  calr_on_d: "Wecker per Termin aussetzen oder verschieben, z. B. Urlaub, Frühdienst oder der erste Termin.",
  calr_hint: "Geprüft wird von oben nach unten: Die erste passende Regel entscheidet den Tag.",
  calr_enabled: "Regel aktiv",
  calr_if: "Wenn ein Termin in",
  calr_then: "dann",
  calr_all_cals: "allen Kalendern",
  calr_no_cals: "In Home Assistant wurden keine Kalender gefunden.",
  calr_word_ph: "Stichwort, dann Enter",
  calr_words_hint: "Gesucht wird im Titel und in der Beschreibung, Groß-/Kleinschreibung egal.",
  calr_no_words: "Ohne Stichwort zählt jeder Termin.",
  calr_match_any: "eines der Wörter",
  calr_match_all: "alle Wörter",
  calr_and: "und",
  calr_or: "oder",
  calr_any_event: "irgendein Termin",
  calr_sentence: "{cals}: {words} → {then}",
  calr_then_skip: "kein Wecker",
  calr_then_time: "wecken um {time}",
  calr_then_before: "{min} min vor Beginn",
  calr_then_before_travel: "{min} min + Fahrzeit vor Beginn",
  calr_then_alarm: "„{name}“ weckt stattdessen",
  calr_act_skip: "Kein Wecker",
  calr_act_time: "Andere Uhrzeit",
  calr_act_before: "Vor dem Termin",
  calr_act_alarm: "Anderer Wecker",
  calr_time: "Wecken um",
  calr_before: "Wecken vor Terminbeginn",
  calr_before_travel: "Zeit zum Fertigmachen",
  calr_travel: "Fahrzeit zum Termin-Ort dazurechnen",
  calr_before_hint: "Es zählt der erste passende Termin des Tages mit Uhrzeit.",
  calr_alarm: "Stattdessen weckt",
  calr_alarm_hint: "Dieser Wecker bleibt an dem Tag still, der gewählte klingelt zu seiner eigenen Zeit, auch an Tagen, für die er nicht eingestellt ist. Ist er ausgeschaltet, klingelt dieser Wecker wie gewohnt.",
  calr_alarm_none: "Lege zuerst einen weiteren Wecker an.",
  calr_any_day: "Auch an Tagen, für die dieser Wecker nicht eingestellt ist",
  calr_add: "Regel",
  calr_tpl_vacation: "Urlaub",
  calr_tpl_vacation_w: "Urlaub",
  calr_tpl_early: "Frühdienst",
  calr_tpl_early_w: "Frühdienst",
  calr_tpl_event: "Termin",
  calr_tpl_event_w: "Termin",
  calr_travel_title: "Fahrzeit",
  calr_travel_hint: "Waze berechnet die Fahrt vom Start zum Ort des Termins, in den letzten 3 Stunden mit aktuellem Verkehr.",
  calr_no_waze: "Waze Travel Time ist in Home Assistant nicht eingerichtet: Es gilt die feste Fahrzeit unten.",
  calr_origin: "Start (leer = Zuhause)",
  calr_origin_hint: "Eine Person, Zone oder ein Gerät. Leer: dein Zuhause.",
  calr_vehicle_car: "Auto",
  calr_vehicle_motorcycle: "Motorrad",
  calr_vehicle_taxi: "Taxi",
  calr_toll: "Mautstraßen meiden",
  calr_region: "Region",
  calr_region_auto: "Automatisch",
  calr_fallback: "Ohne Waze oder Ort",
  calp_title: "Die nächsten Tage",
  calp_normal: "wie gewohnt",
  calp_free: "kein Wecker",
  calp_rule: "Regel {n}",
  calp_skip: "fällt aus",
  calp_alarm: "„{name}“ weckt",
  calp_ring: "statt „{name}“",
  calp_travel: "{min} min Fahrt",
  cal_summary: "{n} Regeln",
  move_up: "Nach oben",
  move_down: "Nach unten",
  feat_conditions: "Bedingungen & Wetter",
  feat_conditions_d: "Anwesenheit, Verschiebung und Wetter",
  feat_overrides: "Einstellungen pro Lampe",
  feat_overrides_d: "Eigene Helligkeit oder Farbe für einzelne Lampen",
  feat_lamp_start: "Start pro Lampe",
  feat_lamp_start_d: "Jede Lampe kann später starten, eine Zeile pro Lampe im Zeitstrahl",
  tl_lamp_start: "Lampe startet",
  lamp_start_on: "Startzeit pro Lampe",
  lamp_start_on_d: "Jede Lampe bekommt eine eigene Zeile und kann später starten. Zur Weckzeit ist sie trotzdem am Ziel.",
  all_own_settings: "Alle Lampen haben eigene Einstellungen (unten), daher gibt es keine gemeinsamen.",
  audio_add_point: "+ Punkt",
  audio_remove_point: "− Punkt",
  audio_point_hint: "Tippe auf einen Punkt, um Uhrzeit und Lautstärke zu ändern.",
  feat_audio: "Audio",
  feat_audio_d: "Musik oder Klang über Lautsprecher",
  feat_tts: "Ansage",
  feat_tts_d: "Uhrzeit, Wetter oder einen Text ansagen",
  feat_push: "Handy",
  feat_push_d: "Push mit Schlummern- und Stopp-Knopf",
  feat_actions: "Aktionen",
  feat_actions_d: "Eigene Aktionen bei Start, Wecken, Schlummern und Stopp",
  feat_none: "Wenn niemand reagiert",
  feat_none_d: "Was passiert, wenn niemand reagiert",
  feat_fallback: "Absicherung & Benachrichtigungen",
  feat_fallback_d: "Ersatzlampen und Meldungen bei Fehlern",
  audio_behaviour: "Verhalten des Lautsprechers",
  audio_button: "Pause am Lautsprecher (z. B. HomePod) = Snooze, im letzten Versuch = Stopp",
  audio_button_hint: "Pause am Lautsprecher (z. B. Tippen auf den HomePod) startet Snooze; im letzten Versuch beendet es den Wecker.",
  audio_pause: "Musik während Snooze pausieren",
  audio_restore: "Danach die alte Lautstärke wiederherstellen",
  tts_title: "Ansage",
  tts_short: "Ansage",
  tts_on: "Gesprochene Begrüßung zur Weckzeit",
  tts_on_d: "Wird über die Lautsprecher vorgelesen, z. B. Uhrzeit und Wetter.",
  tts_ph: "Guten Morgen! Es ist {{ time }} Uhr, draußen {{ temperature }} Grad.",
  tts_vars: "Möglich sind {{ time }}, {{ name }}, {{ temperature }}, {{ weather }} und {{ shift }} (Minuten früher). Vorlagen wie in Home Assistant funktionieren auch.",
  tts_engine: "Stimme",
  tts_auto: "Automatisch",
  src_music_assistant: "Music Assistant",
  src_url: "Klang / URL",
  src_none: "Keine Musik",
  ma_missing: "Music Assistant ist in Home Assistant nicht eingerichtet.",
  ma_search_ph: "Playlist, Radiosender, Album, Titel suchen …",
  ma_manual: "Adresse selbst eingeben",
  media_all: "Alles",
  media_playlist: "Playlist",
  media_radio: "Radio",
  media_album: "Album",
  media_track: "Titel",
  media_artist: "Künstler",
  media_podcast: "Podcast",
  media_audiobook: "Hörbuch",
  search: "Suchen",
  change: "Ändern",
  url_hint: "Eine Klangdatei oder ein Stream (http/https oder media-source). Endet er, während der Wecker klingelt, startet er neu.",
  section_push: "Handy",
  push_on: "Mitteilung mit Snooze und Stopp",
  push_on_d: "Der Wecker erscheint auch auf dem Handy, mit Knöpfen zum Snoozen oder Stoppen.",
  push_owners: "An die Handys der Besitzer senden",
  push_found: "Gefunden: {devices}",
  push_none_found: "Für die Besitzer wurde keine Home-Assistant-App gefunden.",
  push_no_owner: "Kein Besitzer gewählt (oben im Editor).",
  push_no_device: "kein Gerät",
  push_more: "Weitere Geräte",
  push_no_apps: "Es ist noch keine Home-Assistant-App auf einem Handy eingerichtet.",
  push_critical: "Letzter Versuch als kritische Mitteilung",
  push_critical_d: "Klingelt auch, wenn das Handy lautlos oder auf „Nicht stören“ ist (iPhone; Android nutzt den Wecker-Kanal).",
  lc_audio_own: "Eigenes Audio: {name}",
  lc_audio_keep: "Behält die Musik des Weckers, nur lauter, falls eingestellt.",
  lc_audio_keep_short: "Musik des Weckers",
  lc_volume: "Lautstärke (%)",
  lc_volume_ph: "wie am Ende des Weckens",
  audio_lc_soon: "Audio für den letzten Versuch kommt mit Version 0.3.",
  section_actions: "Aktionen",
  n_actions: "{n} Aktionen",
  phase_light_start: "Licht startet",
  phase_wake: "Wecken",
  phase_snooze: "Snooze",
  phase_stop: "Stopp",
  phase_light_start_hint: "Läuft, wenn das Licht startet, z. B. Rollläden ein Stück öffnen.",
  phase_wake_hint: "Läuft zur Weckzeit, z. B. die Kaffeemaschine starten.",
  phase_snooze_hint: "Läuft bei jedem Snooze.",
  phase_stop_hint: "Läuft, wenn der Wecker endet, egal wie.",
  section_none: "Wenn niemand reagiert",
  none_hint: "Was passiert, wenn der Wecker nicht gestoppt wird. Snooze zählt nicht als Reaktion.",
  last_call: "Letzter Versuch",
  ladder_ring: "Wecken",
  ladder_ring_d: "Licht auf voller Stufe, Aktionen starten.",
  ladder_snooze: "{n} × Snooze à {m} Min.",
  ladder_snooze_d: "In dieser Zeit ist Snooze möglich.",
  ladder_last_call: "Letzter Versuch",
  ladder_last_call_d: "Profil „{name}“: alle Lampen an, Aktionen, endet von selbst.",
  ladder_stop: "Stopp",
  ladder_stop_d: "Der Wecker hört von selbst auf.",
  lc_at: "Letzter Versuch um",
  stop_at: "Stopp um",
  lc_snap: "Rastet in Snooze-Schritten ein (nach {n}× Snooze) und wandert bei Vorverlegung mit.",
  lc_summary: "{time} · {name}",
  lc_stop_at: "stoppt um {time}",
  lc_profile_desc: "{min} Min. · {bri} %",
  profiles_manage: "Profile verwalten →",
  stop_on_light_off: "Lampe ausschalten stoppt den Wecker",
  stop_on_light_off_d: "Eine von Hand oder per Schalter ausgeschaltete Lampe zählt als Reaktion.",
  section_fb: "Absicherung & Benachrichtigungen",
  fb_spare: "Ersatzlampe",
  fb_spare_hint: "Wird genutzt, wenn eine Lampe beim Start nicht erreichbar ist.",
  fb_n_spare: "{n} Ersatzlampen",
  fb_notify: "Benachrichtigen über",
  fb_notify_ph: "z. B. notify.mobile_app_handy",
  fb_notifications: "Benachrichtigungen",
  fb_persistent: "Probleme zusätzlich als Meldung in Home Assistant anzeigen",
  ev_started: "Sonnenaufgang gestartet",
  ev_finished: "Wecker beendet",
  ev_skipped: "Wecker ausgelassen",
  ev_shifted: "Weckzeit verschoben",
  ev_device_unavailable: "Lampe nicht erreichbar",
  ev_failed: "Lampe ließ sich nicht schalten",
  ev_last_call: "Letzter Versuch gestartet",
  profiles_intro: "Lichtprofile legen Verlauf, Helligkeit und Farbe fest. Jeder Wecker kann ein Profil nutzen oder eigene Werte setzen.",
  templates: "Vorlagen",
  own_profiles: "Eigene",
  template_ro: "Vorlage · schreibgeschützt",
  profile_new_btn: "Neues Profil",
  profile_new_name: "Neues Profil",
  profile_save: "Profil speichern",
  profile_delete_confirm: "Profil „{name}“ löschen?",
  profile_shared_hint: "Gesperrt: Dieses Profil nutzen Wecker verschiedener Personen. Ändern würde den Wecker einer anderen Person verstellen.",
  profile_in_use_hint: "Wird von {n} Weckern genutzt ({names}). Änderungen gelten dort sofort – ich habe verstanden.",
  profile_duration_hint: "Vorschlag für den Lichtvorlauf, wenn ein Wecker dieses Profil wählt.",
  used_by: "Verwendet von",
  duration: "Dauer",
  minute: "Minute",
  preview_on: "Vorschau auf",
  lc_intro: "Was passiert, wenn trotz Wecker niemand reagiert. Jeder Wecker kann eines dieser Profile wählen.",
  lc_new_name: "Neuer letzter Versuch",
  lc_detail_hint: "Startet nur, wenn der Wecker bis dahin nicht gestoppt wurde, und endet nach der Dauer von selbst.",
  lc_duration: "Dauer (Min.)",
  lc_lights: "Lampen",
  lc_lights_hint: "Leer = die Lampen des Weckers.",
  lc_actions: "Weitere Aktionen",
  lc_actions_hint: "Z. B. eine laute Durchsage oder eine Szene.",
  lc_alarm_lights: "Lampen des Weckers",
  make_default: "Als Standard",
  settings_general: "Allgemein",
  default_mode: "Editor-Modus",
  default_mode_hint: "Wie viel der Wecker-Editor zeigt: Einfach = nur das Nötigste, Erweitert = Bedingungen, Profile und Aktionen, Experte = alles. Du kannst auch oben im Editor umschalten; DayBreak merkt sich die Wahl hier.",
  holiday_entity: "Feiertagsquelle (Workday-Sensor)",
  holiday_used: "Genutzt: {entity}",
  notify_default: "Standard-Ziel für Benachrichtigungen",
  notify_hint: "Gilt für alle Wecker, die kein eigenes Ziel haben.",
  settings_snooze: "Snooze",
  preset_add: "Snooze-Option",
  preset_new: "Neu",
  default_count: "Standard-Anzahl Snooze",
  presets_hint: "Jeder Wecker wählt eine dieser Optionen. Der Punkt markiert den Standard.",
  settings_weather: "Wetter & Warnungen",
  settings_weather_hint: "Standard-Minuten für das frühere Wecken. Im Expertenmodus pro Wecker änderbar.",
  weather_entity: "Wetter-Entität",
  temperature_entity: "Außentemperatur (optional, genauer)",
  warning_entities: "Unwetterwarnungs-Sensoren (z. B. DWD)",
  warning_level: "Warnungen zählen ab",
  warning_1: "Stufe 1 – Wetterwarnung",
  warning_2: "Stufe 2 – markant",
  warning_3: "Stufe 3 – Unwetter",
  warning_4: "Stufe 4 – extrem",
  settings_backup: "Sichern & teilen",
  backup_hint: "Wecker und eigene Profile als Datei exportieren oder in ein anderes Home Assistant importieren.",
  export: "Exportieren",
  import: "Importieren …",
  import_invalid: "Das ist kein DayBreak-Export.",
  import_confirm: "{n} Wecker und die Profile aus der Datei importieren? Vorhandene Wecker bleiben.",
  import_done: "{n} Wecker importiert.",
  builtin_natural: "Natürlicher Sonnenaufgang",
  builtin_gentle: "Sanft",
  builtin_linear: "Linear",
  builtin_fast: "Schnell & hell",
  builtin_all_on: "Alles an",
  preset_standard: "Standard",
  preset_short: "Kurz",
  preset_long: "Lang",
  card_name: "DayBreak Wecker",
  card_desc: "Deine DayBreak-Wecker mit Schaltern, Snooze und Stopp.",
  next_card_name: "DayBreak nächster Wecker",
  next_card_desc: "Nächster Wecker als Kachel oder große Nachttisch-Karte.",
  c_title: "Titel",
  c_show_disabled: "Deaktivierte Wecker anzeigen",
  c_show_controls: "Snooze/Stopp anzeigen, solange aktiv",
  c_style: "Stil",
  c_accent: "DayBreak-Farben",
  c_size: "Größe",
  c_alarm: "Wecker (Name oder ID, leer = nächster)",
  c_show_buttons: "Knöpfe anzeigen",
  c_show_progress: "Fortschritt des Sonnenaufgangs anzeigen",
  style_ha: "Home Assistant",
  style_mushroom: "Mushroom",
  style_bubble: "Bubble",
  size_tile: "Kachel",
  size_large: "Groß (Nachttisch / Tablet)"
}, Gs = { en: $t, de: Si };
function Ai(l) {
  const e = (l?.locale?.language || l?.language || navigator.language || "en").split("-")[0];
  return e in Gs ? e : "en";
}
function a(l, e, t = {}) {
  return (Gs[Ai(l)][e] ?? $t[e] ?? e).replace(/\{(\w+)\}/g, (i, n) => String(t[n] ?? ""));
}
function me(l, e) {
  const t = e, s = `err_${t?.code}`;
  return t?.code && s in $t ? a(l, s) : a(l, "error", { msg: t?.message ?? String(e) });
}
const Mi = { standard: "Standard", short: "Kurz", long: "Lang" };
function Ei(l, e) {
  const t = (i) => {
    const n = `builtin_${i.id}`;
    return i.builtin && n in $t ? { ...i, name: a(l, n) } : i;
  }, s = (e.settings?.snooze_presets ?? []).map(
    (i) => Mi[i.id] === i.name ? { ...i, name: a(l, `preset_${i.id}`) } : i
  );
  return {
    ...e,
    settings: { ...e.settings, snooze_presets: s },
    light_profiles: e.light_profiles.map(t),
    last_call_profiles: e.last_call_profiles.map(t),
    climate_profiles: (e.climate_profiles ?? []).map(t)
  };
}
function _t(l) {
  const e = new Intl.DateTimeFormat(xt(l), { weekday: "short" });
  return [...Array(7).keys()].map((t) => e.format(new Date(2024, 0, 1 + t)));
}
function xt(l) {
  return l?.locale?.language || l?.language || navigator.language || "en";
}
const ht = globalThis, Kt = ht.ShadowRoot && (ht.ShadyCSS === void 0 || ht.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ut = /* @__PURE__ */ Symbol(), vs = /* @__PURE__ */ new WeakMap();
let Zs = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== Ut) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Kt && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = vs.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && vs.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Pi = (l) => new Zs(typeof l == "string" ? l : l + "", void 0, Ut), T = (l, ...e) => {
  const t = l.length === 1 ? l[0] : e.reduce((s, i, n) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + l[n + 1], l[0]);
  return new Zs(t, l, Ut);
}, Wi = (l, e) => {
  if (Kt) l.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = ht.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, l.appendChild(s);
  }
}, $s = Kt ? (l) => l : (l) => l instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return Pi(t);
})(l) : l;
const { is: Li, defineProperty: Ci, getOwnPropertyDescriptor: Ti, getOwnPropertyNames: Di, getOwnPropertySymbols: Ni, getPrototypeOf: Oi } = Object, wt = globalThis, xs = wt.trustedTypes, Bi = xs ? xs.emptyScript : "", Ri = wt.reactiveElementPolyfillSupport, qe = (l, e) => l, ut = { toAttribute(l, e) {
  switch (e) {
    case Boolean:
      l = l ? Bi : null;
      break;
    case Object:
    case Array:
      l = l == null ? l : JSON.stringify(l);
  }
  return l;
}, fromAttribute(l, e) {
  let t = l;
  switch (e) {
    case Boolean:
      t = l !== null;
      break;
    case Number:
      t = l === null ? null : Number(l);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(l);
      } catch {
        t = null;
      }
  }
  return t;
} }, It = (l, e) => !Li(l, e), ws = { attribute: !0, type: String, converter: ut, reflect: !1, useDefault: !1, hasChanged: It };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), wt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Oe = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ws) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && Ci(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: n } = Ti(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: i, set(r) {
      const d = i?.call(this);
      n?.call(this, r), this.requestUpdate(e, d, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ws;
  }
  static _$Ei() {
    if (this.hasOwnProperty(qe("elementProperties"))) return;
    const e = Oi(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(qe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(qe("properties"))) {
      const t = this.properties, s = [...Di(t), ...Ni(t)];
      for (const i of s) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, i] of t) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const i = this._$Eu(t, s);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const i of s) t.unshift($s(i));
    } else e !== void 0 && t.push($s(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Wi(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : ut).toAttribute(t, s.type);
      this._$Em = e, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : ut;
      this._$Em = i;
      const d = r.fromAttribute(t, n.type);
      this[i] = d ?? this._$Ej?.get(i) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, i = !1, n) {
    if (e !== void 0) {
      const r = this.constructor;
      if (i === !1 && (n = this[e]), s ??= r.getPropertyOptions(e), !((s.hasChanged ?? It)(n, t) || s.useDefault && s.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(r._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: n }, r) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), n !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, n] of s) {
        const { wrapped: r } = n, d = this[i];
        r !== !0 || this._$AL.has(i) || d === void 0 || this.C(i, void 0, n, d);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
Oe.elementStyles = [], Oe.shadowRootOptions = { mode: "open" }, Oe[qe("elementProperties")] = /* @__PURE__ */ new Map(), Oe[qe("finalized")] = /* @__PURE__ */ new Map(), Ri?.({ ReactiveElement: Oe }), (wt.reactiveElementVersions ??= []).push("2.1.2");
const qt = globalThis, ys = (l) => l, mt = qt.trustedTypes, ks = mt ? mt.createPolicy("lit-html", { createHTML: (l) => l }) : void 0, Xs = "$lit$", ue = `lit$${Math.random().toFixed(9).slice(2)}$`, Ys = "?" + ue, Fi = `<${Ys}>`, Ee = document, Ge = () => Ee.createComment(""), Ze = (l) => l === null || typeof l != "object" && typeof l != "function", Vt = Array.isArray, ji = (l) => Vt(l) || typeof l?.[Symbol.iterator] == "function", At = `[ 	
\f\r]`, Ke = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, zs = /-->/g, Ss = />/g, xe = RegExp(`>|${At}(?:([^\\s"'>=/]+)(${At}*=${At}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), As = /'/g, Ms = /"/g, Js = /^(?:script|style|textarea|title)$/i, Qs = (l) => (e, ...t) => ({ _$litType$: l, strings: e, values: t }), o = Qs(1), ie = Qs(2), Be = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), Es = /* @__PURE__ */ new WeakMap(), Se = Ee.createTreeWalker(Ee, 129);
function ei(l, e) {
  if (!Vt(l) || !l.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ks !== void 0 ? ks.createHTML(e) : e;
}
const Hi = (l, e) => {
  const t = l.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = Ke;
  for (let d = 0; d < t; d++) {
    const c = l[d];
    let h, m, u = -1, _ = 0;
    for (; _ < c.length && (r.lastIndex = _, m = r.exec(c), m !== null); ) _ = r.lastIndex, r === Ke ? m[1] === "!--" ? r = zs : m[1] !== void 0 ? r = Ss : m[2] !== void 0 ? (Js.test(m[2]) && (i = RegExp("</" + m[2], "g")), r = xe) : m[3] !== void 0 && (r = xe) : r === xe ? m[0] === ">" ? (r = i ?? Ke, u = -1) : m[1] === void 0 ? u = -2 : (u = r.lastIndex - m[2].length, h = m[1], r = m[3] === void 0 ? xe : m[3] === '"' ? Ms : As) : r === Ms || r === As ? r = xe : r === zs || r === Ss ? r = Ke : (r = xe, i = void 0);
    const g = r === xe && l[d + 1].startsWith("/>") ? " " : "";
    n += r === Ke ? c + Fi : u >= 0 ? (s.push(h), c.slice(0, u) + Xs + c.slice(u) + ue + g) : c + ue + (u === -2 ? d : g);
  }
  return [ei(l, n + (l[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class Xe {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, r = 0;
    const d = e.length - 1, c = this.parts, [h, m] = Hi(e, t);
    if (this.el = Xe.createElement(h, s), Se.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (i = Se.nextNode()) !== null && c.length < d; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const u of i.getAttributeNames()) if (u.endsWith(Xs)) {
          const _ = m[r++], g = i.getAttribute(u).split(ue), v = /([.?@])?(.*)/.exec(_);
          c.push({ type: 1, index: n, name: v[2], strings: g, ctor: v[1] === "." ? Ui : v[1] === "?" ? Ii : v[1] === "@" ? qi : yt }), i.removeAttribute(u);
        } else u.startsWith(ue) && (c.push({ type: 6, index: n }), i.removeAttribute(u));
        if (Js.test(i.tagName)) {
          const u = i.textContent.split(ue), _ = u.length - 1;
          if (_ > 0) {
            i.textContent = mt ? mt.emptyScript : "";
            for (let g = 0; g < _; g++) i.append(u[g], Ge()), Se.nextNode(), c.push({ type: 2, index: ++n });
            i.append(u[_], Ge());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ys) c.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = i.data.indexOf(ue, u + 1)) !== -1; ) c.push({ type: 7, index: n }), u += ue.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = Ee.createElement("template");
    return s.innerHTML = e, s;
  }
}
function Re(l, e, t = l, s) {
  if (e === Be) return e;
  let i = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const n = Ze(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(l), i._$AT(l, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = i : t._$Cl = i), i !== void 0 && (e = Re(l, i._$AS(l, e.values), i, s)), e;
}
let Ki = class {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: s } = this._$AD, i = (e?.creationScope ?? Ee).importNode(t, !0);
    Se.currentNode = i;
    let n = Se.nextNode(), r = 0, d = 0, c = s[0];
    for (; c !== void 0; ) {
      if (r === c.index) {
        let h;
        c.type === 2 ? h = new Qe(n, n.nextSibling, this, e) : c.type === 1 ? h = new c.ctor(n, c.name, c.strings, this, e) : c.type === 6 && (h = new Vi(n, this, e)), this._$AV.push(h), c = s[++d];
      }
      r !== c?.index && (n = Se.nextNode(), r++);
    }
    return Se.currentNode = Ee, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
};
class Qe {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = Re(this, e, t), Ze(e) ? e === p || e == null || e === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : e !== this._$AH && e !== Be && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ji(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== p && Ze(this._$AH) ? this._$AA.nextSibling.data = e : this.T(Ee.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = Xe.createElement(ei(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const n = new Ki(i, this), r = n.u(this.options);
      n.p(t), this.T(r), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = Es.get(e.strings);
    return t === void 0 && Es.set(e.strings, t = new Xe(e)), t;
  }
  k(e) {
    Vt(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new Qe(this.O(Ge()), this.O(Ge()), this, this.options)) : s = t[i], s._$AI(n), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = ys(e).nextSibling;
      ys(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
let yt = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(e, t = this, s, i) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) e = Re(this, e, t, 0), r = !Ze(e) || e !== this._$AH && e !== Be, r && (this._$AH = e);
    else {
      const d = e;
      let c, h;
      for (e = n[0], c = 0; c < n.length - 1; c++) h = Re(this, d[s + c], t, c), h === Be && (h = this._$AH[c]), r ||= !Ze(h) || h !== this._$AH[c], h === p ? e = p : e !== p && (e += (h ?? "") + n[c + 1]), this._$AH[c] = h;
    }
    r && !i && this.j(e);
  }
  j(e) {
    e === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
};
class Ui extends yt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === p ? void 0 : e;
  }
}
class Ii extends yt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== p);
  }
}
class qi extends yt {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = Re(this, e, t, 0) ?? p) === Be) return;
    const s = this._$AH, i = e === p && s !== p || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Vi {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Re(this, e);
  }
}
const Gi = qt.litHtmlPolyfillSupport;
Gi?.(Xe, Qe), (qt.litHtmlVersions ??= []).push("3.3.3");
const Zi = (l, e, t) => {
  const s = t?.renderBefore ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = t?.renderBefore ?? null;
    s._$litPart$ = i = new Qe(e.insertBefore(Ge(), n), n, void 0, t ?? {});
  }
  return i._$AI(l), i;
};
const Gt = globalThis;
class L extends Oe {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Zi(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Be;
  }
}
L._$litElement$ = !0, L.finalized = !0, Gt.litElementHydrateSupport?.({ LitElement: L });
const Xi = Gt.litElementPolyfillSupport;
Xi?.({ LitElement: L });
(Gt.litElementVersions ??= []).push("4.2.2");
const Yi = { attribute: !0, type: String, converter: ut, reflect: !1, hasChanged: It }, Ji = (l = Yi, e, t) => {
  const { kind: s, metadata: i } = t;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((l = Object.create(l)).wrapped = !0), n.set(t.name, l), s === "accessor") {
    const { name: r } = t;
    return { set(d) {
      const c = e.get.call(this);
      e.set.call(this, d), this.requestUpdate(r, c, l, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(r, void 0, l, d), d;
    } };
  }
  if (s === "setter") {
    const { name: r } = t;
    return function(d) {
      const c = this[r];
      e.call(this, d), this.requestUpdate(r, c, l, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function f(l) {
  return (e, t) => typeof t == "object" ? Ji(l, e, t) : ((s, i, n) => {
    const r = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), r ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(l, e, t);
}
function b(l) {
  return f({ ...l, state: !0, attribute: !1 });
}
const Qi = (l = 30) => ie`<svg width=${l} height=${l} viewBox="0 0 48 48" aria-hidden="true">
  <defs>
    <linearGradient id="db-logo-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFD27A"></stop>
      <stop offset="1" stop-color="#FF8A4C"></stop>
    </linearGradient>
  </defs>
  <path d="M10 32a14 14 0 0 1 28 0z" fill="url(#db-logo-g)"></path>
  <rect x="5" y="35" width="38" height="3" rx="1.5" fill="#FF8A4C"></rect>
  <rect x="12" y="41" width="24" height="3" rx="1.5" fill="#FF8A4C" opacity="0.55"></rect>
  <path d="M24 8v6M11.3 13.3l4.2 4.2M36.7 13.3l-4.2 4.2" stroke="#FFC56B" stroke-width="3" stroke-linecap="round"></path>
</svg>`, Ve = {
  // Long dark phase, bright only near the end (like a real sunrise).
  natural: [
    [0, 0],
    [0.4, 0.04],
    [0.7, 0.2],
    [0.9, 0.6],
    [1, 1]
  ],
  // Soft S-curve.
  gentle: [
    [0, 0],
    [0.25, 0.07],
    [0.5, 0.4],
    [0.75, 0.82],
    [1, 1]
  ],
  linear: [
    [0, 0],
    [1, 1]
  ],
  // Bright early, then levels off.
  fast: [
    [0, 0],
    [0.2, 0.5],
    [0.5, 0.85],
    [1, 1]
  ]
}, gt = {
  sunrise: ["#3A0D06", "#A32B10", "#F07A2A", "#FFD28A", "#FFF2DC"],
  dawn: ["#2A0B1E", "#8A2A55", "#F06A5A", "#FFC29A", "#FFE9D6"],
  pastel: ["#2B2340", "#7B6BB0", "#F0A7C0", "#FFD9C8", "#FFF1E6"]
}, ti = {
  sunrise: [1800, 3600],
  dawn: [1800, 3e3],
  pastel: [2200, 4e3],
  custom: [1800, 3600]
}, Ps = Ve.natural.map(([l, e]) => ({ t: l, v: e }));
function si() {
  return {
    curve: "natural",
    points: structuredClone(Ps),
    separate: !1,
    points_color: structuredClone(Ps),
    brightness: [1, 100],
    color_mode: "ct",
    kelvin: [2200, 4e3],
    colors: "sunrise",
    sequence: [],
    plain_kelvin: null,
    step_seconds: 15,
    min_brightness: 1,
    transition: "auto",
    start_offset: 0,
    ringing: "hold",
    after_stop: "keep"
  };
}
function Ot() {
  return { type: "none", media_id: "", media_type: "playlist", name: "", url: "" };
}
function ii() {
  return {
    mode: "heat",
    temperature: 21,
    humidity: 50,
    fan: 50,
    water_temperature: 50,
    start: "fixed",
    lead: 30,
    max_lead: 90,
    after: "restore",
    minutes: 30,
    only_if_needed: !0,
    outdoor_below: null,
    outdoor_above: null
  };
}
function Bt() {
  return {
    enabled: !1,
    devices: [],
    profile: null,
    settings: ii(),
    room_sensor: null,
    windows: [],
    presence: !0
  };
}
function Ws() {
  return {
    enabled: !0,
    calendars: [],
    keywords: [],
    match: "any",
    action: "skip",
    time: "06:00",
    before: 60,
    travel: !1,
    any_day: !1,
    alarm: null
  };
}
function ai() {
  return {
    enabled: !1,
    rules: [],
    travel: { origin: null, region: "auto", vehicle: "car", avoid_toll: !1, fallback: 30 }
  };
}
function Ls(l = "wake", e = "") {
  const t = {
    name: e,
    kind: l,
    enabled: !0,
    owners: [],
    wake: { type: "fixed", time: "07:00", sun_event: "sunrise", offset: 0, earliest: null, latest: null },
    light_lead: 30,
    repeat: {
      type: "weekly",
      days: [0, 1, 2, 3, 4],
      week_cycle: 1,
      weeks: [!0],
      interval: 2,
      unit: "days",
      pattern: [!0, !0, !1, !1],
      start_date: null,
      date: null
    },
    wake_on_holidays: !1,
    skip_date: null,
    once: null,
    snooze: { preset: null, count: null },
    stop_on_light_off: !0,
    last_call: { enabled: !1, profile: "all_on", duration: null },
    presence: { entities: [], skip_when_away: !0, stop_when_away: !0 },
    shift: {
      weather: { enabled: !1, conditions: [], minutes: {}, cold_below: null, cold_minutes: null },
      travel: { enabled: !1, sensor: null, usual: 30, routine: 45, arrive_by: null },
      max: 30,
      combine: "max",
      notify: !0
    },
    light: { targets: {}, profile: null, settings: si(), overrides: [], per_lamp_start: !1, starts: {} },
    actions: { light_start: [], wake: [], snooze: [], stop: [] },
    fallback: {
      lights: {},
      notify: null,
      events: ["skipped", "shifted", "device_unavailable", "failed"],
      persistent: !0
    },
    audio: {
      enabled: !1,
      players: [],
      source: Ot(),
      tts: { enabled: !1, engine: null, message: "" },
      lead: 5,
      volume: [5, 35],
      ramp: 5,
      curve: [],
      pause_on_snooze: !0,
      button: !0,
      restore_volume: !0
    },
    push: { enabled: !0, owners: !0, targets: [], critical_last_call: !1 },
    climate: Bt(),
    calendar: ai()
  };
  return l === "sleep" && (t.wake.time = "22:30", t.light_lead = 30, t.repeat.days = [0, 1, 2, 3, 4, 5, 6], t.wake_on_holidays = !0, t.light.settings.curve = "linear", t.light.settings.brightness = [1, 40], t.light.settings.kelvin = [2e3, 2400]), l === "kids" && (t.wake.time = "06:45", t.light_lead = 60, t.repeat.days = [0, 1, 2, 3, 4, 5, 6], t.wake_on_holidays = !0), t;
}
const ea = ["hs", "xy", "rgb", "rgbw", "rgbww"];
function Cs(l) {
  const e = new Set(l ?? []);
  return e.size ? {
    ct: e.has("color_temp"),
    color: ea.some((t) => e.has(t)),
    dim: !(e.size === 1 && e.has("onoff"))
  } : { ct: !1, color: !1, dim: !0 };
}
function Ye(l, e) {
  return l.curve !== "custom" ? Ve[l.curve] : (e === "col" && l.separate ? l.points_color : l.points).map((s) => [s.t, s.v]);
}
function ta(l) {
  const e = l.length, t = [];
  for (let i = 0; i < e - 1; i++)
    t.push((l[i + 1][1] - l[i][1]) / (l[i + 1][0] - l[i][0] || 1e-9));
  if (e === 2) return [t[0], t[0]];
  const s = [t[0]];
  for (let i = 1; i < e - 1; i++) s.push(t[i - 1] * t[i] <= 0 ? 0 : 2 / (1 / t[i - 1] + 1 / t[i]));
  return s.push(t[e - 2]), s;
}
function Ae(l, e) {
  if (e = Math.min(1, Math.max(0, e)), e <= l[0][0]) return l[0][1];
  if (e >= l[l.length - 1][0]) return l[l.length - 1][1];
  const t = ta(l);
  for (let s = 0; s < l.length - 1; s++) {
    const [i, n] = l[s], [r, d] = l[s + 1];
    if (e <= r) {
      const c = r - i || 1e-9, h = (e - i) / c, m = (2 * h ** 3 - 3 * h ** 2 + 1) * n + (h ** 3 - 2 * h ** 2 + h) * c * t[s] + (-2 * h ** 3 + 3 * h ** 2) * d + (h ** 3 - h ** 2) * c * t[s + 1];
      return Math.min(1, Math.max(0, m));
    }
  }
  return l[l.length - 1][1];
}
function Mt(l) {
  const e = l.replace("#", "");
  return [parseInt(e.slice(0, 2), 16), parseInt(e.slice(2, 4), 16), parseInt(e.slice(4, 6), 16)];
}
function sa(l, e, t) {
  return [l[0] + (e[0] - l[0]) * t, l[1] + (e[1] - l[1]) * t, l[2] + (e[2] - l[2]) * t];
}
function ia(l) {
  if (l.colors === "custom" && l.sequence.length >= 2) {
    const t = l.sequence.reduce((r, d) => r + d.minutes, 0) || 1, s = [];
    let i = 0;
    for (const r of l.sequence)
      s.push([i / t, r.color, r.brightness]), i += r.minutes;
    const n = l.sequence[l.sequence.length - 1];
    return s.push([1, n.color, n.brightness]), s;
  }
  const e = gt[l.colors] ?? gt.sunrise;
  return e.map((t, s) => [s / (e.length - 1), t, null]);
}
function aa(l, e) {
  const t = ia(l);
  e = Math.min(1, Math.max(0, e));
  for (let i = 0; i < t.length - 1; i++) {
    const [n, r, d] = t[i], [c, h, m] = t[i + 1];
    if (e <= c) {
      const u = c === n ? 0 : (e - n) / (c - n);
      return { rgb: sa(Mt(r), Mt(h), u), bri: d === null || m === null ? null : d + (m - d) * u };
    }
  }
  const s = t[t.length - 1];
  return { rgb: Mt(s[1]), bri: s[2] };
}
function ni(l) {
  return l.plain_kelvin ?? ti[l.colors];
}
function Je(l, e, t = { ct: !0, color: !0, dim: !0 }) {
  const s = Math.min(1, Math.max(0, e));
  let i = l.brightness[0] + (l.brightness[1] - l.brightness[0]) * Ae(Ye(l, "bri"), s);
  const n = Ae(Ye(l, "col"), s);
  if (l.color_mode === "color") {
    if (t.color) {
      const r = l.colors === "custom" && l.sequence.length >= 2, d = aa(l, r ? s : n);
      return r && d.bri !== null && (i = d.bri), { bri: i, kelvin: null, rgb: d.rgb };
    }
    if (t.ct) {
      const [r, d] = ni(l);
      return { bri: i, kelvin: r + (d - r) * n, rgb: null };
    }
    return { bri: i, kelvin: null, rgb: null };
  }
  return t.ct || t.color ? { bri: i, kelvin: l.kelvin[0] + (l.kelvin[1] - l.kelvin[0]) * n, rgb: null } : { bri: i, kelvin: null, rgb: null };
}
function pt(l) {
  const e = l / 100;
  let t, s, i;
  e <= 66 ? (t = 255, s = 99.4708025861 * Math.log(e) - 161.1195681661, i = e <= 19 ? 0 : 138.5177312231 * Math.log(e - 10) - 305.0447927307) : (t = 329.698727446 * Math.pow(e - 60, -0.1332047592), s = 288.1221695283 * Math.pow(e - 60, -0.0755148492), i = 255);
  const n = (r) => Math.round(Math.min(255, Math.max(0, r)));
  return [n(t), n(s), n(i)];
}
function Zt(l, e = !0) {
  const t = l.rgb ?? (l.kelvin ? pt(l.kelvin) : [255, 236, 210]), s = e ? 0.18 + 0.82 * Math.pow(Math.min(100, Math.max(0, l.bri)) / 100, 0.6) : 1;
  return `rgb(${t.map((i) => Math.round(i * s)).join(",")})`;
}
function le(l, e, t = !0, s = 12) {
  const i = [];
  for (let n = 0; n <= s; n++) {
    const r = n / s;
    i.push(`${Zt(Je(l, r, e), t)} ${Math.round(r * 100)}%`);
  }
  return `linear-gradient(90deg, ${i.join(", ")})`;
}
function na(l, e) {
  const t = gt[l], s = Math.max(0.5, Math.round(e / (t.length - 1) * 2) / 2);
  return t.map((i, n) => ({
    color: i,
    brightness: Math.round(1 + 99 * n / (t.length - 1)),
    minutes: s,
    transition: "smooth"
  }));
}
function ri(l, e) {
  if (e == null) return l;
  if (Array.isArray(l) || typeof l != "object" || l === null) return e;
  if (typeof e != "object" || Array.isArray(e)) return l;
  const t = { ...l };
  for (const [s, i] of Object.entries(e))
    t[s] = s in l ? ri(l[s], i) : i;
  return t;
}
const O = T`
  :host {
    --db-accent: #ffb547;
    --db-accent-strong: #ff8a4c;
    --db-on-accent: #1a1205;
    --db-bg: var(--card-background-color, var(--ha-card-background, #1c1c1c));
    --db-tile: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
    --db-line: var(--divider-color, rgba(127, 127, 127, 0.25));
    --db-text: var(--primary-text-color, #e1e1e1);
    --db-muted: var(--secondary-text-color, #9b9b9b);
    --db-radius: var(--ha-card-border-radius, 16px);
    --db-sun: #ffc56b;
    --db-civil: #f08a5d;
    --db-nautical: #8a63d2;
    --db-astro: #3d5a9e;
    --db-weather: #5aa7e6;
    --db-travel: #c77dff;
    --db-cap: #e05a5a;
    color: var(--db-text);
    font-family: var(--paper-font-body1_-_font-family, var(--ha-font-family-body, inherit));
  }
  * {
    box-sizing: border-box;
  }
  button {
    font: inherit;
    color: inherit;
  }
  .card {
    background: var(--db-bg);
    border: 1px solid var(--db-line);
    border-radius: var(--db-radius);
    box-shadow: var(--ha-card-box-shadow, none);
  }
  .tile {
    background: var(--db-tile);
    border-radius: 14px;
    padding: 12px 14px;
  }
  .lbl {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--db-muted);
  }
  .muted {
    color: var(--db-muted);
    font-size: 13px;
    line-height: 1.45;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .grow {
    flex: 1;
    min-width: 0;
  }
  .seg {
    display: inline-flex;
    flex-wrap: wrap;
    background: var(--db-tile);
    border-radius: 12px;
    padding: 3px;
    gap: 2px;
  }
  .seg button {
    border: none;
    background: transparent;
    padding: 0 14px;
    min-height: 36px;
    border-radius: 9px;
    cursor: pointer;
    color: var(--db-muted);
    white-space: nowrap;
  }
  .seg button:hover {
    color: var(--db-text);
  }
  .seg button[aria-pressed="true"] {
    background: var(--db-bg);
    color: var(--db-text);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid var(--db-line);
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
  }
  .chip[aria-pressed="true"] {
    background: color-mix(in srgb, var(--db-accent) 18%, transparent);
    border-color: color-mix(in srgb, var(--db-accent) 60%, transparent);
    color: var(--db-text);
  }
  .chip .x {
    border: none;
    background: none;
    cursor: pointer;
    color: var(--db-muted);
    padding: 0 0 0 4px;
  }
  .btn {
    min-height: 40px;
    padding: 0 16px;
    border-radius: 12px;
    border: 1px solid var(--db-line);
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn:hover {
    background: var(--db-tile);
  }
  .btn.primary {
    background: var(--db-accent);
    border-color: var(--db-accent);
    color: var(--db-on-accent);
    font-weight: 600;
  }
  .btn.danger {
    color: var(--error-color, #e05a5a);
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .inp {
    height: 38px;
    border-radius: 10px;
    border: 1px solid var(--db-line);
    background: var(--db-bg);
    color: var(--db-text);
    padding: 0 10px;
    font: inherit;
    min-width: 0;
  }
  .inp.num {
    width: 72px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .inp.time {
    width: 136px;
    font-variant-numeric: tabular-nums;
  }
  select.inp {
    padding-right: 4px;
  }
  .switch {
    position: relative;
    width: 46px;
    height: 28px;
    flex: none;
    border-radius: 14px;
    border: none;
    background: var(--db-line);
    cursor: pointer;
    transition: background 0.15s;
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 11px;
    background: #fff;
    transition: left 0.15s;
  }
  .switch[aria-checked="true"] {
    background: var(--db-accent);
  }
  .switch[aria-checked="true"]::after {
    left: 21px;
  }
  .switch:disabled {
    opacity: 0.6;
    cursor: default;
  }
  .tabular {
    font-variant-numeric: tabular-nums;
  }
  :focus-visible {
    outline: 2px solid var(--db-accent);
    outline-offset: 2px;
  }
`, kt = (l) => l?.config?.time_zone || void 0;
function oi(l) {
  const e = l?.locale?.time_format;
  if (e === "12") return !0;
  if (e === "24") return !1;
}
function N(l, e) {
  const t = typeof e == "string" ? new Date(e) : e;
  return new Intl.DateTimeFormat(xt(l), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: oi(l),
    timeZone: kt(l)
  }).format(t);
}
function y(l, e) {
  const [t, s] = e.split(":").map(Number);
  return new Intl.DateTimeFormat(xt(l), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: oi(l),
    timeZone: "UTC"
  }).format(new Date(Date.UTC(2024, 0, 1, t, s)));
}
function U(l, e) {
  const t = typeof e == "string" ? new Date(e.length === 10 ? `${e}T12:00:00Z` : e) : e;
  return new Intl.DateTimeFormat(xt(l), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: typeof e == "string" && e.length === 10 ? "UTC" : kt(l)
  }).format(t);
}
function Rt(l, e, t = Date.now()) {
  let s = Math.max(0, Math.round((new Date(e).getTime() - t) / 6e4));
  const i = Math.floor(s / 1440);
  s -= i * 1440;
  const n = Math.floor(s / 60);
  return s -= n * 60, i ? a(l, "dur_dh", { d: i, h: n }) : n ? a(l, "dur_hm", { h: n, m: String(s).padStart(2, "0") }) : a(l, "dur_m", { m: s });
}
const k = (l) => {
  const [e, t] = l.split(":").map(Number);
  return e * 60 + t;
}, M = (l) => {
  const e = (Math.round(l) % 1440 + 1440) % 1440;
  return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
};
function ae(l, e = /* @__PURE__ */ new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: kt(l)
  }).format(e);
}
function Xt(l, e) {
  const t = typeof e == "string" ? new Date(e) : e;
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: kt(l)
  }).format(t);
}
function Te(l, e) {
  const t = /* @__PURE__ */ new Date(`${l}T12:00:00Z`);
  return t.setUTCDate(t.getUTCDate() + e), t.toISOString().slice(0, 10);
}
const Ts = (l) => ((/* @__PURE__ */ new Date(`${l}T12:00:00Z`)).getUTCDay() + 6) % 7;
function Et(l, e) {
  const t = l.repeat;
  if (t.type === "once") return t.date === null || t.date === e;
  const s = t.start_date ?? "2024-01-01", i = Math.round(
    ((/* @__PURE__ */ new Date(`${e}T12:00:00Z`)).getTime() - (/* @__PURE__ */ new Date(`${s}T12:00:00Z`)).getTime()) / 864e5
  );
  if (t.type === "weekly") {
    if (!t.days.includes(Ts(e))) return !1;
    if (t.week_cycle <= 1) return !0;
    const n = i + Ts(s), r = (Math.floor(n / 7) % t.week_cycle + t.week_cycle) % t.week_cycle;
    return t.weeks[r] ?? !1;
  }
  return i < 0 ? !1 : t.type === "interval" ? i % (t.interval * (t.unit === "weeks" ? 7 : 1)) === 0 : t.pattern[i % t.pattern.length] ?? !1;
}
function Yt(l, e) {
  const t = e.repeat;
  if (t.type === "once") return t.date ? a(l, "on_date", { date: U(l, t.date) }) : a(l, "once");
  if (t.type === "interval")
    return a(l, t.unit === "weeks" ? "every_n_weeks" : "every_n_days", { n: t.interval });
  if (t.type === "pattern")
    return a(l, "pattern_summary", { on: t.pattern.filter(Boolean).length, n: t.pattern.length });
  const s = [...t.days].sort();
  let i;
  return s.length === 7 ? i = a(l, "every_day") : s.join() === "0,1,2,3,4" ? i = a(l, "weekdays") : s.join() === "5,6" ? i = a(l, "weekend") : i = s.map((n) => _t(l)[n]).join(", "), t.week_cycle > 1 && (i += " · " + a(l, "week_cycle_short", { n: t.week_cycle })), i;
}
function P(l, e) {
  return l?.states[e]?.attributes.friendly_name ?? e;
}
function ft(l, e) {
  if (!l) return e.entity_id ?? [];
  const t = new Set((e.entity_id ?? []).filter((n) => n.startsWith("light."))), s = Object.values(l.entities ?? {}), i = l.devices ?? {};
  for (const n of s) {
    if (!n.entity_id.startsWith("light.")) continue;
    n.device_id && e.device_id?.includes(n.device_id) && t.add(n.entity_id);
    const r = n.area_id ?? (n.device_id ? i[n.device_id]?.area_id : null);
    r && e.area_id?.includes(r) && t.add(n.entity_id);
  }
  return [...t].sort();
}
let Ds;
function ra() {
  return customElements.get("ha-form") && customElements.get("ha-selector") ? Promise.resolve() : (Ds ??= (async () => {
    const l = await window.loadCardHelpers?.();
    l && await (await l.createCardElement({ type: "entities", entities: [] }))?.constructor?.getConfigElement?.(), await customElements.whenDefined("ha-form");
  })(), Ds);
}
function S(l, e, t = {}) {
  l.dispatchEvent(new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 }));
}
const $ = (l, e, t) => Math.min(t, Math.max(e, l));
function H(l, e) {
  customElements.get(l) || customElements.define(l, e);
}
var oa = Object.defineProperty, et = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && oa(e, t, i), i;
};
const nt = ["astronomical_dawn", "nautical_dawn", "civil_dawn", "sunrise"], Ns = ["sunset", "civil_dusk", "nautical_dusk", "astronomical_dusk"], rt = {
  astronomical: "var(--db-astro)",
  nautical: "var(--db-nautical)",
  civil: "var(--db-civil)",
  sun: "var(--db-sun)"
}, Pt = (l) => l.startsWith("astronomical") ? rt.astronomical : l.startsWith("nautical") ? rt.nautical : l.startsWith("civil") ? rt.civil : rt.sun;
function li(l, e, t) {
  const s = e?.[t.sun_event];
  if (!s) return null;
  let i = k(Xt(l, s)) + t.offset;
  return t.earliest && (i = Math.max(i, k(t.earliest))), t.latest && (i = Math.min(i, k(t.latest))), i;
}
const Qt = class Qt extends L {
  constructor() {
    super(...arguments), this.date = "", this.mode = "normal", this._loaded = "";
  }
  willUpdate() {
    this.hass && this.date && this._loaded !== this.date && (this._loaded = this.date, Us(this.hass, this.date).then((e) => this._sun = e[this.date]).catch(() => {
    }));
  }
  _set(e) {
    S(this, "wake-change", { ...this.wake, ...e });
  }
  _local(e) {
    const t = this._sun?.[e];
    return t ? k(Xt(this.hass, t)) : null;
  }
  wakeMinutes() {
    return li(this.hass, this._sun, this.wake);
  }
  _graphic() {
    const e = this.hass, t = nt.includes(this.wake.sun_event), s = t ? nt : Ns, i = s.map((x) => this._local(x)), n = i.filter((x) => x !== null), r = this.wakeMinutes();
    if (!n.length) return o`<div class="muted">${a(e, "sun_none")}</div>`;
    const d = Math.min(...n, r ?? 1 / 0) - 40, c = Math.max(...n, r ?? -1 / 0) + 40, h = (x) => ($(x, d, c) - d) / (c - d) * 100, m = "#0b1020", u = t ? [m, "#1b2550", "#3d3a78", "#b5577a", "#ffb36b", "#ffe2a8"] : ["#ffe2a8", "#ffb36b", "#b5577a", "#3d3a78", "#1b2550", m], _ = t ? [h(i[0] ?? d) - 4, ...i.map((x) => x === null ? 0 : h(x)), h(i[3] ?? c) + 8] : [h(i[0] ?? d) - 8, ...i.map((x) => x === null ? 100 : h(x)), h(i[3] ?? c) + 4], g = `linear-gradient(90deg, ${u.map((x, D) => `${x} ${$(_[D], 0, 100)}%`).join(", ")})`, v = this.wake.earliest ? h(k(this.wake.earliest)) : null, E = this.wake.latest ? h(k(this.wake.latest)) : null;
    return o`
      <div class="sky" style="background:${g}">
        ${v !== null ? o`<div class="limit" style="left:0;width:${v}%"></div>` : p}
        ${E !== null ? o`<div class="limit" style="left:${E}%;right:0"></div>` : p}
        ${s.map(
      (x, D) => i[D] === null ? p : o`<div
                  class="mark ${x === this.wake.sun_event ? "sel" : ""}"
                  style="left:${h(i[D])}%;background:${Pt(x)}"
                  title=${a(e, `sun_${x}`)}
                ></div>
                ${x === this.wake.sun_event ? o`<span class="mlabel" style="left:${h(i[D])}%">${y(e, M(i[D]))}</span>` : p}`
    )}
        ${r !== null ? o`<div class="wakeline" style="left:${h(r)}%"></div>
              <span class="wake" style="left:${h(r)}%">${y(e, M(r))}</span>` : p}
      </div>
      <div class="legend">
        ${s.map(
      (x) => o`<span><i class="dot" style="background:${Pt(x)}"></i>${a(e, `sun_${x}`)}</span>`
    )}
        <span>${U(e, this.date)}</span>
      </div>
    `;
  }
  render() {
    const e = this.hass, t = this.wake, s = nt.includes(t.sun_event), i = s ? nt : Ns, n = t.offset < 0;
    return o`
      <div class="row">
        <div class="seg" role="group">
          <button aria-pressed=${s} @click=${() => !s && this._set({ sun_event: "sunrise" })}>
            ${a(e, "sun_rise")}
          </button>
          <button aria-pressed=${!s} @click=${() => s && this._set({ sun_event: "sunset" })}>
            ${a(e, "sun_set")}
          </button>
        </div>
      </div>
      <div class="ev">
        ${i.map(
      (r) => o`<button class="chip" aria-pressed=${t.sun_event === r} @click=${() => this._set({ sun_event: r })}>
            <i class="dot" style="background:${Pt(r)}"></i>${a(e, `sun_${r}`)}
            ${this._local(r) !== null ? o`<span class="muted tabular">${y(e, M(this._local(r)))}</span>` : p}
          </button>`
    )}
      </div>
      <div class="row">
        <input
          class="inp num"
          type="number"
          min="0"
          max="240"
          .value=${String(Math.abs(t.offset))}
          aria-label=${a(e, "sun_offset")}
          @change=${(r) => {
      const d = $(Number(r.target.value) || 0, 0, 240);
      this._set({ offset: n ? -d : d });
    }}
        />
        <span>min</span>
        <div class="seg" role="group">
          <button aria-pressed=${n} @click=${() => !n && this._set({ offset: -Math.abs(t.offset) || -15 })}>
            ${a(e, "sun_before")}
          </button>
          <button aria-pressed=${!n} @click=${() => n && this._set({ offset: Math.abs(t.offset) })}>
            ${a(e, "sun_after")}
          </button>
        </div>
        ${this.mode !== "simple" ? o`<span class="grow"></span>
              ${this.mode === "expert" ? o`<label class="row">
                    <span class="muted">${a(e, "sun_earliest")}</span>
                    <input class="inp time" type="time" .value=${t.earliest ?? ""}
                      @change=${(r) => this._set({ earliest: r.target.value || null })} />
                  </label>` : p}
              <label class="row">
                <span class="muted">${a(e, "sun_latest")}</span>
                <input class="inp time" type="time" .value=${t.latest ?? ""}
                  @change=${(r) => this._set({ latest: r.target.value || null })} />
              </label>` : p}
      </div>
      ${this._graphic()}
    `;
  }
};
Qt.styles = [
  O,
  T`
      :host {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .ev {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .ev .chip {
        gap: 8px;
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        flex: none;
      }
      .sky {
        position: relative;
        height: 86px;
        border-radius: 12px;
        overflow: hidden;
        margin-top: 4px;
      }
      .mark {
        position: absolute;
        top: 0;
        bottom: 22px;
        width: 2px;
        margin-left: -1px;
        opacity: 0.85;
      }
      .mark.sel {
        width: 3px;
        opacity: 1;
      }
      .mlabel {
        position: absolute;
        bottom: 2px;
        transform: translateX(-50%);
        font-size: 11px;
        color: var(--db-muted);
        white-space: nowrap;
      }
      .wake {
        position: absolute;
        top: 8px;
        transform: translateX(-50%);
        padding: 3px 9px;
        border-radius: 10px;
        background: var(--db-accent);
        color: var(--db-on-accent);
        font-weight: 700;
        font-size: 13px;
        white-space: nowrap;
      }
      .wakeline {
        position: absolute;
        top: 30px;
        bottom: 22px;
        width: 2px;
        margin-left: -1px;
        background: var(--db-accent);
      }
      .limit {
        position: absolute;
        top: 0;
        bottom: 22px;
        background: repeating-linear-gradient(135deg, rgba(0, 0, 0, 0.35) 0 6px, transparent 6px 12px);
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 14px;
        font-size: 12px;
        color: var(--db-muted);
      }
      .legend span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
    `
];
let ge = Qt;
et([
  f({ attribute: !1 })
], ge.prototype, "hass");
et([
  f({ attribute: !1 })
], ge.prototype, "wake");
et([
  f()
], ge.prototype, "date");
et([
  f()
], ge.prototype, "mode");
et([
  b()
], ge.prototype, "_sun");
H("db-sun-wake", ge);
var la = Object.defineProperty, B = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && la(e, t, i), i;
};
const es = class es extends L {
  constructor() {
    super(...arguments), this.time = "07:00", this.lead = 30, this.snooze = 9, this.count = 3, this.lastCall = !1, this.lcDuration = 10, this.audioLead = -1, this.climateLead = -1, this.fixedWake = !1, this.showSnooze = !0, this.startLabel = "", this.wakeLabel = "", this.gradient = "linear-gradient(90deg,#3a1a12,#ff8a4c,#fff3e0)", this.lamps = [], this._grown = 0, this._dragText = "", this._width = 600;
  }
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver((e) => {
      const t = Math.round(e[0].contentRect.width);
      t && Math.abs(t - this._width) > 20 && (this._width = t);
    }), this._ro.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect();
  }
  /** Minutes from the wake mark to each edge; the wake time stays centred. */
  get _half() {
    if (this._frozen) return this._frozen;
    const e = Math.max(this.lead, this.audioLead, this.climateLead), t = this.showSnooze ? this.snooze * this.count + (this.lastCall ? this.lcDuration : 0) : 0;
    return Math.max(15, Math.ceil((Math.max(e, t) + 5) / 15) * 15);
  }
  /** Minutes shown left of the wake mark. */
  get _room() {
    return this._half;
  }
  /** Total minutes covered by the bar. */
  get _span() {
    return this._half * 2;
  }
  /** Position (%) of "minutes after the left edge of the bar". */
  _pct(e) {
    return $(e, 0, this._span) / this._span * 100;
  }
  _emit(e) {
    S(this, "timeline-change", {
      time: this.time,
      lead: this.lead,
      count: this.count,
      lcDuration: this.lcDuration,
      ...e
    });
  }
  /** Pointer position in minutes relative to the wake time. */
  _minutesAt(e) {
    const s = this.shadowRoot.querySelector(".bar").getBoundingClientRect();
    return (e.clientX - s.left) / s.width * this._span - this._room;
  }
  _down(e, t) {
    this._frozen = this._half, this._drag = e, t.currentTarget.setPointerCapture(t.pointerId);
  }
  /** A lamp's start in minutes before the wake time (never before the light start). */
  _before(e) {
    return $(e.before, 1, Math.max(1, this.lead));
  }
  /** Grow the frozen scale (in steps) while a handle is pushed against an edge. */
  _grow(e) {
    !this._frozen || Math.abs(e) < this._frozen - 2 || Date.now() - this._grown < 300 || (this._grown = Date.now(), this._frozen += 15);
  }
  _move(e) {
    if (!this._drag) return;
    const t = this._minutesAt(e);
    if (this._grow(t), this._drag.startsWith("lamp:")) {
      const s = this.lamps[Number(this._drag.slice(5))], i = Math.round($(-t, 1, Math.max(1, this.lead)));
      this._dragText = `${s.name} · ${y(this.hass, M(k(this.time) - i))}`, S(this, "lamp-start-change", { entity: s.entity, before: i });
    } else if (this._drag === "start") {
      const s = Math.round($(-t, 0, 240));
      this._dragText = y(this.hass, M(k(this.time) - s)), this._emit({ lead: s });
    } else if (this._drag === "end") {
      const s = Math.round($(t / this.snooze, 1, 10));
      this._dragText = `${y(this.hass, M(k(this.time) + s * this.snooze))} · ${s}×`, this._emit({ count: s });
    } else {
      const s = Math.round($(t - this.snooze * this.count, 1, 120));
      this._dragText = y(this.hass, M(k(this.time) + this.snooze * this.count + s)), this._emit({ lcDuration: s });
    }
  }
  _up() {
    this._drag = void 0, this._frozen = void 0;
  }
  _key(e, t) {
    const s = t.key === "ArrowRight" || t.key === "ArrowUp" ? 1 : t.key === "ArrowLeft" || t.key === "ArrowDown" ? -1 : 0;
    if (s)
      if (t.preventDefault(), e.startsWith("lamp:")) {
        const i = this.lamps[Number(e.slice(5))];
        S(this, "lamp-start-change", { entity: i.entity, before: $(this._before(i) - s, 1, Math.max(1, this.lead)) });
      } else e === "start" ? this._emit({ lead: $(this.lead - s, 0, 240) }) : e === "end" ? this._emit({ count: $(this.count + s, 1, 10) }) : this._emit({ lcDuration: $(this.lcDuration + s, 1, 120) });
  }
  _diff(e, t) {
    let s = k(e) - k(t);
    return s < -720 && (s += 1440), s;
  }
  _setStart(e) {
    const t = e.target.value;
    if (!t) return;
    let s = k(this.time) - k(t);
    s < 0 && (s += 1440), this._emit({ lead: $(s, 0, 240) });
  }
  _setWake(e) {
    const t = e.target.value;
    t && this._emit({ time: t });
  }
  _setEnd(e) {
    const t = e.target.value;
    t && this._emit({ count: $(Math.round(this._diff(t, this.time) / this.snooze), 1, 10) });
  }
  _setOff(e) {
    const t = e.target.value;
    t && this._emit({ lcDuration: $(this._diff(t, this.time) - this.snooze * this.count, 1, 120) });
  }
  render() {
    const e = this.hass, t = this._room, s = k(this.time), i = M(s - this.lead), n = this.snooze * this.count, r = M(s + n), d = this.showSnooze && this.lastCall, c = M(s + n + this.lcDuration), h = this._pct(t - this.lead), m = this._pct(t), u = this._pct(t + n), _ = this._pct(t + n + this.lcDuration), g = Math.max(3, Math.floor(this._width / 84)), v = [5, 10, 15, 30, 60, 120].find((w) => this._span / w <= g) ?? 120, E = s - t, x = [];
    for (let w = Math.ceil(E / v) * v - E; w <= this._span; w += v)
      x.push({ pct: this._pct(w), text: y(e, M(E + w)) });
    const D = this.lastCall ? a(e, "tl_last_call") : a(e, "tl_stop"), Ce = this._drag?.startsWith("lamp:") ? this._pct(t - this._before(this.lamps[Number(this._drag.slice(5))])) : this._drag === "start" ? h : this._drag === "off" ? _ : u;
    return o`
      <div class="labels" style="--cols:${d ? 4 : 3}">
        <label>
          <span>${this.startLabel || a(e, "tl_light_start")}</span>
          <input class="inp tabular" type="time" .value=${i} @change=${this._setStart} />
        </label>
        <label>
          <span>${this.wakeLabel || a(e, "tl_wake")}</span>
          <input class="inp tabular" type="time" .value=${this.time} ?readonly=${this.fixedWake} @change=${this._setWake} />
        </label>
        ${this.showSnooze ? o`<label>
              <span>${D}</span>
              <input class="inp tabular" type="time" step="60" .value=${r} @change=${this._setEnd} />
            </label>` : o`<span></span>`}
        ${d ? o`<label>
              <span>${a(e, "tl_off")}</span>
              <input class="inp tabular" type="time" .value=${c} @change=${this._setOff} />
            </label>` : p}
      </div>
      <div class="bar" @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
        <div class="track"></div>
        <div class="seg ramp" style="left:${h}%;width:${m - h}%;background:${this.gradient}"></div>
        ${this.showSnooze ? o`<div
              class="seg snz"
              style="left:${m}%;width:${u - m}%;--w:${100 / Math.max(1, this.count)}%"
              title=${a(e, "tl_snooze_title", { n: this.count, m: this.snooze })}
            ></div>` : p}
        ${d ? o`<div class="seg lc" style="left:${u}%;width:${_ - u}%" title=${a(e, "tl_last_call")}></div>` : p}
        ${this.audioLead >= 0 && this.showSnooze ? o`<span class="music" style="left:${this._pct(t - this.audioLead)}%">♪ ${y(e, M(s - this.audioLead))}</span>
              <div class="musicline" style="left:${this._pct(t - this.audioLead)}%"></div>` : p}
        ${this.climateLead >= 0 ? o`<div class="clim" style="left:${this._pct(t - this.climateLead)}%;width:${m - this._pct(t - this.climateLead)}%"
                title=${`${a(e, "tl_climate")} ${y(e, M(s - this.climateLead))}`}></div>
              <span class="music climlabel" style="left:${this._pct(t - this.climateLead)}%;top:${this.audioLead >= 0 && Math.abs(this.audioLead - this.climateLead) < this._span / 8 ? "-16px" : "-2px"}">🌡 ${y(e, M(s - this.climateLead))}</span>` : p}
        <div class="wake" style="left:${m}%" title=${this.wakeLabel || a(e, "tl_wake")}></div>
        <div
          class="handle start"
          style="left:${h}%"
          tabindex="0"
          role="slider"
          aria-label=${this.startLabel || a(e, "tl_light_start")}
          aria-valuetext=${y(e, i)}
          @pointerdown=${(w) => this._down("start", w)}
          @keydown=${(w) => this._key("start", w)}
        ><span></span></div>
        ${this.showSnooze ? o`<div
              class="handle end"
              style="left:${u}%"
              tabindex="0"
              role="slider"
              aria-label=${D}
              aria-valuetext=${`${y(e, r)}, ${this.count}×`}
              @pointerdown=${(w) => this._down("end", w)}
              @keydown=${(w) => this._key("end", w)}
            ><span></span></div>` : p}
        ${d ? o`<div
              class="handle off"
              style="left:${_}%"
              tabindex="0"
              role="slider"
              aria-label=${a(e, "tl_off")}
              aria-valuetext=${y(e, c)}
              @pointerdown=${(w) => this._down("off", w)}
              @keydown=${(w) => this._key("off", w)}
            ><span></span></div>` : p}
        ${this._drag ? o`<span class="tip" style="left:${Ce}%">${this._dragText}</span>` : p}
        <div class="ticks">${x.map(
      (w) => o`<span class=${w.pct < 7 ? "first" : w.pct > 93 ? "last" : ""} style="left:${w.pct}%">${w.text}</span>`
    )}</div>
      </div>
      ${this.lamps.length ? o`<div class="lamps" @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
            ${this.lamps.map((w, oe) => {
      const $e = this._pct(t - this._before(w));
      return o`<div class="lamp">
                <span class="lname" style="left:${h}%">${w.name} · ${y(e, M(s - this._before(w)))}</span>
                <div class="ltrack" style="left:${h}%;width:${m - h}%"></div>
                <div class="seg lseg" style="left:${$e}%;width:${m - $e}%;background:${w.gradient ?? this.gradient}"></div>
                <div class="lwake" style="left:${m}%"></div>
                <div class="handle lh" style="left:${$e}%" tabindex="0" role="slider"
                  aria-label=${`${a(e, "tl_lamp_start")}: ${w.name}`}
                  aria-valuetext=${y(e, M(s - this._before(w)))}
                  @pointerdown=${(He) => this._down(`lamp:${oe}`, He)}
                  @keydown=${(He) => this._key(`lamp:${oe}`, He)}><span></span></div>
              </div>`;
    })}
          </div>` : p}
    `;
  }
};
es.styles = [
  O,
  T`
      :host {
        display: block;
      }
      .labels {
        display: grid;
        grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 14px;
      }
      .labels label {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: var(--db-muted);
      }
      .labels label:nth-child(2) {
        align-items: center;
      }
      .labels label:last-child {
        align-items: flex-end;
      }
      .labels label:nth-child(3):not(:last-child) {
        align-items: center;
      }
      .labels input {
        font-size: clamp(15px, 3.6vw, 20px);
        height: 44px;
        width: 100%;
        max-width: 170px;
        text-align: center;
        padding: 0 6px;
      }
      .labels label:nth-child(2) input {
        font-size: clamp(17px, 4.4vw, 24px);
        font-weight: 600;
        max-width: 210px;
      }
      .bar {
        position: relative;
        height: 64px;
        touch-action: none;
        user-select: none;
      }
      .track {
        position: absolute;
        left: 0;
        right: 0;
        top: 22px;
        height: 20px;
        border-radius: 10px;
        background: var(--db-tile);
      }
      .seg {
        position: absolute;
        top: 22px;
        height: 20px;
      }
      .ramp {
        border-radius: 10px 0 0 10px;
      }
      .track {
        opacity: 0.6;
      }
      .snz {
        background: repeating-linear-gradient(
          90deg,
          color-mix(in srgb, var(--db-accent) 55%, transparent) 0 calc(var(--w) - 2px),
          transparent calc(var(--w) - 2px) var(--w)
        );
      }
      .handle {
        position: absolute;
        top: 12px;
        width: 40px;
        height: 40px;
        margin-left: -20px;
        border-radius: 20px;
        cursor: grab;
        display: grid;
        place-items: center;
        outline-offset: -4px;
      }
      .handle span {
        width: 22px;
        height: 22px;
        border-radius: 11px;
        background: #fff;
        border: 3px solid var(--db-accent-strong);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
      }
      .lc {
        background: repeating-linear-gradient(
          135deg,
          color-mix(in srgb, var(--db-cap) 70%, transparent) 0 6px,
          color-mix(in srgb, var(--db-cap) 40%, transparent) 6px 12px
        );
        border-radius: 0 10px 10px 0;
      }
      .handle.off span {
        border-radius: 4px;
        border-color: var(--db-cap);
        background: var(--db-cap);
      }
      .handle.end span {
        border-radius: 6px;
        border-color: var(--db-muted);
      }
      .handle.fixed {
        cursor: default;
      }
      .handle.fixed span {
        border-style: dashed;
      }
      .music {
        position: absolute;
        top: -2px;
        transform: translateX(-50%);
        font-size: 12px;
        color: var(--db-muted);
        white-space: nowrap;
        pointer-events: none;
      }
      .musicline {
        position: absolute;
        top: 16px;
        height: 32px;
        border-left: 2px dotted var(--db-muted);
        pointer-events: none;
      }
      .clim {
        position: absolute;
        top: 15px;
        height: 4px;
        border-radius: 2px;
        background: linear-gradient(90deg, #4aa3ff, #ff8a4c);
        opacity: 0.85;
      }
      .wake {
        position: absolute;
        top: 10px;
        width: 4px;
        height: 44px;
        margin-left: -2px;
        border-radius: 2px;
        background: var(--db-text);
      }
      .handle.start span {
        border-color: var(--db-accent);
      }
      .tip {
        position: absolute;
        top: -8px;
        transform: translateX(-50%);
        padding: 2px 8px;
        border-radius: 8px;
        background: var(--db-text);
        color: var(--db-bg);
        font-size: 12px;
        font-weight: 600;
        pointer-events: none;
        white-space: nowrap;
      }
      .ticks {
        position: absolute;
        top: 46px;
        left: 0;
        right: 0;
        height: 18px;
        font-size: 11px;
        color: var(--db-muted);
      }
      .ticks span {
        position: absolute;
        transform: translateX(-50%);
        white-space: nowrap;
      }
      .ticks span.first {
        transform: none;
      }
      .ticks span.last {
        transform: translateX(-100%);
      }
      .lamps {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-top: 4px;
        touch-action: none;
        user-select: none;
      }
      .lamp {
        position: relative;
        height: 46px;
      }
      .lname {
        position: absolute;
        top: 0;
        font-size: 12px;
        color: var(--db-muted);
        white-space: nowrap;
      }
      .ltrack {
        position: absolute;
        top: 24px;
        height: 10px;
        border-radius: 5px;
        background: var(--db-tile);
      }
      .lseg {
        top: 24px;
        height: 10px;
        border-radius: 5px 0 0 5px;
      }
      .lwake {
        position: absolute;
        top: 18px;
        width: 2px;
        height: 22px;
        margin-left: -1px;
        background: var(--db-text);
        opacity: 0.6;
      }
      .handle.lh {
        top: 9px;
      }
      .handle.lh span {
        width: 18px;
        height: 18px;
        border-color: var(--db-accent);
      }
      @media (max-width: 520px) {
        .labels {
          gap: 6px;
        }
        .labels input {
          height: 40px;
          padding: 0 2px;
        }
        .labels input::-webkit-calendar-picker-indicator {
          display: none;
        }
      }
    `
];
let C = es;
B([
  f({ attribute: !1 })
], C.prototype, "hass");
B([
  f()
], C.prototype, "time");
B([
  f({ type: Number })
], C.prototype, "lead");
B([
  f({ type: Number })
], C.prototype, "snooze");
B([
  f({ type: Number })
], C.prototype, "count");
B([
  f({ type: Boolean })
], C.prototype, "lastCall");
B([
  f({ type: Number })
], C.prototype, "lcDuration");
B([
  f({ type: Number })
], C.prototype, "audioLead");
B([
  f({ type: Number })
], C.prototype, "climateLead");
B([
  f({ type: Boolean })
], C.prototype, "fixedWake");
B([
  f({ type: Boolean })
], C.prototype, "showSnooze");
B([
  f()
], C.prototype, "startLabel");
B([
  f()
], C.prototype, "wakeLabel");
B([
  f()
], C.prototype, "gradient");
B([
  f({ attribute: !1 })
], C.prototype, "lamps");
B([
  b()
], C.prototype, "_drag");
B([
  b()
], C.prototype, "_dragText");
B([
  b()
], C.prototype, "_width");
H("db-time-line", C);
var da = Object.defineProperty, ve = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && da(e, t, i), i;
};
const ts = class ts extends L {
  constructor() {
    super(...arguments), this.bands = [], this.cap = 30, this.lead = 30, this.combine = "max", this.time = "07:00", this.gradient = "linear-gradient(90deg,#3a1a12,#ff8a4c,#fff3e0)", this._grown = 0;
  }
  get _result() {
    const e = this.bands.map((s) => s.minutes ?? 0), t = this.combine === "sum" ? e.reduce((s, i) => s + i, 0) : Math.max(0, ...e);
    return Math.min(t, this.cap);
  }
  /** Clock range of the axis in minutes since midnight (relative to wake). */
  get _bounds() {
    if (this._range) return this._range;
    const e = k(this.time), t = Math.max(this.cap, ...this.bands.map((i) => i.minutes ?? 0)) + this.lead, s = Math.max(15, Math.ceil((t + 5) / 15) * 15);
    return [e - s, e + s];
  }
  _pct(e) {
    const [t, s] = this._bounds;
    return ($(e, t, s) - t) / (s - t) * 100;
  }
  _minutesEarlier(e) {
    const s = this.shadowRoot.querySelector(".lane").getBoundingClientRect(), [i, n] = this._bounds, r = i + (e.clientX - s.left) / s.width * (n - i);
    return $(Math.round(k(this.time) - r), 0, 240);
  }
  _down(e, t) {
    this._range = this._bounds, this._drag = e, t.currentTarget.setPointerCapture(t.pointerId);
  }
  _move(e) {
    if (!this._drag) return;
    const t = this._minutesEarlier(e);
    this._range && k(this.time) - t <= this._range[0] + 1 && Date.now() - this._grown > 300 && (this._grown = Date.now(), this._range = [this._range[0] - 15, this._range[1] + 15]), this._drag === "__cap" ? S(this, "cap-change", { minutes: t }) : S(this, "band-change", { key: this._drag, minutes: t });
  }
  _up() {
    this._drag = void 0, this._range = void 0;
  }
  _key(e, t, s) {
    const i = s.key === "ArrowLeft" || s.key === "ArrowUp" ? 1 : s.key === "ArrowRight" || s.key === "ArrowDown" ? -1 : 0;
    if (!i) return;
    s.preventDefault();
    const n = $(t + i, 0, 240);
    e === "__cap" ? S(this, "cap-change", { minutes: n }) : S(this, "band-change", { key: e, minutes: n });
  }
  render() {
    const e = this.hass, t = k(this.time), s = t - this.lead, i = this._result, [n, r] = this._bounds, d = r - n > 150 ? 30 : r - n > 70 ? 15 : 10, c = [];
    for (let _ = Math.ceil(n / d) * d; _ <= r; _ += d) c.push(_);
    const h = this._pct(t - this.cap), m = (_) => y(e, M(_)), u = (_, g, v) => o`<div class="row">
      <div class="name">${g}<small>${v}</small></div>
      <div class="lane">
        <div class="bar" style="left:${this._pct(_)}%;width:${this._pct(_ + this.lead) - this._pct(_)}%;background:${this.gradient}"></div>
      </div>
    </div>`;
    return o`
      <div class="grid" @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
        ${u(s, a(e, "shift_row_normal"), `${m(s)} – ${m(t)}`)}
        ${this.bands.map((_) => {
      const g = _.minutes, v = this._pct(t - (g ?? this.cap));
      return o`<div class="row" style="--c:${_.color}">
            <div class="name">${_.label}${_.note ? o`<small>${_.note}</small>` : p}</div>
            <div class="lane">
              <div class="bar ${g === null ? "unknown" : ""}" style="left:${v}%;width:${this._pct(t) - v}%;background:${_.color}"></div>
              ${g !== null && g > 0 ? o`<span class="val" style="left:${v}%">−${g}</span>` : p}
              ${_.editable && g !== null ? o`<div class="handle" style="left:${v}%" tabindex="0" role="slider" aria-label=${_.label}
                    aria-valuetext=${`−${g} min`} @pointerdown=${(E) => this._down(_.key, E)}
                    @keydown=${(E) => this._key(_.key, g, E)}><span></span></div>` : p}
            </div>
          </div>`;
    })}
        ${u(
      s - i,
      a(e, "shift_row_worst"),
      i ? `${m(s - i)} – ${m(t - i)}` : a(e, "shift_row_same")
    )}
        <div class="row">
          <span></span>
          <div class="lane" style="height:22px">
            <div class="axis">${c.map((_) => o`<span style="left:${this._pct(_)}%">${m(_)}</span>`)}</div>
          </div>
        </div>
        <div class="row" style="position:absolute;inset:0 0 0 0;pointer-events:none">
          <span></span>
          <div style="position:relative;height:100%">
            <div class="overlay capzone" style="left:0;width:${h}%"></div>
            <div class="overlay wakeline" style="left:${this._pct(t)}%"></div>
            <div class="caphandle" style="left:${h}%;pointer-events:auto" tabindex="0" role="slider"
              aria-label=${a(e, "shift_cap")} aria-valuetext=${`−${this.cap} min`}
              @pointerdown=${(_) => this._down("__cap", _)}
              @keydown=${(_) => this._key("__cap", this.cap, _)}><span></span></div>
          </div>
        </div>
      </div>
      <div class="foot">
        <label class="row" style="display:flex;min-height:0">
          <span>${a(e, "shift_cap")}</span>
          <input class="inp num" type="number" min="0" max="240" .value=${String(this.cap)}
            @change=${(_) => S(this, "cap-change", { minutes: $(Number(_.target.value) || 0, 0, 240) })} />
          <span>${a(e, "min_earlier")}</span>
        </label>
        <span class="grow"></span>
        <span class="muted">${a(e, this.combine === "sum" ? "shift_hint_sum" : "shift_hint_max")}</span>
      </div>
    `;
  }
};
ts.styles = [
  O,
  T`
      .grid {
        position: relative;
        user-select: none;
        touch-action: none;
      }
      .row {
        position: relative;
        display: grid;
        grid-template-columns: 112px minmax(0, 1fr);
        align-items: center;
        min-height: 34px;
        gap: 8px;
      }
      .name {
        font-size: 13px;
        line-height: 1.2;
      }
      .name small {
        display: block;
        color: var(--db-muted);
        font-size: 11px;
      }
      .lane {
        position: relative;
        height: 34px;
      }
      .bar {
        position: absolute;
        top: 9px;
        height: 16px;
        border-radius: 8px;
      }
      .bar.unknown {
        background: repeating-linear-gradient(90deg, var(--c) 0 6px, transparent 6px 10px) !important;
        opacity: 0.6;
      }
      .handle {
        position: absolute;
        top: -3px;
        width: 40px;
        height: 40px;
        margin-left: -20px;
        border-radius: 20px;
        display: grid;
        place-items: center;
        cursor: ew-resize;
        z-index: 2;
      }
      .handle span {
        width: 16px;
        height: 16px;
        border-radius: 8px;
        background: #fff;
        border: 3px solid var(--c, var(--db-accent));
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
      }
      .val {
        position: absolute;
        top: 8px;
        transform: translateX(calc(-100% - 8px));
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
      }
      .overlay {
        position: absolute;
        top: 0;
        bottom: 22px;
        pointer-events: none;
      }
      .capzone {
        background: repeating-linear-gradient(
          135deg,
          color-mix(in srgb, var(--db-cap) 18%, transparent) 0 6px,
          transparent 6px 12px
        );
        border-right: 2px dashed var(--db-cap);
      }
      .wakeline {
        border-left: 2px solid var(--db-accent);
      }
      .caphandle {
        position: absolute;
        bottom: -2px;
        width: 40px;
        height: 28px;
        margin-left: -20px;
        display: grid;
        place-items: center;
        cursor: ew-resize;
        z-index: 3;
      }
      .caphandle span {
        width: 14px;
        height: 14px;
        border-radius: 3px;
        background: var(--db-cap);
        transform: rotate(45deg);
      }
      .axis {
        position: relative;
        height: 22px;
        font-size: 11px;
        color: var(--db-muted);
      }
      .axis span {
        position: absolute;
        transform: translateX(-50%);
        top: 6px;
        white-space: nowrap;
      }
      .foot {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
      }
      @media (max-width: 520px) {
        .row {
          grid-template-columns: 80px minmax(0, 1fr);
        }
      }
    `
];
let te = ts;
ve([
  f({ attribute: !1 })
], te.prototype, "hass");
ve([
  f({ attribute: !1 })
], te.prototype, "bands");
ve([
  f({ type: Number })
], te.prototype, "cap");
ve([
  f({ type: Number })
], te.prototype, "lead");
ve([
  f()
], te.prototype, "combine");
ve([
  f()
], te.prototype, "time");
ve([
  f()
], te.prototype, "gradient");
ve([
  b()
], te.prototype, "_drag");
H("db-shift-line", te);
var ca = Object.defineProperty, V = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && ca(e, t, i), i;
};
const we = 600, se = 180, F = 14, Os = ["natural", "gentle", "linear", "fast"], ss = class ss extends L {
  constructor() {
    super(...arguments), this.mode = "normal", this.locked = !1, this.duration = 30, this.start = "06:30", this.colorLamps = [], this.plainLamps = [], this.showFine = !0, this._channel = "bri", this._sel = -1, this._width = 600, this._open = { bri: !0, col: !0, fine: !1 };
  }
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver((e) => {
      const t = Math.round(e[0].contentRect.width);
      t && Math.abs(t - this._width) > 20 && (this._width = t);
    }), this._ro.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect();
  }
  get s() {
    return this.settings;
  }
  _emit(e) {
    this.locked || S(this, "settings-change", { ...this.settings, ...e });
  }
  _timeAt(e) {
    return y(this.hass, M(k(this.start) + e * this.duration));
  }
  // ------------------------------------------------------------------ curve
  _points() {
    const e = this._channel === "col" && this.s.separate ? "points_color" : "points";
    return this.s.curve !== "custom" ? Ve[this.s.curve].map(([t, s]) => ({ t, v: s })) : this.s[e];
  }
  _setPoints(e) {
    const t = this._channel === "col" && this.s.separate ? "points_color" : "points", s = { curve: "custom", [t]: e };
    if (this.s.curve !== "custom") {
      const i = Ve[this.s.curve].map(([n, r]) => ({ t: n, v: r }));
      t === "points" ? s.points_color = this.s.separate ? i : structuredClone(e) : s.points = i;
    }
    this._emit(s);
  }
  _xy(e) {
    return { x: F + e.t * (we - 2 * F), y: se - F - e.v * (se - 2 * F) };
  }
  _fromEvent(e) {
    const s = this.shadowRoot.querySelector(".graph svg").getBoundingClientRect(), i = (e.clientX - s.left) / s.width * we, n = (e.clientY - s.top) / s.height * se;
    return { t: $((i - F) / (we - 2 * F), 0, 1), v: $((se - F - n) / (se - 2 * F), 0, 1) };
  }
  _curveDown(e, t) {
    this.locked || this.mode === "simple" || (t.stopPropagation(), this._sel = e, this._drag = { kind: "curve", index: e }, t.currentTarget.setPointerCapture(t.pointerId));
  }
  _curveMove(e) {
    if (this._drag?.kind !== "curve") return;
    const t = structuredClone(this._points()), s = this._drag.index, i = this._fromEvent(e), n = s === 0 ? 0 : t[s - 1].t + 0.01, r = s === t.length - 1 ? 1 : t[s + 1].t - 0.01;
    t[s] = {
      t: s === 0 ? 0 : s === t.length - 1 ? 1 : Math.round($(i.t, n, r) * 1e3) / 1e3,
      v: Math.round(i.v * 1e3) / 1e3
    }, this._setPoints(t);
  }
  _addPoint() {
    const e = structuredClone(this._points());
    let t = 0, s = 0;
    for (let r = 0; r < e.length - 1; r++)
      e[r + 1].t - e[r].t > t && (t = e[r + 1].t - e[r].t, s = r);
    const i = (e[s].t + e[s + 1].t) / 2, n = Ae(e.map((r) => [r.t, r.v]), i);
    e.splice(s + 1, 0, { t: Math.round(i * 1e3) / 1e3, v: Math.round(n * 1e3) / 1e3 }), this._sel = s + 1, this._setPoints(e);
  }
  _removePoint() {
    const e = structuredClone(this._points());
    this._sel <= 0 || this._sel >= e.length - 1 || (e.splice(this._sel, 1), this._sel = -1, this._setPoints(e));
  }
  _miniCurve(e) {
    const t = Ve[e], s = Array.from({ length: 31 }, (i, n) => {
      const r = n / 30;
      return `${n ? "L" : "M"}${r * 100},${30 - Ae(t, r) * 28}`;
    }).join(" ");
    return ie`<svg viewBox="0 0 100 31" preserveAspectRatio="none"><path d=${s} fill="none" stroke="var(--db-accent)" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>`;
  }
  _graph() {
    const e = this.hass, t = this._points(), s = this.s.separate ? this._channel : "bri", i = Ye(this.s, s), n = Array.from({ length: 81 }, (g, v) => {
      const E = this._xy({ t: v / 80, v: Ae(i, v / 80) });
      return `${v ? "L" : "M"}${E.x.toFixed(1)},${E.y.toFixed(1)}`;
    }).join(" "), r = `${n} L${we - F},${se - F} L${F},${se - F} Z`, d = this.mode !== "simple" && !this.locked, c = [0.25, 0.5, 0.75].map((g) => this._xy({ t: 0, v: g }).y), h = this._tickMinutes(), m = [];
    for (let g = h; g < this.duration; g += h) m.push(g / this.duration);
    const u = this._drag?.kind === "curve" ? t[this._drag.index] : void 0, _ = u ? this._xy(u) : void 0;
    return o`
      <div class="graph edit">
        <svg viewBox="0 0 ${we} ${se}" @pointermove=${this._curveMove} @pointerup=${() => this._drag = void 0}
          @pointercancel=${() => this._drag = void 0}>
          <defs>
            <linearGradient id="fillg" x1="0" x2="1" y1="0" y2="0">
              ${Array.from({ length: 9 }, (g, v) => ie`<stop offset=${v / 8} stop-color=${Zt(Je(this.s, v / 8), !1)} stop-opacity="0.35"/>`)}
            </linearGradient>
          </defs>
          ${c.map((g) => ie`<line x1=${F} x2=${we - F} y1=${g} y2=${g} stroke="var(--db-line)" stroke-dasharray="3 5"/>`)}
          ${m.map((g) => {
      const v = this._xy({ t: g, v: 0 }).x;
      return ie`<line x1=${v} x2=${v} y1=${F} y2=${se - F} stroke="var(--db-line)" stroke-dasharray="2 6"/>`;
    })}
          <path d=${r} fill="url(#fillg)"/>
          <path d=${n} fill="none" stroke="var(--db-accent)" stroke-width="3" stroke-linecap="round"/>
          ${d || this.s.curve === "custom" ? t.map((g, v) => {
      const { x: E, y: x } = this._xy(g);
      return ie`<g style="cursor:${d ? "grab" : "default"}" @pointerdown=${(D) => this._curveDown(v, D)}>
                  <circle cx=${E} cy=${x} r="18" fill="transparent"/>
                  <circle cx=${E} cy=${x} r=${v === this._sel ? 8 : 6.5} fill="#fff" stroke="var(--db-accent-strong)" stroke-width="3"/>
                </g>`;
    }) : p}
        </svg>
        ${u && _ ? o`<span class="tip" style="left:${_.x / we * 100}%;top:${_.y / se * 100}%">
              ${this._timeAt(u.t)} · ${Math.round(u.v * 100)}%
            </span>` : p}
        <div class="strip" style="background:${le(this.s)}" title=${a(e, "ls_strip")}></div>
      </div>
    `;
  }
  _curveSection() {
    const e = this.hass, t = this.s, s = this.mode === "simple" ? Os : [...Os, "custom"], i = this._points();
    return o`
      <div class="presets edit">
        ${s.map(
      (n) => o`<button class="preset" aria-pressed=${t.curve === n} ?disabled=${this.locked}
            @click=${() => n === "custom" ? this._setPoints(structuredClone(i)) : this._emit({ curve: n })}>
            ${n === "custom" ? o`<svg viewBox="0 0 100 31"><path d="M0 30 C30 28 40 6 100 2" fill="none"
                  stroke="var(--db-accent)" stroke-width="2.5" stroke-dasharray="4 4"/></svg>` : this._miniCurve(n)}
            <b>${a(e, `curve_${n}`)}</b>
            <span class="muted">${a(e, `curve_${n}_d`)}</span>
          </button>`
    )}
      </div>
      ${this.mode !== "simple" ? o`<div class="row edit">
            <div class="seg" role="group" aria-label=${a(e, "ls_link")}>
              <button aria-pressed=${!t.separate} ?disabled=${this.locked}
                @click=${() => t.separate && this._emit({ separate: !1 })}>${a(e, "ls_shared")}</button>
              <button aria-pressed=${t.separate} ?disabled=${this.locked}
                @click=${() => !t.separate && this._emit({ separate: !0, curve: "custom", points_color: structuredClone(i) })}>
                ${a(e, "ls_separate")}
              </button>
            </div>
            ${t.separate ? o`<div class="seg" role="group">
                  <button aria-pressed=${this._channel === "bri"} @click=${() => this._channel = "bri"}>
                    ${a(e, "ls_brightness")}
                  </button>
                  <button aria-pressed=${this._channel === "col"} @click=${() => this._channel = "col"}>
                    ${a(e, t.color_mode === "color" ? "ls_color" : "ls_ct")}
                  </button>
                </div>` : p}
            <span class="grow"></span>
            <button class="btn" ?disabled=${this.locked || i.length >= 24} @click=${this._addPoint}>
              ${a(e, "ls_add_point")}
            </button>
            <button class="btn" ?disabled=${this.locked || this._sel <= 0 || this._sel >= i.length - 1}
              @click=${this._removePoint}>${a(e, "ls_remove_point")}</button>
          </div>` : p}
      ${this._graph()}
      ${this.mode === "expert" ? this._pointTable(i) : p}
    `;
  }
  _pointTable(e) {
    const t = this.hass, s = (i, n) => {
      const r = structuredClone(e);
      r[i] = { ...r[i], ...n }, i === 0 && (r[i].t = 0), i === r.length - 1 && (r[i].t = 1), r.sort((d, c) => d.t - c.t), this._setPoints(r);
    };
    return o`<table class="edit">
      <thead><tr><th>#</th><th>${a(t, "ls_time")}</th><th>${a(t, "ls_share")}</th><th>${a(t, "ls_value")}</th></tr></thead>
      <tbody>
        ${e.map(
      (i, n) => o`<tr>
            <td>${n + 1}</td>
            <td><input class="inp" type="time" .value=${M(k(this.start) + i.t * this.duration)}
              ?disabled=${this.locked || n === 0 || n === e.length - 1}
              @change=${(r) => {
        let d = k(r.target.value) - k(this.start);
        d < -720 && (d += 1440), s(n, { t: $(d / Math.max(1, this.duration), 0, 1) });
      }} /></td>
            <td><input class="inp" type="number" min="0" max="100" .value=${String(Math.round(i.t * 100))}
              ?disabled=${this.locked || n === 0 || n === e.length - 1}
              @change=${(r) => s(n, { t: $(Number(r.target.value) / 100, 0, 1) })} /></td>
            <td><input class="inp" type="number" min="0" max="100" .value=${String(Math.round(i.v * 100))}
              ?disabled=${this.locked}
              @change=${(r) => s(n, { v: $(Number(r.target.value) / 100, 0, 1) })} /></td>
          </tr>`
    )}
      </tbody>
    </table>`;
  }
  // ------------------------------------------------------------------- bars
  _tickMinutes() {
    return this.duration > 90 ? 15 : this.duration > 40 ? 10 : 5;
  }
  /** Label every n-th tick so that 12 h labels never overlap. */
  _labelEvery() {
    const e = this.duration / this._tickMinutes(), t = Math.max(3, Math.floor(this._width / 84));
    return Math.max(1, Math.ceil(e / t));
  }
  _barMarks(e) {
    if (this.s.curve !== "custom") return [];
    const t = e === "col" && this.s.separate ? "points_color" : "points";
    return this.s[t].map((s, i) => ({ p: s, i })).slice(1, -1);
  }
  _barDown(e, t, s) {
    this.locked || this.mode === "simple" || (this._channel = this.s.separate ? e : "bri", this._drag = { kind: "bar", index: t }, s.currentTarget.setPointerCapture(s.pointerId));
  }
  _barMove(e) {
    if (this._drag?.kind !== "bar") return;
    const s = e.currentTarget.getBoundingClientRect(), i = structuredClone(this._points()), n = this._drag.index, r = $((e.clientX - s.left) / s.width, i[n - 1].t + 0.01, i[n + 1].t - 0.01);
    i[n] = { ...i[n], t: Math.round(r * 1e3) / 1e3 }, this._setPoints(i);
  }
  _bar(e, t) {
    const s = this._tickMinutes(), i = [];
    for (let d = 0; d <= this.duration; d += s) i.push(d);
    const n = this._barMarks(e), r = this._drag?.kind === "bar" ? this._points()[this._drag.index] : void 0;
    return o`<div class="bar edit" @pointermove=${this._barMove} @pointerup=${() => this._drag = void 0}
      @pointercancel=${() => this._drag = void 0}>
      ${n.map(
      ({ p: d, i: c }) => o`<div class="mark" style="left:${d.t * 100}%" title=${this._timeAt(d.t)}
          @pointerdown=${(h) => this._barDown(e, c, h)}><span></span></div>`
    )}
      ${r ? o`<span class="tip" style="left:${r.t * 100}%;top:0">${this._timeAt(r.t)}</span>` : p}
      <div class="fill" style="background:${t}"></div>
      ${i.map((d) => {
      const c = d / Math.max(1, this.duration) * 100, h = d / s % this._labelEvery() === 0;
      return o`<span class="tickline" style="left:${c}%"></span>
          ${h ? o`<span class="tick ${c < 7 ? "first" : c > 93 ? "last" : ""}" style="left:${c}%">${this._timeAt(d / Math.max(1, this.duration))}</span>` : p}`;
    })}
    </div>`;
  }
  _section(e, t, s, i) {
    const n = this._open[e];
    return o`<div class="section">
      <button class="sh" aria-expanded=${n} @click=${() => this._open = { ...this._open, [e]: !n }}>
        <span class="chev">▸</span><b>${t}</b><span class="sum">${s}</span>
      </button>
      ${n ? o`<div class="sb">${i}</div>` : p}
    </div>`;
  }
  _rangeInputs(e, t, s, i, n, r) {
    const d = this.hass, c = (m) => o`<input class="inp num" type="number" min=${t} max=${s} step=${i}
      .value=${String(Math.round(e[m]))} ?disabled=${this.locked}
      @change=${(u) => {
      const _ = [...e];
      _[m] = $(Number(u.target.value) || t, t, s), r(_);
    }} />`, h = (m) => o`<input type="range" min=${t} max=${s} step=${i} .value=${String(e[m])}
      ?disabled=${this.locked} aria-label=${a(d, m ? "ls_end" : "ls_start")}
      @input=${(u) => {
      const _ = [...e];
      _[m] = Number(u.target.value), r(_);
    }} />`;
    return o`<div class="range edit">
      <span>${a(d, "ls_start")}</span>${h(0)}<span class="pair">${c(0)}${n}</span>
      <span>${a(d, "ls_end")}</span>${h(1)}<span class="pair">${c(1)}${n}</span>
    </div>`;
  }
  _briBar() {
    const e = this.s, t = [];
    for (let s = 0; s <= 16; s++) {
      const i = Je(e, s / 16, { ct: !1, color: !1 }), n = Math.round(30 + 2.2 * i.bri);
      t.push(`rgb(${n},${n},${n}) ${s / 16 * 100}%`);
    }
    return this._section(
      "bri",
      a(this.hass, "ls_brightness"),
      `${Math.round(e.brightness[0])} → ${Math.round(e.brightness[1])} %`,
      o`${this._bar("bri", `linear-gradient(90deg, ${t.join(",")})`)}
      ${this._rangeInputs(e.brightness, 0, 100, 1, "%", (s) => this._emit({ brightness: s }))}`
    );
  }
  _colorBar() {
    const e = this.hass, t = this.s, s = t.color_mode === "color", i = (d) => {
      const c = [];
      for (let h = 0; h <= 12; h++) {
        const m = Ae(Ye(t, "col"), h / 12);
        c.push(`rgb(${pt(d[0] + (d[1] - d[0]) * m).join(",")}) ${h / 12 * 100}%`);
      }
      return `linear-gradient(90deg, ${c.join(",")})`;
    }, n = s ? a(e, `colors_${t.colors}`) : `${t.kelvin[0]} → ${t.kelvin[1]} K`, r = o`
      <div class="row edit">
        <div class="seg" role="group">
          <button aria-pressed=${!s} ?disabled=${this.locked} @click=${() => s && this._emit({ color_mode: "ct" })}>
            ${a(e, "ls_ct")}
          </button>
          <button aria-pressed=${s} ?disabled=${this.locked} @click=${() => !s && this._emit({ color_mode: "color" })}>
            ${a(e, "ls_color")}
          </button>
        </div>
        <span class="muted grow">${a(e, s ? "ls_color_hint" : "ls_ct_hint")}</span>
      </div>
      ${this._bar("col", s ? le(t, { ct: !0, color: !0 }, !1) : i(t.kelvin))}
      ${s ? this._colorBody() : o`${this._rangeInputs(t.kelvin, 1500, 6500, 50, "K", (d) => this._emit({ kelvin: d }))}
          <span class="muted">${a(e, "ls_kelvin_hint")}</span>`}
    `;
    return this._section("col", a(e, s ? "ls_color" : "ls_ct"), n, r);
  }
  _colorBody() {
    const e = this.hass, t = this.s, s = this.mode === "expert" ? ["sunrise", "dawn", "pastel", "custom"] : ["sunrise", "dawn", "pastel"], i = ni(t), n = t.plain_kelvin === null;
    return o`
      <div class="cols edit">
        ${s.map((r) => {
      const d = r === "custom" ? t.sequence.map((h) => h.color) : gt[r], c = d.length >= 2 ? `linear-gradient(90deg, ${d.join(",")})` : "var(--db-tile)";
      return o`<button class="preset" aria-pressed=${t.colors === r} ?disabled=${this.locked}
            @click=${() => this._emit(
        r === "custom" && t.sequence.length < 2 ? { colors: r, sequence: na(t.colors === "custom" ? "sunrise" : t.colors, this.duration) } : { colors: r }
      )}>
            <span class="swatch" style="background:${c}"></span>
            <b>${a(e, `colors_${r}`)}</b>
          </button>`;
    })}
      </div>
      ${this.mode === "expert" && t.colors === "custom" ? this._sequence() : p}
      ${this.plainLamps.length || this.mode !== "simple" ? o`<div class="tile plain">
            <div class="row">
              <b class="grow">${this.plainLamps.length ? a(e, "ls_plain", { lamps: this.plainLamps.join(", ") }) : a(e, "ls_plain_any")}</b>
              <span class="muted">${a(e, "ls_plain_follow")}</span>
            </div>
            <div class="swatch" style="background:linear-gradient(90deg, rgb(${pt(i[0]).join(",")}), rgb(${pt(i[1]).join(",")}))"></div>
            <div class="row edit">
              <span class="tabular">${i[0]} K → ${i[1]} K</span>
              <span class="grow"></span>
              <button class="chip" aria-pressed=${n} ?disabled=${this.locked}
                @click=${() => this._emit({ plain_kelvin: n ? [...ti[t.colors]] : null })}>
                ${a(e, "ls_matching")}
              </button>
            </div>
            ${n ? p : this._rangeInputs(i, 1500, 6500, 50, "K", (r) => this._emit({ plain_kelvin: r }))}
          </div>` : p}
    `;
  }
  _sequence() {
    const e = this.hass, t = this.s.sequence, s = (r) => this._emit({ sequence: r }), i = (r, d) => {
      const c = structuredClone(t);
      c[r] = { ...c[r], ...d }, s(c);
    }, n = (r, d) => {
      const c = structuredClone(t), [h] = c.splice(r, 1);
      c.splice($(r + d, 0, c.length), 0, h), s(c);
    };
    return o`<table class="edit">
        <thead><tr><th>#</th><th>${a(e, "seq_color")}</th><th>${a(e, "ls_brightness")} %</th>
          <th>${a(e, "seq_minutes")}</th><th>${a(e, "seq_transition")}</th><th></th></tr></thead>
        <tbody>
          ${t.map(
      (r, d) => o`<tr>
              <td>${d + 1}</td>
              <td><input class="inp" type="color" .value=${r.color.toLowerCase()} ?disabled=${this.locked}
                @change=${(c) => i(d, { color: c.target.value.toUpperCase() })} /></td>
              <td><input class="inp" type="number" min="0" max="100" .value=${String(r.brightness)} ?disabled=${this.locked}
                @change=${(c) => i(d, { brightness: $(Number(c.target.value), 0, 100) })} /></td>
              <td><input class="inp" type="number" min="0.5" max="240" step="0.5" .value=${String(r.minutes)} ?disabled=${this.locked}
                @change=${(c) => i(d, { minutes: $(Number(c.target.value), 0.5, 240) })} /></td>
              <td><select class="inp" ?disabled=${this.locked}
                @change=${(c) => i(d, { transition: c.target.value })}>
                <option value="smooth" ?selected=${r.transition === "smooth"}>${a(e, "seq_smooth")}</option>
                <option value="step" ?selected=${r.transition === "step"}>${a(e, "seq_step")}</option>
              </select></td>
              <td class="row" style="flex-wrap:nowrap;gap:2px">
                <button class="btn" style="padding:0 8px" ?disabled=${this.locked || d === 0} @click=${() => n(d, -1)} aria-label="↑">↑</button>
                <button class="btn" style="padding:0 8px" ?disabled=${this.locked || d === t.length - 1} @click=${() => n(d, 1)} aria-label="↓">↓</button>
                <button class="btn" style="padding:0 8px" ?disabled=${this.locked || t.length <= 2}
                  @click=${() => s(t.filter((c, h) => h !== d))} aria-label=${a(e, "delete")}>✕</button>
              </td>
            </tr>`
    )}
        </tbody>
      </table>
      <div class="edit">
        <button class="btn" ?disabled=${this.locked || t.length >= 16}
          @click=${() => s([...t, { color: "#FFFFFF", brightness: 100, minutes: 5, transition: "smooth" }])}>
          ${a(e, "seq_add")}
        </button>
      </div>`;
  }
  _fine() {
    const e = this.hass, t = this.s, s = (r, d, c) => o`<select class="inp"
      ?disabled=${this.locked} @change=${(h) => this._emit({ [r]: h.target.value })}>
      ${d.map((h) => o`<option value=${h} ?selected=${t[r] === h}>${a(e, `${c}_${h}`)}</option>`)}
    </select>`, i = (r, d, c) => o`<input class="inp" type="number" min=${d} max=${c}
      .value=${String(t[r])} ?disabled=${this.locked}
      @change=${(h) => this._emit({ [r]: $(Number(h.target.value), d, c) })} />`, n = [
      a(e, "fine_sum_step", { s: t.step_seconds }),
      a(e, `transition_${t.transition}`),
      a(e, `ringing_${t.ringing}`)
    ].join(" · ");
    return this._section(
      "fine",
      a(e, "fine_title"),
      n,
      o`<div class="fine edit">
        <label>${a(e, "fine_step")}${i("step_seconds", 2, 120)}</label>
        <label>${a(e, "fine_min_bri")}${i("min_brightness", 0, 100)}</label>
        <label>${a(e, "fine_transition")}${s("transition", ["auto", "always", "never"], "transition")}</label>
        <label>${a(e, "fine_offset")}${i("start_offset", 0, 120)}</label>
        ${this.showFine ? o`<label>${a(e, "fine_ringing")}${s("ringing", ["hold", "pulse", "blink"], "ringing")}</label>
              <label>${a(e, "fine_after")}${s("after_stop", ["keep", "off", "off_later"], "after_stop")}</label>` : p}
      </div>`
    );
  }
  render() {
    return this.settings ? o`
      ${this._curveSection()}
      ${this._briBar()}
      ${this._colorBar()}
      ${this.mode === "expert" ? this._fine() : p}
    ` : p;
  }
};
ss.styles = [
  O,
  T`
      :host {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      :host([locked]) .edit {
        pointer-events: none;
      }
      :host([locked]) input:disabled,
      :host([locked]) select:disabled,
      :host([locked]) button:disabled {
        opacity: 1;
        cursor: default;
      }
      .presets {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 8px;
      }
      .preset {
        display: flex;
        flex-direction: column;
        gap: 6px;
        text-align: left;
        padding: 10px 12px;
        border-radius: 14px;
        border: 1px solid var(--db-line);
        background: transparent;
        cursor: pointer;
      }
      .preset[aria-pressed="true"] {
        border-color: var(--db-accent);
        background: color-mix(in srgb, var(--db-accent) 12%, transparent);
      }
      .preset svg {
        width: 100%;
        height: 30px;
      }
      .preset b {
        font-size: 14px;
      }
      .graph {
        position: relative;
      }
      .graph svg {
        width: 100%;
        height: auto;
        display: block;
        touch-action: none;
        user-select: none;
      }
      .tip {
        position: absolute;
        transform: translate(-50%, -130%);
        padding: 2px 8px;
        border-radius: 8px;
        background: var(--db-text);
        color: var(--db-bg);
        font-size: 12px;
        font-weight: 600;
        pointer-events: none;
        white-space: nowrap;
      }
      .strip {
        height: 14px;
        border-radius: 7px;
        margin-top: 6px;
      }
      .section {
        border: 1px solid var(--db-line);
        border-radius: 14px;
        overflow: hidden;
      }
      .sh {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .sh b {
        font-size: 15px;
      }
      .sh .sum {
        margin-left: auto;
        color: var(--db-muted);
        font-size: 13px;
      }
      .sh .chev {
        transition: transform 0.15s;
        color: var(--db-muted);
      }
      .sh[aria-expanded="true"] .chev {
        transform: rotate(90deg);
      }
      .sb {
        padding: 0 14px 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .bar {
        position: relative;
        padding: 18px 0 20px;
        user-select: none;
        touch-action: none;
      }
      .bar .fill {
        height: 26px;
        border-radius: 8px;
      }
      .mark {
        position: absolute;
        top: 0;
        width: 28px;
        height: 22px;
        margin-left: -14px;
        display: grid;
        place-items: center;
        cursor: ew-resize;
      }
      .mark span {
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 10px solid var(--db-text);
      }
      .tick {
        position: absolute;
        bottom: 0;
        font-size: 11px;
        color: var(--db-muted);
        transform: translateX(-50%);
        white-space: nowrap;
      }
      .tick.first {
        transform: none;
      }
      .tick.last {
        transform: translateX(-100%);
      }
      .tickline {
        position: absolute;
        bottom: 16px;
        width: 1px;
        height: 6px;
        background: var(--db-muted);
      }
      .range {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 8px 12px;
        align-items: center;
      }
      .range input[type="range"] {
        width: 100%;
        accent-color: var(--db-accent);
      }
      .pair {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .swatch {
        width: 100%;
        height: 18px;
        border-radius: 6px;
      }
      .cols {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 8px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      td,
      th {
        padding: 4px;
        text-align: left;
      }
      th {
        color: var(--db-muted);
        font-weight: 500;
      }
      td .inp {
        width: 100%;
        height: 34px;
      }
      .fine {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 10px;
      }
      .fine label {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: var(--db-muted);
      }
      .plain {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    `
];
let R = ss;
V([
  f({ attribute: !1 })
], R.prototype, "hass");
V([
  f({ attribute: !1 })
], R.prototype, "settings");
V([
  f()
], R.prototype, "mode");
V([
  f({ type: Boolean, reflect: !0 })
], R.prototype, "locked");
V([
  f({ type: Number })
], R.prototype, "duration");
V([
  f()
], R.prototype, "start");
V([
  f({ attribute: !1 })
], R.prototype, "colorLamps");
V([
  f({ attribute: !1 })
], R.prototype, "plainLamps");
V([
  f({ type: Boolean })
], R.prototype, "showFine");
V([
  b()
], R.prototype, "_channel");
V([
  b()
], R.prototype, "_sel");
V([
  b()
], R.prototype, "_drag");
V([
  b()
], R.prototype, "_width");
V([
  b()
], R.prototype, "_open");
H("db-light-settings", R);
var ha = Object.defineProperty, J = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && ha(e, t, i), i;
};
const Wt = "__no_floor", Lt = "__no_area", is = class is extends L {
  constructor() {
    super(...arguments), this.domains = ["light"], this.value = null, this.multiple = !1, this.areaPick = !1, this.label = "", this.placeholder = "", this._open = !1, this._query = "", this._expanded = /* @__PURE__ */ new Set();
  }
  get _selected() {
    return this.value ? Array.isArray(this.value) ? this.value : [this.value] : [];
  }
  _matches(e) {
    const t = this.hass?.states[e];
    return !(!t || !this.domains.includes(e.split(".")[0]) || this.deviceClass && t.attributes.device_class !== this.deviceClass);
  }
  _candidates() {
    const e = this.hass;
    if (!e) return [];
    const t = Object.keys(e.states).filter((i) => this._matches(i));
    if (!this.units?.length) return t;
    const s = t.filter((i) => this.units.includes(e.states[i].attributes.unit_of_measurement));
    return s.length ? s : t;
  }
  /** floor → area → device → entity, only with matching entities. */
  _tree(e) {
    const t = this.hass, s = t.entities ?? {}, i = t.devices ?? {}, n = t.areas ?? {}, r = t.floors ?? {}, d = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), h = (_) => {
      let g = d.get(_);
      if (!g) {
        const v = r[_];
        g = {
          id: _,
          name: v?.name ?? (_ === Wt ? "" : _),
          level: v?.level ?? (_ === Wt ? 999 : 0),
          areas: []
        }, d.set(_, g);
      }
      return g;
    }, m = (_) => {
      let g = c.get(_);
      if (!g) {
        const v = n[_];
        g = { id: _, name: v?.name ?? a(t, "picker_no_area"), devices: [], leaves: [] }, c.set(_, g), h(v?.floor_id ?? Wt).areas.push(g);
      }
      return g;
    };
    for (const _ of this._candidates()) {
      const g = s[_], v = g?.device_id ? i[g.device_id] : void 0, E = g?.area_id ?? v?.area_id ?? Lt, x = m(E), D = {
        id: _,
        name: P(t, _),
        group: Array.isArray(t.states[_].attributes.entity_id)
      }, Ce = v && (v.name_by_user || v.name) || "", w = `${D.name} ${_} ${x.name} ${Ce}`.toLowerCase();
      if (!(e && !w.includes(e)))
        if (v && g?.device_id) {
          let oe = x.devices.find(($e) => $e.id === g.device_id);
          oe || (oe = { id: g.device_id, name: Ce || D.name, leaves: [] }, x.devices.push(oe)), oe.leaves.push(D);
        } else
          x.leaves.push(D);
    }
    const u = (_, g) => _.name.localeCompare(g.name);
    return [...d.values()].map((_) => ({
      ..._,
      areas: _.areas.filter((g) => g.devices.length || g.leaves.length).map((g) => ({ ...g, devices: g.devices.sort(u), leaves: g.leaves.sort(u) })).sort((g, v) => g.id === Lt ? 1 : v.id === Lt ? -1 : u(g, v))
    })).filter((_) => _.areas.length).sort((_, g) => _.level - g.level || u(_, g));
  }
  _emit(e) {
    S(this, "value-changed", { value: this.multiple ? e : e[0] ?? null });
  }
  _toggleIds(e) {
    const t = this._selected;
    if (!this.multiple) {
      this._emit(t[0] === e[0] ? [] : [e[0]]), this._open = !1;
      return;
    }
    const s = e.every((i) => t.includes(i));
    this._emit(s ? t.filter((i) => !e.includes(i)) : [.../* @__PURE__ */ new Set([...t, ...e])]);
  }
  _expand(e) {
    const t = new Set(this._expanded);
    t.has(e) ? t.delete(e) : t.add(e), this._expanded = t;
  }
  _check(e) {
    const t = this._selected, s = e.filter((i) => t.includes(i)).length;
    return s === 0 ? "false" : s === e.length ? "true" : "mixed";
  }
  _node(e, t, s, i, n, r) {
    const d = this._expanded.has(t) || !!this._query.trim(), c = this._check(i), h = this.multiple || !n;
    return o`<div class="node" style="--depth:${e}">
        <button class="chev ${n ? "" : "none"}" aria-expanded=${d} aria-label=${s}
          @click=${() => n && this._expand(t)}>▸</button>
        ${h ? o`<button class="box ${this.multiple ? "" : "radio"}" role="checkbox" aria-checked=${c} aria-label=${s}
              @click=${() => this._toggleIds(i)}>${c === "true" ? "✓" : c === "mixed" ? "–" : ""}</button>` : p}
        <button class="text" @click=${() => n ? this._expand(t) : this._toggleIds(i)}>
          ${s}${r?.id ? o`<span class="id">${r.id}</span>` : p}
        </button>
        ${r?.group ? o`<span class="badge">${a(this.hass, "picker_group")}</span>` : p}
        ${n ? o`<span class="count">${i.length}</span>` : p}
      </div>
      ${n && d ? n : p}`;
  }
  _leaf(e, t) {
    return this._node(e, t.id, t.name, [t.id], null, { id: t.id, group: t.group });
  }
  render() {
    const e = this.hass;
    if (!e) return p;
    const t = this._selected, s = this._open ? this._tree(this._query.trim().toLowerCase()) : [];
    return o`
      ${this.label ? o`<div class="label">${this.label}</div>` : p}
      <div class="head">
        ${t.map(
      (i) => o`<span class="chip" aria-pressed="true">${P(e, i)}
            <button class="x" aria-label=${a(e, "remove")} @click=${() => this._emit(t.filter((n) => n !== i))}>✕</button>
          </span>`
    )}
        <button class="chip" aria-expanded=${this._open} @click=${() => this._open = !this._open}>
          ${this._open ? a(e, "picker_close") : t.length && !this.multiple ? a(e, "picker_change") : this.placeholder || a(e, "picker_add")}
        </button>
      </div>
      ${this._open ? o`<div class="panel">
            <div class="search">
              <input class="inp" type="search" .value=${this._query} placeholder=${a(e, "picker_search")}
                @input=${(i) => this._query = i.target.value} />
            </div>
            ${s.length ? s.map(
      (i) => o`${i.name || s.length > 1 ? o`<div class="floor">${i.name || a(e, "picker_other")}</div>` : p}
                    ${i.areas.map((n) => {
        const r = [...n.devices.flatMap((c) => c.leaves.map((h) => h.id)), ...n.leaves.map((c) => c.id)], d = [
          ...n.devices.map(
            (c) => c.leaves.length === 1 ? this._leaf(1, c.leaves[0]) : this._node(1, `d:${c.id}`, c.name, c.leaves.map((h) => h.id), c.leaves.map((h) => this._leaf(2, h)))
          ),
          ...n.leaves.map((c) => this._leaf(1, c))
        ];
        return this._node(0, `a:${n.id}`, n.name, r, d);
      })}`
    ) : o`<div class="empty">${a(e, "picker_none")}</div>`}
          </div>` : p}
    `;
  }
};
is.styles = [
  O,
  T`
      :host {
        display: block;
      }
      .head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
      }
      .label {
        font-size: 13px;
        color: var(--db-muted);
        margin-bottom: 4px;
      }
      .panel {
        margin-top: 8px;
        border: 1px solid var(--db-line);
        border-radius: 12px;
        max-height: 420px;
        overflow: auto;
        background: var(--db-bg);
      }
      .search {
        position: sticky;
        top: 0;
        z-index: 1;
        padding: 8px;
        background: var(--db-bg);
        border-bottom: 1px solid var(--db-line);
      }
      .search input {
        width: 100%;
      }
      .floor {
        padding: 10px 12px 4px;
        font-size: 13px;
        font-weight: 600;
        color: var(--db-muted);
        background: var(--db-tile);
      }
      .node {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        padding: 4px 12px 4px calc(12px + var(--depth, 0) * 22px);
      }
      .node:hover {
        background: var(--db-tile);
      }
      .chev {
        width: 28px;
        height: 28px;
        flex: none;
        border: none;
        background: none;
        cursor: pointer;
        color: var(--db-muted);
        transition: transform 0.15s;
        padding: 0;
      }
      .chev[aria-expanded="true"] {
        transform: rotate(90deg);
      }
      .chev.none {
        visibility: hidden;
      }
      .box {
        width: 22px;
        height: 22px;
        flex: none;
        border-radius: 5px;
        border: 2px solid var(--db-muted);
        background: transparent;
        display: grid;
        place-items: center;
        cursor: pointer;
        color: var(--db-on-accent);
        font-size: 14px;
        line-height: 1;
        padding: 0;
      }
      .box[aria-checked="true"],
      .box[aria-checked="mixed"] {
        background: var(--db-accent);
        border-color: var(--db-accent);
      }
      .box.radio {
        border-radius: 11px;
      }
      .text {
        flex: 1;
        min-width: 0;
        cursor: pointer;
        border: none;
        background: none;
        text-align: left;
        padding: 0;
      }
      .text .id {
        display: block;
        font-size: 11px;
        color: var(--db-muted);
      }
      .count {
        font-size: 12px;
        color: var(--db-muted);
      }
      .badge {
        font-size: 11px;
        padding: 1px 6px;
        border-radius: 6px;
        background: var(--db-tile);
        color: var(--db-muted);
      }
      .empty {
        padding: 12px;
        color: var(--db-muted);
      }
    `
];
let I = is;
J([
  f({ attribute: !1 })
], I.prototype, "hass");
J([
  f({ attribute: !1 })
], I.prototype, "domains");
J([
  f({ attribute: !1 })
], I.prototype, "deviceClass");
J([
  f({ attribute: !1 })
], I.prototype, "units");
J([
  f({ attribute: !1 })
], I.prototype, "value");
J([
  f({ type: Boolean })
], I.prototype, "multiple");
J([
  f({ type: Boolean })
], I.prototype, "areaPick");
J([
  f()
], I.prototype, "label");
J([
  f()
], I.prototype, "placeholder");
J([
  b()
], I.prototype, "_open");
J([
  b()
], I.prototype, "_query");
J([
  b()
], I.prototype, "_expanded");
H("db-entity-picker", I);
var pa = Object.defineProperty, ce = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && pa(e, t, i), i;
};
const _a = ["music_assistant", "url", "none"], ua = ["playlist", "radio", "album", "track", "artist"], as = class as extends L {
  constructor() {
    super(...arguments), this.hasMusicAssistant = !0, this.noneLabel = "", this._query = "", this._type = "", this._busy = !1, this._error = "";
  }
  _set(e) {
    S(this, "source-change", { ...this.source, ...e });
  }
  async _search() {
    if (!(!this.hass || !this._query.trim())) {
      this._busy = !0, this._error = "";
      try {
        this._results = await ki(this.hass, this._query.trim(), this._type || void 0);
      } catch (e) {
        this._error = me(this.hass, e), this._results = void 0;
      } finally {
        this._busy = !1;
      }
    }
  }
  render() {
    const e = this.hass, t = this.source;
    return t ? o`
      <div class="seg" role="group">
        ${_a.map(
      (s) => o`<button aria-pressed=${t.type === s} @click=${() => this._set({ type: s })}>
            ${s === "none" && this.noneLabel ? this.noneLabel : a(e, `src_${s}`)}
          </button>`
    )}
      </div>
      ${t.type === "music_assistant" ? o`${this.hasMusicAssistant ? p : o`<div class="muted">${a(e, "ma_missing")}</div>`}
            ${t.media_id ? o`<div class="chosen">
                  <span class="grow"><b>${t.name || t.media_id}</b>
                    <div class="muted">${a(e, `media_${t.media_type}`)}</div></span>
                  <button class="btn" @click=${() => this._set({ media_id: "", name: "" })}>${a(e, "change")}</button>
                </div>` : o`<div class="search">
                    <input class="inp" type="search" placeholder=${a(e, "ma_search_ph")} .value=${this._query}
                      @input=${(s) => this._query = s.target.value}
                      @keydown=${(s) => s.key === "Enter" && this._search()} />
                    <select class="inp" @change=${(s) => this._type = s.target.value}>
                      <option value="">${a(e, "media_all")}</option>
                      ${ua.map((s) => o`<option value=${s} ?selected=${this._type === s}>${a(e, `media_${s}`)}</option>`)}
                    </select>
                    <button class="btn primary" ?disabled=${this._busy} @click=${this._search}>${a(e, "search")}</button>
                  </div>
                  ${this._error ? o`<div class="muted">${this._error}</div>` : p}
                  ${this._results ? this._results.length ? o`<div class="results">
                          ${this._results.map(
      (s) => o`<button class="item" @click=${() => this._set({ media_id: s.uri, media_type: s.media_type, name: s.artist ? `${s.name} – ${s.artist}` : s.name })}>
                              ${s.image ? o`<img src=${s.image} alt="" />` : o`<span class="ph"></span>`}
                              <span class="grow"><div>${s.name}</div>
                                <div class="muted">${a(e, `media_${s.media_type}`)}${s.artist ? ` · ${s.artist}` : ""}</div></span>
                            </button>`
    )}
                        </div>` : o`<div class="muted">${a(e, "picker_none")}</div>` : p}
                  <details>
                    <summary class="muted">${a(e, "ma_manual")}</summary>
                    <div class="search" style="margin-top:8px">
                      <input class="inp" placeholder="library://playlist/1" .value=${t.media_id}
                        @change=${(s) => this._set({ media_id: s.target.value.trim(), name: "" })} />
                    </div>
                  </details>`}` : p}
      ${t.type === "url" ? o`<input class="inp" type="url" placeholder="https://… / media-source://…" .value=${t.url}
              @change=${(s) => this._set({ url: s.target.value.trim() })} />
            <div class="muted">${a(e, "url_hint")}</div>` : p}
    ` : p;
  }
};
as.styles = [
  O,
  T`
      :host {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .results {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--db-line);
        border-radius: 12px;
        max-height: 300px;
        overflow: auto;
      }
      .item {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 48px;
        padding: 6px 10px;
        border: none;
        background: none;
        cursor: pointer;
        text-align: left;
      }
      .item:hover {
        background: var(--db-tile);
      }
      .item img,
      .item .ph {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        object-fit: cover;
        background: var(--db-tile);
        flex: none;
      }
      .chosen {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--db-accent) 12%, transparent);
      }
      .search {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .search input {
        flex: 1;
        min-width: 160px;
      }
    `
];
let Z = as;
ce([
  f({ attribute: !1 })
], Z.prototype, "hass");
ce([
  f({ attribute: !1 })
], Z.prototype, "source");
ce([
  f({ type: Boolean })
], Z.prototype, "hasMusicAssistant");
ce([
  f()
], Z.prototype, "noneLabel");
ce([
  b()
], Z.prototype, "_query");
ce([
  b()
], Z.prototype, "_type");
ce([
  b()
], Z.prototype, "_results");
ce([
  b()
], Z.prototype, "_busy");
ce([
  b()
], Z.prototype, "_error");
H("db-audio-source", Z);
var ma = Object.defineProperty, he = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && ma(e, t, i), i;
};
const ye = 600, Ue = 150, ke = 12, De = 12, Bs = 26, Rs = 8, ns = class ns extends L {
  constructor() {
    super(...arguments), this.time = "07:00", this.lead = 5, this.ramp = 5, this.volume = [5, 35], this.curve = [], this.simple = !1, this._sel = 1, this._grown = 0;
  }
  /** All points: start, the curve points, end. */
  get _pts() {
    const e = -this.lead;
    return [
      { m: e, v: this.volume[0] },
      ...this.curve.map(([t, s]) => ({ m: e + t * this.ramp, v: s })),
      { m: e + this.ramp, v: this.volume[1] }
    ];
  }
  /** Minutes from the wake line to each edge; the wake time stays centred. */
  get _half() {
    if (this._frozen) return this._frozen;
    const e = Math.max(this.lead, Math.abs(this.ramp - this.lead));
    return Math.max(10, Math.ceil((e + 3) / 5) * 5);
  }
  _x(e) {
    const t = this._half;
    return ke + ($(e, -t, t) + t) / (2 * t) * (ye - 2 * ke);
  }
  _y(e) {
    return De + (1 - $(e, 0, 100) / 100) * (Ue - De - Bs);
  }
  /** Volume (%) at a minute, smooth through the points like the backend. */
  _volAt(e, t = this._pts) {
    const s = t[0].m, i = t[t.length - 1].m - s;
    return e <= s ? t[0].v : i <= 0 || e >= s + i ? t[t.length - 1].v : Ae(t.map((n) => [(n.m - s) / i, n.v / 100]), (e - s) / i) * 100;
  }
  _emit(e) {
    const t = e[0].m, s = e[e.length - 1], i = Math.max(0, s.m - t), n = {
      lead: Math.round(-t),
      ramp: Math.round(i),
      volume: [Math.round(e[0].v), Math.round(s.v)],
      curve: e.slice(1, -1).map((r) => [i ? Math.round((r.m - t) / i * 1e3) / 1e3 : 0, Math.round(r.v)])
    };
    S(this, "audio-change", n);
  }
  /** Move point i to (m, v), keeping the order of the points. */
  _set(e, t, s) {
    const i = this._pts.map((r) => ({ ...r })), n = i.length - 1;
    if (t !== null) {
      const r = e === 0 ? -60 : i[e - 1].m, d = e === n ? i[0].m + 60 : i[e + 1].m;
      i[e].m = Math.round($(t, r, d)), e === 0 && (i[e].m = Math.min(0, i[e].m));
    }
    s !== null && !(this.simple && e === 0) && (i[e].v = Math.round($(s, 0, 100))), this._emit(i);
  }
  _fromEvent(e) {
    const s = this.shadowRoot.querySelector("svg").getBoundingClientRect(), i = (e.clientX - s.left) / s.width * ye, n = (e.clientY - s.top) / s.height * Ue, r = this._half;
    return {
      m: -r + (i - ke) / (ye - 2 * ke) * 2 * r,
      v: (1 - (n - De) / (Ue - De - Bs)) * 100
    };
  }
  _down(e, t) {
    this._frozen = this._half, this._drag = e, this._sel = e, t.currentTarget.setPointerCapture(t.pointerId);
  }
  _move(e) {
    if (this._drag === void 0) return;
    const t = this._fromEvent(e);
    this._frozen && Math.abs(t.m) > this._frozen - 1 && Date.now() - this._grown > 300 && (this._grown = Date.now(), this._frozen += 10), this._set(this._drag, t.m, t.v);
  }
  _up() {
    this._drag = void 0, this._frozen = void 0;
  }
  _add() {
    const e = this._pts;
    if (e.length - 2 >= Rs) return;
    let t = 0;
    for (let n = 1; n < e.length - 1; n++) e[n + 1].m - e[n].m > e[t + 1].m - e[t].m && (t = n);
    const s = (e[t].m + e[t + 1].m) / 2, i = [...e.slice(0, t + 1), { m: s, v: this._volAt(s, e) }, ...e.slice(t + 1)];
    this._sel = t + 1, this._emit(i);
  }
  _remove() {
    const e = this._pts;
    if (this._sel <= 0 || this._sel >= e.length - 1) return;
    const t = e.filter((s, i) => i !== this._sel);
    this._sel = Math.min(this._sel, t.length - 2), this._emit(t);
  }
  render() {
    const e = this.hass, t = k(this.time), s = this._pts, i = s.length - 1, n = $(this._sel, 0, i), r = this._half, d = this._y(0), c = this._x(0), h = this._x(r), m = s[0].m, u = s[i].m, _ = [], g = Math.max(2, Math.min(80, Math.round((u - m) * 4)));
    for (let z = 0; z <= g; z++) {
      const K = m + (u - m) * z / g;
      _.push(`${this._x(K).toFixed(1)},${this._y(this._volAt(K, s)).toFixed(1)}`);
    }
    const v = `M${_.join(" L")} L${h},${this._y(s[i].v)}`, E = `M${this._x(m)},${d} L${_.join(" L")} L${h},${this._y(s[i].v)} L${h},${d} Z`, x = 2 * r > 40 ? 10 : 5, D = [];
    for (let z = Math.ceil(-r / x) * x; z <= r; z += x) D.push(z);
    const Ce = (z) => y(e, M(t + Math.round(z))), w = s[n], oe = this._x(w.m), $e = n === 0 ? `♪ ${a(e, "audio_start_at")}` : n === i ? `🔊 ${a(e, "audio_loud_at")}` : "•", He = (z) => {
      if (!z) return;
      let K = k(z) - t;
      K > 720 && (K -= 1440), K < -720 && (K += 1440), this._set(n, K, null);
    };
    return o`<div class="wrap">
        <div class="pill" style="left:clamp(0px, calc(${oe / ye * 100}% - 90px), calc(100% - 230px))">
          ${$e}
          <input type="time" .value=${M(t + Math.round(w.m))} aria-label=${a(e, "audio_start_at")}
            @change=${(z) => He(z.target.value)} />
          ${this.simple && n === 0 ? p : o`<input type="number" min="0" max="100" .value=${String(Math.round(w.v))}
                  aria-label=${n === 0 ? a(e, "audio_vol_start") : a(e, "audio_vol_end")}
                  @change=${(z) => this._set(n, null, Number(z.target.value))} />%`}
        </div>
        <svg viewBox="0 0 ${ye} ${Ue}" @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
          ${[25, 50, 75, 100].map(
      (z) => ie`<line x1=${ke} x2=${ye - ke} y1=${this._y(z)} y2=${this._y(z)} stroke="var(--db-line)" stroke-dasharray="3 5"/>
              <text x=${ye - ke} y=${this._y(z) - 3} text-anchor="end" font-size="10" fill="var(--db-muted)">${z}%</text>`
    )}
          <path d=${E} fill="color-mix(in srgb, var(--db-accent) 22%, transparent)"/>
          <path d=${v} fill="none" stroke="var(--db-accent)" stroke-width="3" stroke-linejoin="round"/>
          <line x1=${c} x2=${c} y1=${De - 6} y2=${d} stroke="var(--db-text)" stroke-width="2"/>
          <text x=${c + 4} y=${De + 4} font-size="11" fill="var(--db-text)">${a(e, "tl_wake")}</text>
          ${D.map(
      (z) => ie`<text x=${this._x(z)} y=${Ue - 8} font-size="10" fill="var(--db-muted)"
              text-anchor=${z <= -r ? "start" : z >= r ? "end" : "middle"}>${Ce(z)}</text>`
    )}
          ${s.map(
      (z, K) => ie`<g style="cursor:grab" @pointerdown=${(ui) => this._down(K, ui)}>
              <circle cx=${this._x(z.m)} cy=${this._y(z.v)} r="20" fill="transparent"/>
              <circle cx=${this._x(z.m)} cy=${this._y(z.v)} r=${K === n ? 9 : K === 0 || K === i ? 8 : 6}
                fill=${K === n ? "var(--db-accent)" : "#fff"}
                stroke=${K === i ? "var(--db-accent-strong)" : "var(--db-accent)"} stroke-width="3"/>
            </g>`
    )}
        </svg>
      </div>
      <div class="tools">
        <button class="btn" ?disabled=${i - 1 >= Rs} @click=${this._add}>${a(e, "audio_add_point")}</button>
        <button class="btn" ?disabled=${n === 0 || n === i} @click=${this._remove}>${a(e, "audio_remove_point")}</button>
        <span class="muted">${a(e, "audio_point_hint")}</span>
      </div>`;
  }
};
ns.styles = [
  O,
  T`
      :host {
        display: block;
      }
      .wrap {
        position: relative;
        padding-top: 52px;
      }
      svg {
        width: 100%;
        height: auto;
        display: block;
        touch-action: none;
        user-select: none;
      }
      .pill {
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 6px;
        border-radius: 12px;
        background: var(--db-tile);
        border: 1px solid var(--db-line);
        font-size: 12px;
        white-space: nowrap;
      }
      .pill input {
        height: 30px;
        border-radius: 8px;
        border: 1px solid var(--db-line);
        background: var(--db-bg);
        color: var(--db-text);
        font: inherit;
        padding: 0 4px;
      }
      .pill input[type="number"] {
        width: 52px;
        text-align: right;
      }
      .pill input[type="time"] {
        width: 92px;
      }
      .pill input[type="time"]::-webkit-calendar-picker-indicator {
        display: none;
      }
      .tools {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 6px;
      }
      .tools .muted {
        font-size: 12px;
      }
    `
];
let X = ns;
he([
  f({ attribute: !1 })
], X.prototype, "hass");
he([
  f()
], X.prototype, "time");
he([
  f({ type: Number })
], X.prototype, "lead");
he([
  f({ type: Number })
], X.prototype, "ramp");
he([
  f({ attribute: !1 })
], X.prototype, "volume");
he([
  f({ attribute: !1 })
], X.prototype, "curve");
he([
  f({ type: Boolean })
], X.prototype, "simple");
he([
  b()
], X.prototype, "_drag");
he([
  b()
], X.prototype, "_sel");
H("db-audio-line", X);
var ga = Object.defineProperty, Pe = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && ga(e, t, i), i;
};
const fa = [
  { mode: "heat", icon: "🔥" },
  { mode: "cool", icon: "❄️" },
  { mode: "heat_cool", icon: "🌗" },
  { mode: "auto", icon: "♻️" },
  { mode: "dry", icon: "💧" },
  { mode: "fan_only", icon: "🌀" }
], ee = 10, _e = 30, Fs = 150, ze = 240, ot = 80, lt = 100, rs = class rs extends L {
  constructor() {
    super(...arguments), this.domains = [], this.locked = !1, this.expert = !1, this.samples = -1, this._drag = !1;
  }
  _set(e) {
    this.locked || S(this, "climate-change", { ...this.settings, ...e });
  }
  _shows(e) {
    return !this.domains.length || this.domains.includes(e);
  }
  get _usesTemperature() {
    return ["heat", "cool", "heat_cool", "auto"].includes(this.settings.mode) && this._shows("climate");
  }
  // ------------------------------------------------------------------ dial
  _point(e, t = ot) {
    const i = (Fs + ($(e, ee, _e) - ee) / (_e - ee) * ze) * Math.PI / 180;
    return [lt + t * Math.cos(i), lt + t * Math.sin(i)];
  }
  _arc(e, t) {
    const [s, i] = this._point(e), [n, r] = this._point(t), d = (t - e) / (_e - ee) * ze > 180 ? 1 : 0;
    return `M${s},${i} A${ot},${ot} 0 ${d} 1 ${n},${r}`;
  }
  _fromPointer(e) {
    const s = this.shadowRoot.querySelector(".dial svg").getBoundingClientRect(), i = (e.clientX - s.left) / s.width * 200 - lt, n = (e.clientY - s.top) / s.height * 200 - lt;
    let r = Math.atan2(n, i) * 180 / Math.PI;
    r < 0 && (r += 360);
    let d = r - Fs;
    d < 0 && (d += 360), d > ze && (d = d - ze < (360 - ze) / 2 ? ze : 0);
    const c = ee + d / ze * (_e - ee);
    this._set({ temperature: Math.round(c * 2) / 2 });
  }
  _dial() {
    const e = this.hass, t = this.settings, s = t.mode === "cool" ? "#4aa3ff" : t.mode === "heat" ? "#ff8a4c" : "var(--db-accent)", [i, n] = this._point(t.temperature), r = (d) => this._set({ temperature: $(t.temperature + d, ee, _e) });
    return o`<div class="dial"
        @pointermove=${(d) => this._drag && this._fromPointer(d)}
        @pointerup=${() => this._drag = !1} @pointercancel=${() => this._drag = !1}>
        <svg viewBox="0 0 200 200" role="slider" tabindex="0" aria-label=${a(e, "cl_temperature")}
          aria-valuemin=${ee} aria-valuemax=${_e} aria-valuenow=${t.temperature}
          @keydown=${(d) => {
      if (d.key === "ArrowUp" || d.key === "ArrowRight") r(0.5);
      else if (d.key === "ArrowDown" || d.key === "ArrowLeft") r(-0.5);
      else return;
      d.preventDefault();
    }}
          @pointerdown=${(d) => {
      this.locked || (this._drag = !0, d.currentTarget.setPointerCapture(d.pointerId), this._fromPointer(d));
    }}>
          <path d=${this._arc(ee, _e)} fill="none" stroke="var(--db-tile)" stroke-width="16" stroke-linecap="round"/>
          <path d=${this._arc(ee, t.temperature)} fill="none" stroke=${s} stroke-width="16" stroke-linecap="round"/>
          ${[ee, 15, 20, 25, _e].map((d) => {
      const [c, h] = this._point(d, ot - 24);
      return ie`<text x=${c} y=${h + 4} text-anchor="middle" font-size="10" fill="var(--db-muted)">${d}°</text>`;
    })}
          <circle cx=${i} cy=${n} r="13" fill="#fff" stroke=${s} stroke-width="4" style="cursor:grab"/>
        </svg>
        <div class="value"><b>${t.temperature.toLocaleString(void 0, { minimumFractionDigits: 1 })}</b> °C
          <div class="muted">${a(e, `clm_${t.mode}`)}</div></div>
        ${this.locked ? p : o`<div class="steps">
              <button aria-label="−0.5" @click=${() => r(-0.5)}>−</button>
              <button aria-label="+0.5" @click=${() => r(0.5)}>+</button>
            </div>`}
      </div>`;
  }
  // ---------------------------------------------------------------- render
  _slider(e, t, s, i, n, r) {
    return o`<label class="slider">
      <span>${e}</span>
      <input type="range" min=${s} max=${i} .value=${String(t)} ?disabled=${this.locked}
        @input=${(d) => r(Number(d.target.value))} />
      <b>${Math.round(t)} ${n}</b>
    </label>`;
  }
  _num(e, t, s, i = {}) {
    return o`<label class="field">${e}
      <input class="inp" type="number" min=${i.min ?? 0} max=${i.max ?? 240} step=${i.step ?? 1}
        placeholder=${i.ph ?? ""} ?disabled=${this.locked} .value=${t === null ? "" : String(t)}
        @change=${(n) => {
      const r = n.target.value;
      s(r === "" ? null : $(Number(r), i.min ?? 0, i.max ?? 240));
    }} /></label>`;
  }
  render() {
    const e = this.hass, t = this.settings;
    if (!t) return p;
    const s = this._shows("climate") ? fa : [];
    return o`
      ${s.length ? o`<div class="modes" role="group" aria-label=${a(e, "cl_mode")}>
            ${s.map(
      (i) => o`<button aria-pressed=${t.mode === i.mode} ?disabled=${this.locked} @click=${() => this._set({ mode: i.mode })}>
                <span aria-hidden="true">${i.icon}</span>${a(e, `clm_${i.mode}`)}</button>`
    )}
          </div>` : p}
      <div class="top">
        ${this._usesTemperature ? this._dial() : p}
        <div class="side">
          ${this._shows("fan") ? this._slider(a(e, "cl_fan"), t.fan, 0, 100, "%", (i) => this._set({ fan: i })) : p}
          ${this._shows("humidifier") ? this._slider(a(e, "cl_humidity"), t.humidity, 0, 100, "%", (i) => this._set({ humidity: i })) : p}
          ${this._shows("water_heater") ? this._slider(a(e, "cl_water"), t.water_temperature, 20, 80, "°C", (i) => this._set({ water_temperature: i })) : p}
          ${this._usesTemperature ? o`<label class="row"><input type="checkbox" .checked=${t.only_if_needed} ?disabled=${this.locked}
                @change=${(i) => this._set({ only_if_needed: i.target.checked })} />${a(e, "cl_only_needed")}</label>` : p}
        </div>
      </div>

      <div class="lbl">${a(e, "cl_start")}</div>
      <div class="seg" role="group">
        <button aria-pressed=${t.start === "fixed"} ?disabled=${this.locked} @click=${() => this._set({ start: "fixed" })}>${a(e, "cl_start_fixed")}</button>
        <button aria-pressed=${t.start === "learned"} ?disabled=${this.locked} @click=${() => this._set({ start: "learned" })}>${a(e, "cl_start_learned")}</button>
      </div>
      <div class="grid">
        ${t.start === "fixed" ? this._num(a(e, "cl_lead"), t.lead, (i) => this._set({ lead: i ?? 0 })) : this._num(a(e, "cl_max_lead"), t.max_lead, (i) => this._set({ max_lead: i ?? 0 }))}
      </div>
      <div class="muted">${t.start === "fixed" ? a(e, "cl_start_fixed_d") : a(e, "cl_start_learned_d") + (this.samples >= 0 ? ` ${a(e, "cl_samples", { n: this.samples })}` : "")}</div>

      <div class="lbl">${a(e, "cl_after")}</div>
      <div class="seg" role="group">
        ${["restore", "off", "presence"].map(
      (i) => o`<button aria-pressed=${t.after === i} ?disabled=${this.locked} @click=${() => this._set({ after: i })}>${a(e, `cl_after_${i}`)}</button>`
    )}
      </div>
      <div class="grid">
        ${this._num(t.after === "presence" ? a(e, "cl_minutes_max") : a(e, "cl_minutes_after"), t.minutes, (i) => this._set({ minutes: i ?? 0 }))}
      </div>
      <div class="muted">${a(e, `cl_after_${t.after}_d`)}</div>

      <div class="lbl">${a(e, "cl_outdoor")}</div>
      <div class="grid">
        ${this._num(a(e, "cl_outdoor_below"), t.outdoor_below, (i) => this._set({ outdoor_below: i }), { min: -30, max: 40, step: 0.5, ph: "–" })}
        ${this._num(a(e, "cl_outdoor_above"), t.outdoor_above, (i) => this._set({ outdoor_above: i }), { min: -30, max: 40, step: 0.5, ph: "–" })}
      </div>
      <div class="muted">${a(e, "cl_outdoor_d")}</div>
    `;
  }
};
rs.styles = [
  O,
  T`
      :host {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .top {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
        align-items: center;
        justify-items: center;
      }
      .side {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
      }
      .dial {
        position: relative;
        width: 220px;
        touch-action: none;
        user-select: none;
      }
      .dial svg {
        width: 100%;
        height: auto;
        display: block;
      }
      .value {
        position: absolute;
        left: 0;
        right: 0;
        top: 70px;
        text-align: center;
        pointer-events: none;
      }
      .value b {
        font-size: 38px;
        font-weight: 600;
      }
      .steps {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 6px;
        display: flex;
        justify-content: center;
        gap: 40px;
      }
      .steps button {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        border: 1px solid var(--db-line);
        background: var(--db-tile);
        color: var(--db-text);
        font-size: 20px;
        cursor: pointer;
      }
      .modes {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 8px;
      }
      .modes button {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 10px 6px;
        border-radius: 12px;
        border: 1px solid var(--db-line);
        background: var(--db-tile);
        color: var(--db-text);
        cursor: pointer;
        font: inherit;
        font-size: 13px;
      }
      .modes button span {
        font-size: 22px;
      }
      .modes button[aria-pressed="true"] {
        border-color: var(--db-accent);
        background: color-mix(in srgb, var(--db-accent) 18%, transparent);
      }
      .slider {
        display: grid;
        grid-template-columns: 96px minmax(80px, 1fr) 56px;
        gap: 10px;
        align-items: center;
        font-size: 14px;
      }
      .slider input[type="range"] {
        width: 100%;
        accent-color: var(--db-accent);
      }
      .slider b {
        text-align: right;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: var(--db-muted);
      }
      fieldset {
        border: none;
        margin: 0;
        padding: 0;
        display: contents;
      }
    `
];
let ne = rs;
Pe([
  f({ attribute: !1 })
], ne.prototype, "hass");
Pe([
  f({ attribute: !1 })
], ne.prototype, "settings");
Pe([
  f({ attribute: !1 })
], ne.prototype, "domains");
Pe([
  f({ type: Boolean })
], ne.prototype, "locked");
Pe([
  f({ type: Boolean })
], ne.prototype, "expert");
Pe([
  f({ type: Number })
], ne.prototype, "samples");
Pe([
  b()
], ne.prototype, "_drag");
H("db-climate-settings", ne);
var ba = Object.defineProperty, We = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && ba(e, t, i), i;
};
const va = ["skip", "time", "before", "alarm"], $a = [
  { key: "calr_tpl_vacation", rule: { keywords: [], action: "skip" } },
  { key: "calr_tpl_early", rule: { action: "time", time: "05:00" } },
  { key: "calr_tpl_event", rule: { action: "before", before: 60, travel: !0 } }
], os = class os extends L {
  constructor() {
    super(...arguments), this.alarms = [], this.loading = !1, this._word = {}, this._openRule = -1;
  }
  _emit(e) {
    S(this, "calendar-change", { ...this.config, ...e });
  }
  _rules(e) {
    this._emit({ rules: e });
  }
  _set(e, t) {
    this._rules(this.config.rules.map((s, i) => i === e ? { ...s, ...t } : s));
  }
  _move(e, t) {
    const s = [...this.config.rules], [i] = s.splice(e, 1);
    s.splice(e + t, 0, i), this._openRule === e && (this._openRule = e + t), this._rules(s);
  }
  get _calendars() {
    return Object.keys(this.hass?.states ?? {}).filter((e) => e.startsWith("calendar.")).sort((e, t) => P(this.hass, e).localeCompare(P(this.hass, t)));
  }
  get _waze() {
    return !!this.hass?.services?.waze_travel_time;
  }
  _addWord(e) {
    const t = (this._word[e] ?? "").trim();
    if (!t) return;
    const s = this.config.rules[e];
    s.keywords.some((i) => i.toLowerCase() === t.toLowerCase()) || this._set(e, { keywords: [...s.keywords, t] }), this._word = { ...this._word, [e]: "" };
  }
  /** "If an event in Work contains "early" → 05:00" */
  _sentence(e) {
    const t = this.hass, s = e.calendars.length ? e.calendars.map((n) => P(t, n)).join(", ") : a(t, "calr_all_cals"), i = e.keywords.length ? e.keywords.map((n) => `„${n}“`).join(e.match === "all" ? ` ${a(t, "calr_and")} ` : ` ${a(t, "calr_or")} `) : a(t, "calr_any_event");
    return a(t, "calr_sentence", { cals: s, words: i, then: this._then(e) });
  }
  _then(e) {
    const t = this.hass;
    switch (e.action) {
      case "skip":
        return a(t, "calr_then_skip");
      case "time":
        return a(t, "calr_then_time", { time: y(t, e.time) });
      case "before":
        return a(t, e.travel ? "calr_then_before_travel" : "calr_then_before", { min: e.before });
      case "alarm":
        return a(t, "calr_then_alarm", {
          name: this.alarms.find((s) => s.id === e.alarm)?.name ?? "…"
        });
    }
  }
  _rule(e, t) {
    const s = this.hass, i = this._openRule === t;
    return o`<div class="rule ${e.enabled ? "" : "off"}">
      <div class="rhead">
        <span class="num">${t + 1}</span>
        <button class="say" aria-expanded=${i} @click=${() => this._openRule = i ? -1 : t}>
          ${this._sentence(e)} <span class="muted">${i ? "▴" : "▾"}</span>
        </button>
        <button class="switch" role="switch" aria-checked=${e.enabled} aria-label=${a(s, "calr_enabled")}
          @click=${() => this._set(t, { enabled: !e.enabled })}></button>
      </div>
      ${i ? this._ruleBody(e, t) : p}
    </div>`;
  }
  _ruleBody(e, t) {
    const s = this.hass, i = this.config.rules.length, n = this._calendars;
    return o`

      <div class="k">${a(s, "calr_if")}</div>
      <div class="row">
        <button class="chip" aria-pressed=${!e.calendars.length} @click=${() => this._set(t, { calendars: [] })}>
          ${a(s, "calr_all_cals")}
        </button>
        ${n.map((r) => {
      const d = e.calendars.includes(r);
      return o`<button class="chip" aria-pressed=${d}
            @click=${() => this._set(t, { calendars: d ? e.calendars.filter((c) => c !== r) : [...e.calendars, r] })}>
            📅 ${P(s, r)}
          </button>`;
    })}
      </div>
      ${n.length ? p : o`<div class="muted">${a(s, "calr_no_cals")}</div>`}

      <div class="words">
        ${e.keywords.map(
      (r) => o`<span class="chip" aria-pressed="true">${r}<button class="x" aria-label=${a(s, "remove")}
              @click=${() => this._set(t, { keywords: e.keywords.filter((d) => d !== r) })}>✕</button></span>`
    )}
        <input class="inp" .value=${this._word[t] ?? ""} placeholder=${a(s, "calr_word_ph")}
          @input=${(r) => this._word = { ...this._word, [t]: r.target.value }}
          @keydown=${(r) => {
      (r.key === "Enter" || r.key === ",") && (r.preventDefault(), this._addWord(t));
    }}
          @blur=${() => this._addWord(t)} />
      </div>
      ${e.keywords.length > 1 ? o`<div class="seg" role="group">
            ${["any", "all"].map(
      (r) => o`<button aria-pressed=${e.match === r} @click=${() => this._set(t, { match: r })}>
                ${a(s, `calr_match_${r}`)}
              </button>`
    )}
          </div>` : o`<div class="muted">${a(s, e.keywords.length ? "calr_words_hint" : "calr_no_words")}</div>`}

      <div class="k">${a(s, "calr_then")}</div>
      <div class="seg" role="group">
        ${va.map(
      (r) => o`<button aria-pressed=${e.action === r} @click=${() => this._set(t, { action: r })}>
            ${a(s, `calr_act_${r}`)}
          </button>`
    )}
      </div>
      ${e.action === "time" ? o`<label class="row"><span>${a(s, "calr_time")}</span>
            <input class="inp time" type="time" .value=${e.time}
              @change=${(r) => this._set(t, { time: r.target.value || e.time })} /></label>` : p}
      ${e.action === "before" ? o`<label class="row"><span>${a(s, e.travel ? "calr_before_travel" : "calr_before")}</span>
              <input class="inp num" type="number" min="0" max="240" .value=${String(e.before)}
                @change=${(r) => this._set(t, { before: $(Number(r.target.value) || 0, 0, 240) })} />
              min</label>
            <label class="row"><input type="checkbox" .checked=${e.travel}
              @change=${(r) => this._set(t, { travel: r.target.checked })} />
              ${a(s, "calr_travel")}</label>
            <div class="muted">${a(s, "calr_before_hint")}</div>` : p}
      ${e.action === "alarm" ? o`<label class="row"><span>${a(s, "calr_alarm")}</span>
              <select class="inp" @change=${(r) => this._set(t, { alarm: r.target.value || null })}>
                <option value="" ?selected=${!e.alarm}>—</option>
                ${this.alarms.map((r) => o`<option value=${r.id} ?selected=${r.id === e.alarm}>${r.name}</option>`)}
              </select></label>
            <div class="muted">${a(s, this.alarms.length ? "calr_alarm_hint" : "calr_alarm_none")}</div>` : p}
      ${e.action !== "skip" ? o`<label class="row"><input type="checkbox" .checked=${e.any_day}
              @change=${(r) => this._set(t, { any_day: r.target.checked })} />
            ${a(s, "calr_any_day")}</label>` : p}

      <div class="row" style="justify-content:flex-end">
        <button class="icon" ?disabled=${t === 0} aria-label=${a(s, "move_up")} @click=${() => this._move(t, -1)}>↑</button>
        <button class="icon" ?disabled=${t === i - 1} aria-label=${a(s, "move_down")} @click=${() => this._move(t, 1)}>↓</button>
        <button class="icon" aria-label=${a(s, "remove")}
          @click=${() => {
      this._openRule = -1, this._rules(this.config.rules.filter((r, d) => d !== t));
    }}>✕</button>
      </div>`;
  }
  _travel() {
    const e = this.hass, t = this.config.travel, s = (i) => this._emit({ travel: { ...t, ...i } });
    return o`<div class="lbl">${a(e, "calr_travel_title")}</div>
      <div class="muted">${a(e, this._waze ? "calr_travel_hint" : "calr_no_waze")}</div>
      <db-entity-picker .hass=${e} .domains=${["person", "zone", "device_tracker"]} .value=${t.origin}
        .label=${a(e, "calr_origin")}
        @value-changed=${(i) => {
      i.stopPropagation(), s({ origin: i.detail.value || null });
    }}></db-entity-picker>
      <div class="muted">${a(e, "calr_origin_hint")}</div>
      <div class="seg" role="group">
        ${["car", "motorcycle", "taxi"].map(
      (i) => o`<button aria-pressed=${t.vehicle === i} @click=${() => s({ vehicle: i })}>
            ${a(e, `calr_vehicle_${i}`)}
          </button>`
    )}
      </div>
      <div class="row">
        <label class="row"><input type="checkbox" .checked=${t.avoid_toll}
          @change=${(i) => s({ avoid_toll: i.target.checked })} />${a(e, "calr_toll")}</label>
        <label class="row"><span>${a(e, "calr_region")}</span>
          <select class="inp" @change=${(i) => s({ region: i.target.value })}>
            ${["auto", "eu", "us", "na", "il", "au"].map(
      (i) => o`<option value=${i} ?selected=${t.region === i}>${i === "auto" ? a(e, "calr_region_auto") : i.toUpperCase()}</option>`
    )}
          </select></label>
      </div>
      <label class="row"><span>${a(e, "calr_fallback")}</span>
        <input class="inp num" type="number" min="0" max="240" .value=${String(t.fallback)}
          @change=${(i) => s({ fallback: $(Number(i.target.value) || 0, 0, 240) })} />
        min</label>`;
  }
  _decision(e) {
    const t = this.hass, s = e.decision;
    if (!s)
      return e.normal ? o`${e.time ? o`<b>${N(t, e.time)}</b>` : p}<span class="tag">${a(t, "calp_normal")}</span>` : o`<span class="muted">${a(t, "calp_free")}</span>`;
    const i = s.rule >= 0 ? a(t, "calp_rule", { n: s.rule + 1 }) : "", n = s.summary ? `${i} · ${s.summary}` : i;
    switch (s.action) {
      case "skip":
        return o`<span class="tag skip">${a(t, "calp_skip")}</span><span class="muted">${n}</span>`;
      case "alarm":
        return o`<span class="tag skip">${a(t, "calp_alarm", { name: this.alarms.find((r) => r.id === s.alarm)?.name ?? "…" })}</span>
          <span class="muted">${n}</span>`;
      case "ring":
        return o`<span class="tag">${a(t, "calp_ring", { name: this.alarms.find((r) => r.id === s.alarm)?.name ?? "…" })}</span>
          <span class="muted">${s.summary ?? ""}</span>`;
      default:
        return o`<b>${s.time ? N(t, s.time) : ""}</b><span class="muted">${n}${s.travel != null ? ` · ${a(t, "calp_travel", { min: s.travel })}` : ""}</span>`;
    }
  }
  _preview() {
    const e = this.hass, t = this.preview;
    return o`<div class="lbl">${a(e, "calp_title")}</div>
      ${this.loading && !t ? o`<div class="muted">…</div>` : p}
      ${t ? o`<div class="days">
            ${t.map(
      (s) => o`<div class="day">
                <span>${U(e, s.date)}</span>
                <span class="what">
                  ${this._decision(s)}
                  ${s.events.length ? o`<div class="ev">${s.events.map((i) => i.all_day ? i.summary : `${N(e, i.start)} ${i.summary}`).join(" · ")}</div>` : p}
                </span>
              </div>`
    )}
          </div>` : p}`;
  }
  render() {
    const e = this.hass, t = this.config, s = t.rules.some((i) => i.enabled && i.action === "before" && i.travel);
    return o`
      <div class="muted">${a(e, "calr_hint")}</div>
      ${t.rules.map((i, n) => this._rule(i, n))}
      <div class="row">
        <button class="btn" @click=${() => {
      this._openRule = t.rules.length, this._rules([...t.rules, Ws()]);
    }}>＋ ${a(e, "calr_add")}</button>
        ${$a.map(
      (i) => o`<button class="chip"
            @click=${() => {
        this._openRule = t.rules.length, this._rules([...t.rules, { ...Ws(), ...i.rule, keywords: [a(e, `${i.key}_w`)] }]);
      }}>
            ＋ ${a(e, i.key)}
          </button>`
    )}
      </div>
      ${s ? o`<div class="divider"></div>${this._travel()}` : p}
      ${t.rules.length ? o`<div class="divider"></div>${this._preview()}` : p}
    `;
  }
};
os.styles = [
  O,
  T`
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
    `
];
let re = os;
We([
  f({ attribute: !1 })
], re.prototype, "hass");
We([
  f({ attribute: !1 })
], re.prototype, "config");
We([
  f({ attribute: !1 })
], re.prototype, "alarms");
We([
  f({ attribute: !1 })
], re.prototype, "preview");
We([
  f({ type: Boolean })
], re.prototype, "loading");
We([
  b()
], re.prototype, "_word");
We([
  b()
], re.prototype, "_openRule");
H("db-calendar-rules", re);
var xa = Object.defineProperty, G = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && xa(e, t, i), i;
};
const di = [1, 6, 30, 60], ci = "daybreak-test-speed";
function wa() {
  try {
    const l = Number(localStorage.getItem(ci));
    return di.includes(l) ? l : 6;
  } catch {
    return 6;
  }
}
const ls = class ls extends L {
  constructor() {
    super(...arguments), this.parts = ["light", "audio"], this.start = "light", this.wakeTime = "07:00", this._speed = wa(), this._busy = !1, this._error = "", this._now = Date.now();
  }
  connectedCallback() {
    super.connectedCallback(), this._tick = window.setInterval(() => {
      this._running && (this._now = Date.now());
    }, 500);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this._tick);
  }
  get _running() {
    return !!this.runtime?.test && !!this.runtime.alarm_time;
  }
  get _parts() {
    const e = this.parts.filter((t) => this._configured(t));
    return (this._with ?? e).filter((t) => e.includes(t));
  }
  _configured(e) {
    const t = this.draft;
    return t ? e === "light" ? Object.values(t.light.targets).some((s) => s?.length) : t.audio.enabled && t.audio.players.length > 0 : !1;
  }
  /** Seconds until the alarm time in the test. */
  get _leadSeconds() {
    const e = this.draft, t = this._parts, s = t.includes("light") ? e.light_lead : 0, i = t.includes("audio") ? e.audio.lead : 0;
    return ((this._start ?? this.start) === "ring" ? 0 : Math.max(s, i) * 60) / this._speed;
  }
  _duration(e) {
    const t = Math.round(e);
    return t >= 60 ? `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")} min` : `${t} s`;
  }
  async _run() {
    if (!(!this.hass || !this.alarmId || !this.draft)) {
      this._busy = !0, this._error = "";
      try {
        const { ...e } = this.draft;
        delete e.runtime, await gi(this.hass, this.alarmId, {
          alarm: e,
          speed: this._speed,
          parts: this._parts,
          start: this._start ?? this.start
        });
      } catch (e) {
        this._error = e.message ?? String(e);
      } finally {
        this._busy = !1;
      }
    }
  }
  _action(e) {
    this.hass && this.alarmId && Ft(this.hass, e, this.alarmId).catch(() => {
    });
  }
  _live() {
    const e = this.hass, t = this.runtime, s = t.test_speed || 1, i = Date.parse(t.alarm_time), n = (i - this._now) / 1e3, r = k(this.wakeTime) - n * s / 60, d = y(e, M(Math.floor((r % 1440 + 1440) % 1440))), c = t.light_start ? Date.parse(t.light_start) : i, h = Math.max(1, i - Math.min(c, i - 1e3)), m = Math.min(1, Math.max(0, 1 - (i - this._now) / h)), u = t.snooze_until ? Math.max(0, (Date.parse(t.snooze_until) - this._now) / 1e3) : 0;
    return o`<div class="live">
      <div>
        <div class="muted">${a(e, "tr_simulated")}</div>
        <div class="clock">${d}</div>
      </div>
      <div class="grow">
        <div>${a(e, `tr_state_${t.state}`)}${t.snooze_until ? o` · ${a(e, "tr_snooze_left", { time: this._duration(u) })}` : p}</div>
        <div class="bar"><span style="width:${m * 100}%"></span></div>
      </div>
      ${t.state === "ringing" ? o`<button class="btn" @click=${() => this._action("snooze")}>${a(e, "tr_snooze")}</button>` : p}
      <button class="btn primary" @click=${() => this._action("stop")}>${a(e, "stop")}</button>
    </div>`;
  }
  render() {
    const e = this.hass;
    if (!this.draft) return p;
    const t = this.parts.filter((r) => this._configured(r)), s = this._parts, i = this._start ?? this.start, n = this.runtime?.problems ?? [];
    return o`<div class="box">
      <div class="head">🧪 ${a(e, "tr_title")}</div>
      <div class="muted">${a(e, "tr_hint")}</div>
      ${this.alarmId ? t.length ? o`
              <div class="row">
                <span>${a(e, "tr_speed")}</span>
                <div class="seg" role="group">
                  ${di.map(
      (r) => o`<button aria-pressed=${this._speed === r} @click=${() => {
        this._speed = r;
        try {
          localStorage.setItem(ci, String(r));
        } catch {
        }
      }}>${r === 1 ? a(e, "tr_real") : a(e, "tr_lapse", { s: 60 / r })}</button>`
    )}
                </div>
              </div>
              <div class="row">
                <div class="seg" role="group">
                  ${["light", "ring"].map(
      (r) => o`<button aria-pressed=${i === r} @click=${() => this._start = r}>
                      ${a(e, `tr_start_${r}`)}
                    </button>`
    )}
                </div>
                ${t.length > 1 ? t.map(
      (r) => o`<button class="chip" aria-pressed=${s.includes(r)}
                        @click=${() => this._with = s.includes(r) ? s.filter((d) => d !== r) : [...s, r]}>
                        ${a(e, `tr_part_${r}`)}
                      </button>`
    ) : p}
              </div>
              <div class="muted">
                ${i === "light" ? a(e, "tr_until", { time: this._duration(this._leadSeconds) }) : a(e, "tr_ring_now")}
                · ${a(e, "tr_snooze_info")}
              </div>
              ${this._running ? this._live() : o`<div class="row">
                    <button class="btn primary" ?disabled=${this._busy || !s.length} @click=${this._run}>▶ ${a(e, "tr_start")}</button>
                  </div>`}
              ${this._error ? o`<div class="problem">${this._error}</div>` : p}
              ${n.length ? o`<div>
                    <div class="lbl">${a(e, "tr_problems")}</div>
                    ${n.map(
      (r) => o`<div class="problem">⚠ ${a(e, `tr_part_${r.part}`)}: ${r.message}</div>`
    )}
                  </div>` : p}
            ` : o`<div class="muted">${a(e, "tr_nothing")}</div>` : o`<div class="muted">${a(e, "tr_save_first")}</div>`}
    </div>`;
  }
};
ls.styles = [
  O,
  T`
      :host {
        display: block;
      }
      .box {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
        border: 1px dashed var(--db-line);
        border-radius: 14px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
      }
      .live {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--db-tile);
      }
      .clock {
        font-size: 28px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      .bar {
        height: 6px;
        border-radius: 3px;
        background: var(--db-line);
        overflow: hidden;
        flex: 1 1 160px;
      }
      .bar span {
        display: block;
        height: 100%;
        background: var(--db-accent);
      }
      .problem {
        color: var(--error-color, #e5534b);
        font-size: 13px;
      }
    `
];
let j = ls;
G([
  f({ attribute: !1 })
], j.prototype, "hass");
G([
  f({ attribute: !1 })
], j.prototype, "alarmId");
G([
  f({ attribute: !1 })
], j.prototype, "draft");
G([
  f({ attribute: !1 })
], j.prototype, "runtime");
G([
  f({ attribute: !1 })
], j.prototype, "parts");
G([
  f()
], j.prototype, "start");
G([
  f()
], j.prototype, "wakeTime");
G([
  b()
], j.prototype, "_speed");
G([
  b()
], j.prototype, "_start");
G([
  b()
], j.prototype, "_with");
G([
  b()
], j.prototype, "_busy");
G([
  b()
], j.prototype, "_error");
G([
  b()
], j.prototype, "_now");
H("db-test-run", j);
var ya = Object.defineProperty, W = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && ya(e, t, i), i;
};
const Ct = ["light_start", "wake", "snooze", "stop"], js = ["snow", "storm", "rain"], ka = ["started", "finished", "skipped", "shifted", "device_unavailable", "failed", "last_call"], za = [
  ["weekdays", [0, 1, 2, 3, 4]],
  ["weekend", [5, 6]],
  ["every_day", [0, 1, 2, 3, 4, 5, 6]]
], ds = class ds extends L {
  constructor() {
    super(...arguments), this.lightProfiles = [], this.lastCallProfiles = [], this.climateProfiles = [], this.holidayEntity = null, this.alarms = [], this.mode = "normal", this.isNew = !1, this.saving = !1, this.narrow = !1, this._open = {
      time: !0,
      cond: !1,
      cal: !1,
      light: !0,
      audio: !1,
      climate: !1,
      push: !1,
      act: !1,
      none: !1,
      fb: !1
    }, this._ownerPick = !1, this._morePresence = !1, this._phase = "wake", this._unlocked = !1, this._newProfileName = "", this._overrideOpen = -1, this._sunDate = "", this._calLoading = !1, this._calKey = "";
  }
  willUpdate(e) {
    e.has("alarm") && this.alarm && (this._draft = structuredClone(this.alarm), this._unlocked = !1, this._newProfileName = ""), this.hass && !this._phones && zi(this.hass).then((s) => this._phones = s).catch(() => {
    }), this._queueCalendarPreview();
    const t = this._nextDate();
    this.hass && t !== this._sunDate && (this._sunDate = t, Us(this.hass, t).then((s) => this._sun = s[t]).catch(() => {
    }));
  }
  // ---------------------------------------------------------------- helpers
  get d() {
    return this._draft;
  }
  _patch(e) {
    this._draft = { ...this.d, ...e };
  }
  _sub(e, t) {
    this._patch({ [e]: { ...this.d[e], ...t } });
  }
  get _expert() {
    return this.mode === "expert";
  }
  get _simple() {
    return this.mode === "simple";
  }
  /**
   * Whether an option is shown in the current mode (configured in the
   * settings). Options this alarm already uses stay visible, so nothing
   * runs that the user cannot see.
   */
  _has(e, t = !1) {
    return this.mode === "expert" || t ? !0 : !(this.settings?.mode_hidden?.[this.mode] ?? Dt[this.mode]).includes(e);
  }
  _picker(e, t, s, i = {}) {
    return o`<db-entity-picker
      .hass=${this.hass}
      .domains=${e}
      .value=${t}
      .multiple=${!!i.multiple}
      .areaPick=${!!i.areaPick}
      .deviceClass=${i.deviceClass}
      .units=${i.units}
      .label=${i.label ?? ""}
      @value-changed=${(n) => {
      n.stopPropagation(), s(n.detail.value);
    }}
    ></db-entity-picker>`;
  }
  _selector(e, t, s, i) {
    return o`<ha-selector
      .hass=${this.hass}
      .selector=${e}
      .value=${t}
      .label=${i}
      .required=${!1}
      @value-changed=${(n) => s(n.detail.value)}
    ></ha-selector>`;
  }
  _toggle(e, t, s) {
    return o`<button class="switch" role="switch" aria-checked=${e} aria-label=${s}
      @click=${() => t(!e)}></button>`;
  }
  _section(e, t, s, i, n) {
    const r = this._open[e];
    return o`<section class="card">
      <button class="sh" aria-expanded=${r} @click=${() => this._open = { ...this._open, [e]: !r }}>
        <span class="chev">▸</span><b>${t}</b>${n ? o`<span class="badge">${n}</span>` : p}
        <span class="sum">${s}</span>
      </button>
      ${r ? o`<div class="sb">${i()}</div>` : p}
    </section>`;
  }
  get _snoozeMinutes() {
    const e = this.settings?.snooze_presets ?? [], t = this.d.snooze.preset ?? this.settings?.default_snooze;
    return e.find((s) => s.id === t)?.minutes ?? e[0]?.minutes ?? 9;
  }
  get _snoozeCount() {
    return this.d.snooze.count ?? this.settings?.default_snooze_count ?? 3;
  }
  /** Date the next occurrence falls on (for sun times and "only once"). */
  _nextDate() {
    const e = this._draft;
    if (!e || !this.hass) return "";
    const t = ae(this.hass);
    for (let s = 0; s < 62; s++) {
      const i = Te(t, s);
      if (Et(e, i) && i !== e.skip_date) return i;
    }
    return t;
  }
  /** Effective wake time (computed for sun-based alarms). */
  get _wakeTime() {
    const e = this.d;
    if (e.wake.type === "sun") {
      const t = li(this.hass, this._sun, e.wake);
      if (t !== null) return M(t);
    }
    return e.wake.time;
  }
  get _lights() {
    return ft(this.hass, this.d.light.targets);
  }
  _profile(e) {
    return e ? this.lightProfiles.find((t) => t.id === e) : void 0;
  }
  // ----------------------------------------------------------------- header
  _header() {
    const e = this.hass, t = ["simple", "normal", "expert"];
    return o`<header>
      <button class="btn" style="padding:0 10px" aria-label=${a(e, "back")} @click=${() => S(this, "daybreak-cancel")}>←</button>
      <div class="seg" role="group" aria-label=${a(e, "mode")}>
        ${t.map(
      (s) => o`<button aria-pressed=${this.mode === s} @click=${() => S(this, "daybreak-mode", { mode: s })}>
            ${a(e, `mode_${s}`)}
          </button>`
    )}
      </div>
      <span class="grow"></span>
      ${this.isNew ? p : o`<button class="btn danger" @click=${() => S(this, "daybreak-delete")}>${a(e, "delete")}</button>
            <button class="btn" @click=${() => S(this, "daybreak-test")}>${a(e, "test")}</button>`}
      <button class="btn" @click=${() => S(this, "daybreak-cancel")}>${a(e, "cancel")}</button>
      <button class="btn primary" ?disabled=${this.saving} @click=${this._save}>${a(e, "save")}</button>
    </header>`;
  }
  _save() {
    const e = this.hass;
    if (this._unlocked && !this._newProfileName.trim()) {
      S(this, "hass-notification", { message: a(e, "profile_name_required") }), this._open = { ...this._open, light: !0 };
      return;
    }
    S(this, "daybreak-save", {
      alarm: this.d,
      newProfile: this._unlocked ? { name: this._newProfileName.trim(), duration: this.d.light_lead, settings: this.d.light.settings } : void 0
    });
  }
  // ------------------------------------------------------------ name/owners
  _persons() {
    return Object.values(this.hass?.states ?? {}).filter((e) => e.entity_id.startsWith("person."));
  }
  _avatar(e) {
    const s = this.hass?.states[e]?.attributes.entity_picture, i = P(this.hass, e);
    return o`<span class="avatar">${s ? o`<img src=${s} alt="" />` : i.slice(0, 1).toUpperCase()}</span>`;
  }
  _head() {
    const e = this.hass, t = this.d, s = this._persons().filter((i) => !t.owners.includes(i.entity_id));
    return o`<section class="card head">
      <div class="row">
        <label class="lbl grow" for="name">${a(e, "f_name")}</label>
        <span class="badge">${a(e, `kind_${t.kind}`)}</span>
      </div>
      <input id="name" class="inp name" .value=${t.name} @input=${(i) => this._patch({ name: i.target.value })} />
      <div class="lbl">${a(e, "owners")}</div>
      <div class="row">
        ${t.owners.map(
      (i) => o`<span class="chip" aria-pressed="true">${this._avatar(i)}${P(e, i)}
            <button class="x" aria-label=${a(e, "remove")} @click=${() => this._patch({ owners: t.owners.filter((n) => n !== i) })}>✕</button>
          </span>`
    )}
        <button class="chip" aria-expanded=${this._ownerPick} aria-label=${a(e, "owner_add")}
          @click=${() => this._ownerPick = !this._ownerPick}>+</button>
        ${this._ownerPick ? s.map(
      (i) => o`<button class="chip" @click=${() => {
        this._patch({ owners: [...t.owners, i.entity_id] }), this._ownerPick = !1;
      }}>${this._avatar(i.entity_id)}${P(e, i.entity_id)}</button>`
    ) : p}
        ${this._ownerPick && !s.length ? o`<span class="muted">${a(e, "owner_none")}</span>` : p}
      </div>
      <div class="muted">${a(e, "owners_hint")}</div>
    </section>`;
  }
  // ----------------------------------------------------------------- time
  _timeSection() {
    const e = this.hass, t = this.d, s = this._wakeTime, i = `${y(e, s)} · ${Yt(e, t)}`;
    return this._section("time", a(e, "section_time"), i, () => this._timeBody());
  }
  _timeBody() {
    const e = this.hass, t = this.d, s = t.kind === "wake", i = this._effectiveSettings(), n = t.kind === "sleep" ? a(e, "tl_sleep_start") : t.kind === "kids" ? a(e, "tl_kids_start") : "", r = t.kind === "sleep" ? a(e, "tl_sleep_end") : t.kind === "kids" ? a(e, "tl_kids_end") : "", d = s && this._lights.length > 1 && this._has("lamp_start", t.light.per_lamp_start), c = d && t.light.per_lamp_start;
    return o`
      ${this._has("sun", t.wake.type === "sun") ? o`<div class="seg" role="group">
            <button aria-pressed=${t.wake.type === "fixed"} @click=${() => this._sub("wake", { type: "fixed", time: this._wakeTime })}>
              ${a(e, "wake_fixed")}
            </button>
            <button aria-pressed=${t.wake.type === "sun"} @click=${() => this._sub("wake", { type: "sun" })}>
              ${a(e, "wake_sun")}
            </button>
          </div>` : p}
      ${t.wake.type === "sun" ? o`<div class="tile"><db-sun-wake .hass=${e} .wake=${t.wake} .date=${this._nextDate()} .mode=${this.mode}
            @wake-change=${(h) => this._patch({ wake: h.detail })}></db-sun-wake></div>` : p}
      <div class="tile">
        <db-time-line
          .hass=${e}
          .time=${this._wakeTime}
          .lead=${t.light_lead}
          .snooze=${this._snoozeMinutes}
          .count=${this._snoozeCount}
          .lastCall=${t.last_call.enabled}
          .lcDuration=${this._lcDuration}
          .audioLead=${this.d.audio.enabled && this.d.audio.players.length ? this.d.audio.lead : -1}
          .climateLead=${s ? this._climateLead : -1}
          .fixedWake=${t.wake.type === "sun"}
          .showSnooze=${s}
          .startLabel=${n}
          .wakeLabel=${r}
          .gradient=${le(i)}
          .lamps=${c ? this._lampStarts() : []}
          @lamp-start-change=${(h) => this._sub("light", { starts: { ...t.light.starts, [h.detail.entity]: h.detail.before } })}
          @timeline-change=${(h) => {
      const { time: m, lead: u, count: _, lcDuration: g } = h.detail;
      this._patch({
        light_lead: u,
        wake: t.wake.type === "fixed" ? { ...t.wake, time: m } : t.wake,
        snooze: _ === this._snoozeCount ? t.snooze : { ...t.snooze, count: _ },
        last_call: g === this._lcDuration ? t.last_call : { ...t.last_call, duration: g }
      });
    }}
        ></db-time-line>
        ${d ? o`<div class="row" style="margin-top:10px">
              <div class="grow"><div>${a(e, "lamp_start_on")}</div><div class="muted">${a(e, "lamp_start_on_d")}</div></div>
              ${this._toggle(t.light.per_lamp_start, (h) => this._sub("light", { per_lamp_start: h }), a(e, "lamp_start_on"))}
            </div>` : p}
      </div>
      ${s ? this._snoozeChoice() : p}
      ${s ? this._lastCallRow() : p}
      ${this._onceBlock()}
      <div class="divider"></div>
      ${this._repeatBlock()}
      ${this._holidayTile()}
    `;
  }
  _snoozeChoice() {
    const e = this.hass, t = this.settings?.snooze_presets ?? [], s = this.d.snooze.preset ?? this.settings?.default_snooze;
    return o`<div class="row">
      <span class="lbl">${a(e, "snooze")}</span>
      ${t.map(
      (i) => o`<button class="chip" aria-pressed=${s === i.id}
          @click=${() => this._sub("snooze", { preset: i.id === this.settings?.default_snooze ? null : i.id })}>
          ${i.name} · ${i.minutes} min
        </button>`
    )}
      <span class="muted">${a(e, "snooze_hint")}</span>
    </div>`;
  }
  get _lcDuration() {
    const e = this.d.last_call;
    return e.duration ?? this.lastCallProfiles.find((t) => t.id === e.profile)?.duration ?? 10;
  }
  _lastCallRow() {
    const e = this.hass, t = this.d.last_call;
    return o`<div class="row">
      <span class="lbl">${a(e, "last_call")}</span>
      ${this._toggle(t.enabled, (s) => this._sub("last_call", { enabled: s }), a(e, "last_call"))}
      ${t.enabled ? o`<select class="inp" aria-label=${a(e, "last_call")}
            @change=${(s) => this._sub("last_call", { profile: s.target.value, duration: null })}>
            ${this.lastCallProfiles.map((s) => o`<option value=${s.id} ?selected=${s.id === t.profile}>${s.name}</option>`)}
          </select>` : p}
      <span class="muted grow">${a(e, "lc_row_hint")}</span>
    </div>`;
  }
  _onceBlock() {
    const e = this.hass, t = this.d;
    if (t.repeat.type === "once") return p;
    const s = this._nextDate(), i = t.once;
    return o`<div class="row">
        <button class="chip" aria-pressed=${!!i}
          @click=${() => this._patch({ once: i ? null : { date: s, time: this._wakeTime, light_lead: null } })}>
          ${a(e, "once_toggle")}
        </button>
        ${i ? o`<span class="muted">${a(e, "once_hint")}</span>` : p}
      </div>
      ${i ? o`<div class="tile row">
            <label class="row"><span>${a(e, "once_on")}</span>
              <input class="inp" type="date" .value=${i.date}
                @change=${(n) => this._patch({ once: { ...i, date: n.target.value } })} /></label>
            <label class="row"><span>${a(e, "tl_wake")}</span>
              <input class="inp time" type="time" .value=${i.time}
                @change=${(n) => this._patch({ once: { ...i, time: n.target.value } })} /></label>
            <label class="row"><span>${a(e, "light_lead")}</span>
              <input class="inp num" type="number" min="0" max="240" placeholder=${String(t.light_lead)}
                .value=${i.light_lead === null ? "" : String(i.light_lead)}
                @change=${(n) => {
      const r = n.target.value;
      this._patch({ once: { ...i, light_lead: r === "" ? null : $(Number(r), 0, 240) } });
    }} /> min</label>
          </div>` : p}`;
  }
  _repeatBlock() {
    const e = this.hass, t = this.d.repeat, s = this._has("pattern") || t.type === "pattern" ? ["weekly", "interval", "pattern", "once"] : ["weekly", "interval", "once"];
    return o`
      <div class="lbl">${a(e, "repeat")}</div>
      <div class="seg" role="group">
        ${s.map(
      (i) => o`<button aria-pressed=${t.type === i} @click=${() => this._sub("repeat", { type: i })}>
            ${a(e, `repeat_${i}`)}
          </button>`
    )}
      </div>
      ${t.type === "weekly" ? this._weekly() : p}
      ${t.type === "interval" ? this._interval() : p}
      ${t.type === "pattern" ? this._pattern() : p}
      ${t.type === "once" ? o`<label class="row"><span>${a(e, "once_date")}</span>
            <input class="inp" type="date" .value=${t.date ?? ""}
              @change=${(i) => this._sub("repeat", { date: i.target.value || null })} />
            <span class="muted">${a(e, "once_date_hint")}</span></label>` : p}
      ${this._has("calendar") && t.type !== "once" ? this._calendar() : p}
    `;
  }
  _weekly() {
    const e = this.hass, t = this.d.repeat, s = _t(e), i = t.start_date ?? ae(e), n = Te(i, -(((/* @__PURE__ */ new Date(`${i}T12:00:00Z`)).getUTCDay() + 6) % 7));
    return o`
      <div class="row days">
        ${s.map(
      (r, d) => o`<button class="chip" aria-pressed=${t.days.includes(d)}
            @click=${() => this._sub("repeat", {
        days: t.days.includes(d) ? t.days.filter((c) => c !== d) : [...t.days, d].sort()
      })}>${r}</button>`
    )}
      </div>
      <div class="row">
        ${za.map(
      ([r, d]) => o`<button class="chip" aria-pressed=${t.days.join() === d.join()}
            @click=${() => this._sub("repeat", { days: d })}>${a(e, r)}</button>`
    )}
      </div>
      ${this._has("week_cycle") ? o`<div class="row">
              <span>${a(e, "week_cycle")}</span>
              <div class="seg" role="group">
                ${[1, 2, 3, 4].map(
      (r) => o`<button aria-pressed=${t.week_cycle === r}
                    @click=${() => this._sub("repeat", {
        week_cycle: r,
        weeks: [...t.weeks, !0, !0, !0, !0].slice(0, r),
        start_date: r > 1 ? t.start_date ?? n : t.start_date
      })}>${r === 1 ? a(e, "every_week") : a(e, "week_cycle_short", { n: r })}</button>`
    )}
              </div>
            </div>
            ${t.week_cycle > 1 ? o`<div class="weeks">
                    ${t.weeks.map((r, d) => {
      const c = Te(n, d * 7);
      return o`<button class="wtile" aria-pressed=${r}
                        @click=${() => this._sub("repeat", { weeks: t.weeks.map((h, m) => m === d ? !h : h) })}>
                        <b>${a(e, "week_n", { n: d + 1 })}</b>
                        <span>${r ? a(e, "week_on") : a(e, "week_off")}</span>
                        <span class="muted">${U(e, c)} – ${U(e, Te(c, 6))}</span>
                      </button>`;
    })}
                  </div>
                  <label class="row"><span class="muted">${a(e, "week_anchor")}</span>
                    <input class="inp" type="date" .value=${t.start_date ?? n}
                      @change=${(r) => this._sub("repeat", { start_date: r.target.value || null })} /></label>` : p}` : p}
    `;
  }
  _interval() {
    const e = this.hass, t = this.d.repeat;
    return o`<div class="row">
      <span>${a(e, "every")}</span>
      <input class="inp num" type="number" min="1" max="60" .value=${String(t.interval)}
        @change=${(s) => this._sub("repeat", { interval: $(Number(s.target.value) || 1, 1, 60) })} />
      <select class="inp" @change=${(s) => this._sub("repeat", { unit: s.target.value })}>
        <option value="days" ?selected=${t.unit === "days"}>${a(e, "unit_days")}</option>
        <option value="weeks" ?selected=${t.unit === "weeks"}>${a(e, "unit_weeks")}</option>
      </select>
      <span>${a(e, "from")}</span>
      <input class="inp" type="date" .value=${t.start_date ?? ae(e)}
        @change=${(s) => this._sub("repeat", { start_date: s.target.value || null })} />
    </div>`;
  }
  _pattern() {
    const e = this.hass, t = this.d.repeat, s = t.start_date ?? ae(e);
    return o`<div class="muted">${a(e, "pattern_hint")}</div>
      <div class="row">
        <span>${a(e, "pattern_cycle")}</span>
        <input class="inp num" type="number" min="1" max="42" .value=${String(t.pattern.length)}
          @change=${(i) => {
      const n = $(Number(i.target.value) || 1, 1, 42);
      this._sub("repeat", { pattern: Array.from({ length: n }, (r, d) => t.pattern[d] ?? !1) });
    }} />
        <span>${a(e, "pattern_day1")}</span>
        <input class="inp" type="date" .value=${s}
          @change=${(i) => this._sub("repeat", { start_date: i.target.value || null })} />
      </div>
      <div class="pattern">
        ${t.pattern.map(
      (i, n) => o`<button class="wtile" aria-pressed=${i}
            @click=${() => this._sub("repeat", { pattern: t.pattern.map((r, d) => d === n ? !r : r), start_date: s })}>
            <b>${a(e, "day_n", { n: n + 1 })}</b><span class="muted">${i ? a(e, "week_on") : a(e, "week_off")}</span>
          </button>`
    )}
      </div>`;
  }
  _calendar() {
    const e = this.hass, t = this.d, s = ae(e), i = Te(s, -(((/* @__PURE__ */ new Date(`${s}T12:00:00Z`)).getUTCDay() + 6) % 7)), n = Array.from({ length: 28 }, (r, d) => Te(i, d));
    return o`<div class="tile">
      <div class="row" style="margin-bottom:8px">
        <span class="grow">${a(e, "preview_4w")}</span>
        <span class="muted">${a(e, "preview_legend")}</span>
      </div>
      <div class="cal">
        ${_t(e).map((r) => o`<span class="head">${r}</span>`)}
        ${n.map((r) => {
      const d = this._calDecision(r), c = r >= s && (d ? ["time", "ring"].includes(d) : Et(t, r) || t.once?.date === r), h = r === t.skip_date || r >= s && (d === "skip" || d === "alarm") && Et(t, r);
      return o`<span class="${c ? "on" : ""} ${h ? "skip" : ""}" title=${U(e, r)}>${Number(r.slice(8))}</span>`;
    })}
      </div>
    </div>`;
  }
  /** Action of a calendar rule on a day (from the preview or the saved runtime). */
  _calDecision(e) {
    if (this.d.calendar?.enabled)
      return this._calPreview ? this._calPreview.find((t) => t.date === e)?.decision?.action : this.runtime?.calendar_days?.find((t) => t.date === e)?.action;
  }
  // ------------------------------------------------------------- calendar
  _queueCalendarPreview() {
    const e = this.d?.calendar;
    if (!this.hass || !e?.enabled || !e.rules.length || !this._open.cal) return;
    const t = JSON.stringify([e, this.d.repeat, this.d.wake, this.d.enabled]);
    t !== this._calKey && (this._calKey = t, window.clearTimeout(this._calTimer), this._calTimer = window.setTimeout(() => {
      const s = this.hass;
      this._calLoading = !0;
      const { name: i, kind: n, wake: r, repeat: d, light_lead: c, calendar: h } = this.d;
      mi(s, { id: this.alarmId, name: i, kind: n, wake: r, repeat: d, light_lead: c, calendar: h }).then((m) => {
        this._calKey === t && (this._calPreview = m.days);
      }).catch(() => {
      }).finally(() => this._calLoading = !1);
    }, 400));
  }
  _calendarSection() {
    const e = this.hass, t = this.d.calendar ?? ai(), s = (h) => this._sub("calendar", h), i = t.rules.filter((h) => h.enabled).length, n = this.runtime?.calendar_days?.[0], r = n ? `${U(e, n.date)}: ${n.action === "skip" || n.action === "alarm" ? a(e, "calp_skip") : n.time ? N(e, n.time) : ""}${n.summary ? ` (${n.summary})` : ""}` : "", d = t.enabled ? [a(e, "cal_summary", { n: i }), r].filter(Boolean).join(" · ") : a(e, "off"), c = this.alarms.filter((h) => h.id !== this.alarmId);
    return this._section("cal", a(e, "section_calendar"), d, () => o`
      <div class="row">
        <div class="grow"><div>${a(e, "calr_on")}</div><div class="muted">${a(e, "calr_on_d")}</div></div>
        ${this._toggle(t.enabled, (h) => s({ enabled: h }), a(e, "calr_on"))}
      </div>
      ${t.enabled ? o`<db-calendar-rules .hass=${e} .config=${t} .alarms=${c}
            .preview=${this._calPreview} .loading=${this._calLoading}
            @calendar-change=${(h) => s(h.detail)}></db-calendar-rules>` : p}
    `);
  }
  _holidayTile() {
    const e = this.hass, t = this.d;
    return o`<div class="tile row">
      <div class="grow">
        <div>${a(e, "holidays")}</div>
        <div class="muted">
          ${this.holidayEntity ? a(e, "holidays_hint", { entity: P(e, this.holidayEntity) }) : a(e, "holidays_none")}
        </div>
      </div>
      ${this._toggle(t.wake_on_holidays, (s) => this._patch({ wake_on_holidays: s }), a(e, "holidays"))}
    </div>`;
  }
  // ----------------------------------------------------------- conditions
  _condSection() {
    const e = this.hass, t = this.d, s = [], i = t.presence.entities;
    i.length && !this._simple && s.push(i.map((r) => P(e, r)).join(", ")), t.shift.weather.enabled && s.push(a(e, "rule_weather")), t.shift.travel.enabled && s.push(a(e, "rule_travel")), (t.shift.weather.enabled || t.shift.travel.enabled) && s.push(a(e, "shift_upto", { min: t.shift.max }));
    const n = this._simple ? a(e, "section_weather") : a(e, "section_cond");
    return this._section(
      "cond",
      n,
      s.join(" · ") || a(e, "none"),
      () => this._simple ? this._simpleWeather() : this._condBody()
    );
  }
  _weatherMinutes(e) {
    return this.d.shift.weather.minutes[e] ?? this.settings?.weather_minutes[e] ?? 0;
  }
  _simpleWeather() {
    const e = this.hass, t = this.d.shift.weather;
    return o`<div class="muted">${a(e, "simple_weather_hint")}</div>
      <div class="row">
        ${js.map((s) => {
      const i = t.enabled && t.conditions.includes(s);
      return o`<button class="chip" aria-pressed=${i} @click=${() => {
        const n = i ? t.conditions.filter((r) => r !== s) : [...t.conditions, s];
        this._sub("shift", { weather: { ...t, enabled: n.length > 0, conditions: n } });
      }}>${a(e, `weather_${s}`)} <span class="muted">−${this._weatherMinutes(s)} min</span></button>`;
    })}
      </div>
      ${this.settings?.weather_entity ? p : o`<div class="muted">${a(e, "weather_entity_missing")}</div>`}`;
  }
  _condBody() {
    const t = this.d.kind === "wake";
    return o`
      ${this._presenceBlock()}
      ${t ? o`<div class="divider"></div>${this._shiftBlock()}` : p}
    `;
  }
  _presenceBlock() {
    const e = this.hass, t = this.d.presence, s = (i) => this._sub("presence", { entities: i });
    return o`<div class="lbl">${a(e, "presence")}</div>
      <div class="muted">${a(e, t.entities.length ? "presence_hint" : "presence_off")}</div>
      <div class="row">
        ${this._persons().map((i) => {
      const n = t.entities.includes(i.entity_id);
      return o`<button class="chip" aria-pressed=${n}
            @click=${() => {
        const r = [...t.entities];
        s(n ? r.filter((d) => d !== i.entity_id) : [...r, i.entity_id]);
      }}>${this._avatar(i.entity_id)}${P(e, i.entity_id)}
            <span class="muted">${e?.states[i.entity_id]?.state === "home" ? a(e, "home") : a(e, "away")}</span>
          </button>`;
    })}
        ${t.entities.filter((i) => !i.startsWith("person.")).map(
      (i) => o`<span class="chip" aria-pressed="true">${P(e, i)}
              <button class="x" @click=${() => s(t.entities.filter((n) => n !== i))}>✕</button></span>`
    )}
        <button class="chip" aria-expanded=${this._morePresence} @click=${() => this._morePresence = !this._morePresence}>+</button>
      </div>
      ${this._morePresence ? this._picker(["device_tracker", "binary_sensor", "zone", "person", "input_boolean"], t.entities, (i) => s(i ?? []), {
      multiple: !0,
      areaPick: !0,
      label: a(e, "presence_more")
    }) : p}
      <div class="row">
        <label class="row"><input type="checkbox" .checked=${t.skip_when_away}
          @change=${(i) => this._sub("presence", { skip_when_away: i.target.checked })} />
          ${a(e, "skip_when_away")}</label>
        <label class="row"><input type="checkbox" .checked=${t.stop_when_away}
          @change=${(i) => this._sub("presence", { stop_when_away: i.target.checked })} />
          ${a(e, "stop_when_away")}</label>
      </div>`;
  }
  _shiftBlock() {
    const e = this.hass, t = this.d.shift, s = t.weather, i = t.travel, n = this.settings, r = [];
    if (s.enabled) {
      for (const h of s.conditions)
        r.push({
          key: h,
          label: a(e, `weather_${h}`),
          minutes: this._weatherMinutes(h),
          color: "var(--db-weather)",
          editable: this._expert,
          note: this._expert ? a(e, "shift_drag_hint") : a(e, "shift_from_settings")
        });
      const c = s.cold_minutes ?? n?.cold_minutes ?? 0;
      c && r.push({
        key: "cold",
        label: a(e, "shift_cold", { below: s.cold_below ?? n?.cold_below ?? 0 }),
        minutes: c,
        color: "var(--db-weather)",
        editable: this._expert,
        note: this._expert ? a(e, "shift_drag_hint") : a(e, "shift_from_settings")
      });
    }
    if (i.enabled) {
      const c = i.sensor ? Number(e?.states[i.sensor]?.state) : NaN, h = Number.isFinite(c) && !i.arrive_by;
      r.push({
        key: "travel",
        label: a(e, "rule_travel"),
        minutes: h ? Math.min(240, Math.max(0, Math.round(c - i.usual))) : null,
        color: "var(--db-travel)",
        editable: !1,
        note: Number.isFinite(c) ? a(e, "travel_now", { min: Math.round(c) }) : a(e, "travel_depends")
      });
    }
    const d = (c, h, m) => o`<div class="rule ${h ? "open" : ""}">
      <span class="bar-dot" style="background:var(--db-${c})"></span>
      <div class="grow"><b>${a(e, `rule_${c}`)}</b><div class="muted">${m}</div></div>
      ${this._toggle(
      h,
      (u) => this._sub("shift", { [c]: { ...t[c], enabled: u } }),
      a(e, `rule_${c}`)
    )}
    </div>`;
    return o`<div class="lbl">${a(e, "shift_title")}</div>
      <div class="muted">${a(e, "shift_intro")}</div>
      <div class="rules">
        ${d("weather", s.enabled, a(e, "rule_weather_d"))}
        ${d("travel", i.enabled, a(e, "rule_travel_d"))}
      </div>
      ${s.enabled ? this._weatherDetail() : p}
      ${i.enabled ? this._travelDetail() : p}
      ${r.length ? o`<div class="tile"><db-shift-line .hass=${e} .bands=${r} .cap=${t.max} .combine=${t.combine}
            .time=${this._wakeTime} .lead=${this.d.light_lead} .gradient=${le(this._effectiveSettings())}
            @cap-change=${(c) => this._sub("shift", { max: c.detail.minutes })}
            @band-change=${(c) => {
      const { key: h, minutes: m } = c.detail;
      h === "cold" ? this._sub("shift", { weather: { ...s, cold_minutes: m } }) : this._sub("shift", { weather: { ...s, minutes: { ...s.minutes, [h]: m } } });
    }}></db-shift-line></div>` : p}
      ${r.length && this._expert ? o`<label class="row"><span>${a(e, "combine")}</span>
            <select class="inp" @change=${(c) => this._sub("shift", { combine: c.target.value })}>
              <option value="max" ?selected=${t.combine === "max"}>${a(e, "combine_max")}</option>
              <option value="sum" ?selected=${t.combine === "sum"}>${a(e, "combine_sum")}</option>
            </select></label>` : p}
      ${r.length ? o`<label class="row"><input type="checkbox" .checked=${t.notify}
            @change=${(c) => this._sub("shift", { notify: c.target.checked })} />
            ${a(e, "shift_notify")}</label>` : p}`;
  }
  _weatherDetail() {
    const e = this.hass, t = this.d.shift.weather, s = this.settings, i = (n) => this._sub("shift", { weather: { ...t, ...n } });
    return o`<div class="tile" style="display:flex;flex-direction:column;gap:10px">
      <div class="muted">
        ${s?.weather_entity ? a(e, "weather_source", { entity: P(e, s.weather_entity) }) : a(e, "weather_entity_missing")}
      </div>
      <div class="grid2">
        ${js.map((n) => {
      const r = t.conditions.includes(n);
      return o`<label class="cond">
            <input type="checkbox" .checked=${r}
              @change=${() => i({ conditions: r ? t.conditions.filter((d) => d !== n) : [...t.conditions, n] })} />
            <span class="grow">${a(e, `weather_${n}`)}</span>
            ${this._expert ? o`<input class="inp num" type="number" min="0" max="240" .value=${String(this._weatherMinutes(n))}
                  @change=${(d) => i({ minutes: { ...t.minutes, [n]: $(Number(d.target.value), 0, 240) } })} />` : o`<span class="tabular">${this._weatherMinutes(n)}</span>`}
            <span>min</span>
          </label>`;
    })}
      </div>
      <div class="muted">${a(e, "weather_storm_hint", { level: s?.warning_level ?? 2 })}</div>
      ${this._expert ? o`<div class="row">
            <span>${a(e, "cold_below")}</span>
            <input class="inp num" type="number" step="0.5" placeholder=${String(s?.cold_below ?? 0)}
              .value=${t.cold_below === null ? "" : String(t.cold_below)}
              @change=${(n) => {
      const r = n.target.value;
      i({ cold_below: r === "" ? null : Number(r) });
    }} /><span>°C →</span>
            <input class="inp num" type="number" min="0" max="240" placeholder=${String(s?.cold_minutes ?? 10)}
              .value=${t.cold_minutes === null ? "" : String(t.cold_minutes)}
              @change=${(n) => {
      const r = n.target.value;
      i({ cold_minutes: r === "" ? null : $(Number(r), 0, 240) });
    }} /><span>${a(e, "min_earlier")}</span>
          </div>` : o`<div class="muted">${a(e, "cold_settings", { below: s?.cold_below ?? 0, min: s?.cold_minutes ?? 10 })}</div>`}
    </div>`;
  }
  _travelDetail() {
    const e = this.hass, t = this.d.shift.travel, s = (i) => this._sub("shift", { travel: { ...t, ...i } });
    return o`<div class="tile" style="display:flex;flex-direction:column;gap:10px">
      ${this._picker(["sensor"], t.sensor, (i) => s({ sensor: i || null }), { label: a(e, "travel_sensor"), units: ["min", "minutes"] })}
      <div class="grid2">
        <label class="field">${a(e, "travel_usual")}
          <input class="inp" type="number" min="0" max="240" .value=${String(t.usual)}
            @change=${(i) => s({ usual: $(Number(i.target.value), 0, 240) })} /></label>
        <label class="field">${a(e, "travel_routine")}
          <input class="inp" type="number" min="0" max="240" .value=${String(t.routine)}
            @change=${(i) => s({ routine: $(Number(i.target.value), 0, 240) })} /></label>
        <label class="field">${a(e, "travel_arrive")}
          <input class="inp" type="time" .value=${t.arrive_by ?? ""}
            @change=${(i) => s({ arrive_by: i.target.value || null })} /></label>
      </div>
      <div class="muted">${t.arrive_by ? a(e, "travel_arrive_hint") : a(e, "travel_usual_hint")}</div>
    </div>`;
  }
  // ----------------------------------------------------------------- light
  _effectiveSettings() {
    const e = this._profile(this.d.light.profile);
    return e && !this._unlocked ? e.settings : this.d.light.settings;
  }
  _lightSection() {
    const e = this.hass, t = this.d, s = this._lights, i = this._profile(t.light.profile), n = s.length ? `${a(e, "n_lights", { n: s.length })} · ${i && !this._unlocked ? i.name : a(e, `curve_${this._effectiveSettings().curve}`)}` : a(e, "no_lights");
    return this._section("light", a(e, "section_light"), n, () => o`${this._lightBody()}
      <div class="divider"></div>
      ${this._testRun(["light", "audio"], "light")}`);
  }
  _lightBody() {
    const e = this.hass, t = this.d, s = this._lights, i = this._profile(t.light.profile), n = !!i && !this._unlocked, r = this._effectiveSettings(), d = s.filter((_) => Cs(e?.states[_]?.attributes.supported_color_modes).color), c = s.filter((_) => !d.includes(_)), h = M(k(this._wakeTime) - t.light_lead), m = (_) => t.light.overrides.some((g) => g.target.entity_id?.length === 1 && g.target.entity_id[0] === _), u = s.length > 1 && s.every(m);
    return o`
      <div class="lbl">${a(e, "targets")}</div>
      ${this._picker(["light"], s, (_) => this._sub("light", { targets: { entity_id: _ ?? [] } }), {
      multiple: !0,
      areaPick: !0,
      label: a(e, "targets_hint")
    })}
      ${s.length ? p : o`<div class="muted">${a(e, "no_lights")}</div>`}
      <div class="divider"></div>
      ${u ? o`<div class="muted">${a(e, "all_own_settings")}</div>` : o`<div class="lbl">${this._simple ? a(e, "light_settings") : a(e, "light_common")}</div>
      ${!this._simple || i ? this._profileRow(i) : p}
      <db-light-settings
        .hass=${e}
        .settings=${r}
        .mode=${this.mode}
        .locked=${n}
        .duration=${t.light_lead}
        .start=${h}
        .colorLamps=${d.map((_) => P(e, _))}
        .plainLamps=${c.map((_) => P(e, _))}
        .showFine=${t.kind === "wake"}
        @settings-change=${(_) => this._sub("light", { settings: _.detail })}
      ></db-light-settings>`}
      ${(this._has("overrides") || u) && s.length > 1 ? this._overrides(s, h) : p}
    `;
  }
  _profileRow(e) {
    const t = this.hass, s = this.d;
    return this._unlocked ? o`<div class="lock">
        <span>${a(t, "profile_new")}</span>
        <input class="inp grow" .value=${this._newProfileName} placeholder=${a(t, "profile_name_required")}
          @input=${(i) => this._newProfileName = i.target.value} />
        <button class="btn" @click=${() => {
      this._unlocked = !1, this._newProfileName = "";
    }}>${a(t, "discard")}</button>
      </div>` : o`<div class="lock">
      ${e ? o`<span class="grow">${a(t, "profile_locked", { name: e.name })}</span>` : o`<span class="grow">${a(t, "profile_own")}</span>`}
      <select class="inp" @change=${(i) => {
      const n = i.target.value || null, r = this._profile(n);
      this._patch({
        light: { ...s.light, profile: n, settings: r ? structuredClone(r.settings) : s.light.settings },
        light_lead: r && this._simple ? r.duration : s.light_lead
      });
    }}>
        <option value="" ?selected=${!e}>${a(t, "profile_none")}</option>
        ${this.lightProfiles.map((i) => o`<option value=${i.id} ?selected=${i.id === s.light.profile}>${i.name}</option>`)}
      </select>
      ${e ? o`<button class="btn" @click=${() => {
      this._unlocked = !0, this._newProfileName = a(t, "profile_copy_name", { name: e.name }), this._sub("light", { settings: structuredClone(e.settings) });
    }}>${a(t, "customize")}</button>` : p}
    </div>`;
  }
  /** Settings a lamp runs with: its override (or that override's profile), else the common ones. */
  _lampSettings(e) {
    const t = this.d.light.overrides.find((s) => s.target.entity_id?.length === 1 && s.target.entity_id[0] === e);
    return t ? this._profile(t.profile)?.settings ?? t.settings : this._effectiveSettings();
  }
  _lampStarts() {
    const e = this.hass;
    return this._lights.map((t) => ({
      entity: t,
      name: P(e, t),
      before: this.d.light.starts[t] ?? this.d.light_lead,
      gradient: le(this._lampSettings(t))
    }));
  }
  _overrides(e, t) {
    const s = this.hass, i = this.d, n = i.light.overrides, r = (c) => n.findIndex((h) => h.target.entity_id?.length === 1 && h.target.entity_id[0] === c), d = (c) => this._sub("light", { overrides: c });
    return o`<div class="divider"></div>
      <div class="lbl">${a(s, "per_target")}</div>
      <div class="muted">${a(s, "per_target_hint")}</div>
      ${e.map((c) => {
      const h = r(c), m = h >= 0 ? n[h] : void 0, u = this._overrideOpen === e.indexOf(c), _ = Cs(s?.states[c]?.attributes.supported_color_modes), g = m ? this._profile(m.profile) : void 0;
      return o`<div class="tile" style="display:flex;flex-direction:column;gap:10px">
          <button class="t row" style="border:none;background:none;cursor:pointer;padding:0;text-align:left"
            aria-expanded=${u} @click=${() => this._overrideOpen = u ? -1 : e.indexOf(c)}>
            <b class="grow">${P(s, c)}</b>
            <span class="badge">${m ? g ? g.name : a(s, "own_settings") : a(s, "uses_common")}</span>
          </button>
          ${u ? o`<div class="row">
                  <label class="row"><input type="checkbox" .checked=${!!m}
                    @change=${(v) => d(
        v.target.checked ? [...n, { target: { entity_id: [c] }, profile: null, settings: structuredClone(this._effectiveSettings()) }] : n.filter((E, x) => x !== h)
      )} />${a(s, "use_own")}</label>
                  ${m ? o`<select class="inp" @change=${(v) => {
        const E = v.target.value || null, x = structuredClone(n);
        x[h] = { ...x[h], profile: E }, d(x);
      }}>
                        <option value="" ?selected=${!m.profile}>${a(s, "profile_none")}</option>
                        ${this.lightProfiles.map((v) => o`<option value=${v.id} ?selected=${v.id === m.profile}>${v.name}</option>`)}
                      </select>` : p}
                </div>
                ${m ? o`<db-light-settings .hass=${s} .settings=${g ? g.settings : m.settings} .mode=${this.mode} .locked=${!!g}
                      .duration=${i.light_lead} .start=${t}
                      .colorLamps=${_.color ? [P(s, c)] : []}
                      .plainLamps=${_.color ? [] : [P(s, c)]}
                      .showFine=${i.kind === "wake"}
                      @settings-change=${(v) => {
        const E = structuredClone(n);
        E[h] = { ...E[h], settings: v.detail }, d(E);
      }}></db-light-settings>` : p}` : p}
        </div>`;
    })}`;
  }
  // ---------------------------------------------------------------- others
  _audioSection() {
    const e = this.hass, t = this.d.audio, s = t.enabled && t.players.length ? [t.source.name || t.source.media_id || t.source.url || a(e, "src_none"), t.tts.enabled ? a(e, "tts_short") : ""].filter(Boolean).join(" · ") : a(e, "off"), i = (n) => this._sub("audio", n);
    return this._section("audio", a(e, "section_audio"), s, () => o`
      <div class="row">
        <div class="grow"><div>${a(e, "audio_on")}</div><div class="muted">${a(e, "audio_on_d")}</div></div>
        ${this._toggle(t.enabled, (n) => i({ enabled: n }), a(e, "audio_on"))}
      </div>
      ${t.enabled ? o`
            ${this._picker(["media_player"], t.players, (n) => i({ players: n ?? [] }), {
      multiple: !0,
      label: a(e, "audio_players")
    })}
            <div class="lbl">${a(e, "audio_what")}</div>
            <db-audio-source .hass=${e} .source=${t.source} .hasMusicAssistant=${this._phones?.music_assistant ?? !0}
              @source-change=${(n) => i({ source: n.detail })}></db-audio-source>
            <div class="lbl">${a(e, "audio_volume")}</div>
            <db-audio-line .hass=${e} .time=${this._wakeTime} .lead=${t.lead} .ramp=${t.ramp} .volume=${t.volume} .curve=${t.curve ?? []}
              .simple=${this._simple} @audio-change=${(n) => i(n.detail)}></db-audio-line>
            ${this._has("tts", t.tts.enabled) ? o`<div class="lbl">${a(e, "tts_title")}</div>
                  <div class="row">
                    <div class="grow"><div>${a(e, "tts_on")}</div><div class="muted">${a(e, "tts_on_d")}</div></div>
                    ${this._toggle(t.tts.enabled, (n) => i({ tts: { ...t.tts, enabled: n } }), a(e, "tts_on"))}
                  </div>
                  ${t.tts.enabled ? o`<textarea class="inp" rows="3" style="height:auto;padding:8px 10px"
                          placeholder=${a(e, "tts_ph")} .value=${t.tts.message}
                          @change=${(n) => i({ tts: { ...t.tts, message: n.target.value } })}></textarea>
                        <div class="muted">${a(e, "tts_vars")}</div>
                        ${this._expert ? o`<label class="row"><span>${a(e, "tts_engine")}</span>
                              <select class="inp" @change=${(n) => i({ tts: { ...t.tts, engine: n.target.value || null } })}>
                                <option value="">${a(e, "tts_auto")}</option>
                                ${(this._phones?.tts ?? []).map((n) => o`<option value=${n} ?selected=${t.tts.engine === n}>${P(e, n)}</option>`)}
                              </select></label>` : p}` : p}` : p}
            ${this._simple ? o`<div class="muted">${a(e, "audio_button_hint")}</div>` : o`<div class="lbl">${a(e, "audio_behaviour")}</div>
                  <label class="row"><input type="checkbox" .checked=${t.button}
                    @change=${(n) => i({ button: n.target.checked })} />${a(e, "audio_button")}</label>
                  <label class="row"><input type="checkbox" .checked=${t.pause_on_snooze}
                    @change=${(n) => i({ pause_on_snooze: n.target.checked })} />${a(e, "audio_pause")}</label>
                  <label class="row"><input type="checkbox" .checked=${t.restore_volume}
                    @change=${(n) => i({ restore_volume: n.target.checked })} />${a(e, "audio_restore")}</label>`}
            <div class="divider"></div>
            ${this._testRun(["audio"], "ring")}
          ` : p}
    `);
  }
  /** Test area: run the current settings in time lapse. */
  _testRun(e, t) {
    return o`<db-test-run .hass=${this.hass} .alarmId=${this.alarmId} .draft=${this.d}
      .runtime=${this.runtime} .parts=${e} .start=${t} .wakeTime=${this._wakeTime}></db-test-run>`;
  }
  /** Settings the climate runs with: its profile's, else its own. */
  get _climateSettings() {
    const e = this.d.climate ?? Bt();
    return this.climateProfiles.find((t) => t.id === e.profile)?.settings ?? e.settings;
  }
  /** Minutes before the alarm the climate starts (planned by the backend if known). */
  get _climateLead() {
    const e = this.d.climate;
    if (!e?.enabled || !e.devices.length) return -1;
    const t = this._climateSettings;
    if (t.start === "fixed") return t.lead;
    const s = this.runtime;
    return s?.climate_at && s.next_alarm ? Math.max(0, Math.round((Date.parse(s.next_alarm) - Date.parse(s.climate_at)) / 6e4)) : t.max_lead;
  }
  _climateSection() {
    const e = this.hass, t = this.d.climate ?? Bt(), s = (_) => this._sub("climate", _), i = this.climateProfiles.find((_) => _.id === t.profile), n = this._climateSettings, r = [...new Set(t.devices.map((_) => _.split(".")[0]))], d = ["heat", "cool", "heat_cool", "auto"].includes(n.mode) && r.includes("climate") ? ` ${n.temperature} °C` : "", c = this._climateLead, h = c >= 0 ? a(e, "cl_planned", { time: y(e, M(k(this._wakeTime) - c)) }) : "", m = t.enabled && t.devices.length ? [
      `${a(e, `clm_${n.mode}`)}${d}`,
      i?.name,
      this.runtime?.climate_active ? a(e, "cl_active") : h
    ].filter(Boolean).join(" · ") : a(e, "off"), u = !this.d.presence.entities.length;
    return this._section("climate", a(e, "section_climate"), m, () => o`
      <div class="row">
        <div class="grow"><div>${a(e, "cl_on")}</div><div class="muted">${a(e, "cl_on_d")}</div></div>
        ${this._toggle(t.enabled, (_) => s({ enabled: _ }), a(e, "cl_on"))}
      </div>
      ${t.enabled ? o`
            ${this._picker(fi, t.devices, (_) => s({ devices: _ ?? [] }), {
      multiple: !0,
      areaPick: !0,
      label: a(e, "cl_devices")
    })}
            <div class="muted">${a(e, "cl_devices_hint")}</div>
            <div class="divider"></div>
            <div class="lbl">${a(e, "cl_settings")}</div>
            <div class="lock">
              <span class="grow">${i ? a(e, "profile_locked", { name: i.name }) : a(e, "profile_own")}</span>
              <select class="inp" @change=${(_) => s({ profile: _.target.value || null })}>
                <option value="" ?selected=${!i}>${a(e, "profile_none")}</option>
                ${this.climateProfiles.map((_) => o`<option value=${_.id} ?selected=${_.id === t.profile}>${_.name}</option>`)}
              </select>
              ${i ? o`<button class="btn" @click=${() => s({ profile: null, settings: structuredClone(i.settings) })}>${a(e, "customize")}</button>` : p}
            </div>
            <db-climate-settings .hass=${e} .settings=${n} .domains=${r} .locked=${!!i}
              .samples=${this.runtime?.climate_samples ?? -1}
              @climate-change=${(_) => s({ settings: _.detail })}></db-climate-settings>
            <div class="divider"></div>
            <div class="lbl">${a(e, "section_cond")}</div>
            ${this._picker(["sensor"], t.room_sensor, (_) => s({ room_sensor: _ || null }), {
      label: a(e, "cl_room"),
      deviceClass: "temperature"
    })}
            <div class="muted">${a(e, "cl_room_hint")}</div>
            ${this._picker(["binary_sensor"], t.windows, (_) => s({ windows: _ ?? [] }), {
      multiple: !0,
      areaPick: !0,
      label: a(e, "cl_windows")
    })}
            <div class="muted">${a(e, "cl_windows_hint")}</div>
            <label class="row"><input type="checkbox" .checked=${t.presence}
              @change=${(_) => s({ presence: _.target.checked })} />${a(e, "cl_presence")}</label>
            ${t.presence && u ? o`<div class="muted">${a(e, "cl_presence_none")}</div>` : p}
          ` : p}
    `);
  }
  _pushSection() {
    const e = this.hass, t = this.d.push, s = this._phones, i = [...new Set(this.d.owners.flatMap((h) => s?.persons[h] ?? []))], n = [.../* @__PURE__ */ new Set([...t.owners ? i : [], ...t.targets])], r = (h) => this._sub("push", h), d = (h) => h.replace(/^mobile_app_/, "").replace(/_/g, " "), c = t.enabled ? n.length ? n.map(d).join(", ") : a(e, "push_no_device") : a(e, "off");
    return this._section("push", a(e, "section_push"), c, () => o`
      <div class="row">
        <div class="grow"><div>${a(e, "push_on")}</div><div class="muted">${a(e, "push_on_d")}</div></div>
        ${this._toggle(t.enabled, (h) => r({ enabled: h }), a(e, "push_on"))}
      </div>
      ${t.enabled ? o`<label class="row"><input type="checkbox" .checked=${t.owners}
              @change=${(h) => r({ owners: h.target.checked })} />
              ${a(e, "push_owners")}</label>
            <div class="muted">
              ${this.d.owners.length ? i.length ? a(e, "push_found", { devices: i.map(d).join(", ") }) : a(e, "push_none_found") : a(e, "push_no_owner")}
            </div>
            <div class="lbl">${a(e, "push_more")}</div>
            ${s && !s.services.length ? o`<div class="muted">${a(e, "push_no_apps")}</div>` : p}
            <div class="row">
              ${(s?.services ?? []).map(
      (h) => o`<button class="chip" aria-pressed=${t.targets.includes(h)}
                  ?disabled=${t.owners && i.includes(h)}
                  @click=${() => r({ targets: t.targets.includes(h) ? t.targets.filter((m) => m !== h) : [...t.targets, h] })}>
                  ${d(h)}</button>`
    )}
            </div>
            ${this.d.last_call.enabled ? o`<div class="tile row">
                  <div class="grow"><div>${a(e, "push_critical")}</div><div class="muted">${a(e, "push_critical_d")}</div></div>
                  ${this._toggle(t.critical_last_call, (h) => r({ critical_last_call: h }), a(e, "push_critical"))}
                </div>` : p}` : p}
    `);
  }
  _actionsSection() {
    const e = this.hass, t = this.d.actions, s = Ct.reduce((i, n) => i + t[n].length, 0);
    return this._section(
      "act",
      a(e, "section_actions"),
      s ? a(e, "n_actions", { n: s }) : a(e, "optional"),
      () => o`<div class="seg" role="group">
          ${Ct.map(
        (i) => o`<button aria-pressed=${this._phase === i} @click=${() => this._phase = i}>
              ${a(e, `phase_${i}`)}${t[i].length ? ` (${t[i].length})` : ""}
            </button>`
      )}
        </div>
        <div class="muted">${a(e, `phase_${this._phase}_hint`)}</div>
        ${this._selector(
        { action: {} },
        t[this._phase],
        (i) => this._patch({ actions: { ...t, [this._phase]: i ?? [] } })
      )}`
    );
  }
  _noneSection() {
    const e = this.hass, t = this.d, s = t.last_call, i = this._snoozeMinutes, n = this._snoozeCount, r = this._wakeTime, d = M(k(r) + i * n), c = this.lastCallProfiles.find((u) => u.id === s.profile) ?? this.lastCallProfiles[0], h = s.enabled ? a(e, "lc_summary", { time: y(e, d), name: c?.name ?? "" }) : a(e, "lc_stop_at", { time: y(e, d) }), m = [
      { title: a(e, "ladder_ring"), time: y(e, r), desc: a(e, "ladder_ring_d"), on: !0 },
      {
        title: a(e, "ladder_snooze", { n, m: i }),
        time: `${y(e, r)} – ${y(e, d)}`,
        desc: a(e, "ladder_snooze_d"),
        on: !0
      },
      s.enabled ? {
        title: a(e, "ladder_last_call"),
        time: `${y(e, d)} – ${y(e, M(k(d) + this._lcDuration))}`,
        desc: a(e, "ladder_last_call_d", { name: c?.name ?? "" }),
        on: !0
      } : { title: a(e, "ladder_stop"), time: y(e, d), desc: a(e, "ladder_stop_d"), on: !0 }
    ];
    return this._section("none", a(e, "section_none"), h, () => o`
      <div class="row">
        <div class="muted grow">${a(e, "none_hint")}</div>
        <span>${a(e, "last_call")}</span>
        ${this._toggle(s.enabled, (u) => this._sub("last_call", { enabled: u }), a(e, "last_call"))}
      </div>
      <div class="ladder">
        ${m.map(
      (u, _) => o`<div class="step ${u.on ? "" : "off"}">
            <div class="n"><span>${_ + 1}</span>${_ < m.length - 1 ? o`<i></i>` : p}</div>
            <div class="c">
              <div class="row"><b class="grow">${u.title}</b><span class="tabular muted">${u.time}</span></div>
              <div class="muted">${u.desc}</div>
            </div>
          </div>`
    )}
      </div>
      <label class="row">
        <span>${s.enabled ? a(e, "lc_at") : a(e, "stop_at")}</span>
        <input class="inp time" type="time" .value=${d} @change=${(u) => {
      let _ = k(u.target.value) - k(r);
      _ < -720 && (_ += 1440), this._sub("snooze", { count: $(Math.round(_ / i), 1, 10) });
    }} />
        <span class="muted">${a(e, "lc_snap", { n })}</span>
      </label>
      ${s.enabled ? o`<div class="lcp">
              ${this.lastCallProfiles.map(
      (u) => o`<button class="pick" aria-pressed=${u.id === s.profile} @click=${() => this._sub("last_call", { profile: u.id })}>
                  <b>${u.name}</b>
                  <span class="muted">${a(e, "lc_profile_desc", { min: u.duration, bri: Math.round(u.brightness) })}</span>
                </button>`
    )}
            </div>
            <div><button class="btn" @click=${() => S(this, "daybreak-tab", { tab: "last_call" })}>${a(e, "profiles_manage")}</button></div>` : p}
      <div class="tile row">
        <div class="grow"><div>${a(e, "stop_on_light_off")}</div><div class="muted">${a(e, "stop_on_light_off_d")}</div></div>
        ${this._toggle(t.stop_on_light_off, (u) => this._patch({ stop_on_light_off: u }), a(e, "stop_on_light_off"))}
      </div>
    `);
  }
  _notifyTargets() {
    return Object.keys(this.hass?.states ?? {}).filter((e) => e.startsWith("notify."));
  }
  _fallbackSection() {
    const e = this.hass, t = this.d.fallback, s = this._lights, i = t.notify ?? this.settings?.notify ?? null, n = [
      Object.keys(t.lights).length ? a(e, "fb_n_spare", { n: Object.keys(t.lights).length }) : "",
      i ? P(e, i) : ""
    ].filter(Boolean).join(" · "), r = (h) => this._sub("fallback", h), d = o`<div class="field">
      ${a(e, "fb_notify")}
      <input class="inp" list="db-notify" .value=${t.notify ?? ""} placeholder=${this.settings?.notify ?? a(e, "fb_notify_ph")}
        @change=${(h) => r({ notify: h.target.value.trim() || null })} />
      <datalist id="db-notify">${this._notifyTargets().map((h) => o`<option value=${h}>${P(e, h)}</option>`)}</datalist>
    </div>`, c = (h) => {
      const m = h ? t.lights[h] ?? "" : Object.values(t.lights)[0] ?? "";
      return this._picker(["light"], m || null, (u) => {
        const _ = { ...t.lights };
        for (const g of h ? [h] : s)
          u ? _[g] = u : delete _[g];
        r({ lights: _ });
      }, { label: h ? P(e, h) : a(e, "fb_spare") });
    };
    return this._section(
      "fb",
      a(e, "section_fb"),
      n || a(e, "none"),
      () => this._simple ? o`<div class="muted">${a(e, "fb_spare_hint")}</div>${c(null)}${d}` : o`<div class="lbl">${a(e, "fb_spare")}</div>
            <div class="muted">${a(e, "fb_spare_hint")}</div>
            ${s.length ? s.map((h) => c(h)) : o`<div class="muted">${a(e, "no_lights")}</div>`}
            <div class="lbl">${a(e, "fb_notifications")}</div>
            ${d}
            <div class="notify">
              ${ka.map(
        (h) => o`<span>${a(e, `ev_${h}`)}</span>
                  <input type="checkbox" .checked=${t.events.includes(h)}
                    @change=${(m) => r({
          events: m.target.checked ? [...t.events, h] : t.events.filter((u) => u !== h)
        })} />`
      )}
            </div>
            <label class="row"><input type="checkbox" .checked=${t.persistent}
              @change=${(h) => r({ persistent: h.target.checked })} />${a(e, "fb_persistent")}</label>`
    );
  }
  render() {
    if (!this._draft) return p;
    const e = this.d.kind;
    return o`
      ${this._header()}
      <div class="body">
        <div class="muted">${a(this.hass, `mode_${this.mode}_hint`)}</div>
        ${this._head()}
        ${this._timeSection()}
        ${(e === "wake" || !this._simple) && this._has("conditions") ? this._condSection() : p}
        ${this._has("calendar", !!this.d.calendar?.enabled) ? this._calendarSection() : p}
        ${this._lightSection()}
        ${e === "wake" && this._has("audio", this.d.audio.enabled) ? this._audioSection() : p}
        ${e === "wake" && this._has("climate", !!this.d.climate?.enabled) ? this._climateSection() : p}
        ${e === "wake" && this._has("push", this.d.push.enabled) ? this._pushSection() : p}
        ${this._has("actions", Ct.some((t) => this.d.actions[t].length)) ? this._actionsSection() : p}
        ${this._has("none") && e === "wake" ? this._noneSection() : p}
        ${this._has("fallback") ? this._fallbackSection() : p}
      </div>
    `;
  }
};
ds.styles = [
  O,
  T`
      :host {
        display: block;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 3;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        padding: 10px 0 12px;
        background: var(--primary-background-color, #111);
      }
      .body {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding-bottom: 40px;
      }
      section.card {
        overflow: hidden;
      }
      .sh {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 18px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
        min-height: 56px;
      }
      .sh b {
        font-size: 16px;
      }
      .sh .sum {
        margin-left: auto;
        color: var(--db-muted);
        font-size: 13px;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 60%;
      }
      .sh .chev {
        color: var(--db-muted);
        transition: transform 0.15s;
      }
      .sh[aria-expanded="true"] .chev {
        transform: rotate(90deg);
      }
      .badge {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--db-tile);
        color: var(--db-muted);
      }
      .sb {
        padding: 0 18px 18px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .head {
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .name {
        font-size: 20px;
        height: 46px;
        width: 100%;
      }
      .avatar {
        width: 26px;
        height: 26px;
        border-radius: 13px;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--db-accent) 30%, transparent);
        font-size: 12px;
        font-weight: 700;
        flex: none;
        overflow: hidden;
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .divider {
        height: 1px;
        background: var(--db-line);
      }
      .days button {
        width: 46px;
        height: 46px;
        padding: 0;
        border-radius: 23px;
        justify-content: center;
      }
      .weeks {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 8px;
      }
      .wtile {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--db-line);
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .wtile[aria-pressed="true"] {
        border-color: var(--db-accent);
        background: color-mix(in srgb, var(--db-accent) 14%, transparent);
      }
      .pattern {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
        gap: 6px;
      }
      .cal {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
        text-align: center;
        font-size: 12px;
      }
      .cal span {
        padding: 6px 0;
        border-radius: 8px;
      }
      .cal .on {
        background: color-mix(in srgb, var(--db-accent) 35%, transparent);
        font-weight: 600;
      }
      .cal .skip {
        text-decoration: line-through;
        color: var(--db-muted);
      }
      .cal .head {
        color: var(--db-muted);
        padding: 0;
      }
      .rules {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 8px;
      }
      .rule {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--db-line);
      }
      .rule.open {
        border-color: var(--db-accent);
      }
      .rule button.t {
        flex: 1;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        padding: 0;
        display: flex;
        flex-direction: column;
      }
      .bar-dot {
        width: 12px;
        height: 12px;
        border-radius: 6px;
        flex: none;
      }
      .grid2 {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 10px;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: var(--db-muted);
      }
      .field .inp {
        width: 100%;
      }
      .cond {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 10px;
        background: var(--db-bg);
      }
      .ladder {
        display: flex;
        flex-direction: column;
      }
      .step {
        display: flex;
        gap: 12px;
      }
      .step .n {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .step .n span {
        width: 28px;
        height: 28px;
        border-radius: 14px;
        display: grid;
        place-items: center;
        background: var(--db-tile);
        font-weight: 700;
        font-size: 13px;
      }
      .step .n i {
        flex: 1;
        width: 2px;
        background: var(--db-line);
        min-height: 14px;
      }
      .step .c {
        padding-bottom: 14px;
        flex: 1;
      }
      .step.off {
        opacity: 0.5;
      }
      .lcp {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 8px;
      }
      .pick {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        padding: 12px;
        border-radius: 12px;
        border: 1px solid var(--db-line);
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .pick[aria-pressed="true"] {
        border-color: var(--db-accent);
        background: color-mix(in srgb, var(--db-accent) 12%, transparent);
      }
      .lock {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--db-tile);
      }
      .lamp {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 999px;
        background: var(--db-tile);
        font-size: 13px;
      }
      .cap {
        font-size: 10px;
        padding: 1px 6px;
        border-radius: 6px;
        background: var(--db-bg);
        color: var(--db-muted);
      }
      .notify {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 6px 16px;
        align-items: center;
      }
      .soon {
        opacity: 0.75;
      }
      ha-selector {
        display: block;
      }
      @media (max-width: 600px) {
        .sb {
          padding: 0 12px 14px;
        }
        .sh {
          padding: 14px 12px;
        }
        .head {
          padding: 14px 12px;
        }
      }
    `
];
let A = ds;
W([
  f({ attribute: !1 })
], A.prototype, "hass");
W([
  f({ attribute: !1 })
], A.prototype, "alarm");
W([
  f({ attribute: !1 })
], A.prototype, "alarmId");
W([
  f({ attribute: !1 })
], A.prototype, "settings");
W([
  f({ attribute: !1 })
], A.prototype, "lightProfiles");
W([
  f({ attribute: !1 })
], A.prototype, "lastCallProfiles");
W([
  f({ attribute: !1 })
], A.prototype, "climateProfiles");
W([
  f({ attribute: !1 })
], A.prototype, "runtime");
W([
  f({ attribute: !1 })
], A.prototype, "holidayEntity");
W([
  f({ attribute: !1 })
], A.prototype, "alarms");
W([
  f()
], A.prototype, "mode");
W([
  f({ type: Boolean })
], A.prototype, "isNew");
W([
  f({ type: Boolean })
], A.prototype, "saving");
W([
  f({ type: Boolean })
], A.prototype, "narrow");
W([
  b()
], A.prototype, "_draft");
W([
  b()
], A.prototype, "_open");
W([
  b()
], A.prototype, "_ownerPick");
W([
  b()
], A.prototype, "_morePresence");
W([
  b()
], A.prototype, "_phase");
W([
  b()
], A.prototype, "_unlocked");
W([
  b()
], A.prototype, "_newProfileName");
W([
  b()
], A.prototype, "_sun");
W([
  b()
], A.prototype, "_overrideOpen");
W([
  b()
], A.prototype, "_phones");
W([
  b()
], A.prototype, "_calPreview");
W([
  b()
], A.prototype, "_calLoading");
H("daybreak-alarm-editor", A);
var Sa = Object.defineProperty, pe = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && Sa(e, t, i), i;
};
const cs = class cs extends L {
  constructor() {
    super(...arguments), this.mode = "normal", this._sel = "natural", this._confirmed = !1, this._previewLight = "", this._previewAt = 1;
  }
  get _profiles() {
    return this.snapshot?.light_profiles ?? [];
  }
  _users(e) {
    return (this.snapshot?.alarms ?? []).filter(
      (t) => t.light.profile === e || t.light.overrides.some((s) => s.profile === e)
    );
  }
  _shared(e) {
    return new Set(this._users(e).filter((s) => s.owners.length).map((s) => [...s.owners].sort().join())).size > 1;
  }
  _error(e) {
    S(this, "hass-notification", { message: me(this.hass, e) });
  }
  _startEdit(e, t) {
    const s = this.hass, i = structuredClone(e);
    t && (delete i.id, delete i.builtin, i.name = a(s, "profile_copy_name", { name: e.name })), this._edit = i, this._confirmed = !1;
  }
  _new() {
    this._edit = { id: "", name: a(this.hass, "profile_new_name"), duration: 30, settings: si() }, this._confirmed = !1;
  }
  async _save() {
    const e = this.hass, t = this._edit;
    if (!e || !t) return;
    if (!t.name.trim()) {
      this._error(new Error(a(e, "profile_name_required")));
      return;
    }
    const s = { ...t };
    s.id || delete s.id;
    try {
      const i = await Me(e, "light", s, this._confirmed);
      this._sel = i.id, this._edit = void 0;
    } catch (i) {
      this._error(i);
    }
  }
  async _delete(e) {
    if (!(!this.hass || !confirm(a(this.hass, "profile_delete_confirm", { name: e.name }))))
      try {
        await Ht(this.hass, "light", e.id), this._sel = "natural", this._edit = void 0;
      } catch (t) {
        this._error(t);
      }
  }
  render() {
    const e = this.hass, t = this._profiles.filter((n) => n.builtin), s = this._profiles.filter((n) => !n.builtin), i = (n) => o`<button class="item" aria-current=${!this._edit && this._sel === n.id}
      @click=${() => {
      this._sel = n.id, this._edit = void 0;
    }}>
      <i style="background:${le(n.settings)}"></i>
      <span><b>${n.name}</b><span class="muted">${a(e, `curve_${n.settings.curve}`)} · ${n.duration} min</span></span>
    </button>`;
    return o`<p class="muted" style="margin:0">${a(e, "profiles_intro")}</p>
      <div class="wrap">
        <aside class="card">
          <button class="btn primary" @click=${this._new}>+ ${a(e, "profile_new_btn")}</button>
          <div class="lbl" style="margin-top:8px">${a(e, "templates")}</div>
          ${t.map(i)}
          <div class="lbl" style="margin-top:8px">${a(e, "own_profiles")}</div>
          ${s.length ? s.map(i) : o`<span class="muted">${a(e, "none")}</span>`}
        </aside>
        <main class="card">${this._edit ? this._editor() : this._detail()}</main>
      </div>`;
  }
  _detail() {
    const e = this.hass, t = this._profiles.find((h) => h.id === this._sel) ?? this._profiles[0];
    if (!t) return p;
    const s = t.settings, i = this._users(t.id), n = this._shared(t.id), d = Ye(s, "bri").map(([h], m) => {
      const u = Je(s, h);
      return {
        n: m + 1,
        pct: Math.round(h * 100),
        min: Math.round(h * t.duration),
        bri: Math.round(u.bri),
        ct: (() => {
          const _ = Je(s, h, { ct: !0, color: !1 }).kelvin;
          return _ ? `${Math.round(_ / 10) * 10} K` : "–";
        })(),
        css: Zt(u, !1)
      };
    }), c = [
      ["duration", `${t.duration} min`],
      ["curve", a(e, `curve_${s.curve}`)],
      ["ls_brightness", `${Math.round(s.brightness[0])} → ${Math.round(s.brightness[1])} %`],
      s.color_mode === "ct" ? ["ls_ct", `${s.kelvin[0]} → ${s.kelvin[1]} K`] : ["ls_color", a(e, `colors_${s.colors}`)],
      ["fine_ringing", a(e, `ringing_${s.ringing}`)],
      ["fine_after", a(e, `after_stop_${s.after_stop}`)]
    ];
    return o`
      <div class="row">
        <h2 class="grow">${t.name}</h2>
        ${t.builtin ? o`<span class="chip">${a(e, "template_ro")}</span>` : p}
        ${t.builtin || n ? o`<button class="btn" @click=${() => this._startEdit(t, !0)}>${a(e, "edit_copy")}</button>` : o`<button class="btn" @click=${() => this._startEdit(t, !1)}>${a(e, "edit")}</button>`}
        ${!t.builtin && !i.length ? o`<button class="btn danger" @click=${() => this._delete(t)}>${a(e, "delete")}</button>` : p}
      </div>
      ${n ? o`<div class="warn">${a(e, "profile_shared_hint")}</div>` : p}
      <div class="ramp" style="background:${le(s)}"></div>
      <div class="facts">${c.map(([h, m]) => o`<div><span class="muted">${a(e, h)}</span><b>${m}</b></div>`)}</div>
      <div class="lbl">${a(e, "curve_points")}</div>
      <table>
        <thead><tr><th>#</th><th>${a(e, "ls_share")}</th><th>${a(e, "minute")}</th><th>${a(e, "ls_brightness")}</th>
          <th>${a(e, "ls_ct")}</th><th>${a(e, "ls_color")}</th></tr></thead>
        <tbody>${d.map(
      (h) => o`<tr><td>${h.n}</td><td>${h.pct} %</td><td>${h.min}</td><td>${h.bri} %</td><td>${h.ct}</td>
            <td><span class="sw" style="background:${h.css}"></span></td></tr>`
    )}</tbody>
      </table>
      <div class="muted">
        ${a(e, "used_by")}: ${i.length ? i.map((h) => h.name).join(", ") : a(e, "nobody")}
      </div>
    `;
  }
  _editor() {
    const e = this.hass, t = this._edit, s = this._editMode ?? this.mode, i = t.id ? this._users(t.id) : [], n = t.id ? this._shared(t.id) : !1, r = Object.keys(e?.states ?? {}).filter((c) => c.startsWith("light.")), d = i.length > 1;
    return o`
      <div class="row">
        <input class="inp name" .value=${t.name} aria-label=${a(e, "f_name")}
          @input=${(c) => this._edit = { ...t, name: c.target.value }} />
        <div class="seg" role="group">
          ${["simple", "normal", "expert"].map(
      (c) => o`<button aria-pressed=${s === c} @click=${() => this._editMode = c}>${a(e, `mode_${c}`)}</button>`
    )}
        </div>
      </div>
      ${n ? o`<div class="warn"><span class="grow">${a(e, "profile_shared_hint")}</span>
            <button class="btn" @click=${() => this._startEdit(t, !0)}>${a(e, "edit_copy")}</button></div>` : p}
      ${!n && i.length ? o`<label class="warn">
            ${d ? o`<input type="checkbox" .checked=${this._confirmed} @change=${(c) => this._confirmed = c.target.checked} />` : p}
            <span>${a(e, "profile_in_use_hint", { n: i.length, names: i.map((c) => c.name).join(", ") })}</span>
          </label>` : p}
      <label class="row">
        <span>${a(e, "duration")}</span>
        <input class="inp num" type="number" min="0" max="240" .value=${String(t.duration)}
          @change=${(c) => this._edit = { ...t, duration: Number(c.target.value) || 0 }} />
        <span>min</span>
        <span class="muted">${a(e, "profile_duration_hint")}</span>
      </label>
      <db-light-settings .hass=${e} .settings=${t.settings} .mode=${s} .duration=${t.duration || 30} .start=${"06:00"}
        .locked=${n}
        @settings-change=${(c) => this._edit = { ...t, settings: c.detail }}></db-light-settings>
      ${e?.user?.is_admin ? o`<div class="tile row">
            <span>${a(e, "preview_on")}</span>
            <select class="inp" @change=${(c) => this._previewLight = c.target.value}>
              <option value="">–</option>
              ${r.map((c) => o`<option value=${c} ?selected=${c === this._previewLight}>${e.states[c].attributes.friendly_name ?? c}</option>`)}
            </select>
            <input class="grow" type="range" min="0" max="1" step="0.01" .value=${String(this._previewAt)}
              ?disabled=${!this._previewLight} style="accent-color:var(--db-accent)"
              @change=${(c) => {
      this._previewAt = Number(c.target.value), this._previewLight && wi(e, [this._previewLight], t.settings, this._previewAt).catch((h) => this._error(h));
    }} />
            <span class="tabular">${y(e, M(360 + this._previewAt * (t.duration || 30)))}</span>
          </div>` : p}
      <div class="row" style="justify-content:flex-end">
        ${t.id && !i.length && !t.builtin ? o`<button class="btn danger" @click=${() => this._delete(t)}>${a(e, "delete")}</button>` : p}
        <span class="grow"></span>
        <button class="btn" @click=${() => this._edit = void 0}>${a(e, "cancel")}</button>
        <button class="btn primary" ?disabled=${n || d && !this._confirmed} @click=${this._save}>
          ${a(e, "profile_save")}
        </button>
      </div>
    `;
  }
};
cs.styles = [
  O,
  T`
      .wrap {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr);
        gap: 16px;
        align-items: start;
      }
      aside {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 12px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .item[aria-current="true"] {
        background: color-mix(in srgb, var(--db-accent) 14%, transparent);
      }
      .item i {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        flex: none;
      }
      .item span {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      main {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      h2 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
      }
      .facts {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }
      .facts div {
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--db-tile);
      }
      .facts b {
        display: block;
        margin-top: 2px;
      }
      .ramp {
        height: 56px;
        border-radius: 12px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      th,
      td {
        text-align: left;
        padding: 6px 8px;
        border-bottom: 1px solid var(--db-line);
      }
      th {
        color: var(--db-muted);
        font-weight: 500;
      }
      .sw {
        display: inline-block;
        width: 22px;
        height: 22px;
        border-radius: 6px;
        vertical-align: middle;
      }
      .warn {
        padding: 12px 14px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--warning-color, #ffa600) 16%, transparent);
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
      .name {
        font-size: 20px;
        height: 44px;
        flex: 1;
        min-width: 200px;
      }
      @media (max-width: 760px) {
        .wrap {
          grid-template-columns: 1fr;
        }
      }
    `
];
let Y = cs;
pe([
  f({ attribute: !1 })
], Y.prototype, "hass");
pe([
  f({ attribute: !1 })
], Y.prototype, "snapshot");
pe([
  f()
], Y.prototype, "mode");
pe([
  b()
], Y.prototype, "_sel");
pe([
  b()
], Y.prototype, "_edit");
pe([
  b()
], Y.prototype, "_editMode");
pe([
  b()
], Y.prototype, "_confirmed");
pe([
  b()
], Y.prototype, "_previewLight");
pe([
  b()
], Y.prototype, "_previewAt");
H("db-profiles-view", Y);
var Aa = Object.defineProperty, tt = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && Aa(e, t, i), i;
};
const hs = class hs extends L {
  constructor() {
    super(...arguments), this._sel = "all_on", this._confirmed = !1;
  }
  get _profiles() {
    return this.snapshot?.last_call_profiles ?? [];
  }
  _users(e) {
    return (this.snapshot?.alarms ?? []).filter((t) => t.last_call.profile === e);
  }
  _shared(e) {
    return new Set(this._users(e).filter((t) => t.owners.length).map((t) => [...t.owners].sort().join())).size > 1;
  }
  _error(e) {
    S(this, "hass-notification", { message: me(this.hass, e) });
  }
  _describe(e) {
    const t = this.hass, s = ft(t, e.targets);
    return [
      a(t, "lc_profile_desc", { min: e.duration, bri: Math.round(e.brightness) }),
      s.length ? s.map((i) => P(t, i)).join(", ") : a(t, "lc_alarm_lights"),
      e.actions.length ? a(t, "n_actions", { n: e.actions.length }) : ""
    ].filter(Boolean).join(" · ");
  }
  _start(e, t) {
    const s = structuredClone(e);
    t && (s.id = "", delete s.builtin, s.name = a(this.hass, "profile_copy_name", { name: e.name })), this._edit = s, this._confirmed = !1;
  }
  async _save() {
    const e = this.hass, t = this._edit;
    if (!e || !t) return;
    const s = { ...t };
    s.id || delete s.id;
    try {
      const i = await Me(e, "last_call", s, this._confirmed);
      this._sel = i.id, this._edit = void 0;
    } catch (i) {
      this._error(i);
    }
  }
  render() {
    const e = this.hass, t = this.snapshot?.settings.default_last_call;
    return o`<p class="muted" style="margin:0">${a(e, "lc_intro")}</p>
      <div class="wrap">
        <aside class="card">
          <button class="btn primary" @click=${() => this._start(
      {
        id: "",
        name: a(e, "lc_new_name"),
        duration: 10,
        targets: {},
        brightness: 100,
        kelvin: 5e3,
        actions: [],
        audio: Ot(),
        volume: null
      },
      !1
    )}>
            + ${a(e, "profile_new_btn")}
          </button>
          ${this._profiles.map(
      (s) => o`<button class="item" aria-current=${!this._edit && this._sel === s.id}
              @click=${() => {
        this._sel = s.id, this._edit = void 0;
      }}>
              <b>${s.name}${s.id === t ? o` <span class="muted">· ${a(e, "default")}</span>` : p}</b>
              <span class="muted">${this._describe(s)}</span>
            </button>`
    )}
        </aside>
        <main class="card">${this._edit ? this._editor() : this._detail()}</main>
      </div>`;
  }
  _detail() {
    const e = this.hass, t = this._profiles.find((r) => r.id === this._sel) ?? this._profiles[0];
    if (!t) return p;
    const s = this._users(t.id), i = this._shared(t.id), n = this.snapshot?.settings.default_last_call === t.id;
    return o`
      <div class="row">
        <h2 class="grow">${t.name}</h2>
        ${n ? o`<span class="chip">${a(e, "default")}</span>` : o`<button class="btn" @click=${() => e && jt(e, { default_last_call: t.id }).catch((r) => this._error(r))}>
              ${a(e, "make_default")}</button>`}
        ${t.builtin || i ? o`<button class="btn" @click=${() => this._start(t, !0)}>${a(e, "edit_copy")}</button>` : o`<button class="btn" @click=${() => this._start(t, !1)}>${a(e, "edit")}</button>`}
      </div>
      <div class="muted">${a(e, "lc_detail_hint")}</div>
      <div class="tile">${this._describe(t)}${t.kelvin ? ` · ${t.kelvin} K` : ""}</div>
      ${i ? o`<div class="warn">${a(e, "profile_shared_hint")}</div>` : p}
      <div class="muted">${a(e, "used_by")}: ${s.length ? s.map((r) => r.name).join(", ") : a(e, "nobody")}</div>
      <div class="muted">${t.audio?.type && t.audio.type !== "none" ? a(e, "lc_audio_own", { name: t.audio.name || t.audio.media_id || t.audio.url }) : a(e, "lc_audio_keep")}${t.volume !== null && t.volume !== void 0 ? ` · ${Math.round(t.volume)} %` : ""}</div>
    `;
  }
  _editor() {
    const e = this.hass, t = this._edit, s = t.id ? this._users(t.id) : [], i = t.id ? this._shared(t.id) : !1, n = s.length > 1, r = (d) => this._edit = { ...t, ...d };
    return o`
      <input class="inp" style="font-size:20px;height:44px" .value=${t.name} aria-label=${a(e, "f_name")}
        @input=${(d) => r({ name: d.target.value })} />
      ${i ? o`<div class="warn">${a(e, "profile_shared_hint")}</div>` : p}
      ${!i && s.length ? o`<label class="warn">
            ${n ? o`<input type="checkbox" .checked=${this._confirmed} @change=${(d) => this._confirmed = d.target.checked} />` : p}
            <span>${a(e, "profile_in_use_hint", { n: s.length, names: s.map((d) => d.name).join(", ") })}</span>
          </label>` : p}
      <div class="grid">
        <label class="field">${a(e, "lc_duration")}
          <input class="inp" type="number" min="1" max="120" .value=${String(t.duration)}
            @change=${(d) => r({ duration: $(Number(d.target.value) || 1, 1, 120) })} /></label>
        <label class="field">${a(e, "ls_brightness")} (%)
          <input class="inp" type="number" min="0" max="100" .value=${String(t.brightness)}
            @change=${(d) => r({ brightness: $(Number(d.target.value), 0, 100) })} /></label>
        <label class="field">${a(e, "ls_ct")} (K)
          <input class="inp" type="number" min="1500" max="6500" step="50" placeholder="–" .value=${t.kelvin ? String(t.kelvin) : ""}
            @change=${(d) => {
      const c = d.target.value;
      r({ kelvin: c ? $(Number(c), 1500, 6500) : null });
    }} /></label>
      </div>
      <div class="lbl">${a(e, "lc_lights")}</div>
      <div class="muted">${a(e, "lc_lights_hint")}</div>
      <db-entity-picker .hass=${e} .domains=${["light"]} multiple areaPick .value=${ft(e, t.targets)}
        @value-changed=${(d) => {
      d.stopPropagation(), r({ targets: { entity_id: d.detail.value ?? [] } });
    }}></db-entity-picker>
      <div class="lbl">${a(e, "section_audio")}</div>
      <db-audio-source .hass=${e} .source=${t.audio ?? Ot()} .noneLabel=${a(e, "lc_audio_keep_short")}
        @source-change=${(d) => r({ audio: d.detail })}></db-audio-source>
      <label class="field" style="max-width:240px">${a(e, "lc_volume")}
        <input class="inp" type="number" min="0" max="100" placeholder=${a(e, "lc_volume_ph")}
          .value=${t.volume === null || t.volume === void 0 ? "" : String(t.volume)}
          @change=${(d) => {
      const c = d.target.value;
      r({ volume: c === "" ? null : $(Number(c), 0, 100) });
    }} /></label>
      <div class="lbl">${a(e, "lc_actions")}</div>
      <div class="muted">${a(e, "lc_actions_hint")}</div>
      <ha-selector .required=${!1} .hass=${e} .selector=${{ action: {} }} .value=${t.actions}
        @value-changed=${(d) => r({ actions: d.detail.value ?? [] })}></ha-selector>
      <div class="row">
        ${t.id && !s.length && !t.builtin ? o`<button class="btn danger" @click=${async () => {
      if (!(!e || !confirm(a(e, "profile_delete_confirm", { name: t.name }))))
        try {
          await Ht(e, "last_call", t.id), this._edit = void 0, this._sel = "all_on";
        } catch (d) {
          this._error(d);
        }
    }}>${a(e, "delete")}</button>` : p}
        <span class="grow"></span>
        <button class="btn" @click=${() => this._edit = void 0}>${a(e, "cancel")}</button>
        <button class="btn primary" ?disabled=${i || n && !this._confirmed} @click=${this._save}>
          ${a(e, "profile_save")}</button>
      </div>
    `;
  }
};
hs.styles = [
  O,
  T`
      .wrap {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr);
        gap: 16px;
        align-items: start;
      }
      aside {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .item {
        display: flex;
        flex-direction: column;
        padding: 10px 12px;
        border-radius: 12px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .item[aria-current="true"] {
        background: color-mix(in srgb, var(--db-accent) 14%, transparent);
      }
      main {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      h2 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: var(--db-muted);
      }
      .warn {
        padding: 12px 14px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--warning-color, #ffa600) 16%, transparent);
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
      ha-selector {
        display: block;
      }
      @media (max-width: 760px) {
        .wrap {
          grid-template-columns: 1fr;
        }
      }
    `
];
let fe = hs;
tt([
  f({ attribute: !1 })
], fe.prototype, "hass");
tt([
  f({ attribute: !1 })
], fe.prototype, "snapshot");
tt([
  b()
], fe.prototype, "_sel");
tt([
  b()
], fe.prototype, "_edit");
tt([
  b()
], fe.prototype, "_confirmed");
H("db-last-call-view", fe);
var Ma = Object.defineProperty, st = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && Ma(e, t, i), i;
};
const ps = class ps extends L {
  constructor() {
    super(...arguments), this._sel = "warm", this._confirmed = !1;
  }
  get _profiles() {
    return this.snapshot?.climate_profiles ?? [];
  }
  _users(e) {
    return (this.snapshot?.alarms ?? []).filter((t) => t.climate?.profile === e);
  }
  _shared(e) {
    return new Set(this._users(e).filter((t) => t.owners.length).map((t) => [...t.owners].sort().join())).size > 1;
  }
  _error(e) {
    S(this, "hass-notification", { message: me(this.hass, e) });
  }
  _describe(e) {
    const t = this.hass, s = e.settings, i = ["heat", "cool", "heat_cool", "auto"].includes(s.mode) ? ` ${s.temperature} °C` : "", n = s.start === "fixed" ? a(t, "cl_start_fixed") + ` (${s.lead} min)` : a(t, "cl_start_learned");
    return `${a(t, `clm_${s.mode}`)}${i} · ${n} · ${a(t, `cl_after_${s.after}`)}`;
  }
  _start(e, t) {
    const s = structuredClone(e);
    t && (s.id = "", delete s.builtin, s.name = a(this.hass, "profile_copy_name", { name: e.name })), this._edit = s, this._confirmed = !1;
  }
  async _save() {
    const e = this.hass, t = this._edit;
    if (!e || !t) return;
    const s = { ...t };
    s.id || delete s.id;
    try {
      const i = await Me(e, "climate", s, this._confirmed);
      this._sel = i.id, this._edit = void 0;
    } catch (i) {
      this._error(i);
    }
  }
  render() {
    const e = this.hass;
    return o`<p class="muted" style="margin:0">${a(e, "cl_intro")}</p>
      <div class="wrap">
        <aside class="card">
          <button class="btn primary" @click=${() => this._start({ id: "", name: a(e, "cl_new_name"), settings: ii() }, !1)}>
            + ${a(e, "profile_new_btn")}
          </button>
          ${this._profiles.map(
      (t) => o`<button class="item" aria-current=${!this._edit && this._sel === t.id}
              @click=${() => {
        this._sel = t.id, this._edit = void 0;
      }}>
              <b>${t.name}</b>
              <span class="muted">${this._describe(t)}</span>
            </button>`
    )}
        </aside>
        <main class="card">${this._edit ? this._editor() : this._detail()}</main>
      </div>`;
  }
  _detail() {
    const e = this.hass, t = this._profiles.find((n) => n.id === this._sel) ?? this._profiles[0];
    if (!t) return p;
    const s = this._users(t.id), i = this._shared(t.id);
    return o`
      <div class="row">
        <h2 class="grow">${t.name}</h2>
        ${t.builtin || i ? o`<button class="btn" @click=${() => this._start(t, !0)}>${a(e, "edit_copy")}</button>` : o`<button class="btn" @click=${() => this._start(t, !1)}>${a(e, "edit")}</button>`}
      </div>
      ${i ? o`<div class="warn">${a(e, "profile_shared_hint")}</div>` : p}
      <div class="muted">${a(e, "used_by")}: ${s.length ? s.map((n) => n.name).join(", ") : a(e, "nobody")}</div>
      <db-climate-settings .hass=${e} .settings=${t.settings} locked></db-climate-settings>
    `;
  }
  _editor() {
    const e = this.hass, t = this._edit, s = t.id ? this._users(t.id) : [], i = t.id ? this._shared(t.id) : !1, n = s.length > 1;
    return o`
      <input class="inp" style="font-size:20px;height:44px" .value=${t.name} aria-label=${a(e, "f_name")}
        @input=${(r) => this._edit = { ...t, name: r.target.value }} />
      ${i ? o`<div class="warn">${a(e, "profile_shared_hint")}</div>` : p}
      ${!i && s.length ? o`<label class="warn">
            ${n ? o`<input type="checkbox" .checked=${this._confirmed} @change=${(r) => this._confirmed = r.target.checked} />` : p}
            <span>${a(e, "profile_in_use_hint", { n: s.length, names: s.map((r) => r.name).join(", ") })}</span>
          </label>` : p}
      <db-climate-settings .hass=${e} .settings=${t.settings}
        @climate-change=${(r) => this._edit = { ...t, settings: r.detail }}></db-climate-settings>
      <div class="row">
        ${t.id && !s.length && !t.builtin ? o`<button class="btn danger" @click=${async () => {
      if (!(!e || !confirm(a(e, "profile_delete_confirm", { name: t.name }))))
        try {
          await Ht(e, "climate", t.id), this._edit = void 0, this._sel = "warm";
        } catch (r) {
          this._error(r);
        }
    }}>${a(e, "delete")}</button>` : p}
        <span class="grow"></span>
        <button class="btn" @click=${() => this._edit = void 0}>${a(e, "cancel")}</button>
        <button class="btn primary" ?disabled=${i || n && !this._confirmed || !t.name.trim()} @click=${this._save}>
          ${a(e, "profile_save")}</button>
      </div>
    `;
  }
};
ps.styles = [
  O,
  T`
      .wrap {
        display: grid;
        grid-template-columns: 260px minmax(0, 1fr);
        gap: 16px;
        align-items: start;
      }
      aside {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .item {
        display: flex;
        flex-direction: column;
        padding: 10px 12px;
        border-radius: 12px;
        border: none;
        background: transparent;
        cursor: pointer;
        text-align: left;
      }
      .item[aria-current="true"] {
        background: color-mix(in srgb, var(--db-accent) 14%, transparent);
      }
      main {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      h2 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 13px;
        color: var(--db-muted);
      }
      .warn {
        padding: 12px 14px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--warning-color, #ffa600) 16%, transparent);
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
      ha-selector {
        display: block;
      }
      @media (max-width: 760px) {
        .wrap {
          grid-template-columns: 1fr;
        }
      }
    `
];
let be = ps;
st([
  f({ attribute: !1 })
], be.prototype, "hass");
st([
  f({ attribute: !1 })
], be.prototype, "snapshot");
st([
  b()
], be.prototype, "_sel");
st([
  b()
], be.prototype, "_edit");
st([
  b()
], be.prototype, "_confirmed");
H("db-climate-view", be);
var Ea = Object.defineProperty, Jt = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && Ea(e, t, i), i;
};
const Pa = ["snow", "storm", "rain"], _s = class _s extends L {
  constructor() {
    super(...arguments), this._busy = !1;
  }
  get s() {
    return this.snapshot.settings;
  }
  async _set(e) {
    if (this.hass)
      try {
        await jt(this.hass, e);
      } catch (t) {
        S(this, "hass-notification", { message: me(this.hass, t) });
      }
  }
  _sel(e, t, s, i, n = {}) {
    return o`<db-entity-picker .hass=${this.hass} .domains=${e} .value=${t} .label=${i}
      .multiple=${!!n.multiple} .deviceClass=${n.deviceClass}
      @value-changed=${(r) => {
      r.stopPropagation(), s(r.detail.value);
    }}></db-entity-picker>`;
  }
  _modes() {
    const e = this.hass, t = { ...Dt, ...this.s.mode_hidden }, s = (i, n, r) => {
      const d = t[i].filter((c) => c !== n);
      this._set({ mode_hidden: { ...t, [i]: r ? d : [...d, n] } });
    };
    return o`<section class="card">
      <h2>${a(e, "settings_modes")}</h2>
      <div class="muted">${a(e, "settings_modes_hint")}</div>
      <div class="modes">
        <span></span>
        ${["simple", "normal", "expert"].map((i) => o`<span class="head">${a(e, `mode_${i}`)}</span>`)}
        ${bi.map(
      (i) => o`<div class="feat"><div>${a(e, `feat_${i}`)}</div>
              <div class="muted">${a(e, `feat_${i}_d`)}</div></div>
            ${["simple", "normal"].map(
        (n) => o`<label class="box"><input type="checkbox" .checked=${!t[n].includes(i)}
                aria-label=${`${a(e, `feat_${i}`)} – ${a(e, `mode_${n}`)}`}
                @change=${(r) => s(n, i, r.target.checked)} /></label>`
      )}
            <span class="box"><input type="checkbox" checked disabled aria-label=${a(e, "mode_expert")} /></span>`
    )}
      </div>
      <div><button class="btn" @click=${() => this._set({ mode_hidden: Dt })}>${a(e, "settings_modes_reset")}</button></div>
    </section>`;
  }
  _presets() {
    const e = this.hass, t = this.s.snooze_presets, s = (n) => this._set({ snooze_presets: n }), i = (n, r) => s(t.map((d, c) => c === n ? { ...d, ...r } : d));
    return o`
      ${t.map(
      (n, r) => o`<div class="preset">
          <input type="radio" name="def" .checked=${this.s.default_snooze === n.id} aria-label=${a(e, "default")}
            @change=${() => this._set({ default_snooze: n.id })} />
          <input class="inp" .value=${n.name} @change=${(d) => i(r, { name: d.target.value || n.name })} />
          <input class="inp num" type="number" min="1" max="60" .value=${String(n.minutes)}
            @change=${(d) => i(r, { minutes: $(Number(d.target.value) || 1, 1, 60) })} />
          <span>min</span>
          <button class="btn" ?disabled=${t.length <= 1} aria-label=${a(e, "delete")}
            @click=${() => s(t.filter((d, c) => c !== r))}>✕</button>
        </div>`
    )}
      <div class="row">
        <button class="btn" ?disabled=${t.length >= 12}
          @click=${() => s([...t, { id: `p${Date.now().toString(36)}`, name: a(e, "preset_new"), minutes: 10 }])}>
          + ${a(e, "preset_add")}</button>
        <span class="grow"></span>
        <label class="row"><span>${a(e, "default_count")}</span>
          <input class="inp num" type="number" min="1" max="10" .value=${String(this.s.default_snooze_count)}
            @change=${(n) => this._set({ default_snooze_count: $(Number(n.target.value) || 1, 1, 10) })} />
          <span>×</span></label>
      </div>
      <div class="muted">${a(e, "presets_hint")}</div>
    `;
  }
  _export() {
    const e = this.snapshot, t = {
      daybreak: 2,
      alarms: e.alarms.map(({ runtime: n, ...r }) => r),
      light_profiles: e.light_profiles.filter((n) => !n.builtin),
      last_call_profiles: e.last_call_profiles.filter((n) => !n.builtin),
      climate_profiles: (e.climate_profiles ?? []).filter((n) => !n.builtin),
      settings: e.settings
    }, s = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), i = document.createElement("a");
    i.href = URL.createObjectURL(s), i.download = `daybreak-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, i.click(), setTimeout(() => URL.revokeObjectURL(i.href), 1e3);
  }
  async _import(e) {
    const t = this.hass, s = e.target, i = s.files?.[0];
    if (s.value = "", !(!t || !i)) {
      this._busy = !0;
      try {
        const n = JSON.parse(await i.text());
        if (n?.daybreak !== 2) throw new Error(a(t, "import_invalid"));
        const r = n.alarms ?? [];
        if (!confirm(a(t, "import_confirm", { n: r.length }))) return;
        const d = {};
        for (const m of n.light_profiles ?? []) {
          const { id: u, ..._ } = m;
          d[u] = (await Me(t, "light", _)).id;
        }
        const c = {};
        for (const m of n.last_call_profiles ?? []) {
          const { id: u, ..._ } = m;
          c[u] = (await Me(t, "last_call", _)).id;
        }
        const h = {};
        for (const m of n.climate_profiles ?? []) {
          const { id: u, ..._ } = m;
          h[u] = (await Me(t, "climate", _)).id;
        }
        for (const m of r) {
          const u = structuredClone(m);
          delete u.id, u.light?.profile && (u.light.profile = d[u.light.profile] ?? u.light.profile);
          for (const _ of u.light?.overrides ?? []) _.profile && (_.profile = d[_.profile] ?? _.profile);
          u.last_call?.profile && (u.last_call.profile = c[u.last_call.profile] ?? u.last_call.profile), u.climate?.profile && (u.climate.profile = h[u.climate.profile] ?? u.climate.profile), await Ks(t, u);
        }
        S(this, "hass-notification", { message: a(t, "import_done", { n: r.length }) });
      } catch (n) {
        S(this, "hass-notification", { message: me(t, n) });
      } finally {
        this._busy = !1;
      }
    }
  }
  render() {
    const e = this.hass;
    if (!this.snapshot) return o``;
    const t = this.s;
    return o`
      <section class="card">
        <h2>${a(e, "settings_general")}</h2>
        <div class="row">
          <span>${a(e, "default_mode")}</span>
          <div class="seg" role="group">
            ${["simple", "normal", "expert"].map(
      (s) => o`<button aria-pressed=${t.default_mode === s} @click=${() => this._set({ default_mode: s })}>
                ${a(e, `mode_${s}`)}</button>`
    )}
          </div>
        </div>
        <div class="muted">${a(e, "default_mode_hint")}</div>
        ${this._sel(
      ["binary_sensor"],
      t.holiday_entity,
      (s) => this._set({ holiday_entity: s || null }),
      a(e, "holiday_entity")
    )}
        <div class="muted">
          ${this.snapshot.holiday_entity ? a(e, "holiday_used", { entity: P(e, this.snapshot.holiday_entity) }) : a(e, "holidays_none")}
        </div>
        ${this._sel(["notify"], t.notify, (s) => this._set({ notify: s || null }), a(e, "notify_default"))}
        <div class="muted">${a(e, "notify_hint")}</div>
      </section>
      ${this._modes()}

      <section class="card">
        <h2>${a(e, "settings_snooze")}</h2>
        ${this._presets()}
      </section>

      <section class="card">
        <h2>${a(e, "settings_weather")}</h2>
        <div class="muted">${a(e, "settings_weather_hint")}</div>
        ${this._sel(["weather"], t.weather_entity, (s) => this._set({ weather_entity: s || null }), a(e, "weather_entity"))}
        <div class="grid">
          ${Pa.map(
      (s) => o`<label class="cell"><span class="grow">${a(e, `weather_${s}`)}</span>
              <input class="inp num" type="number" min="0" max="240" .value=${String(t.weather_minutes[s] ?? 0)}
                @change=${(i) => this._set({ weather_minutes: { ...t.weather_minutes, [s]: $(Number(i.target.value), 0, 240) } })} />
              <span>min</span></label>`
    )}
          <label class="cell"><span class="grow">${a(e, "cold_below")}</span>
            <input class="inp num" type="number" step="0.5" .value=${String(t.cold_below)}
              @change=${(s) => this._set({ cold_below: Number(s.target.value) })} /><span>°C</span></label>
          <label class="cell"><span class="grow">${a(e, "cold_minutes")}</span>
            <input class="inp num" type="number" min="0" max="240" .value=${String(t.cold_minutes)}
              @change=${(s) => this._set({ cold_minutes: $(Number(s.target.value), 0, 240) })} /><span>min</span></label>
        </div>
        ${this._sel(
      ["sensor"],
      t.temperature_entity,
      (s) => this._set({ temperature_entity: s || null }),
      a(e, "temperature_entity"),
      { deviceClass: "temperature" }
    )}
        ${this._sel(
      ["sensor", "binary_sensor"],
      t.warning_entities,
      (s) => this._set({ warning_entities: s ?? [] }),
      a(e, "warning_entities"),
      { multiple: !0 }
    )}
        <label class="row"><span>${a(e, "warning_level")}</span>
          <select class="inp" @change=${(s) => this._set({ warning_level: Number(s.target.value) })}>
            ${[1, 2, 3, 4].map((s) => o`<option value=${s} ?selected=${t.warning_level === s}>${a(e, `warning_${s}`)}</option>`)}
          </select></label>
      </section>

      <section class="card">
        <h2>${a(e, "settings_backup")}</h2>
        <div class="muted">${a(e, "backup_hint")}</div>
        <div class="row">
          <button class="btn" @click=${this._export}>${a(e, "export")}</button>
          <label class="btn" style="cursor:pointer">
            ${a(e, "import")}<input type="file" accept="application/json,.json" hidden ?disabled=${this._busy} @change=${this._import} />
          </label>
        </div>
      </section>
    `;
  }
};
_s.styles = [
  O,
  T`
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
    `
];
let Fe = _s;
Jt([
  f({ attribute: !1 })
], Fe.prototype, "hass");
Jt([
  f({ attribute: !1 })
], Fe.prototype, "snapshot");
Jt([
  b()
], Fe.prototype, "_busy");
H("db-settings-view", Fe);
var Wa = Object.defineProperty, je = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && Wa(e, t, i), i;
};
const Tt = ["prep", "sunrise", "wake", "end"], Hs = {
  checks: "prep",
  checks_failed: "prep",
  calendar: "prep",
  holiday_override: "prep",
  climate_wait: "prep",
  climate_start: "prep",
  climate_not_needed: "prep",
  presence: "prep",
  skipped: "prep",
  cancelled: "prep",
  start: "sunrise",
  ring: "wake",
  ring_again: "wake",
  snooze: "wake",
  button: "wake",
  last_call: "wake",
  end: "end"
}, La = {
  checks: "🌦",
  checks_failed: "🌦",
  calendar: "📅",
  holiday_override: "📅",
  climate_wait: "🌡",
  climate_start: "🌡",
  climate_not_needed: "🌡",
  presence: "🏠",
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
  end: "🏁"
};
function Ie(l) {
  return l.problem ? "problem" : l.result === "skipped" || l.result === "planned" || l.result === "running" || l.result === "cancelled" ? l.result : l.warn ? "warn" : "ok";
}
function Ne(l) {
  return l.level ?? (l.ok ? "ok" : "error");
}
const us = class us extends L {
  constructor() {
    super(...arguments), this.narrow = !1, this._filter = "all", this._alarm = "";
  }
  // ------------------------------------------------------------ helpers
  _color(e) {
    return {
      ok: "var(--st-ok)",
      info: "var(--st-planned)",
      warn: "var(--st-warn)",
      error: "var(--st-problem)",
      problem: "var(--st-problem)",
      skipped: "var(--st-skipped)",
      planned: "var(--st-planned)",
      running: "var(--st-running)",
      cancelled: "var(--st-cancelled)"
    }[e];
  }
  _icon(e) {
    return { ok: "✓", warn: "!", problem: "⚠", skipped: "⏭", planned: "🕑", running: "▶", cancelled: "✖" }[e];
  }
  _time(e, t, s = e.test) {
    const i = this.hass;
    return s ? `${N(i, t)}:${String(new Date(t).getSeconds()).padStart(2, "0")}` : N(i, t);
  }
  _dayLabel(e) {
    const t = this.hass, s = ae(t, new Date(e)), i = ae(t), n = ae(t, new Date(Date.now() - 864e5));
    return s === i ? a(t, "hx_today") : s === n ? a(t, "hx_yesterday") : U(t, s);
  }
  get _entries() {
    return [...this.snapshot?.history ?? []].sort((t, s) => (s.started ?? "").localeCompare(t.started ?? "")).filter((t) => this._alarm && t.alarm_id !== this._alarm ? !1 : this._filter === "problem" ? Ie(t) === "problem" || Ie(t) === "warn" : this._filter === "skipped" ? t.result === "skipped" || t.result === "cancelled" : this._filter === "test" ? t.test : !0);
  }
  /** One line under the name in the list. */
  _short(e) {
    const t = this.hass, s = e.steps, i = s.filter((h) => h.step === "snooze").length, n = s.find((h) => h.step === "end"), r = s.find((h) => h.step === "skipped"), d = s.filter((h) => Ne(h) === "error").length, c = [];
    return r ? c.push(this._skipText(r)) : e.result === "planned" ? c.push(a(t, "hx_s_planned")) : e.result === "running" ? c.push(a(t, "hx_s_running")) : e.result === "cancelled" && c.push(a(t, "hx_s_cancelled")), i && c.push(a(t, "hx_s_snoozed", { n: i })), n && c.push(a(t, `hx_end_${n.reason ?? "stopped"}_s`)), d && c.push(a(t, "hx_s_problems", { n: d })), c.join(" · ");
  }
  _skipText(e) {
    return a(this.hass, `hx_skip_${e.reason ?? "away"}`, {
      detail: e.detail ?? "",
      rule: e.rule ?? "",
      other: e.other ?? ""
    });
  }
  // -------------------------------------------------------------- texts
  /** Title, plain explanation and (for problems) what to do. */
  _describe(e, t) {
    const s = this.hass, i = t.step, n = (r, d = {}) => a(s, r, d);
    switch (i) {
      case "checks": {
        const r = [];
        if (t.weather) {
          const c = `hx_wx_${t.weather}`, h = n(c);
          r.push(n("hx_checks_weather", { w: h === c ? t.weather : h }));
        }
        t.temperature != null && r.push(`${t.temperature} °C`), t.warning && r.push(n("hx_checks_warning", { n: t.warning })), t.travel != null && r.push(n("hx_checks_travel", { min: t.travel }));
        const d = (t.reasons ?? []).map((c) => n(`hx_reason_${c}`)).join(", ");
        return {
          title: n("hx_checks_t"),
          text: `${r.join(" · ") || n("hx_checks_none")} → ${t.minutes ? n("hx_checks_earlier", { min: t.minutes, why: d }) : n("hx_checks_same")}`
        };
      }
      case "calendar": {
        const r = t.action === "time" ? n("hx_cal_time", { time: t.time ? N(s, t.time) : "" }) : t.action === "ring" ? n("hx_cal_ring", { other: t.other ?? "" }) : n("hx_cal_other");
        return {
          title: n("hx_calendar_t"),
          text: n("hx_calendar_d", { detail: t.detail ?? "", what: r, rule: t.rule ?? "" }) + (t.travel != null ? ` ${n("hx_checks_travel", { min: t.travel })}` : "")
        };
      }
      case "climate_wait":
        return {
          title: n("hx_climate_wait_t"),
          text: n(`hx_climate_wait_${t.reason ?? "window"}`, { outdoor: t.outdoor ?? "?" })
        };
      case "climate_start":
        return {
          title: n("hx_climate_start_t"),
          text: n("hx_climate_start_d", {
            mode: n(`clm_${t.mode ?? "heat"}`),
            target: t.target ?? "",
            lead: t.lead ?? 0,
            how: n(t.learned ? "hx_learned" : "hx_fixed")
          }) + (t.paused ? ` ${n("hx_climate_paused")}` : "")
        };
      case "climate_not_needed":
        return {
          title: n("hx_climate_not_needed_t"),
          text: t.room != null ? n("hx_climate_not_needed_d", { room: t.room }) : n("hx_climate_not_needed_x")
        };
      case "presence":
        return { title: n("hx_presence_t"), text: n("hx_presence_d", { who: t.detail || "?" }) };
      case "skipped":
        return {
          title: n("hx_skipped_t"),
          text: this._skipText(t),
          help: t.reason === "away" ? n("hx_skip_away_h") : void 0
        };
      case "start":
        return {
          title: n(t.lights ? "hx_start_t" : "hx_start_nolight_t"),
          text: [
            t.lights ? n("hx_start_d", { n: t.lights }) : "",
            t.shift ? n("hx_start_shift", { min: t.shift }) : "",
            e.test ? n("hx_start_test", { s: e.speed ? 60 / e.speed : 60 }) : ""
          ].filter(Boolean).join(" ")
        };
      case "music":
        return { title: n("hx_music_t"), text: n("hx_music_d", { n: t.players ?? 1 }) };
      case "music_playing":
        return { title: n("hx_music_playing_t"), text: t.source ?? "" };
      case "music_retry":
        return { title: n("hx_music_retry_t"), text: n("hx_music_retry_d", { src: t.source ?? "" }), help: n("hx_music_retry_h") };
      case "audio_failed":
        return { title: n("hx_audio_failed_t"), text: t.detail ?? "", help: n("hx_audio_failed_h") };
      case "lights_missing":
      case "light_failed":
        return { title: n(`hx_${i}_t`), text: t.detail ?? "", help: n("hx_light_h") };
      case "push":
        return { title: n("hx_push_t"), text: n(`hx_push_${t.kind ?? "ring"}`) };
      case "actions":
        return { title: n("hx_actions_t"), text: n("hx_actions_d", { phase: n(`phase_${t.phase ?? "wake"}`), n: t.count ?? 1 }) };
      case "actions_failed":
        return { title: n("hx_actions_failed_t"), text: t.detail ?? "", help: n("hx_actions_h") };
      case "checks_failed":
        return { title: n("hx_checks_failed_t"), text: t.detail ?? "", help: n("hx_checks_h") };
      case "snooze":
        return { title: n("hx_snooze_t"), text: n("hx_snooze_d", { min: t.minutes ?? 0, n: t.count ?? 1 }) };
      case "last_call":
        return { title: n("hx_last_call_t"), text: n("hx_last_call_d", { profile: t.profile ?? "" }) };
      case "end":
        return { title: n(`hx_end_${t.reason ?? "stopped"}`), text: n(`hx_end_${t.reason ?? "stopped"}_d`) };
      default:
        return { title: n(`hx_${i}_t`), text: n(`hx_${i}_d`) };
    }
  }
  _headline(e) {
    const t = this.hass, s = Ie(e), i = e.steps, n = i.filter((_) => Ne(_) === "error").length, r = i.find((_) => _.step === "ring"), d = i.find((_) => _.step === "end"), c = i.filter((_) => _.step === "snooze").length, h = [a(t, "hx_sum_alarm", { time: N(t, e.alarm_time) })];
    if (r && h.push(a(t, "hx_sum_rang", { time: this._time(e, r.t) })), c && h.push(a(t, "hx_s_snoozed", { n: c })), d) {
      h.push(a(t, "hx_sum_end", { time: this._time(e, d.t) }));
      const _ = i.find((g) => g.step === "start");
      if (_) {
        const g = Math.round((Date.parse(d.t) - Date.parse(_.t)) / 6e4);
        g > 0 && h.push(a(t, "hx_sum_duration", { min: g }));
      }
    }
    const m = i.find((_) => _.step === "skipped");
    return { title: s === "problem" ? a(t, "hx_h_problem", { n }) : s === "skipped" && m ? a(t, "hx_h_skipped") : a(t, `hx_h_${s}`), text: m ? this._skipText(m) : h.join(" · ") };
  }
  // ------------------------------------------------------------- graphic
  /** Time bar: preparation, sunrise, ringing, snoozes and last call, problems as dots. */
  _timeBar(e) {
    const t = e.steps;
    if (t.length < 2) return p;
    const s = t.map((_) => Date.parse(_.t)), i = Math.min(...s), n = Math.max(...s, i + 1e3), r = (_) => (_ - i) / (n - i) * 100, d = [];
    let c = null;
    const h = (_, g) => {
      c && d.push({ cls: c.cls, a: c.at, b: g }), c = { cls: _, at: g };
    };
    for (const _ of t) {
      const g = Date.parse(_.t);
      Hs[_.step] === "prep" && !c ? h("prep", g) : _.step === "start" ? h("sunrise", g) : _.step === "ring" || _.step === "ring_again" ? h("ring", g) : _.step === "snooze" ? h("snooze", g) : _.step === "last_call" ? h("last", g) : _.step === "end" && c && (d.push({ cls: c.cls, a: c.at, b: g }), c = null);
    }
    c && d.push({ cls: c.cls, a: c.at, b: e.result === "running" ? Date.now() : n });
    const m = t.filter((_) => Ne(_) === "error" || Ne(_) === "warn"), u = this.hass;
    return o`<div class="tl">
      <div class="track">
        ${d.map(
      (_) => o`<span class="tseg ${_.cls}" style="left:${r(_.a)}%;width:${Math.max(0.8, r(Math.min(_.b, n)) - r(_.a))}%"></span>`
    )}
        ${m.map(
      (_) => o`<span class="mark ${Ne(_) === "warn" ? "warn" : ""}" style="left:${r(Date.parse(_.t))}%"
            title=${this._describe(e, _).title}></span>`
    )}
      </div>
      <div class="ticks"><span>${this._time(e, new Date(i).toISOString())}</span>
        <span>${this._time(e, new Date(n).toISOString())}</span></div>
      <div class="legend">
        ${["prep", "sunrise", "ring", "snooze", "last"].filter((_) => d.some((g) => g.cls === _)).map((_) => o`<span style="--c:${{ prep: "#5a7fa8", sunrise: "#e0763b", ring: "#ff8a4c", snooze: "#8a63d2", last: "#e05a5a" }[_]}">${a(u, `hx_seg_${_}`)}</span>`)}
        ${m.length ? o`<span style="--c:var(--st-problem)">${a(u, "hx_seg_problem")}</span>` : p}
      </div>
    </div>`;
  }
  /** Flow: phases with their steps, each in plain words; problems with help. */
  _flow(e) {
    const t = this.hass, s = [];
    let i = "prep";
    for (const r of e.steps) {
      const d = Hs[r.step];
      d && Tt.indexOf(d) > Tt.indexOf(i) && (i = d);
      const c = s[s.length - 1];
      c && c.phase === i ? c.steps.push(r) : s.push({ phase: i, steps: [r] });
    }
    const n = s.flatMap((r) => r.steps);
    return s.map(
      (r) => o`<div class="phase">
        <div class="ph"><span class="n">${Tt.indexOf(r.phase) + 1}</span>${a(t, `hx_ph_${r.phase}`)}
          <span class="muted">${a(t, `hx_ph_${r.phase}_d`)}</span></div>
        ${r.steps.map((d) => {
        const c = this._describe(e, d), h = Ne(d), m = d === n[n.length - 1], u = c.help && (h === "error" || h === "warn") ? o`<div class="help" style="--c:${this._color(h)}"><b>${a(t, "hx_what_to_do")}</b>${c.help}</div>` : p;
        return o`<div class="node" style="--c:${this._color(h)}">
            <div class="rail"><span class="dot">${h === "error" ? "⚠" : La[d.step] ?? "•"}</span>${m ? p : o`<span class="line"></span>`}</div>
            <div class="body">
              <div class="when">${this._time(e, d.t)}</div>
              <div class="title">${c.title}</div>
              ${c.text ? o`<div class="text">${c.text}</div>` : p}
              ${u}
            </div>
          </div>`;
      })}
      </div>`
    );
  }
  // --------------------------------------------------------------- render
  _list(e) {
    const t = this.hass;
    let s = "";
    return o`<section class="card list">
      ${e.length ? e.map((i) => {
      const n = Ie(i), r = this._dayLabel(i.started ?? i.alarm_time), d = r !== s ? o`<div class="day">${r}</div>` : p;
      return s = r, o`${d}<button class="hrow ${n}" style="--c:${this._color(n)}" aria-current=${this._sel === i.id}
              @click=${() => this._sel = i.id}>
              <span class="bar"></span>
              <span class="ico">${this._icon(n)}</span>
              <span class="rt"><b>${i.name}${i.test ? o`<span class="test">🧪 ${a(t, "hs_test")}</span>` : p}</b>
                <span class="muted">${this._short(i) || a(t, `hx_h_${n}`)}</span></span>
              <span class="tm">${N(t, i.alarm_time)}</span>
            </button>`;
    }) : o`<div class="placeholder muted">${a(t, "hs_empty")}</div>`}
    </section>`;
  }
  _detail(e) {
    const t = this.hass;
    if (!e) return o`<section class="card placeholder muted">👈 ${a(t, "hx_pick")}</section>`;
    const s = Ie(e), i = this._headline(e);
    return o`<section class="card detail">
      ${this.narrow ? o`<button class="btn" @click=${() => this._sel = void 0}>← ${a(t, "hx_back")}</button>` : p}
      <div class="banner" style="--c:${this._color(s)}">
        <span class="big">${this._icon(s)}</span>
        <div>
          <h2>${i.title}</h2>
          <div><b>${e.name}</b>${e.test ? o`<span class="test">🧪 ${a(t, "hs_test")}</span>` : p}
            · ${U(t, e.started ?? e.alarm_time)}</div>
          <div class="muted">${i.text}</div>
        </div>
      </div>
      ${this._timeBar(e)}
      <div>${this._flow(e)}</div>
    </section>`;
  }
  render() {
    const e = this.hass, t = this._entries, s = t.find((r) => r.id === this._sel), i = [...new Map((this.snapshot?.history ?? []).map((r) => [r.alarm_id, r.name])).entries()], n = this.narrow && !!s;
    return o`
      <div class="muted">${a(e, "hx_hint")}</div>
      ${n ? p : o`<div class="filters">
            <div class="seg" role="group">
              ${["all", "problem", "skipped", "test"].map(
      (r) => o`<button aria-pressed=${this._filter === r} @click=${() => this._filter = r}>${a(e, `hx_f_${r}`)}</button>`
    )}
            </div>
            ${i.length > 1 ? o`<select class="inp" @change=${(r) => this._alarm = r.target.value}>
                  <option value="">${a(e, "hx_all_alarms")}</option>
                  ${i.map(([r, d]) => o`<option value=${r} ?selected=${this._alarm === r}>${d}</option>`)}
                </select>` : p}
          </div>
          <div class="legend">
            ${["ok", "warn", "problem", "skipped", "planned"].map(
      (r) => o`<span style="--c:${this._color(r)}">${a(e, `hx_l_${r}`)}</span>`
    )}
          </div>`}
      <div class="wrap ${this.narrow ? "one" : ""}">
        ${n ? p : this._list(t)}
        ${this.narrow && !s ? p : this._detail(s)}
      </div>
    `;
  }
};
us.styles = [
  O,
  T`
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
      @media (max-width: 800px) {
        .wrap {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `
];
let de = us;
je([
  f({ attribute: !1 })
], de.prototype, "hass");
je([
  f({ attribute: !1 })
], de.prototype, "snapshot");
je([
  f({ type: Boolean })
], de.prototype, "narrow");
je([
  b()
], de.prototype, "_sel");
je([
  b()
], de.prototype, "_filter");
je([
  b()
], de.prototype, "_alarm");
H("db-history-view", de);
var Ca = Object.defineProperty, Q = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && Ca(e, t, i), i;
};
const Ta = ["wake", "sleep", "kids"], Da = {
  wake: "linear-gradient(90deg,#3a1a12,#b4441f,#ff8a4c,#ffd9a0)",
  sleep: "linear-gradient(90deg,#ffb36b,#b5577a,#3d3a78,#0b1020)",
  kids: "linear-gradient(90deg,#e0402a 0 50%,#3cc864 50% 100%)"
}, ms = class ms extends L {
  constructor() {
    super(...arguments), this.narrow = !1, this._tab = "alarms", this._saving = !1, this._now = Date.now(), this._ready = !1, this._chooser = !1, this._onceOpen = !1, this._onceTime = "";
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this._now = Date.now(), 3e4), ra().then(() => this._ready = !0), this._subscribe();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this._timer), this._unsub?.(), this._unsub = void 0;
  }
  updated(e) {
    e.has("hass") && this._subscribe();
  }
  _subscribe() {
    this._unsub || !this.hass || !this.isConnected || (this._unsub = Vs(this.hass, (e) => {
      this._snapshot = Ei(this.hass, e), this._mode = void 0;
    }));
  }
  get _editorMode() {
    return this._mode ?? this._snapshot?.settings.default_mode ?? "normal";
  }
  _error(e) {
    S(this, "hass-notification", { message: me(this.hass, e) });
  }
  // ------------------------------------------------------------- editing
  _new(e) {
    const t = this.hass, s = Ls(e, a(t, `kind_${e}_name`)), i = this._snapshot?.settings;
    i && (s.last_call.profile = i.default_last_call);
    const n = Object.values(t?.states ?? {}).find(
      (r) => r.entity_id.startsWith("person.") && r.attributes.user_id && t?.user?.id === r.attributes.user_id
    );
    n && (s.owners = [n.entity_id]), this._chooser = !1, this._editing = { alarm: s };
  }
  _edit(e) {
    const { runtime: t, id: s, ...i } = e;
    this._editing = { alarm: ri(Ls(i.kind), i), id: s };
  }
  async _save(e) {
    if (!(!this.hass || !this._editing)) {
      this._saving = !0;
      try {
        const t = structuredClone(e.detail.alarm), s = e.detail.newProfile;
        if (s) {
          const i = await Me(this.hass, "light", s);
          t.light.profile = i.id;
        }
        delete t.id, this._editing.id ? await vi(this.hass, this._editing.id, t) : await Ks(this.hass, t), this._editing = void 0;
      } catch (t) {
        this._error(t);
      } finally {
        this._saving = !1;
      }
    }
  }
  async _delete() {
    const e = this._editing;
    if (!(!this.hass || !e?.id) && confirm(a(this.hass, "delete_confirm", { name: e.alarm.name })))
      try {
        await $i(this.hass, e.id), this._editing = void 0;
      } catch (t) {
        this._error(t);
      }
  }
  async _action(e, t, s = {}) {
    if (this.hass)
      try {
        await Ft(this.hass, e, t, s);
      } catch (i) {
        this._error(i);
      }
  }
  _setMode(e) {
    this._mode = e.detail.mode, this.hass && jt(this.hass, { default_mode: e.detail.mode }).catch((t) => this._error(t));
  }
  // -------------------------------------------------------------- render
  render() {
    const e = this.hass, t = ["alarms", "history", "profiles", "last_call", "climate", "settings"];
    return o`
      <div class="toolbar">
        <ha-menu-button .hass=${e} .narrow=${this.narrow}></ha-menu-button>
        ${Qi(28)}
        <h1>${this._editing ? this._editing.alarm.name || a(e, "new_alarm") : a(e, "title")}</h1>
      </div>
      ${this._editing ? p : o`<div class="tabs" role="tablist">
            ${t.map(
      (s) => o`<button role="tab" aria-selected=${this._tab === s} @click=${() => this._tab = s}>
                ${a(e, `tab_${s}`)}
              </button>`
    )}
          </div>`}
      <main>
        ${qs ? o`<section class="card active">
              <div class="grow">
                <div class="nm">${a(this.hass, "stale_title")}</div>
                <div class="muted">${a(this.hass, "stale_text")}</div>
              </div>
              <button class="btn primary" @click=${() => window.location.reload()}>${a(this.hass, "stale_reload")}</button>
            </section>` : p}
        ${this._body()}
      </main>
    `;
  }
  _body() {
    const e = this._snapshot;
    if (!e || !this._ready) return o`<div class="loading">…</div>`;
    if (this._editing)
      return o`<daybreak-alarm-editor
        .hass=${this.hass}
        .alarm=${this._editing.alarm}
        .alarmId=${this._editing.id}
        .settings=${e.settings}
        .lightProfiles=${e.light_profiles}
        .lastCallProfiles=${e.last_call_profiles}
        .climateProfiles=${e.climate_profiles ?? []}
        .runtime=${e.alarms.find((t) => t.id === this._editing?.id)?.runtime}
        .holidayEntity=${e.holiday_entity}
        .alarms=${e.alarms.map((t) => ({ id: t.id, name: t.name }))}
        .mode=${this._editorMode}
        .isNew=${!this._editing.id}
        .saving=${this._saving}
        .narrow=${this.narrow}
        @daybreak-save=${this._save}
        @daybreak-cancel=${() => this._editing = void 0}
        @daybreak-delete=${this._delete}
        @daybreak-test=${() => this._editing?.id && this._action("test", this._editing.id)}
        @daybreak-mode=${this._setMode}
        @daybreak-tab=${(t) => {
        this._editing = void 0, this._tab = t.detail.tab;
      }}
      ></daybreak-alarm-editor>`;
    switch (this._tab) {
      case "profiles":
        return o`<db-profiles-view .hass=${this.hass} .snapshot=${e} .mode=${this._editorMode}></db-profiles-view>`;
      case "last_call":
        return o`<db-last-call-view .hass=${this.hass} .snapshot=${e}></db-last-call-view>`;
      case "climate":
        return o`<db-climate-view .hass=${this.hass} .snapshot=${e}></db-climate-view>`;
      case "history":
        return o`<db-history-view .hass=${this.hass} .snapshot=${e} .narrow=${this.narrow}></db-history-view>`;
      case "settings":
        return o`<db-settings-view .hass=${this.hass} .snapshot=${e}></db-settings-view>`;
      default:
        return this._alarms(e);
    }
  }
  _alarms(e) {
    const t = this.hass, s = e.alarms.filter((n) => Nt.includes(n.runtime.state)), i = [...e.alarms].sort(
      (n, r) => (n.runtime.next_alarm ?? "9999").localeCompare(r.runtime.next_alarm ?? "9999")
    );
    return o`
      ${s.map((n) => this._activeCard(n))}
      ${this._top(e)}
      <section class="card list" aria-label=${a(t, "tab_alarms")}>
        ${i.length ? i.map((n) => this._row(n)) : o`<div class="empty">${a(t, "no_alarms")}</div>`}
      </section>
      ${this._chooser ? o`<section class="card chooser">
            <b>${a(t, "new_what")}</b>
            <div class="kinds">
              ${Ta.map(
      (n) => o`<button class="kind" @click=${() => this._new(n)}>
                  <i style="background:${Da[n]}"></i>
                  <b>${a(t, `kind_${n}`)}</b>
                  <span class="muted">${a(t, `kind_${n}_d`)}</span>
                </button>`
    )}
            </div>
          </section>` : p}
      <button class="btn primary fab" aria-expanded=${this._chooser} @click=${() => this._chooser = !this._chooser}>
        + ${a(t, "new_alarm")}
      </button>
    `;
  }
  _activeCard(e) {
    const t = this.hass, s = e.runtime, i = s.state === "snoozed" && s.snooze_until ? a(t, "state_snoozed", { time: N(t, s.snooze_until) }) : a(t, `state_${s.state}`);
    return o`<section class="card active">
      <div class="grow">
        <div class="nm">${e.name}${s.test ? o`<span class="badge">${a(t, "test_badge")}</span>` : p}</div>
        <div class="muted">${i}${s.snoozes ? ` · ${a(t, "snoozed_n", { n: s.snoozes })}` : ""}</div>
      </div>
      ${e.kind === "wake" && (s.state === "ringing" || s.state === "snoozed") ? o`<button class="btn" @click=${() => this._action("snooze", e.id)}>${a(t, "snooze")}</button>` : p}
      <button class="btn primary" @click=${() => this._action("stop", e.id)}>${a(t, "stop")}</button>
    </section>`;
  }
  _top(e) {
    const t = this.hass, s = e.next, i = s ? e.alarms.find((m) => m.id === s.alarm_id) : void 0;
    if (!s || !i)
      return o`<section class="card hero"><div class="lbl">${a(t, "next_alarm")}</div>
        <div class="muted">${a(t, "no_next")}</div></section>`;
    const n = i.runtime, r = e.light_profiles.find((m) => m.id === i.light.profile), d = r?.settings ?? i.light.settings, c = ft(t, i.light.targets), h = ae(t, new Date(s.time));
    return o`<div class="top">
      <section class="card hero">
        <div class="lbl">${a(t, "next_alarm")} · ${U(t, s.time)}</div>
        <div class="times">
          ${n.next_light_start && n.next_light_start !== s.time ? o`<div><div class="muted">${a(t, "tl_light_start")}</div>
                <div class="mid tabular">${N(t, n.next_light_start)}</div></div>` : p}
          <div><div class="muted">${a(t, "tl_wake")}</div><div class="big tabular">${N(t, s.time)}</div></div>
          <span class="grow"></span>
          <div style="text-align:right"><div class="muted">${a(t, "in_label")}</div>
            <div style="font-size:20px;font-weight:600">${Rt(t, s.time, this._now)}</div></div>
        </div>
        <div class="ramp" style="background:${le(d)}"></div>
        <div class="row">
          <span class="chip">${i.name}</span>
          ${c.length ? o`<span class="chip">${a(t, "n_lights", { n: c.length })}</span>` : p}
          ${r ? o`<span class="chip">${r.name}</span>` : p}
          ${n.shift ? o`<span class="chip" aria-pressed="true">${a(t, "shifted_by", { min: n.shift })}</span>` : p}
          ${i.once?.date === h ? o`<span class="chip" aria-pressed="true">${a(t, "once_badge")}</span>` : p}
        </div>
      </section>
      <section class="card quick">
        <div class="lbl">${a(t, "quick")}</div>
        <button class="btn" @click=${() => this._action("test", i.id)}>▶ ${a(t, "quick_test")}</button>
        ${i.skip_date ? o`<button class="btn" @click=${() => this._action("cancel_skip", i.id)}>↺ ${a(t, "cancel_skip")}</button>` : o`<button class="btn" @click=${() => this._action("skip_next", i.id)}>⇥ ${a(t, "quick_skip")}</button>`}
        ${i.once ? o`<button class="btn" @click=${() => this._action("clear_once", i.id)}>✕ ${a(t, "quick_once_clear")}</button>` : o`<button class="btn" aria-expanded=${this._onceOpen} @click=${() => {
      this._onceOpen = !this._onceOpen, this._onceTime = Xt(t, n.next_base ?? s.time);
    }}>◷ ${a(t, "quick_once")}</button>`}
        ${this._onceOpen && !i.once ? o`<div class="row">
              <input class="inp time" type="time" .value=${this._onceTime}
                @change=${(m) => this._onceTime = m.target.value} />
              <button class="btn primary" @click=${async () => {
      if (!(!t || !this._onceTime))
        try {
          await xi(t, i.id, ae(t, new Date(n.next_base ?? s.time)), this._onceTime), this._onceOpen = !1;
        } catch (m) {
          this._error(m);
        }
    }}>${a(t, "save")}</button>
            </div>` : p}
      </section>
    </div>`;
  }
  _row(e) {
    const t = this.hass, s = e.runtime, i = _t(t), n = e.repeat.type === "weekly" ? o`<div class="pills">${i.map((c, h) => o`<span class=${e.repeat.days.includes(h) ? "on" : ""}>${c.slice(0, 2)}</span>`)}</div>` : p;
    let r;
    Nt.includes(s.state) ? r = a(t, `state_${s.state}`) : e.skip_date ? r = a(t, "skipped", { date: U(t, e.skip_date) }) : s.next_alarm ? r = `${U(t, s.next_alarm)} · ${Rt(t, s.next_alarm, this._now)}` : r = a(t, `state_${s.state}`);
    const d = s.next_alarm ? N(t, s.next_alarm) : e.wake.type === "fixed" ? y(t, e.wake.time) : "–";
    return o`<div class="alarm ${e.enabled ? "" : "off"}" role="button" tabindex="0"
      @click=${() => this._edit(e)} @keydown=${(c) => c.key === "Enter" && this._edit(e)}>
      <div>
        <div class="time tabular">${d}</div>
        ${s.next_light_start && s.next_light_start !== s.next_alarm ? o`<div class="muted">${a(t, "light_from", { time: N(t, s.next_light_start) })}</div>` : p}
      </div>
      <div class="grow">
        <div class="nm">${e.name}
          ${e.kind !== "wake" ? o`<span class="badge">${a(t, `kind_${e.kind}`)}</span>` : p}
          ${s.shift ? o`<span class="badge">${a(t, "shifted_by", { min: s.shift })}</span>` : p}
        </div>
        ${n}
        <div class="muted">${e.repeat.type === "weekly" ? "" : Yt(t, e) + " · "}${r}</div>
      </div>
      <button class="switch" role="switch" aria-checked=${e.enabled} aria-label=${a(t, "enabled")}
        @click=${(c) => {
      c.stopPropagation(), this._action(e.enabled ? "disable" : "enable", e.id);
    }}></button>
      <span class="muted" aria-hidden="true">›</span>
    </div>`;
  }
};
ms.styles = [
  O,
  T`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--primary-background-color);
      }
      .toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        height: var(--header-height, 56px);
        padding: 0 12px;
        background: var(--app-header-background-color, var(--primary-color));
        color: var(--app-header-text-color, var(--text-primary-color, #fff));
        border-bottom: var(--app-header-border-bottom, none);
        position: sticky;
        top: 0;
        z-index: 4;
      }
      .toolbar h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 400;
      }
      .tabs {
        display: flex;
        gap: 2px;
        overflow-x: auto;
        padding: 0 16px;
        border-bottom: 1px solid var(--db-line);
        background: var(--app-header-background-color, var(--primary-background-color));
        position: sticky;
        top: var(--header-height, 56px);
        z-index: 3;
      }
      .tabs button {
        border: none;
        background: none;
        padding: 0 16px;
        min-height: 48px;
        cursor: pointer;
        color: var(--app-header-text-color, var(--db-muted));
        opacity: 0.75;
        border-bottom: 3px solid transparent;
        white-space: nowrap;
      }
      .tabs button[aria-selected="true"] {
        opacity: 1;
        font-weight: 600;
        border-bottom-color: var(--db-accent);
      }
      main {
        max-width: 960px;
        margin: 0 auto;
        padding: 20px 16px 96px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .top {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
        gap: 16px;
      }
      .hero {
        padding: 20px 22px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .hero .times {
        display: flex;
        align-items: flex-end;
        gap: 22px;
        flex-wrap: wrap;
      }
      .big {
        font-size: 48px;
        line-height: 1;
        font-weight: 500;
      }
      .mid {
        font-size: 26px;
        font-weight: 500;
        color: var(--db-accent);
      }
      .ramp {
        height: 10px;
        border-radius: 5px;
      }
      .quick {
        padding: 20px 22px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .quick .btn {
        min-height: 48px;
        justify-content: flex-start;
      }
      .active {
        padding: 18px 22px;
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
        border-color: var(--db-accent);
        background: color-mix(in srgb, var(--db-accent) 12%, var(--db-bg));
      }
      .active .btn {
        min-height: 52px;
        font-size: 16px;
        padding: 0 24px;
      }
      .list {
        overflow: hidden;
      }
      .alarm {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 14px 18px;
        cursor: pointer;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
      }
      .alarm + .alarm {
        border-top: 1px solid var(--db-line);
      }
      .alarm:hover {
        background: var(--db-tile);
      }
      .alarm .time {
        font-size: 34px;
        font-weight: 400;
        line-height: 1.05;
        min-width: 112px;
      }
      .alarm.off .time,
      .alarm.off .nm {
        color: var(--db-muted);
      }
      .nm {
        font-weight: 600;
        font-size: 16px;
      }
      .pills {
        display: flex;
        gap: 4px;
        margin: 4px 0;
      }
      .pills span {
        width: 24px;
        height: 24px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        font-size: 11px;
        background: var(--db-tile);
        color: var(--db-muted);
      }
      .pills span.on {
        background: color-mix(in srgb, var(--db-accent) 35%, transparent);
        color: var(--db-text);
        font-weight: 600;
      }
      .badge {
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--db-tile);
        color: var(--db-muted);
        margin-left: 6px;
      }
      .chooser {
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .kinds {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
      }
      .kind {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid var(--db-line);
        background: var(--db-tile);
        cursor: pointer;
        text-align: left;
      }
      .kind i {
        height: 8px;
        border-radius: 4px;
      }
      .fab {
        position: fixed;
        right: 24px;
        bottom: 24px;
        min-height: 56px;
        padding: 0 22px;
        border-radius: 16px;
        font-size: 16px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
        z-index: 5;
      }
      .empty,
      .loading {
        padding: 32px 16px;
        text-align: center;
        color: var(--db-muted);
      }
      @media (max-width: 700px) {
        .top {
          grid-template-columns: 1fr;
        }
        .big {
          font-size: 40px;
        }
        .alarm .time {
          font-size: 24px;
          min-width: 0;
        }
        .pills span {
          width: 20px;
          height: 20px;
          font-size: 10px;
        }
        .alarm {
          gap: 10px;
          padding: 12px;
        }
      }
    `
];
let q = ms;
Q([
  f({ attribute: !1 })
], q.prototype, "hass");
Q([
  f({ type: Boolean, reflect: !0 })
], q.prototype, "narrow");
Q([
  b()
], q.prototype, "_snapshot");
Q([
  b()
], q.prototype, "_tab");
Q([
  b()
], q.prototype, "_editing");
Q([
  b()
], q.prototype, "_mode");
Q([
  b()
], q.prototype, "_saving");
Q([
  b()
], q.prototype, "_now");
Q([
  b()
], q.prototype, "_ready");
Q([
  b()
], q.prototype, "_chooser");
Q([
  b()
], q.prototype, "_onceOpen");
Q([
  b()
], q.prototype, "_onceTime");
customElements.get("daybreak-panel") || customElements.define("daybreak-panel", q);
var Na = Object.defineProperty, it = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && Na(e, t, i), i;
};
class Le extends L {
  constructor() {
    super(...arguments), this.cardStyle = "ha", this.accent = !1, this.now = Date.now();
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this.now = Date.now(), 3e4), this._subscribe();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this._timer), this._unsub?.(), this._unsub = void 0;
  }
  updated(e) {
    e.has("hass") && this._subscribe();
  }
  _subscribe() {
    this._unsub || !this.hass || !this.isConnected || (this._unsub = Vs(this.hass, (e) => this.snapshot = e));
  }
  async act(e, t, s) {
    s?.stopPropagation();
    try {
      await Ft(this.hass, e, t.id);
    } catch (i) {
      S(this, "hass-notification", { message: me(this.hass, i) });
    }
  }
  isActive(e) {
    return Nt.includes(e.runtime.state);
  }
  stateText(e) {
    const t = this.hass, s = e.runtime;
    return s.state === "snoozed" && s.snooze_until ? a(t, "state_snoozed", { time: N(t, s.snooze_until) }) : this.isActive(e) ? a(t, `state_${s.state}`) : e.skip_date ? a(t, "skipped", { date: U(t, e.skip_date) }) : s.next_alarm ? `${U(t, s.next_alarm)} · ${Rt(t, s.next_alarm, this.now)}` : a(t, `state_${s.state}`);
  }
  repeatText(e) {
    return Yt(this.hass, e);
  }
  rampOf(e) {
    const t = this.snapshot?.light_profiles.find((s) => s.id === e.light.profile);
    return le(t?.settings ?? e.light.settings);
  }
  /** Progress 0..1 of a running sunrise. */
  progressOf(e) {
    const t = e.runtime;
    if (t.state !== "sunrise" || !t.light_start || !t.alarm_time) return null;
    const s = new Date(t.light_start).getTime(), i = new Date(t.alarm_time).getTime();
    return i > s ? Math.min(1, Math.max(0, (this.now - s) / (i - s))) : 1;
  }
}
it([
  f({ attribute: !1 })
], Le.prototype, "hass");
it([
  f({ reflect: !0, attribute: "card-style" })
], Le.prototype, "cardStyle");
it([
  f({ type: Boolean, reflect: !0 })
], Le.prototype, "accent");
it([
  b()
], Le.prototype, "snapshot");
it([
  b()
], Le.prototype, "now");
const hi = [
  O,
  T`
    :host {
      display: block;
      --db-icon-bg: color-mix(in srgb, var(--state-icon-color, var(--primary-color)) 20%, transparent);
      --db-icon: var(--state-icon-color, var(--primary-color));
      --db-active: var(--primary-color);
    }
    :host([accent]) {
      --db-icon-bg: color-mix(in srgb, var(--db-accent) 22%, transparent);
      --db-icon: var(--db-accent-strong);
      --db-active: var(--db-accent);
    }
    :host(:not([accent])) .switch[aria-checked="true"] {
      background: var(--switch-checked-track-color, var(--primary-color));
    }
    ha-card {
      height: 100%;
      overflow: hidden;
    }
    .icon {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      display: grid;
      place-items: center;
      flex: none;
      background: var(--db-icon-bg);
      color: var(--db-icon);
      --mdc-icon-size: 24px;
    }
    .icon.on {
      background: color-mix(in srgb, var(--db-active) 30%, transparent);
    }
    .name {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .state {
      font-size: 12px;
      line-height: 16px;
      color: var(--db-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .feature {
      flex: 1;
      min-height: 42px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      background: color-mix(in srgb, var(--db-active) 18%, transparent);
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      --mdc-icon-size: 20px;
    }
    .feature:hover {
      background: color-mix(in srgb, var(--db-active) 28%, transparent);
    }
    .feature.primary {
      background: var(--db-active);
      color: var(--text-primary-color, #fff);
    }
    :host([accent]) .feature.primary {
      color: var(--db-on-accent);
    }
    .progress {
      height: 6px;
      border-radius: 3px;
      background: var(--db-tile);
      overflow: hidden;
    }
    .progress div {
      height: 100%;
    }
    /* Mushroom: square-ish icon shape, tighter spacing */
    :host([card-style="mushroom"]) ha-card {
      border-radius: var(--ha-card-border-radius, 12px);
    }
    :host([card-style="mushroom"]) .icon {
      border-radius: 12px;
      width: 38px;
      height: 38px;
    }
    :host([card-style="mushroom"]) .feature {
      border-radius: 10px;
      min-height: 38px;
    }
    /* Bubble: pill shapes */
    :host([card-style="bubble"]) ha-card {
      border-radius: 32px;
    }
    :host([card-style="bubble"]) .icon {
      width: 44px;
      height: 44px;
      border-radius: 22px;
    }
    :host([card-style="bubble"]) .feature {
      border-radius: 999px;
    }
  `
], pi = (l) => [
  {
    name: "style",
    selector: {
      select: {
        mode: "dropdown",
        options: ["ha", "mushroom", "bubble"].map((e) => ({ value: e, label: a(l, `style_${e}`) }))
      }
    }
  },
  { name: "accent", selector: { boolean: {} } }
], _i = (l) => (e) => a(l, `c_${e.name}`);
var Oa = Object.defineProperty, Ba = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && Oa(e, t, i), i;
};
const Ra = () => document.querySelector("home-assistant")?.hass, gs = class gs extends Le {
  static getConfigForm() {
    const e = Ra();
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "show_disabled", selector: { boolean: {} } },
        { name: "show_controls", selector: { boolean: {} } },
        ...pi(e)
      ],
      computeLabel: _i(e)
    };
  }
  static getStubConfig() {
    return { show_controls: !0, show_disabled: !0 };
  }
  setConfig(e) {
    this._config = { show_disabled: !0, show_controls: !0, style: "ha", ...e }, this.cardStyle = this._config.style ?? "ha", this.accent = !!this._config.accent;
  }
  getCardSize() {
    return 1 + (this.snapshot?.alarms.length ?? 2);
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }
  _row(e) {
    const t = this.hass, s = this.isActive(e), i = e.runtime.next_alarm ? N(t, e.runtime.next_alarm) : y(t, e.wake.time), n = e.kind === "sleep" ? "mdi:weather-night" : e.kind === "kids" ? "mdi:traffic-light" : "mdi:weather-sunset-up", r = this.progressOf(e);
    return o`<div class="r ${e.enabled ? "" : "off"}">
        <span class="icon ${s ? "on" : ""}"><ha-icon .icon=${n}></ha-icon></span>
        <div class="grow">
          <div class="name">${i} · ${e.name}</div>
          <div class="state">${this.repeatText(e)} · ${this.stateText(e)}</div>
        </div>
        <button class="switch" role="switch" aria-checked=${e.enabled} aria-label=${e.name}
          @click=${(d) => this.act(e.enabled ? "disable" : "enable", e, d)}></button>
      </div>
      ${r !== null ? o`<div class="progress" style="margin:0 4px 4px 56px"><div style="width:${r * 100}%;background:${this.rampOf(e)}"></div></div>` : p}
      ${s && this._config?.show_controls ? o`<div class="features">
            ${e.kind === "wake" && (e.runtime.state === "ringing" || e.runtime.state === "snoozed") ? o`<button class="feature" @click=${() => this.act("snooze", e)}><ha-icon icon="mdi:sleep"></ha-icon>${a(t, "snooze")}</button>` : p}
            <button class="feature primary" @click=${() => this.act("stop", e)}><ha-icon icon="mdi:alarm-off"></ha-icon>${a(t, "stop")}</button>
          </div>` : p}`;
  }
  render() {
    const e = this._config;
    if (!e) return p;
    let t = [...this.snapshot?.alarms ?? []].sort(
      (s, i) => (s.runtime.next_alarm ?? "9").localeCompare(i.runtime.next_alarm ?? "9")
    );
    return e.alarms?.length && (t = t.filter((s) => e.alarms.includes(s.id))), e.show_disabled || (t = t.filter((s) => s.enabled)), o`<ha-card>
      ${e.title ? o`<div class="title">${e.title}</div>` : p}
      <div class="rows">
        ${this.snapshot ? t.length ? t.map((s) => this._row(s)) : o`<div class="empty">${a(this.hass, "no_alarms")}</div>` : o`<div class="empty">…</div>`}
      </div>
    </ha-card>`;
  }
};
gs.styles = [
  ...hi,
  T`
      .title {
        padding: 16px 16px 4px;
        font-size: 16px;
        font-weight: 500;
      }
      .rows {
        padding: 8px 12px 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .r {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 4px;
        border-radius: 12px;
      }
      .r.off .name {
        color: var(--db-muted);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .features {
        display: flex;
        gap: 8px;
        padding: 4px 4px 6px 56px;
      }
      .empty {
        padding: 20px 16px;
        color: var(--db-muted);
        text-align: center;
      }
    `
];
let bt = gs;
Ba([
  b()
], bt.prototype, "_config");
customElements.get("daybreak-alarms-card") || customElements.define("daybreak-alarms-card", bt);
var Fa = Object.defineProperty, ja = (l, e, t, s) => {
  for (var i = void 0, n = l.length - 1, r; n >= 0; n--)
    (r = l[n]) && (i = r(e, t, i) || i);
  return i && Fa(e, t, i), i;
};
const Ha = () => document.querySelector("home-assistant")?.hass, fs = class fs extends Le {
  static getConfigForm() {
    const e = Ha();
    return {
      schema: [
        {
          name: "size",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "tile", label: a(e, "size_tile") },
                { value: "large", label: a(e, "size_large") }
              ]
            }
          }
        },
        { name: "alarm", selector: { text: {} } },
        { name: "show_buttons", selector: { boolean: {} } },
        { name: "show_progress", selector: { boolean: {} } },
        ...pi(e)
      ],
      computeLabel: _i(e)
    };
  }
  static getStubConfig() {
    return { size: "tile", show_buttons: !0, show_progress: !0 };
  }
  setConfig(e) {
    this._config = { size: "tile", show_buttons: !0, show_progress: !0, ...e }, this.cardStyle = this._config.style ?? "ha", this.accent = !!this._config.accent;
  }
  getCardSize() {
    return this._config?.size === "large" ? 5 : 2;
  }
  getGridOptions() {
    return this._config?.size === "large" ? { columns: 12, rows: 4, min_columns: 6, min_rows: 3 } : { columns: 6, rows: "auto", min_columns: 3 };
  }
  _pick() {
    const e = this.snapshot?.alarms ?? [], t = this._config?.alarm ? e.filter((i) => i.id === this._config.alarm || i.name === this._config.alarm) : e, s = t.find((i) => this.isActive(i));
    return s || t.filter((i) => i.runtime.next_alarm && i.kind === "wake").sort((i, n) => i.runtime.next_alarm.localeCompare(n.runtime.next_alarm))[0];
  }
  _buttons(e) {
    const t = this.hass;
    if (!this._config?.show_buttons || !this.isActive(e)) return p;
    const s = e.kind === "wake" && (e.runtime.state === "ringing" || e.runtime.state === "snoozed");
    return o`<div class="features">
      ${s ? o`<button class="feature" @click=${() => this.act("snooze", e)}><ha-icon icon="mdi:sleep"></ha-icon>${a(t, "snooze")}</button>` : p}
      <button class="feature primary" @click=${() => this.act("stop", e)}><ha-icon icon="mdi:alarm-off"></ha-icon>${a(t, "stop")}</button>
    </div>`;
  }
  _progress(e) {
    const t = this.progressOf(e);
    return !this._config?.show_progress || t === null ? p : o`<div class="progress"><div style="width:${t * 100}%;background:${this.rampOf(e)}"></div></div>`;
  }
  render() {
    const e = this._config;
    if (!e) return p;
    const t = this.hass, s = this._pick(), i = s?.runtime.next_alarm ?? s?.runtime.alarm_time;
    return e.size === "large" ? o`<ha-card><div class="large">
        <div class="top"><span>${a(t, "next_alarm")}</span><span>${s && i ? U(t, i) : ""}</span></div>
        <div class="big">${s && i ? N(t, i) : "–"}</div>
        <div class="sub">${s ? `${s.name} · ${this.stateText(s)}` : a(t, "no_next")}</div>
        ${s ? this._progress(s) : p}
        ${s ? this._buttons(s) : p}
      </div></ha-card>` : o`<ha-card><div class="tile">
      <div class="head">
        <span class="icon ${s && this.isActive(s) ? "on" : ""}"><ha-icon icon="mdi:weather-sunset-up"></ha-icon></span>
        <div class="info">
          <div class="name">${s ? `${i ? N(t, i) : ""} · ${s.name}` : a(t, "title")}</div>
          <div class="state">${s ? this.stateText(s) : a(t, "no_next")}</div>
        </div>
      </div>
      ${s ? this._progress(s) : p}
      ${s ? this._buttons(s) : p}
    </div></ha-card>`;
  }
};
fs.styles = [
  ...hi,
  T`
      .tile {
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }
      .info {
        min-width: 0;
        flex: 1;
      }
      .features {
        display: flex;
        gap: 8px;
      }
      .large {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: 100%;
        justify-content: center;
      }
      .large .top {
        display: flex;
        justify-content: space-between;
        color: var(--db-muted);
        font-size: 14px;
      }
      .large .big {
        font-size: clamp(48px, 12vw, 96px);
        font-weight: 300;
        line-height: 1;
        font-variant-numeric: tabular-nums;
      }
      .large .sub {
        color: var(--db-muted);
      }
      .large .feature {
        min-height: 56px;
        font-size: 16px;
      }
    `
];
let vt = fs;
ja([
  b()
], vt.prototype, "_config");
customElements.get("daybreak-next-card") || customElements.define("daybreak-next-card", vt);
const dt = document.querySelector("home-assistant")?.hass;
window.customCards = window.customCards || [];
for (const l of [
  { type: "daybreak-alarms-card", name: a(dt, "card_name"), description: a(dt, "card_desc") },
  { type: "daybreak-next-card", name: a(dt, "next_card_name"), description: a(dt, "next_card_desc") }
])
  window.customCards.some((e) => e.type === l.type) || window.customCards.push({ ...l, preview: !0 });
console.info(`%c DAYBREAK %c ${Is} `, "color:#3a2410;background:#ffcf7a;font-weight:bold", "color:#ffcf7a;background:#3a2410");
