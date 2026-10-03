const Ue = {
  title: "DayBreak",
  tab_alarms: "Alarms",
  tab_profiles: "Light profiles",
  tab_last_call: "Last call",
  tab_settings: "Settings",
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
  calendar_title: "Calendar & school holidays",
  calendar_hint: "Keyword rules per calendar: appointment as trigger, other time or exception",
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
  audio_soon: "Music, radio and HomePod via Music Assistant follow in version 0.3.",
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
}, _s = {
  title: "DayBreak",
  tab_alarms: "Wecker",
  tab_profiles: "Lichtprofile",
  tab_last_call: "Letzter Versuch",
  tab_settings: "Einstellungen",
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
  calendar_title: "Kalender & Ferien",
  calendar_hint: "Stichwort-Regeln pro Kalender: Termin als Auslöser, andere Weckzeit oder Ausnahme",
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
  audio_soon: "Musik, Radio und HomePod über Music Assistant kommen mit Version 0.3.",
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
}, Kt = { en: Ue, de: _s };
function ms(o) {
  const e = (o?.locale?.language || o?.language || navigator.language || "en").split("-")[0];
  return e in Kt ? e : "en";
}
function n(o, e, t = {}) {
  return (Kt[ms(o)][e] ?? Ue[e] ?? e).replace(/\{(\w+)\}/g, (i, a) => String(t[a] ?? ""));
}
function he(o, e) {
  const t = e, s = `err_${t?.code}`;
  return t?.code && s in Ue ? n(o, s) : n(o, "error", { msg: t?.message ?? String(e) });
}
const gs = { standard: "Standard", short: "Kurz", long: "Lang" };
function fs(o, e) {
  const t = (i) => {
    const a = `builtin_${i.id}`;
    return i.builtin && a in Ue ? { ...i, name: n(o, a) } : i;
  }, s = (e.settings?.snooze_presets ?? []).map(
    (i) => gs[i.id] === i.name ? { ...i, name: n(o, `preset_${i.id}`) } : i
  );
  return {
    ...e,
    settings: { ...e.settings, snooze_presets: s },
    light_profiles: e.light_profiles.map(t),
    last_call_profiles: e.last_call_profiles.map(t)
  };
}
function Le(o) {
  const e = new Intl.DateTimeFormat(qe(o), { weekday: "short" });
  return [...Array(7).keys()].map((t) => e.format(new Date(2024, 0, 1 + t)));
}
function qe(o) {
  return o?.locale?.language || o?.language || navigator.language || "en";
}
const Te = globalThis, tt = Te.ShadowRoot && (Te.ShadyCSS === void 0 || Te.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, st = /* @__PURE__ */ Symbol(), kt = /* @__PURE__ */ new WeakMap();
let Gt = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== st) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (tt && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = kt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && kt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const bs = (o) => new Gt(typeof o == "string" ? o : o + "", void 0, st), F = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, a) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[a + 1], o[0]);
  return new Gt(t, o, st);
}, vs = (o, e) => {
  if (tt) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = Te.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, zt = tt ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return bs(t);
})(o) : o;
const { is: $s, defineProperty: ws, getOwnPropertyDescriptor: ys, getOwnPropertyNames: xs, getOwnPropertySymbols: ks, getPrototypeOf: zs } = Object, He = globalThis, St = He.trustedTypes, Ss = St ? St.emptyScript : "", As = He.reactiveElementPolyfillSupport, ge = (o, e) => o, De = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? Ss : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, e) {
  let t = o;
  switch (e) {
    case Boolean:
      t = o !== null;
      break;
    case Number:
      t = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(o);
      } catch {
        t = null;
      }
  }
  return t;
} }, it = (o, e) => !$s(o, e), At = { attribute: !0, type: String, converter: De, reflect: !1, useDefault: !1, hasChanged: it };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), He.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let le = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = At) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && ws(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: a } = ys(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: i, set(r) {
      const c = i?.call(this);
      a?.call(this, r), this.requestUpdate(e, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? At;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ge("elementProperties"))) return;
    const e = zs(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ge("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ge("properties"))) {
      const t = this.properties, s = [...xs(t), ...ks(t)];
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
      for (const i of s) t.unshift(zt(i));
    } else e !== void 0 && t.push(zt(e));
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
    return vs(e, this.constructor.elementStyles), e;
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
      const a = (s.converter?.toAttribute !== void 0 ? s.converter : De).toAttribute(t, s.type);
      this._$Em = e, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const a = s.getPropertyOptions(i), r = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : De;
      this._$Em = i;
      const c = r.fromAttribute(t, a.type);
      this[i] = c ?? this._$Ej?.get(i) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, i = !1, a) {
    if (e !== void 0) {
      const r = this.constructor;
      if (i === !1 && (a = this[e]), s ??= r.getPropertyOptions(e), !((s.hasChanged ?? it)(a, t) || s.useDefault && s.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(r._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: a }, r) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), a !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [i, a] of this._$Ep) this[i] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, a] of s) {
        const { wrapped: r } = a, c = this[i];
        r !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, a, c);
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
le.elementStyles = [], le.shadowRootOptions = { mode: "open" }, le[ge("elementProperties")] = /* @__PURE__ */ new Map(), le[ge("finalized")] = /* @__PURE__ */ new Map(), As?.({ ReactiveElement: le }), (He.reactiveElementVersions ??= []).push("2.1.2");
const nt = globalThis, Et = (o) => o, Oe = nt.trustedTypes, Ct = Oe ? Oe.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Vt = "$lit$", X = `lit$${Math.random().toFixed(9).slice(2)}$`, Zt = "?" + X, Es = `<${Zt}>`, ae = document, be = () => ae.createComment(""), ve = (o) => o === null || typeof o != "object" && typeof o != "function", at = Array.isArray, Cs = (o) => at(o) || typeof o?.[Symbol.iterator] == "function", Ge = `[ 	
\f\r]`, me = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Mt = /-->/g, Pt = />/g, te = RegExp(`>|${Ge}(?:([^\\s"'>=/]+)(${Ge}*=${Ge}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Wt = /'/g, Tt = /"/g, Xt = /^(?:script|style|textarea|title)$/i, Yt = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), l = Yt(1), ce = Yt(2), pe = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), Nt = /* @__PURE__ */ new WeakMap(), ne = ae.createTreeWalker(ae, 129);
function Jt(o, e) {
  if (!at(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ct !== void 0 ? Ct.createHTML(e) : e;
}
const Ms = (o, e) => {
  const t = o.length - 1, s = [];
  let i, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = me;
  for (let c = 0; c < t; c++) {
    const d = o[c];
    let h, u, m = -1, _ = 0;
    for (; _ < d.length && (r.lastIndex = _, u = r.exec(d), u !== null); ) _ = r.lastIndex, r === me ? u[1] === "!--" ? r = Mt : u[1] !== void 0 ? r = Pt : u[2] !== void 0 ? (Xt.test(u[2]) && (i = RegExp("</" + u[2], "g")), r = te) : u[3] !== void 0 && (r = te) : r === te ? u[0] === ">" ? (r = i ?? me, m = -1) : u[1] === void 0 ? m = -2 : (m = r.lastIndex - u[2].length, h = u[1], r = u[3] === void 0 ? te : u[3] === '"' ? Tt : Wt) : r === Tt || r === Wt ? r = te : r === Mt || r === Pt ? r = me : (r = te, i = void 0);
    const g = r === te && o[c + 1].startsWith("/>") ? " " : "";
    a += r === me ? d + Es : m >= 0 ? (s.push(h), d.slice(0, m) + Vt + d.slice(m) + X + g) : d + X + (m === -2 ? c : g);
  }
  return [Jt(o, a + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class $e {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let a = 0, r = 0;
    const c = e.length - 1, d = this.parts, [h, u] = Ms(e, t);
    if (this.el = $e.createElement(h, s), ne.currentNode = this.el.content, t === 2 || t === 3) {
      const m = this.el.content.firstChild;
      m.replaceWith(...m.childNodes);
    }
    for (; (i = ne.nextNode()) !== null && d.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const m of i.getAttributeNames()) if (m.endsWith(Vt)) {
          const _ = u[r++], g = i.getAttribute(m).split(X), b = /([.?@])?(.*)/.exec(_);
          d.push({ type: 1, index: a, name: b[2], strings: g, ctor: b[1] === "." ? Ws : b[1] === "?" ? Ts : b[1] === "@" ? Ns : Ie }), i.removeAttribute(m);
        } else m.startsWith(X) && (d.push({ type: 6, index: a }), i.removeAttribute(m));
        if (Xt.test(i.tagName)) {
          const m = i.textContent.split(X), _ = m.length - 1;
          if (_ > 0) {
            i.textContent = Oe ? Oe.emptyScript : "";
            for (let g = 0; g < _; g++) i.append(m[g], be()), ne.nextNode(), d.push({ type: 2, index: ++a });
            i.append(m[_], be());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Zt) d.push({ type: 2, index: a });
      else {
        let m = -1;
        for (; (m = i.data.indexOf(X, m + 1)) !== -1; ) d.push({ type: 7, index: a }), m += X.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const s = ae.createElement("template");
    return s.innerHTML = e, s;
  }
}
function ue(o, e, t = o, s) {
  if (e === pe) return e;
  let i = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const a = ve(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(o), i._$AT(o, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = i : t._$Cl = i), i !== void 0 && (e = ue(o, i._$AS(o, e.values), i, s)), e;
}
class Ps {
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
    const { el: { content: t }, parts: s } = this._$AD, i = (e?.creationScope ?? ae).importNode(t, !0);
    ne.currentNode = i;
    let a = ne.nextNode(), r = 0, c = 0, d = s[0];
    for (; d !== void 0; ) {
      if (r === d.index) {
        let h;
        d.type === 2 ? h = new ke(a, a.nextSibling, this, e) : d.type === 1 ? h = new d.ctor(a, d.name, d.strings, this, e) : d.type === 6 && (h = new Ls(a, this, e)), this._$AV.push(h), d = s[++c];
      }
      r !== d?.index && (a = ne.nextNode(), r++);
    }
    return ne.currentNode = ae, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class ke {
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
    e = ue(this, e, t), ve(e) ? e === p || e == null || e === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : e !== this._$AH && e !== pe && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Cs(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== p && ve(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ae.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = $e.createElement(Jt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const a = new Ps(i, this), r = a.u(this.options);
      a.p(t), this.T(r), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = Nt.get(e.strings);
    return t === void 0 && Nt.set(e.strings, t = new $e(e)), t;
  }
  k(e) {
    at(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const a of e) i === t.length ? t.push(s = new ke(this.O(be()), this.O(be()), this, this.options)) : s = t[i], s._$AI(a), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = Et(e).nextSibling;
      Et(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
let Ie = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, a) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(e, t = this, s, i) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) e = ue(this, e, t, 0), r = !ve(e) || e !== this._$AH && e !== pe, r && (this._$AH = e);
    else {
      const c = e;
      let d, h;
      for (e = a[0], d = 0; d < a.length - 1; d++) h = ue(this, c[s + d], t, d), h === pe && (h = this._$AH[d]), r ||= !ve(h) || h !== this._$AH[d], h === p ? e = p : e !== p && (e += (h ?? "") + a[d + 1]), this._$AH[d] = h;
    }
    r && !i && this.j(e);
  }
  j(e) {
    e === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
};
class Ws extends Ie {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === p ? void 0 : e;
  }
}
class Ts extends Ie {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== p);
  }
}
class Ns extends Ie {
  constructor(e, t, s, i, a) {
    super(e, t, s, i, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = ue(this, e, t, 0) ?? p) === pe) return;
    const s = this._$AH, i = e === p && s !== p || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, a = e !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ls {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ue(this, e);
  }
}
const Ds = nt.litHtmlPolyfillSupport;
Ds?.($e, ke), (nt.litHtmlVersions ??= []).push("3.3.3");
const Os = (o, e, t) => {
  const s = t?.renderBefore ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const a = t?.renderBefore ?? null;
    s._$litPart$ = i = new ke(e.insertBefore(be(), a), a, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
const rt = globalThis;
class L extends le {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Os(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return pe;
  }
}
L._$litElement$ = !0, L.finalized = !0, rt.litElementHydrateSupport?.({ LitElement: L });
const Bs = rt.litElementPolyfillSupport;
Bs?.({ LitElement: L });
(rt.litElementVersions ??= []).push("4.2.2");
const Fs = { attribute: !0, type: String, converter: De, reflect: !1, hasChanged: it }, Rs = (o = Fs, e, t) => {
  const { kind: s, metadata: i } = t;
  let a = globalThis.litPropertyMetadata.get(i);
  if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), s === "setter" && ((o = Object.create(o)).wrapped = !0), a.set(t.name, o), s === "accessor") {
    const { name: r } = t;
    return { set(c) {
      const d = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(r, d, o, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, o, c), c;
    } };
  }
  if (s === "setter") {
    const { name: r } = t;
    return function(c) {
      const d = this[r];
      e.call(this, c), this.requestUpdate(r, d, o, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function f(o) {
  return (e, t) => typeof t == "object" ? Rs(o, e, t) : ((s, i, a) => {
    const r = i.hasOwnProperty(a);
    return i.constructor.createProperty(a, s), r ? Object.getOwnPropertyDescriptor(i, a) : void 0;
  })(o, e, t);
}
function v(o) {
  return f({ ...o, state: !0, attribute: !1 });
}
const Qe = ["sunrise", "ringing", "snoozed", "last_call"], Qt = (o, e) => o.callWS({ type: "daybreak/alarm/create", alarm: e }), js = (o, e, t) => o.callWS({ type: "daybreak/alarm/update", alarm_id: e, changes: t }), Us = (o, e) => o.callWS({ type: "daybreak/alarm/delete", alarm_id: e }), es = (o, e, t, s = {}) => o.callWS({ type: "daybreak/alarm/action", action: e, alarm_id: t, ...s }), qs = (o, e, t, s, i = null) => o.callWS({ type: "daybreak/alarm/once", alarm_id: e, date: t, time: s, light_lead: i }), ot = (o, e) => o.callWS({ type: "daybreak/settings", changes: e }), we = (o, e, t, s = !1) => o.callWS({ type: "daybreak/profile/save", kind: e, profile: t, confirm: s }), ts = (o, e, t) => o.callWS({ type: "daybreak/profile/delete", kind: e, profile_id: t }), Ve = /* @__PURE__ */ new Map();
function ss(o, e, t = 1) {
  const s = `${e}/${t}`;
  let i = Ve.get(s);
  return i || (i = o.callWS({ type: "daybreak/sun", date: e, days: t }), i.catch(() => Ve.delete(s)), Ve.set(s, i)), i;
}
const Hs = (o, e, t, s) => o.callWS({ type: "daybreak/preview", entity_id: e, settings: t, progress: s }), Lt = /* @__PURE__ */ new WeakMap();
function is(o, e) {
  let t = Lt.get(o.connection);
  t || (t = { listeners: /* @__PURE__ */ new Set() }, Lt.set(o.connection, t));
  const s = t;
  return s.listeners.add(e), s.last && e(s.last), s.unsub || (s.unsub = o.connection.subscribeMessage(
    (i) => {
      s.last = i, s.listeners.forEach((a) => a(i));
    },
    { type: "daybreak/subscribe" }
  ), s.unsub.catch(() => {
    s.unsub = void 0;
  })), () => {
    if (s.listeners.delete(e), s.listeners.size === 0 && s.unsub) {
      const i = s.unsub;
      s.unsub = void 0, s.last = void 0, i.then((a) => a()).catch(() => {
      });
    }
  };
}
const Is = (o = 30) => ce`<svg width=${o} height=${o} viewBox="0 0 48 48" aria-hidden="true">
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
</svg>`, fe = {
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
}, Be = {
  sunrise: ["#3A0D06", "#A32B10", "#F07A2A", "#FFD28A", "#FFF2DC"],
  dawn: ["#2A0B1E", "#8A2A55", "#F06A5A", "#FFC29A", "#FFE9D6"],
  pastel: ["#2B2340", "#7B6BB0", "#F0A7C0", "#FFD9C8", "#FFF1E6"]
}, ns = {
  sunrise: [1800, 3600],
  dawn: [1800, 3e3],
  pastel: [2200, 4e3],
  custom: [1800, 3600]
}, Dt = fe.natural.map(([o, e]) => ({ t: o, v: e }));
function as() {
  return {
    curve: "natural",
    points: structuredClone(Dt),
    separate: !1,
    points_color: structuredClone(Dt),
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
function Ot(o = "wake", e = "") {
  const t = {
    name: e,
    kind: o,
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
    light: { targets: {}, profile: null, settings: as(), overrides: [] },
    actions: { light_start: [], wake: [], snooze: [], stop: [] },
    fallback: {
      lights: {},
      notify: null,
      events: ["skipped", "shifted", "device_unavailable", "failed"],
      persistent: !0
    }
  };
  return o === "sleep" && (t.wake.time = "22:30", t.light_lead = 30, t.repeat.days = [0, 1, 2, 3, 4, 5, 6], t.wake_on_holidays = !0, t.light.settings.curve = "linear", t.light.settings.brightness = [1, 40], t.light.settings.kelvin = [2e3, 2400]), o === "kids" && (t.wake.time = "06:45", t.light_lead = 60, t.repeat.days = [0, 1, 2, 3, 4, 5, 6], t.wake_on_holidays = !0), t;
}
const Ks = ["hs", "xy", "rgb", "rgbw", "rgbww"];
function Bt(o) {
  const e = new Set(o ?? []);
  return e.size ? {
    ct: e.has("color_temp"),
    color: Ks.some((t) => e.has(t)),
    dim: !(e.size === 1 && e.has("onoff"))
  } : { ct: !1, color: !1, dim: !0 };
}
function ye(o, e) {
  return o.curve !== "custom" ? fe[o.curve] : (e === "col" && o.separate ? o.points_color : o.points).map((s) => [s.t, s.v]);
}
function Gs(o) {
  const e = o.length, t = [];
  for (let i = 0; i < e - 1; i++)
    t.push((o[i + 1][1] - o[i][1]) / (o[i + 1][0] - o[i][0] || 1e-9));
  if (e === 2) return [t[0], t[0]];
  const s = [t[0]];
  for (let i = 1; i < e - 1; i++) s.push(t[i - 1] * t[i] <= 0 ? 0 : 2 / (1 / t[i - 1] + 1 / t[i]));
  return s.push(t[e - 2]), s;
}
function de(o, e) {
  if (e = Math.min(1, Math.max(0, e)), e <= o[0][0]) return o[0][1];
  if (e >= o[o.length - 1][0]) return o[o.length - 1][1];
  const t = Gs(o);
  for (let s = 0; s < o.length - 1; s++) {
    const [i, a] = o[s], [r, c] = o[s + 1];
    if (e <= r) {
      const d = r - i || 1e-9, h = (e - i) / d, u = (2 * h ** 3 - 3 * h ** 2 + 1) * a + (h ** 3 - 2 * h ** 2 + h) * d * t[s] + (-2 * h ** 3 + 3 * h ** 2) * c + (h ** 3 - h ** 2) * d * t[s + 1];
      return Math.min(1, Math.max(0, u));
    }
  }
  return o[o.length - 1][1];
}
function Ze(o) {
  const e = o.replace("#", "");
  return [parseInt(e.slice(0, 2), 16), parseInt(e.slice(2, 4), 16), parseInt(e.slice(4, 6), 16)];
}
function Vs(o, e, t) {
  return [o[0] + (e[0] - o[0]) * t, o[1] + (e[1] - o[1]) * t, o[2] + (e[2] - o[2]) * t];
}
function Zs(o) {
  if (o.colors === "custom" && o.sequence.length >= 2) {
    const t = o.sequence.reduce((r, c) => r + c.minutes, 0) || 1, s = [];
    let i = 0;
    for (const r of o.sequence)
      s.push([i / t, r.color, r.brightness]), i += r.minutes;
    const a = o.sequence[o.sequence.length - 1];
    return s.push([1, a.color, a.brightness]), s;
  }
  const e = Be[o.colors] ?? Be.sunrise;
  return e.map((t, s) => [s / (e.length - 1), t, null]);
}
function Xs(o, e) {
  const t = Zs(o);
  e = Math.min(1, Math.max(0, e));
  for (let i = 0; i < t.length - 1; i++) {
    const [a, r, c] = t[i], [d, h, u] = t[i + 1];
    if (e <= d) {
      const m = d === a ? 0 : (e - a) / (d - a);
      return { rgb: Vs(Ze(r), Ze(h), m), bri: c === null || u === null ? null : c + (u - c) * m };
    }
  }
  const s = t[t.length - 1];
  return { rgb: Ze(s[1]), bri: s[2] };
}
function rs(o) {
  return o.plain_kelvin ?? ns[o.colors];
}
function xe(o, e, t = { ct: !0, color: !0, dim: !0 }) {
  const s = Math.min(1, Math.max(0, e));
  let i = o.brightness[0] + (o.brightness[1] - o.brightness[0]) * de(ye(o, "bri"), s);
  const a = de(ye(o, "col"), s);
  if (o.color_mode === "color") {
    if (t.color) {
      const r = o.colors === "custom" && o.sequence.length >= 2, c = Xs(o, r ? s : a);
      return r && c.bri !== null && (i = c.bri), { bri: i, kelvin: null, rgb: c.rgb };
    }
    if (t.ct) {
      const [r, c] = rs(o);
      return { bri: i, kelvin: r + (c - r) * a, rgb: null };
    }
    return { bri: i, kelvin: null, rgb: null };
  }
  return t.ct || t.color ? { bri: i, kelvin: o.kelvin[0] + (o.kelvin[1] - o.kelvin[0]) * a, rgb: null } : { bri: i, kelvin: null, rgb: null };
}
function Ne(o) {
  const e = o / 100;
  let t, s, i;
  e <= 66 ? (t = 255, s = 99.4708025861 * Math.log(e) - 161.1195681661, i = e <= 19 ? 0 : 138.5177312231 * Math.log(e - 10) - 305.0447927307) : (t = 329.698727446 * Math.pow(e - 60, -0.1332047592), s = 288.1221695283 * Math.pow(e - 60, -0.0755148492), i = 255);
  const a = (r) => Math.round(Math.min(255, Math.max(0, r)));
  return [a(t), a(s), a(i)];
}
function lt(o, e = !0) {
  const t = o.rgb ?? (o.kelvin ? Ne(o.kelvin) : [255, 236, 210]), s = e ? 0.18 + 0.82 * Math.pow(Math.min(100, Math.max(0, o.bri)) / 100, 0.6) : 1;
  return `rgb(${t.map((i) => Math.round(i * s)).join(",")})`;
}
function Y(o, e, t = !0, s = 12) {
  const i = [];
  for (let a = 0; a <= s; a++) {
    const r = a / s;
    i.push(`${lt(xe(o, r, e), t)} ${Math.round(r * 100)}%`);
  }
  return `linear-gradient(90deg, ${i.join(", ")})`;
}
function Ys(o, e) {
  const t = Be[o], s = Math.max(0.5, Math.round(e / (t.length - 1) * 2) / 2);
  return t.map((i, a) => ({
    color: i,
    brightness: Math.round(1 + 99 * a / (t.length - 1)),
    minutes: s,
    transition: "smooth"
  }));
}
function os(o, e) {
  if (e == null) return o;
  if (Array.isArray(o) || typeof o != "object" || o === null) return e;
  if (typeof e != "object" || Array.isArray(e)) return o;
  const t = { ...o };
  for (const [s, i] of Object.entries(e))
    t[s] = s in o ? os(o[s], i) : i;
  return t;
}
const K = F`
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
`, Ke = (o) => o?.config?.time_zone || void 0;
function ls(o) {
  const e = o?.locale?.time_format;
  if (e === "12") return !0;
  if (e === "24") return !1;
}
function V(o, e) {
  const t = typeof e == "string" ? new Date(e) : e;
  return new Intl.DateTimeFormat(qe(o), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: ls(o),
    timeZone: Ke(o)
  }).format(t);
}
function z(o, e) {
  const [t, s] = e.split(":").map(Number);
  return new Intl.DateTimeFormat(qe(o), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: ls(o),
    timeZone: "UTC"
  }).format(new Date(Date.UTC(2024, 0, 1, t, s)));
}
function H(o, e) {
  const t = typeof e == "string" ? new Date(e.length === 10 ? `${e}T12:00:00Z` : e) : e;
  return new Intl.DateTimeFormat(qe(o), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: typeof e == "string" && e.length === 10 ? "UTC" : Ke(o)
  }).format(t);
}
function et(o, e, t = Date.now()) {
  let s = Math.max(0, Math.round((new Date(e).getTime() - t) / 6e4));
  const i = Math.floor(s / 1440);
  s -= i * 1440;
  const a = Math.floor(s / 60);
  return s -= a * 60, i ? n(o, "dur_dh", { d: i, h: a }) : a ? n(o, "dur_hm", { h: a, m: String(s).padStart(2, "0") }) : n(o, "dur_m", { m: s });
}
const y = (o) => {
  const [e, t] = o.split(":").map(Number);
  return e * 60 + t;
}, M = (o) => {
  const e = (Math.round(o) % 1440 + 1440) % 1440;
  return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
};
function ie(o, e = /* @__PURE__ */ new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: Ke(o)
  }).format(e);
}
function ct(o, e) {
  const t = typeof e == "string" ? new Date(e) : e;
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: Ke(o)
  }).format(t);
}
function oe(o, e) {
  const t = /* @__PURE__ */ new Date(`${o}T12:00:00Z`);
  return t.setUTCDate(t.getUTCDate() + e), t.toISOString().slice(0, 10);
}
const Ft = (o) => ((/* @__PURE__ */ new Date(`${o}T12:00:00Z`)).getUTCDay() + 6) % 7;
function Rt(o, e) {
  const t = o.repeat;
  if (t.type === "once") return t.date === null || t.date === e;
  const s = t.start_date ?? "2024-01-01", i = Math.round(
    ((/* @__PURE__ */ new Date(`${e}T12:00:00Z`)).getTime() - (/* @__PURE__ */ new Date(`${s}T12:00:00Z`)).getTime()) / 864e5
  );
  if (t.type === "weekly") {
    if (!t.days.includes(Ft(e))) return !1;
    if (t.week_cycle <= 1) return !0;
    const a = i + Ft(s), r = (Math.floor(a / 7) % t.week_cycle + t.week_cycle) % t.week_cycle;
    return t.weeks[r] ?? !1;
  }
  return i < 0 ? !1 : t.type === "interval" ? i % (t.interval * (t.unit === "weeks" ? 7 : 1)) === 0 : t.pattern[i % t.pattern.length] ?? !1;
}
function dt(o, e) {
  const t = e.repeat;
  if (t.type === "once") return t.date ? n(o, "on_date", { date: H(o, t.date) }) : n(o, "once");
  if (t.type === "interval")
    return n(o, t.unit === "weeks" ? "every_n_weeks" : "every_n_days", { n: t.interval });
  if (t.type === "pattern")
    return n(o, "pattern_summary", { on: t.pattern.filter(Boolean).length, n: t.pattern.length });
  const s = [...t.days].sort();
  let i;
  return s.length === 7 ? i = n(o, "every_day") : s.join() === "0,1,2,3,4" ? i = n(o, "weekdays") : s.join() === "5,6" ? i = n(o, "weekend") : i = s.map((a) => Le(o)[a]).join(", "), t.week_cycle > 1 && (i += " · " + n(o, "week_cycle_short", { n: t.week_cycle })), i;
}
function E(o, e) {
  return o?.states[e]?.attributes.friendly_name ?? e;
}
function Fe(o, e) {
  if (!o) return e.entity_id ?? [];
  const t = new Set((e.entity_id ?? []).filter((a) => a.startsWith("light."))), s = Object.values(o.entities ?? {}), i = o.devices ?? {};
  for (const a of s) {
    if (!a.entity_id.startsWith("light.")) continue;
    a.device_id && e.device_id?.includes(a.device_id) && t.add(a.entity_id);
    const r = a.area_id ?? (a.device_id ? i[a.device_id]?.area_id : null);
    r && e.area_id?.includes(r) && t.add(a.entity_id);
  }
  return [...t].sort();
}
let jt;
function Js() {
  return customElements.get("ha-form") && customElements.get("ha-selector") ? Promise.resolve() : (jt ??= (async () => {
    const o = await window.loadCardHelpers?.();
    o && await (await o.createCardElement({ type: "entities", entities: [] }))?.constructor?.getConfigElement?.(), await customElements.whenDefined("ha-form");
  })(), jt);
}
function S(o, e, t = {}) {
  o.dispatchEvent(new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 }));
}
const $ = (o, e, t) => Math.min(t, Math.max(e, o));
var Qs = Object.defineProperty, ze = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && Qs(e, t, i), i;
};
const Me = ["astronomical_dawn", "nautical_dawn", "civil_dawn", "sunrise"], Ut = ["sunset", "civil_dusk", "nautical_dusk", "astronomical_dusk"], Pe = {
  astronomical: "var(--db-astro)",
  nautical: "var(--db-nautical)",
  civil: "var(--db-civil)",
  sun: "var(--db-sun)"
}, Xe = (o) => o.startsWith("astronomical") ? Pe.astronomical : o.startsWith("nautical") ? Pe.nautical : o.startsWith("civil") ? Pe.civil : Pe.sun;
function cs(o, e, t) {
  const s = e?.[t.sun_event];
  if (!s) return null;
  let i = y(ct(o, s)) + t.offset;
  return t.earliest && (i = Math.max(i, y(t.earliest))), t.latest && (i = Math.min(i, y(t.latest))), i;
}
const pt = class pt extends L {
  constructor() {
    super(...arguments), this.date = "", this.mode = "normal", this._loaded = "";
  }
  willUpdate() {
    this.hass && this.date && this._loaded !== this.date && (this._loaded = this.date, ss(this.hass, this.date).then((e) => this._sun = e[this.date]).catch(() => {
    }));
  }
  _set(e) {
    S(this, "wake-change", { ...this.wake, ...e });
  }
  _local(e) {
    const t = this._sun?.[e];
    return t ? y(ct(this.hass, t)) : null;
  }
  wakeMinutes() {
    return cs(this.hass, this._sun, this.wake);
  }
  _graphic() {
    const e = this.hass, t = Me.includes(this.wake.sun_event), s = t ? Me : Ut, i = s.map((w) => this._local(w)), a = i.filter((w) => w !== null), r = this.wakeMinutes();
    if (!a.length) return l`<div class="muted">${n(e, "sun_none")}</div>`;
    const c = Math.min(...a, r ?? 1 / 0) - 40, d = Math.max(...a, r ?? -1 / 0) + 40, h = (w) => ($(w, c, d) - c) / (d - c) * 100, u = "#0b1020", m = t ? [u, "#1b2550", "#3d3a78", "#b5577a", "#ffb36b", "#ffe2a8"] : ["#ffe2a8", "#ffb36b", "#b5577a", "#3d3a78", "#1b2550", u], _ = t ? [h(i[0] ?? c) - 4, ...i.map((w) => w === null ? 0 : h(w)), h(i[3] ?? d) + 8] : [h(i[0] ?? c) - 8, ...i.map((w) => w === null ? 100 : h(w)), h(i[3] ?? d) + 4], g = `linear-gradient(90deg, ${m.map((w, T) => `${w} ${$(_[T], 0, 100)}%`).join(", ")})`, b = this.wake.earliest ? h(y(this.wake.earliest)) : null, x = this.wake.latest ? h(y(this.wake.latest)) : null;
    return l`
      <div class="sky" style="background:${g}">
        ${b !== null ? l`<div class="limit" style="left:0;width:${b}%"></div>` : p}
        ${x !== null ? l`<div class="limit" style="left:${x}%;right:0"></div>` : p}
        ${s.map(
      (w, T) => i[T] === null ? p : l`<div
                  class="mark ${w === this.wake.sun_event ? "sel" : ""}"
                  style="left:${h(i[T])}%;background:${Xe(w)}"
                  title=${n(e, `sun_${w}`)}
                ></div>
                ${w === this.wake.sun_event ? l`<span class="mlabel" style="left:${h(i[T])}%">${z(e, M(i[T]))}</span>` : p}`
    )}
        ${r !== null ? l`<div class="wakeline" style="left:${h(r)}%"></div>
              <span class="wake" style="left:${h(r)}%">${z(e, M(r))}</span>` : p}
      </div>
      <div class="legend">
        ${s.map(
      (w) => l`<span><i class="dot" style="background:${Xe(w)}"></i>${n(e, `sun_${w}`)}</span>`
    )}
        <span>${H(e, this.date)}</span>
      </div>
    `;
  }
  render() {
    const e = this.hass, t = this.wake, s = Me.includes(t.sun_event), i = s ? Me : Ut, a = t.offset < 0;
    return l`
      <div class="row">
        <div class="seg" role="group">
          <button aria-pressed=${s} @click=${() => !s && this._set({ sun_event: "sunrise" })}>
            ${n(e, "sun_rise")}
          </button>
          <button aria-pressed=${!s} @click=${() => s && this._set({ sun_event: "sunset" })}>
            ${n(e, "sun_set")}
          </button>
        </div>
      </div>
      <div class="ev">
        ${i.map(
      (r) => l`<button class="chip" aria-pressed=${t.sun_event === r} @click=${() => this._set({ sun_event: r })}>
            <i class="dot" style="background:${Xe(r)}"></i>${n(e, `sun_${r}`)}
            ${this._local(r) !== null ? l`<span class="muted tabular">${z(e, M(this._local(r)))}</span>` : p}
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
          aria-label=${n(e, "sun_offset")}
          @change=${(r) => {
      const c = $(Number(r.target.value) || 0, 0, 240);
      this._set({ offset: a ? -c : c });
    }}
        />
        <span>min</span>
        <div class="seg" role="group">
          <button aria-pressed=${a} @click=${() => !a && this._set({ offset: -Math.abs(t.offset) || -15 })}>
            ${n(e, "sun_before")}
          </button>
          <button aria-pressed=${!a} @click=${() => a && this._set({ offset: Math.abs(t.offset) })}>
            ${n(e, "sun_after")}
          </button>
        </div>
        ${this.mode !== "simple" ? l`<span class="grow"></span>
              ${this.mode === "expert" ? l`<label class="row">
                    <span class="muted">${n(e, "sun_earliest")}</span>
                    <input class="inp time" type="time" .value=${t.earliest ?? ""}
                      @change=${(r) => this._set({ earliest: r.target.value || null })} />
                  </label>` : p}
              <label class="row">
                <span class="muted">${n(e, "sun_latest")}</span>
                <input class="inp time" type="time" .value=${t.latest ?? ""}
                  @change=${(r) => this._set({ latest: r.target.value || null })} />
              </label>` : p}
      </div>
      ${this._graphic()}
    `;
  }
};
pt.styles = [
  K,
  F`
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
let J = pt;
ze([
  f({ attribute: !1 })
], J.prototype, "hass");
ze([
  f({ attribute: !1 })
], J.prototype, "wake");
ze([
  f()
], J.prototype, "date");
ze([
  f()
], J.prototype, "mode");
ze([
  v()
], J.prototype, "_sun");
customElements.define("db-sun-wake", J);
var ei = Object.defineProperty, B = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && ei(e, t, i), i;
};
const ut = class ut extends L {
  constructor() {
    super(...arguments), this.time = "07:00", this.lead = 30, this.snooze = 9, this.count = 3, this.lastCall = !1, this.lcDuration = 10, this.fixedWake = !1, this.showSnooze = !0, this.startLabel = "", this.wakeLabel = "", this.gradient = "linear-gradient(90deg,#3a1a12,#ff8a4c,#fff3e0)", this._dragText = "", this._width = 600;
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
  /** Minutes shown left of the wake mark (room to drag the light start). */
  get _room() {
    return this._frozen ? this._frozen[0] : Math.max(30, Math.ceil((this.lead + 15) / 15) * 15);
  }
  /** Total minutes covered by the bar. */
  get _span() {
    if (this._frozen) return this._frozen[1];
    if (!this.showSnooze) return this._room + 6;
    const e = this.snooze * this.count + (this.lastCall ? this.lcDuration : 0);
    return this._room + e + Math.max(this.snooze, 8);
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
    const s = e === "start" ? 30 : e === "end" ? this.snooze * 3 : 20;
    this._frozen = [this._room + (e === "start" ? 30 : 0), this._span + s], this._drag = e, t.currentTarget.setPointerCapture(t.pointerId);
  }
  _move(e) {
    if (!this._drag) return;
    const t = this._minutesAt(e);
    if (this._drag === "start") {
      const s = Math.round($(-t, 0, 240));
      this._dragText = z(this.hass, M(y(this.time) - s)), this._emit({ lead: s });
    } else if (this._drag === "end") {
      const s = Math.round($(t / this.snooze, 1, 10));
      this._dragText = `${z(this.hass, M(y(this.time) + s * this.snooze))} · ${s}×`, this._emit({ count: s });
    } else {
      const s = Math.round($(t - this.snooze * this.count, 1, 120));
      this._dragText = z(this.hass, M(y(this.time) + this.snooze * this.count + s)), this._emit({ lcDuration: s });
    }
  }
  _up() {
    this._drag = void 0, this._frozen = void 0;
  }
  _key(e, t) {
    const s = t.key === "ArrowRight" || t.key === "ArrowUp" ? 1 : t.key === "ArrowLeft" || t.key === "ArrowDown" ? -1 : 0;
    s && (t.preventDefault(), e === "start" ? this._emit({ lead: $(this.lead - s, 0, 240) }) : e === "end" ? this._emit({ count: $(this.count + s, 1, 10) }) : this._emit({ lcDuration: $(this.lcDuration + s, 1, 120) }));
  }
  _diff(e, t) {
    let s = y(e) - y(t);
    return s < -720 && (s += 1440), s;
  }
  _setStart(e) {
    const t = e.target.value;
    if (!t) return;
    let s = y(this.time) - y(t);
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
    const e = this.hass, t = this._room, s = y(this.time), i = M(s - this.lead), a = this.snooze * this.count, r = M(s + a), c = this.showSnooze && this.lastCall, d = M(s + a + this.lcDuration), h = this._pct(t - this.lead), u = this._pct(t), m = this._pct(t + a), _ = this._pct(t + a + this.lcDuration), g = Math.max(3, Math.floor(this._width / 84)), b = [5, 10, 15, 30, 60, 120].find((k) => this._span / k <= g) ?? 120, x = s - t, w = [];
    for (let k = Math.ceil(x / b) * b - x; k <= this._span; k += b)
      w.push({ pct: this._pct(k), text: z(e, M(x + k)) });
    const T = this.lastCall ? n(e, "tl_last_call") : n(e, "tl_stop"), Ee = this._drag === "start" ? h : this._drag === "off" ? _ : m;
    return l`
      <div class="labels" style="--cols:${c ? 4 : 3}">
        <label>
          <span>${this.startLabel || n(e, "tl_light_start")}</span>
          <input class="inp tabular" type="time" .value=${i} @change=${this._setStart} />
        </label>
        <label>
          <span>${this.wakeLabel || n(e, "tl_wake")}</span>
          <input class="inp tabular" type="time" .value=${this.time} ?readonly=${this.fixedWake} @change=${this._setWake} />
        </label>
        ${this.showSnooze ? l`<label>
              <span>${T}</span>
              <input class="inp tabular" type="time" step="60" .value=${r} @change=${this._setEnd} />
            </label>` : l`<span></span>`}
        ${c ? l`<label>
              <span>${n(e, "tl_off")}</span>
              <input class="inp tabular" type="time" .value=${d} @change=${this._setOff} />
            </label>` : p}
      </div>
      <div class="bar" @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
        <div class="track"></div>
        <div class="seg ramp" style="left:${h}%;width:${u - h}%;background:${this.gradient}"></div>
        ${this.showSnooze ? l`<div
              class="seg snz"
              style="left:${u}%;width:${m - u}%;--w:${100 / Math.max(1, this.count)}%"
              title=${n(e, "tl_snooze_title", { n: this.count, m: this.snooze })}
            ></div>` : p}
        ${c ? l`<div class="seg lc" style="left:${m}%;width:${_ - m}%" title=${n(e, "tl_last_call")}></div>` : p}
        <div class="wake" style="left:${u}%" title=${this.wakeLabel || n(e, "tl_wake")}></div>
        <div
          class="handle start"
          style="left:${h}%"
          tabindex="0"
          role="slider"
          aria-label=${this.startLabel || n(e, "tl_light_start")}
          aria-valuetext=${z(e, i)}
          @pointerdown=${(k) => this._down("start", k)}
          @keydown=${(k) => this._key("start", k)}
        ><span></span></div>
        ${this.showSnooze ? l`<div
              class="handle end"
              style="left:${m}%"
              tabindex="0"
              role="slider"
              aria-label=${T}
              aria-valuetext=${`${z(e, r)}, ${this.count}×`}
              @pointerdown=${(k) => this._down("end", k)}
              @keydown=${(k) => this._key("end", k)}
            ><span></span></div>` : p}
        ${c ? l`<div
              class="handle off"
              style="left:${_}%"
              tabindex="0"
              role="slider"
              aria-label=${n(e, "tl_off")}
              aria-valuetext=${z(e, d)}
              @pointerdown=${(k) => this._down("off", k)}
              @keydown=${(k) => this._key("off", k)}
            ><span></span></div>` : p}
        ${this._drag ? l`<span class="tip" style="left:${Ee}%">${this._dragText}</span>` : p}
        <div class="ticks">${w.map(
      (k) => l`<span class=${k.pct < 7 ? "first" : k.pct > 93 ? "last" : ""} style="left:${k.pct}%">${k.text}</span>`
    )}</div>
      </div>
    `;
  }
};
ut.styles = [
  K,
  F`
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
let P = ut;
B([
  f({ attribute: !1 })
], P.prototype, "hass");
B([
  f()
], P.prototype, "time");
B([
  f({ type: Number })
], P.prototype, "lead");
B([
  f({ type: Number })
], P.prototype, "snooze");
B([
  f({ type: Number })
], P.prototype, "count");
B([
  f({ type: Boolean })
], P.prototype, "lastCall");
B([
  f({ type: Number })
], P.prototype, "lcDuration");
B([
  f({ type: Boolean })
], P.prototype, "fixedWake");
B([
  f({ type: Boolean })
], P.prototype, "showSnooze");
B([
  f()
], P.prototype, "startLabel");
B([
  f()
], P.prototype, "wakeLabel");
B([
  f()
], P.prototype, "gradient");
B([
  v()
], P.prototype, "_drag");
B([
  v()
], P.prototype, "_dragText");
B([
  v()
], P.prototype, "_width");
customElements.define("db-time-line", P);
var ti = Object.defineProperty, ee = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && ti(e, t, i), i;
};
const _t = class _t extends L {
  constructor() {
    super(...arguments), this.bands = [], this.cap = 30, this.lead = 30, this.combine = "max", this.time = "07:00", this.gradient = "linear-gradient(90deg,#3a1a12,#ff8a4c,#fff3e0)";
  }
  get _result() {
    const e = this.bands.map((s) => s.minutes ?? 0), t = this.combine === "sum" ? e.reduce((s, i) => s + i, 0) : Math.max(0, ...e);
    return Math.min(t, this.cap);
  }
  /** Clock range of the axis in minutes since midnight (relative to wake). */
  get _bounds() {
    if (this._range) return this._range;
    const e = y(this.time), t = Math.max(this.cap, ...this.bands.map((s) => s.minutes ?? 0)) + this.lead;
    return [e - t - 10, e + 6];
  }
  _pct(e) {
    const [t, s] = this._bounds;
    return ($(e, t, s) - t) / (s - t) * 100;
  }
  _minutesEarlier(e) {
    const s = this.shadowRoot.querySelector(".lane").getBoundingClientRect(), [i, a] = this._bounds, r = i + (e.clientX - s.left) / s.width * (a - i);
    return $(Math.round(y(this.time) - r), 0, 240);
  }
  _down(e, t) {
    this._range = this._bounds, this._drag = e, t.currentTarget.setPointerCapture(t.pointerId);
  }
  _move(e) {
    if (!this._drag) return;
    const t = this._minutesEarlier(e);
    this._drag === "__cap" ? S(this, "cap-change", { minutes: t }) : S(this, "band-change", { key: this._drag, minutes: t });
  }
  _up() {
    this._drag = void 0, this._range = void 0;
  }
  _key(e, t, s) {
    const i = s.key === "ArrowLeft" || s.key === "ArrowUp" ? 1 : s.key === "ArrowRight" || s.key === "ArrowDown" ? -1 : 0;
    if (!i) return;
    s.preventDefault();
    const a = $(t + i, 0, 240);
    e === "__cap" ? S(this, "cap-change", { minutes: a }) : S(this, "band-change", { key: e, minutes: a });
  }
  render() {
    const e = this.hass, t = y(this.time), s = t - this.lead, i = this._result, [a, r] = this._bounds, c = r - a > 150 ? 30 : r - a > 70 ? 15 : 10, d = [];
    for (let _ = Math.ceil(a / c) * c; _ <= r; _ += c) d.push(_);
    const h = this._pct(t - this.cap), u = (_) => z(e, M(_)), m = (_, g, b) => l`<div class="row">
      <div class="name">${g}<small>${b}</small></div>
      <div class="lane">
        <div class="bar" style="left:${this._pct(_)}%;width:${this._pct(_ + this.lead) - this._pct(_)}%;background:${this.gradient}"></div>
      </div>
    </div>`;
    return l`
      <div class="grid" @pointermove=${this._move} @pointerup=${this._up} @pointercancel=${this._up}>
        ${m(s, n(e, "shift_row_normal"), `${u(s)} – ${u(t)}`)}
        ${this.bands.map((_) => {
      const g = _.minutes, b = this._pct(t - (g ?? this.cap));
      return l`<div class="row" style="--c:${_.color}">
            <div class="name">${_.label}${_.note ? l`<small>${_.note}</small>` : p}</div>
            <div class="lane">
              <div class="bar ${g === null ? "unknown" : ""}" style="left:${b}%;width:${this._pct(t) - b}%;background:${_.color}"></div>
              ${g !== null && g > 0 ? l`<span class="val" style="left:${b}%">−${g}</span>` : p}
              ${_.editable && g !== null ? l`<div class="handle" style="left:${b}%" tabindex="0" role="slider" aria-label=${_.label}
                    aria-valuetext=${`−${g} min`} @pointerdown=${(x) => this._down(_.key, x)}
                    @keydown=${(x) => this._key(_.key, g, x)}><span></span></div>` : p}
            </div>
          </div>`;
    })}
        ${m(
      s - i,
      n(e, "shift_row_worst"),
      i ? `${u(s - i)} – ${u(t - i)}` : n(e, "shift_row_same")
    )}
        <div class="row">
          <span></span>
          <div class="lane" style="height:22px">
            <div class="axis">${d.map((_) => l`<span style="left:${this._pct(_)}%">${u(_)}</span>`)}</div>
          </div>
        </div>
        <div class="row" style="position:absolute;inset:0 0 0 0;pointer-events:none">
          <span></span>
          <div style="position:relative;height:100%">
            <div class="overlay capzone" style="left:0;width:${h}%"></div>
            <div class="overlay wakeline" style="left:${this._pct(t)}%"></div>
            <div class="caphandle" style="left:${h}%;pointer-events:auto" tabindex="0" role="slider"
              aria-label=${n(e, "shift_cap")} aria-valuetext=${`−${this.cap} min`}
              @pointerdown=${(_) => this._down("__cap", _)}
              @keydown=${(_) => this._key("__cap", this.cap, _)}><span></span></div>
          </div>
        </div>
      </div>
      <div class="foot">
        <label class="row" style="display:flex;min-height:0">
          <span>${n(e, "shift_cap")}</span>
          <input class="inp num" type="number" min="0" max="240" .value=${String(this.cap)}
            @change=${(_) => S(this, "cap-change", { minutes: $(Number(_.target.value) || 0, 0, 240) })} />
          <span>${n(e, "min_earlier")}</span>
        </label>
        <span class="grow"></span>
        <span class="muted">${n(e, this.combine === "sum" ? "shift_hint_sum" : "shift_hint_max")}</span>
      </div>
    `;
  }
};
_t.styles = [
  K,
  F`
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
let I = _t;
ee([
  f({ attribute: !1 })
], I.prototype, "hass");
ee([
  f({ attribute: !1 })
], I.prototype, "bands");
ee([
  f({ type: Number })
], I.prototype, "cap");
ee([
  f({ type: Number })
], I.prototype, "lead");
ee([
  f()
], I.prototype, "combine");
ee([
  f()
], I.prototype, "time");
ee([
  f()
], I.prototype, "gradient");
ee([
  v()
], I.prototype, "_drag");
customElements.define("db-shift-line", I);
var si = Object.defineProperty, R = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && si(e, t, i), i;
};
const se = 600, G = 180, N = 14, qt = ["natural", "gentle", "linear", "fast"], mt = class mt extends L {
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
    return z(this.hass, M(y(this.start) + e * this.duration));
  }
  // ------------------------------------------------------------------ curve
  _points() {
    const e = this._channel === "col" && this.s.separate ? "points_color" : "points";
    return this.s.curve !== "custom" ? fe[this.s.curve].map(([t, s]) => ({ t, v: s })) : this.s[e];
  }
  _setPoints(e) {
    const t = this._channel === "col" && this.s.separate ? "points_color" : "points", s = { curve: "custom", [t]: e };
    if (this.s.curve !== "custom") {
      const i = fe[this.s.curve].map(([a, r]) => ({ t: a, v: r }));
      t === "points" ? s.points_color = this.s.separate ? i : structuredClone(e) : s.points = i;
    }
    this._emit(s);
  }
  _xy(e) {
    return { x: N + e.t * (se - 2 * N), y: G - N - e.v * (G - 2 * N) };
  }
  _fromEvent(e) {
    const s = this.shadowRoot.querySelector(".graph svg").getBoundingClientRect(), i = (e.clientX - s.left) / s.width * se, a = (e.clientY - s.top) / s.height * G;
    return { t: $((i - N) / (se - 2 * N), 0, 1), v: $((G - N - a) / (G - 2 * N), 0, 1) };
  }
  _curveDown(e, t) {
    this.locked || this.mode === "simple" || (t.stopPropagation(), this._sel = e, this._drag = { kind: "curve", index: e }, t.currentTarget.setPointerCapture(t.pointerId));
  }
  _curveMove(e) {
    if (this._drag?.kind !== "curve") return;
    const t = structuredClone(this._points()), s = this._drag.index, i = this._fromEvent(e), a = s === 0 ? 0 : t[s - 1].t + 0.01, r = s === t.length - 1 ? 1 : t[s + 1].t - 0.01;
    t[s] = {
      t: s === 0 ? 0 : s === t.length - 1 ? 1 : Math.round($(i.t, a, r) * 1e3) / 1e3,
      v: Math.round(i.v * 1e3) / 1e3
    }, this._setPoints(t);
  }
  _addPoint() {
    const e = structuredClone(this._points());
    let t = 0, s = 0;
    for (let r = 0; r < e.length - 1; r++)
      e[r + 1].t - e[r].t > t && (t = e[r + 1].t - e[r].t, s = r);
    const i = (e[s].t + e[s + 1].t) / 2, a = de(e.map((r) => [r.t, r.v]), i);
    e.splice(s + 1, 0, { t: Math.round(i * 1e3) / 1e3, v: Math.round(a * 1e3) / 1e3 }), this._sel = s + 1, this._setPoints(e);
  }
  _removePoint() {
    const e = structuredClone(this._points());
    this._sel <= 0 || this._sel >= e.length - 1 || (e.splice(this._sel, 1), this._sel = -1, this._setPoints(e));
  }
  _miniCurve(e) {
    const t = fe[e], s = Array.from({ length: 31 }, (i, a) => {
      const r = a / 30;
      return `${a ? "L" : "M"}${r * 100},${30 - de(t, r) * 28}`;
    }).join(" ");
    return ce`<svg viewBox="0 0 100 31" preserveAspectRatio="none"><path d=${s} fill="none" stroke="var(--db-accent)" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>`;
  }
  _graph() {
    const e = this.hass, t = this._points(), s = this.s.separate ? this._channel : "bri", i = ye(this.s, s), a = Array.from({ length: 81 }, (g, b) => {
      const x = this._xy({ t: b / 80, v: de(i, b / 80) });
      return `${b ? "L" : "M"}${x.x.toFixed(1)},${x.y.toFixed(1)}`;
    }).join(" "), r = `${a} L${se - N},${G - N} L${N},${G - N} Z`, c = this.mode !== "simple" && !this.locked, d = [0.25, 0.5, 0.75].map((g) => this._xy({ t: 0, v: g }).y), h = this._tickMinutes(), u = [];
    for (let g = h; g < this.duration; g += h) u.push(g / this.duration);
    const m = this._drag?.kind === "curve" ? t[this._drag.index] : void 0, _ = m ? this._xy(m) : void 0;
    return l`
      <div class="graph edit">
        <svg viewBox="0 0 ${se} ${G}" @pointermove=${this._curveMove} @pointerup=${() => this._drag = void 0}
          @pointercancel=${() => this._drag = void 0}>
          <defs>
            <linearGradient id="fillg" x1="0" x2="1" y1="0" y2="0">
              ${Array.from({ length: 9 }, (g, b) => ce`<stop offset=${b / 8} stop-color=${lt(xe(this.s, b / 8), !1)} stop-opacity="0.35"/>`)}
            </linearGradient>
          </defs>
          ${d.map((g) => ce`<line x1=${N} x2=${se - N} y1=${g} y2=${g} stroke="var(--db-line)" stroke-dasharray="3 5"/>`)}
          ${u.map((g) => {
      const b = this._xy({ t: g, v: 0 }).x;
      return ce`<line x1=${b} x2=${b} y1=${N} y2=${G - N} stroke="var(--db-line)" stroke-dasharray="2 6"/>`;
    })}
          <path d=${r} fill="url(#fillg)"/>
          <path d=${a} fill="none" stroke="var(--db-accent)" stroke-width="3" stroke-linecap="round"/>
          ${c || this.s.curve === "custom" ? t.map((g, b) => {
      const { x, y: w } = this._xy(g);
      return ce`<g style="cursor:${c ? "grab" : "default"}" @pointerdown=${(T) => this._curveDown(b, T)}>
                  <circle cx=${x} cy=${w} r="18" fill="transparent"/>
                  <circle cx=${x} cy=${w} r=${b === this._sel ? 8 : 6.5} fill="#fff" stroke="var(--db-accent-strong)" stroke-width="3"/>
                </g>`;
    }) : p}
        </svg>
        ${m && _ ? l`<span class="tip" style="left:${_.x / se * 100}%;top:${_.y / G * 100}%">
              ${this._timeAt(m.t)} · ${Math.round(m.v * 100)}%
            </span>` : p}
        <div class="strip" style="background:${Y(this.s)}" title=${n(e, "ls_strip")}></div>
      </div>
    `;
  }
  _curveSection() {
    const e = this.hass, t = this.s, s = this.mode === "simple" ? qt : [...qt, "custom"], i = this._points();
    return l`
      <div class="presets edit">
        ${s.map(
      (a) => l`<button class="preset" aria-pressed=${t.curve === a} ?disabled=${this.locked}
            @click=${() => a === "custom" ? this._setPoints(structuredClone(i)) : this._emit({ curve: a })}>
            ${a === "custom" ? l`<svg viewBox="0 0 100 31"><path d="M0 30 C30 28 40 6 100 2" fill="none"
                  stroke="var(--db-accent)" stroke-width="2.5" stroke-dasharray="4 4"/></svg>` : this._miniCurve(a)}
            <b>${n(e, `curve_${a}`)}</b>
            <span class="muted">${n(e, `curve_${a}_d`)}</span>
          </button>`
    )}
      </div>
      ${this.mode !== "simple" ? l`<div class="row edit">
            <div class="seg" role="group" aria-label=${n(e, "ls_link")}>
              <button aria-pressed=${!t.separate} ?disabled=${this.locked}
                @click=${() => t.separate && this._emit({ separate: !1 })}>${n(e, "ls_shared")}</button>
              <button aria-pressed=${t.separate} ?disabled=${this.locked}
                @click=${() => !t.separate && this._emit({ separate: !0, curve: "custom", points_color: structuredClone(i) })}>
                ${n(e, "ls_separate")}
              </button>
            </div>
            ${t.separate ? l`<div class="seg" role="group">
                  <button aria-pressed=${this._channel === "bri"} @click=${() => this._channel = "bri"}>
                    ${n(e, "ls_brightness")}
                  </button>
                  <button aria-pressed=${this._channel === "col"} @click=${() => this._channel = "col"}>
                    ${n(e, t.color_mode === "color" ? "ls_color" : "ls_ct")}
                  </button>
                </div>` : p}
            <span class="grow"></span>
            <button class="btn" ?disabled=${this.locked || i.length >= 24} @click=${this._addPoint}>
              ${n(e, "ls_add_point")}
            </button>
            <button class="btn" ?disabled=${this.locked || this._sel <= 0 || this._sel >= i.length - 1}
              @click=${this._removePoint}>${n(e, "ls_remove_point")}</button>
          </div>` : p}
      ${this._graph()}
      ${this.mode === "expert" ? this._pointTable(i) : p}
    `;
  }
  _pointTable(e) {
    const t = this.hass, s = (i, a) => {
      const r = structuredClone(e);
      r[i] = { ...r[i], ...a }, i === 0 && (r[i].t = 0), i === r.length - 1 && (r[i].t = 1), r.sort((c, d) => c.t - d.t), this._setPoints(r);
    };
    return l`<table class="edit">
      <thead><tr><th>#</th><th>${n(t, "ls_time")}</th><th>${n(t, "ls_share")}</th><th>${n(t, "ls_value")}</th></tr></thead>
      <tbody>
        ${e.map(
      (i, a) => l`<tr>
            <td>${a + 1}</td>
            <td><input class="inp" type="time" .value=${M(y(this.start) + i.t * this.duration)}
              ?disabled=${this.locked || a === 0 || a === e.length - 1}
              @change=${(r) => {
        let c = y(r.target.value) - y(this.start);
        c < -720 && (c += 1440), s(a, { t: $(c / Math.max(1, this.duration), 0, 1) });
      }} /></td>
            <td><input class="inp" type="number" min="0" max="100" .value=${String(Math.round(i.t * 100))}
              ?disabled=${this.locked || a === 0 || a === e.length - 1}
              @change=${(r) => s(a, { t: $(Number(r.target.value) / 100, 0, 1) })} /></td>
            <td><input class="inp" type="number" min="0" max="100" .value=${String(Math.round(i.v * 100))}
              ?disabled=${this.locked}
              @change=${(r) => s(a, { v: $(Number(r.target.value) / 100, 0, 1) })} /></td>
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
    const s = e.currentTarget.getBoundingClientRect(), i = structuredClone(this._points()), a = this._drag.index, r = $((e.clientX - s.left) / s.width, i[a - 1].t + 0.01, i[a + 1].t - 0.01);
    i[a] = { ...i[a], t: Math.round(r * 1e3) / 1e3 }, this._setPoints(i);
  }
  _bar(e, t) {
    const s = this._tickMinutes(), i = [];
    for (let c = 0; c <= this.duration; c += s) i.push(c);
    const a = this._barMarks(e), r = this._drag?.kind === "bar" ? this._points()[this._drag.index] : void 0;
    return l`<div class="bar edit" @pointermove=${this._barMove} @pointerup=${() => this._drag = void 0}
      @pointercancel=${() => this._drag = void 0}>
      ${a.map(
      ({ p: c, i: d }) => l`<div class="mark" style="left:${c.t * 100}%" title=${this._timeAt(c.t)}
          @pointerdown=${(h) => this._barDown(e, d, h)}><span></span></div>`
    )}
      ${r ? l`<span class="tip" style="left:${r.t * 100}%;top:0">${this._timeAt(r.t)}</span>` : p}
      <div class="fill" style="background:${t}"></div>
      ${i.map((c) => {
      const d = c / Math.max(1, this.duration) * 100, h = c / s % this._labelEvery() === 0;
      return l`<span class="tickline" style="left:${d}%"></span>
          ${h ? l`<span class="tick ${d < 7 ? "first" : d > 93 ? "last" : ""}" style="left:${d}%">${this._timeAt(c / Math.max(1, this.duration))}</span>` : p}`;
    })}
    </div>`;
  }
  _section(e, t, s, i) {
    const a = this._open[e];
    return l`<div class="section">
      <button class="sh" aria-expanded=${a} @click=${() => this._open = { ...this._open, [e]: !a }}>
        <span class="chev">▸</span><b>${t}</b><span class="sum">${s}</span>
      </button>
      ${a ? l`<div class="sb">${i}</div>` : p}
    </div>`;
  }
  _rangeInputs(e, t, s, i, a, r) {
    const c = this.hass, d = (u) => l`<input class="inp num" type="number" min=${t} max=${s} step=${i}
      .value=${String(Math.round(e[u]))} ?disabled=${this.locked}
      @change=${(m) => {
      const _ = [...e];
      _[u] = $(Number(m.target.value) || t, t, s), r(_);
    }} />`, h = (u) => l`<input type="range" min=${t} max=${s} step=${i} .value=${String(e[u])}
      ?disabled=${this.locked} aria-label=${n(c, u ? "ls_end" : "ls_start")}
      @input=${(m) => {
      const _ = [...e];
      _[u] = Number(m.target.value), r(_);
    }} />`;
    return l`<div class="range edit">
      <span>${n(c, "ls_start")}</span>${h(0)}<span class="pair">${d(0)}${a}</span>
      <span>${n(c, "ls_end")}</span>${h(1)}<span class="pair">${d(1)}${a}</span>
    </div>`;
  }
  _briBar() {
    const e = this.s, t = [];
    for (let s = 0; s <= 16; s++) {
      const i = xe(e, s / 16, { ct: !1, color: !1 }), a = Math.round(30 + 2.2 * i.bri);
      t.push(`rgb(${a},${a},${a}) ${s / 16 * 100}%`);
    }
    return this._section(
      "bri",
      n(this.hass, "ls_brightness"),
      `${Math.round(e.brightness[0])} → ${Math.round(e.brightness[1])} %`,
      l`${this._bar("bri", `linear-gradient(90deg, ${t.join(",")})`)}
      ${this._rangeInputs(e.brightness, 0, 100, 1, "%", (s) => this._emit({ brightness: s }))}`
    );
  }
  _colorBar() {
    const e = this.hass, t = this.s, s = t.color_mode === "color", i = (c) => {
      const d = [];
      for (let h = 0; h <= 12; h++) {
        const u = de(ye(t, "col"), h / 12);
        d.push(`rgb(${Ne(c[0] + (c[1] - c[0]) * u).join(",")}) ${h / 12 * 100}%`);
      }
      return `linear-gradient(90deg, ${d.join(",")})`;
    }, a = s ? n(e, `colors_${t.colors}`) : `${t.kelvin[0]} → ${t.kelvin[1]} K`, r = l`
      <div class="row edit">
        <div class="seg" role="group">
          <button aria-pressed=${!s} ?disabled=${this.locked} @click=${() => s && this._emit({ color_mode: "ct" })}>
            ${n(e, "ls_ct")}
          </button>
          <button aria-pressed=${s} ?disabled=${this.locked} @click=${() => !s && this._emit({ color_mode: "color" })}>
            ${n(e, "ls_color")}
          </button>
        </div>
        <span class="muted grow">${n(e, s ? "ls_color_hint" : "ls_ct_hint")}</span>
      </div>
      ${this._bar("col", s ? Y(t, { ct: !0, color: !0 }, !1) : i(t.kelvin))}
      ${s ? this._colorBody() : l`${this._rangeInputs(t.kelvin, 1500, 6500, 50, "K", (c) => this._emit({ kelvin: c }))}
          <span class="muted">${n(e, "ls_kelvin_hint")}</span>`}
    `;
    return this._section("col", n(e, s ? "ls_color" : "ls_ct"), a, r);
  }
  _colorBody() {
    const e = this.hass, t = this.s, s = this.mode === "expert" ? ["sunrise", "dawn", "pastel", "custom"] : ["sunrise", "dawn", "pastel"], i = rs(t), a = t.plain_kelvin === null;
    return l`
      <div class="cols edit">
        ${s.map((r) => {
      const c = r === "custom" ? t.sequence.map((h) => h.color) : Be[r], d = c.length >= 2 ? `linear-gradient(90deg, ${c.join(",")})` : "var(--db-tile)";
      return l`<button class="preset" aria-pressed=${t.colors === r} ?disabled=${this.locked}
            @click=${() => this._emit(
        r === "custom" && t.sequence.length < 2 ? { colors: r, sequence: Ys(t.colors === "custom" ? "sunrise" : t.colors, this.duration) } : { colors: r }
      )}>
            <span class="swatch" style="background:${d}"></span>
            <b>${n(e, `colors_${r}`)}</b>
          </button>`;
    })}
      </div>
      ${this.mode === "expert" && t.colors === "custom" ? this._sequence() : p}
      ${this.plainLamps.length || this.mode !== "simple" ? l`<div class="tile plain">
            <div class="row">
              <b class="grow">${this.plainLamps.length ? n(e, "ls_plain", { lamps: this.plainLamps.join(", ") }) : n(e, "ls_plain_any")}</b>
              <span class="muted">${n(e, "ls_plain_follow")}</span>
            </div>
            <div class="swatch" style="background:linear-gradient(90deg, rgb(${Ne(i[0]).join(",")}), rgb(${Ne(i[1]).join(",")}))"></div>
            <div class="row edit">
              <span class="tabular">${i[0]} K → ${i[1]} K</span>
              <span class="grow"></span>
              <button class="chip" aria-pressed=${a} ?disabled=${this.locked}
                @click=${() => this._emit({ plain_kelvin: a ? [...ns[t.colors]] : null })}>
                ${n(e, "ls_matching")}
              </button>
            </div>
            ${a ? p : this._rangeInputs(i, 1500, 6500, 50, "K", (r) => this._emit({ plain_kelvin: r }))}
          </div>` : p}
    `;
  }
  _sequence() {
    const e = this.hass, t = this.s.sequence, s = (r) => this._emit({ sequence: r }), i = (r, c) => {
      const d = structuredClone(t);
      d[r] = { ...d[r], ...c }, s(d);
    }, a = (r, c) => {
      const d = structuredClone(t), [h] = d.splice(r, 1);
      d.splice($(r + c, 0, d.length), 0, h), s(d);
    };
    return l`<table class="edit">
        <thead><tr><th>#</th><th>${n(e, "seq_color")}</th><th>${n(e, "ls_brightness")} %</th>
          <th>${n(e, "seq_minutes")}</th><th>${n(e, "seq_transition")}</th><th></th></tr></thead>
        <tbody>
          ${t.map(
      (r, c) => l`<tr>
              <td>${c + 1}</td>
              <td><input class="inp" type="color" .value=${r.color.toLowerCase()} ?disabled=${this.locked}
                @change=${(d) => i(c, { color: d.target.value.toUpperCase() })} /></td>
              <td><input class="inp" type="number" min="0" max="100" .value=${String(r.brightness)} ?disabled=${this.locked}
                @change=${(d) => i(c, { brightness: $(Number(d.target.value), 0, 100) })} /></td>
              <td><input class="inp" type="number" min="0.5" max="240" step="0.5" .value=${String(r.minutes)} ?disabled=${this.locked}
                @change=${(d) => i(c, { minutes: $(Number(d.target.value), 0.5, 240) })} /></td>
              <td><select class="inp" ?disabled=${this.locked}
                @change=${(d) => i(c, { transition: d.target.value })}>
                <option value="smooth" ?selected=${r.transition === "smooth"}>${n(e, "seq_smooth")}</option>
                <option value="step" ?selected=${r.transition === "step"}>${n(e, "seq_step")}</option>
              </select></td>
              <td class="row" style="flex-wrap:nowrap;gap:2px">
                <button class="btn" style="padding:0 8px" ?disabled=${this.locked || c === 0} @click=${() => a(c, -1)} aria-label="↑">↑</button>
                <button class="btn" style="padding:0 8px" ?disabled=${this.locked || c === t.length - 1} @click=${() => a(c, 1)} aria-label="↓">↓</button>
                <button class="btn" style="padding:0 8px" ?disabled=${this.locked || t.length <= 2}
                  @click=${() => s(t.filter((d, h) => h !== c))} aria-label=${n(e, "delete")}>✕</button>
              </td>
            </tr>`
    )}
        </tbody>
      </table>
      <div class="edit">
        <button class="btn" ?disabled=${this.locked || t.length >= 16}
          @click=${() => s([...t, { color: "#FFFFFF", brightness: 100, minutes: 5, transition: "smooth" }])}>
          ${n(e, "seq_add")}
        </button>
      </div>`;
  }
  _fine() {
    const e = this.hass, t = this.s, s = (r, c, d) => l`<select class="inp"
      ?disabled=${this.locked} @change=${(h) => this._emit({ [r]: h.target.value })}>
      ${c.map((h) => l`<option value=${h} ?selected=${t[r] === h}>${n(e, `${d}_${h}`)}</option>`)}
    </select>`, i = (r, c, d) => l`<input class="inp" type="number" min=${c} max=${d}
      .value=${String(t[r])} ?disabled=${this.locked}
      @change=${(h) => this._emit({ [r]: $(Number(h.target.value), c, d) })} />`, a = [
      n(e, "fine_sum_step", { s: t.step_seconds }),
      n(e, `transition_${t.transition}`),
      n(e, `ringing_${t.ringing}`)
    ].join(" · ");
    return this._section(
      "fine",
      n(e, "fine_title"),
      a,
      l`<div class="fine edit">
        <label>${n(e, "fine_step")}${i("step_seconds", 2, 120)}</label>
        <label>${n(e, "fine_min_bri")}${i("min_brightness", 0, 100)}</label>
        <label>${n(e, "fine_transition")}${s("transition", ["auto", "always", "never"], "transition")}</label>
        <label>${n(e, "fine_offset")}${i("start_offset", 0, 120)}</label>
        ${this.showFine ? l`<label>${n(e, "fine_ringing")}${s("ringing", ["hold", "pulse", "blink"], "ringing")}</label>
              <label>${n(e, "fine_after")}${s("after_stop", ["keep", "off", "off_later"], "after_stop")}</label>` : p}
      </div>`
    );
  }
  render() {
    return this.settings ? l`
      ${this._curveSection()}
      ${this._briBar()}
      ${this._colorBar()}
      ${this.mode === "expert" ? this._fine() : p}
    ` : p;
  }
};
mt.styles = [
  K,
  F`
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
let W = mt;
R([
  f({ attribute: !1 })
], W.prototype, "hass");
R([
  f({ attribute: !1 })
], W.prototype, "settings");
R([
  f()
], W.prototype, "mode");
R([
  f({ type: Boolean, reflect: !0 })
], W.prototype, "locked");
R([
  f({ type: Number })
], W.prototype, "duration");
R([
  f()
], W.prototype, "start");
R([
  f({ attribute: !1 })
], W.prototype, "colorLamps");
R([
  f({ attribute: !1 })
], W.prototype, "plainLamps");
R([
  f({ type: Boolean })
], W.prototype, "showFine");
R([
  v()
], W.prototype, "_channel");
R([
  v()
], W.prototype, "_sel");
R([
  v()
], W.prototype, "_drag");
R([
  v()
], W.prototype, "_width");
R([
  v()
], W.prototype, "_open");
customElements.define("db-light-settings", W);
var ii = Object.defineProperty, U = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && ii(e, t, i), i;
};
const Ye = "__no_floor", Je = "__no_area", gt = class gt extends L {
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
    const t = this.hass, s = t.entities ?? {}, i = t.devices ?? {}, a = t.areas ?? {}, r = t.floors ?? {}, c = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), h = (_) => {
      let g = c.get(_);
      if (!g) {
        const b = r[_];
        g = {
          id: _,
          name: b?.name ?? (_ === Ye ? "" : _),
          level: b?.level ?? (_ === Ye ? 999 : 0),
          areas: []
        }, c.set(_, g);
      }
      return g;
    }, u = (_) => {
      let g = d.get(_);
      if (!g) {
        const b = a[_];
        g = { id: _, name: b?.name ?? n(t, "picker_no_area"), devices: [], leaves: [] }, d.set(_, g), h(b?.floor_id ?? Ye).areas.push(g);
      }
      return g;
    };
    for (const _ of this._candidates()) {
      const g = s[_], b = g?.device_id ? i[g.device_id] : void 0, x = g?.area_id ?? b?.area_id ?? Je, w = u(x), T = {
        id: _,
        name: E(t, _),
        group: Array.isArray(t.states[_].attributes.entity_id)
      }, Ee = b && (b.name_by_user || b.name) || "", k = `${T.name} ${_} ${w.name} ${Ee}`.toLowerCase();
      if (!(e && !k.includes(e)))
        if (b && g?.device_id) {
          let Ce = w.devices.find((us) => us.id === g.device_id);
          Ce || (Ce = { id: g.device_id, name: Ee || T.name, leaves: [] }, w.devices.push(Ce)), Ce.leaves.push(T);
        } else
          w.leaves.push(T);
    }
    const m = (_, g) => _.name.localeCompare(g.name);
    return [...c.values()].map((_) => ({
      ..._,
      areas: _.areas.filter((g) => g.devices.length || g.leaves.length).map((g) => ({ ...g, devices: g.devices.sort(m), leaves: g.leaves.sort(m) })).sort((g, b) => g.id === Je ? 1 : b.id === Je ? -1 : m(g, b))
    })).filter((_) => _.areas.length).sort((_, g) => _.level - g.level || m(_, g));
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
  _node(e, t, s, i, a, r) {
    const c = this._expanded.has(t) || !!this._query.trim(), d = this._check(i), h = this.multiple || !a;
    return l`<div class="node" style="--depth:${e}">
        <button class="chev ${a ? "" : "none"}" aria-expanded=${c} aria-label=${s}
          @click=${() => a && this._expand(t)}>▸</button>
        ${h ? l`<button class="box ${this.multiple ? "" : "radio"}" role="checkbox" aria-checked=${d} aria-label=${s}
              @click=${() => this._toggleIds(i)}>${d === "true" ? "✓" : d === "mixed" ? "–" : ""}</button>` : p}
        <button class="text" @click=${() => a ? this._expand(t) : this._toggleIds(i)}>
          ${s}${r?.id ? l`<span class="id">${r.id}</span>` : p}
        </button>
        ${r?.group ? l`<span class="badge">${n(this.hass, "picker_group")}</span>` : p}
        ${a ? l`<span class="count">${i.length}</span>` : p}
      </div>
      ${a && c ? a : p}`;
  }
  _leaf(e, t) {
    return this._node(e, t.id, t.name, [t.id], null, { id: t.id, group: t.group });
  }
  render() {
    const e = this.hass;
    if (!e) return p;
    const t = this._selected, s = this._open ? this._tree(this._query.trim().toLowerCase()) : [];
    return l`
      ${this.label ? l`<div class="label">${this.label}</div>` : p}
      <div class="head">
        ${t.map(
      (i) => l`<span class="chip" aria-pressed="true">${E(e, i)}
            <button class="x" aria-label=${n(e, "remove")} @click=${() => this._emit(t.filter((a) => a !== i))}>✕</button>
          </span>`
    )}
        <button class="chip" aria-expanded=${this._open} @click=${() => this._open = !this._open}>
          ${this._open ? n(e, "picker_close") : t.length && !this.multiple ? n(e, "picker_change") : this.placeholder || n(e, "picker_add")}
        </button>
      </div>
      ${this._open ? l`<div class="panel">
            <div class="search">
              <input class="inp" type="search" .value=${this._query} placeholder=${n(e, "picker_search")}
                @input=${(i) => this._query = i.target.value} />
            </div>
            ${s.length ? s.map(
      (i) => l`${i.name || s.length > 1 ? l`<div class="floor">${i.name || n(e, "picker_other")}</div>` : p}
                    ${i.areas.map((a) => {
        const r = [...a.devices.flatMap((d) => d.leaves.map((h) => h.id)), ...a.leaves.map((d) => d.id)], c = [
          ...a.devices.map(
            (d) => d.leaves.length === 1 ? this._leaf(1, d.leaves[0]) : this._node(1, `d:${d.id}`, d.name, d.leaves.map((h) => h.id), d.leaves.map((h) => this._leaf(2, h)))
          ),
          ...a.leaves.map((d) => this._leaf(1, d))
        ];
        return this._node(0, `a:${a.id}`, a.name, r, c);
      })}`
    ) : l`<div class="empty">${n(e, "picker_none")}</div>`}
          </div>` : p}
    `;
  }
};
gt.styles = [
  K,
  F`
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
let D = gt;
U([
  f({ attribute: !1 })
], D.prototype, "hass");
U([
  f({ attribute: !1 })
], D.prototype, "domains");
U([
  f({ attribute: !1 })
], D.prototype, "deviceClass");
U([
  f({ attribute: !1 })
], D.prototype, "units");
U([
  f({ attribute: !1 })
], D.prototype, "value");
U([
  f({ type: Boolean })
], D.prototype, "multiple");
U([
  f({ type: Boolean })
], D.prototype, "areaPick");
U([
  f()
], D.prototype, "label");
U([
  f()
], D.prototype, "placeholder");
U([
  v()
], D.prototype, "_open");
U([
  v()
], D.prototype, "_query");
U([
  v()
], D.prototype, "_expanded");
customElements.define("db-entity-picker", D);
var ni = Object.defineProperty, C = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && ni(e, t, i), i;
};
const Ht = ["light_start", "wake", "snooze", "stop"], It = ["snow", "storm", "rain"], ai = ["started", "finished", "skipped", "shifted", "device_unavailable", "failed", "last_call"], ri = [
  ["weekdays", [0, 1, 2, 3, 4]],
  ["weekend", [5, 6]],
  ["every_day", [0, 1, 2, 3, 4, 5, 6]]
], ft = class ft extends L {
  constructor() {
    super(...arguments), this.lightProfiles = [], this.lastCallProfiles = [], this.holidayEntity = null, this.mode = "normal", this.isNew = !1, this.saving = !1, this.narrow = !1, this._open = {
      time: !0,
      cond: !1,
      light: !0,
      audio: !1,
      act: !1,
      none: !1,
      fb: !1
    }, this._ownerPick = !1, this._morePresence = !1, this._phase = "wake", this._unlocked = !1, this._newProfileName = "", this._overrideOpen = -1, this._sunDate = "";
  }
  willUpdate(e) {
    e.has("alarm") && this.alarm && (this._draft = structuredClone(this.alarm), this._unlocked = !1, this._newProfileName = "");
    const t = this._nextDate();
    this.hass && t !== this._sunDate && (this._sunDate = t, ss(this.hass, t).then((s) => this._sun = s[t]).catch(() => {
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
  _picker(e, t, s, i = {}) {
    return l`<db-entity-picker
      .hass=${this.hass}
      .domains=${e}
      .value=${t}
      .multiple=${!!i.multiple}
      .areaPick=${!!i.areaPick}
      .deviceClass=${i.deviceClass}
      .units=${i.units}
      .label=${i.label ?? ""}
      @value-changed=${(a) => {
      a.stopPropagation(), s(a.detail.value);
    }}
    ></db-entity-picker>`;
  }
  _selector(e, t, s, i) {
    return l`<ha-selector
      .hass=${this.hass}
      .selector=${e}
      .value=${t}
      .label=${i}
      .required=${!1}
      @value-changed=${(a) => s(a.detail.value)}
    ></ha-selector>`;
  }
  _toggle(e, t, s) {
    return l`<button class="switch" role="switch" aria-checked=${e} aria-label=${s}
      @click=${() => t(!e)}></button>`;
  }
  _section(e, t, s, i, a) {
    const r = this._open[e];
    return l`<section class="card">
      <button class="sh" aria-expanded=${r} @click=${() => this._open = { ...this._open, [e]: !r }}>
        <span class="chev">▸</span><b>${t}</b>${a ? l`<span class="badge">${a}</span>` : p}
        <span class="sum">${s}</span>
      </button>
      ${r ? l`<div class="sb">${i()}</div>` : p}
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
    const t = ie(this.hass);
    for (let s = 0; s < 62; s++) {
      const i = oe(t, s);
      if (Rt(e, i) && i !== e.skip_date) return i;
    }
    return t;
  }
  /** Effective wake time (computed for sun-based alarms). */
  get _wakeTime() {
    const e = this.d;
    if (e.wake.type === "sun") {
      const t = cs(this.hass, this._sun, e.wake);
      if (t !== null) return M(t);
    }
    return e.wake.time;
  }
  get _lights() {
    return Fe(this.hass, this.d.light.targets);
  }
  _profile(e) {
    return e ? this.lightProfiles.find((t) => t.id === e) : void 0;
  }
  // ----------------------------------------------------------------- header
  _header() {
    const e = this.hass, t = ["simple", "normal", "expert"];
    return l`<header>
      <button class="btn" style="padding:0 10px" aria-label=${n(e, "back")} @click=${() => S(this, "daybreak-cancel")}>←</button>
      <div class="seg" role="group" aria-label=${n(e, "mode")}>
        ${t.map(
      (s) => l`<button aria-pressed=${this.mode === s} @click=${() => S(this, "daybreak-mode", { mode: s })}>
            ${n(e, `mode_${s}`)}
          </button>`
    )}
      </div>
      <span class="grow"></span>
      ${this.isNew ? p : l`<button class="btn danger" @click=${() => S(this, "daybreak-delete")}>${n(e, "delete")}</button>
            <button class="btn" @click=${() => S(this, "daybreak-test")}>${n(e, "test")}</button>`}
      <button class="btn" @click=${() => S(this, "daybreak-cancel")}>${n(e, "cancel")}</button>
      <button class="btn primary" ?disabled=${this.saving} @click=${this._save}>${n(e, "save")}</button>
    </header>`;
  }
  _save() {
    const e = this.hass;
    if (this._unlocked && !this._newProfileName.trim()) {
      S(this, "hass-notification", { message: n(e, "profile_name_required") }), this._open = { ...this._open, light: !0 };
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
    const s = this.hass?.states[e]?.attributes.entity_picture, i = E(this.hass, e);
    return l`<span class="avatar">${s ? l`<img src=${s} alt="" />` : i.slice(0, 1).toUpperCase()}</span>`;
  }
  _head() {
    const e = this.hass, t = this.d, s = this._persons().filter((i) => !t.owners.includes(i.entity_id));
    return l`<section class="card head">
      <div class="row">
        <label class="lbl grow" for="name">${n(e, "f_name")}</label>
        <span class="badge">${n(e, `kind_${t.kind}`)}</span>
      </div>
      <input id="name" class="inp name" .value=${t.name} @input=${(i) => this._patch({ name: i.target.value })} />
      <div class="lbl">${n(e, "owners")}</div>
      <div class="row">
        ${t.owners.map(
      (i) => l`<span class="chip" aria-pressed="true">${this._avatar(i)}${E(e, i)}
            <button class="x" aria-label=${n(e, "remove")} @click=${() => this._patch({ owners: t.owners.filter((a) => a !== i) })}>✕</button>
          </span>`
    )}
        <button class="chip" aria-expanded=${this._ownerPick} aria-label=${n(e, "owner_add")}
          @click=${() => this._ownerPick = !this._ownerPick}>+</button>
        ${this._ownerPick ? s.map(
      (i) => l`<button class="chip" @click=${() => {
        this._patch({ owners: [...t.owners, i.entity_id] }), this._ownerPick = !1;
      }}>${this._avatar(i.entity_id)}${E(e, i.entity_id)}</button>`
    ) : p}
        ${this._ownerPick && !s.length ? l`<span class="muted">${n(e, "owner_none")}</span>` : p}
      </div>
      <div class="muted">${n(e, "owners_hint")}</div>
    </section>`;
  }
  // ----------------------------------------------------------------- time
  _timeSection() {
    const e = this.hass, t = this.d, s = this._wakeTime, i = `${z(e, s)} · ${dt(e, t)}`;
    return this._section("time", n(e, "section_time"), i, () => this._timeBody());
  }
  _timeBody() {
    const e = this.hass, t = this.d, s = t.kind === "wake", i = this._effectiveSettings(), a = t.kind === "sleep" ? n(e, "tl_sleep_start") : t.kind === "kids" ? n(e, "tl_kids_start") : "", r = t.kind === "sleep" ? n(e, "tl_sleep_end") : t.kind === "kids" ? n(e, "tl_kids_end") : "";
    return l`
      ${this._simple ? p : l`<div class="seg" role="group">
            <button aria-pressed=${t.wake.type === "fixed"} @click=${() => this._sub("wake", { type: "fixed", time: this._wakeTime })}>
              ${n(e, "wake_fixed")}
            </button>
            <button aria-pressed=${t.wake.type === "sun"} @click=${() => this._sub("wake", { type: "sun" })}>
              ${n(e, "wake_sun")}
            </button>
          </div>`}
      ${t.wake.type === "sun" ? l`<div class="tile"><db-sun-wake .hass=${e} .wake=${t.wake} .date=${this._nextDate()} .mode=${this.mode}
            @wake-change=${(c) => this._patch({ wake: c.detail })}></db-sun-wake></div>` : p}
      <div class="tile">
        <db-time-line
          .hass=${e}
          .time=${this._wakeTime}
          .lead=${t.light_lead}
          .snooze=${this._snoozeMinutes}
          .count=${this._snoozeCount}
          .lastCall=${t.last_call.enabled}
          .lcDuration=${this._lcDuration}
          .fixedWake=${t.wake.type === "sun"}
          .showSnooze=${s}
          .startLabel=${a}
          .wakeLabel=${r}
          .gradient=${Y(i)}
          @timeline-change=${(c) => {
      const { time: d, lead: h, count: u, lcDuration: m } = c.detail;
      this._patch({
        light_lead: h,
        wake: t.wake.type === "fixed" ? { ...t.wake, time: d } : t.wake,
        snooze: u === this._snoozeCount ? t.snooze : { ...t.snooze, count: u },
        last_call: m === this._lcDuration ? t.last_call : { ...t.last_call, duration: m }
      });
    }}
        ></db-time-line>
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
    return l`<div class="row">
      <span class="lbl">${n(e, "snooze")}</span>
      ${t.map(
      (i) => l`<button class="chip" aria-pressed=${s === i.id}
          @click=${() => this._sub("snooze", { preset: i.id === this.settings?.default_snooze ? null : i.id })}>
          ${i.name} · ${i.minutes} min
        </button>`
    )}
      <span class="muted">${n(e, "snooze_hint")}</span>
    </div>`;
  }
  get _lcDuration() {
    const e = this.d.last_call;
    return e.duration ?? this.lastCallProfiles.find((t) => t.id === e.profile)?.duration ?? 10;
  }
  _lastCallRow() {
    const e = this.hass, t = this.d.last_call;
    return l`<div class="row">
      <span class="lbl">${n(e, "last_call")}</span>
      ${this._toggle(t.enabled, (s) => this._sub("last_call", { enabled: s }), n(e, "last_call"))}
      ${t.enabled ? l`<select class="inp" aria-label=${n(e, "last_call")}
            @change=${(s) => this._sub("last_call", { profile: s.target.value, duration: null })}>
            ${this.lastCallProfiles.map((s) => l`<option value=${s.id} ?selected=${s.id === t.profile}>${s.name}</option>`)}
          </select>` : p}
      <span class="muted grow">${n(e, "lc_row_hint")}</span>
    </div>`;
  }
  _onceBlock() {
    const e = this.hass, t = this.d;
    if (t.repeat.type === "once") return p;
    const s = this._nextDate(), i = t.once;
    return l`<div class="row">
        <button class="chip" aria-pressed=${!!i}
          @click=${() => this._patch({ once: i ? null : { date: s, time: this._wakeTime, light_lead: null } })}>
          ${n(e, "once_toggle")}
        </button>
        ${i ? l`<span class="muted">${n(e, "once_hint")}</span>` : p}
      </div>
      ${i ? l`<div class="tile row">
            <label class="row"><span>${n(e, "once_on")}</span>
              <input class="inp" type="date" .value=${i.date}
                @change=${(a) => this._patch({ once: { ...i, date: a.target.value } })} /></label>
            <label class="row"><span>${n(e, "tl_wake")}</span>
              <input class="inp time" type="time" .value=${i.time}
                @change=${(a) => this._patch({ once: { ...i, time: a.target.value } })} /></label>
            <label class="row"><span>${n(e, "light_lead")}</span>
              <input class="inp num" type="number" min="0" max="240" placeholder=${String(t.light_lead)}
                .value=${i.light_lead === null ? "" : String(i.light_lead)}
                @change=${(a) => {
      const r = a.target.value;
      this._patch({ once: { ...i, light_lead: r === "" ? null : $(Number(r), 0, 240) } });
    }} /> min</label>
          </div>` : p}`;
  }
  _repeatBlock() {
    const e = this.hass, t = this.d.repeat, s = this._simple ? ["weekly", "interval", "once"] : ["weekly", "interval", "pattern", "once"];
    return l`
      <div class="lbl">${n(e, "repeat")}</div>
      <div class="seg" role="group">
        ${s.map(
      (i) => l`<button aria-pressed=${t.type === i} @click=${() => this._sub("repeat", { type: i })}>
            ${n(e, `repeat_${i}`)}
          </button>`
    )}
      </div>
      ${t.type === "weekly" ? this._weekly() : p}
      ${t.type === "interval" ? this._interval() : p}
      ${t.type === "pattern" ? this._pattern() : p}
      ${t.type === "once" ? l`<label class="row"><span>${n(e, "once_date")}</span>
            <input class="inp" type="date" .value=${t.date ?? ""}
              @change=${(i) => this._sub("repeat", { date: i.target.value || null })} />
            <span class="muted">${n(e, "once_date_hint")}</span></label>` : p}
      ${!this._simple && t.type !== "once" ? this._calendar() : p}
    `;
  }
  _weekly() {
    const e = this.hass, t = this.d.repeat, s = Le(e), i = t.start_date ?? ie(e), a = oe(i, -(((/* @__PURE__ */ new Date(`${i}T12:00:00Z`)).getUTCDay() + 6) % 7));
    return l`
      <div class="row days">
        ${s.map(
      (r, c) => l`<button class="chip" aria-pressed=${t.days.includes(c)}
            @click=${() => this._sub("repeat", {
        days: t.days.includes(c) ? t.days.filter((d) => d !== c) : [...t.days, c].sort()
      })}>${r}</button>`
    )}
      </div>
      <div class="row">
        ${ri.map(
      ([r, c]) => l`<button class="chip" aria-pressed=${t.days.join() === c.join()}
            @click=${() => this._sub("repeat", { days: c })}>${n(e, r)}</button>`
    )}
      </div>
      ${this._simple ? p : l`<div class="row">
              <span>${n(e, "week_cycle")}</span>
              <div class="seg" role="group">
                ${[1, 2, 3, 4].map(
      (r) => l`<button aria-pressed=${t.week_cycle === r}
                    @click=${() => this._sub("repeat", {
        week_cycle: r,
        weeks: [...t.weeks, !0, !0, !0, !0].slice(0, r),
        start_date: r > 1 ? t.start_date ?? a : t.start_date
      })}>${r === 1 ? n(e, "every_week") : n(e, "week_cycle_short", { n: r })}</button>`
    )}
              </div>
            </div>
            ${t.week_cycle > 1 ? l`<div class="weeks">
                    ${t.weeks.map((r, c) => {
      const d = oe(a, c * 7);
      return l`<button class="wtile" aria-pressed=${r}
                        @click=${() => this._sub("repeat", { weeks: t.weeks.map((h, u) => u === c ? !h : h) })}>
                        <b>${n(e, "week_n", { n: c + 1 })}</b>
                        <span>${r ? n(e, "week_on") : n(e, "week_off")}</span>
                        <span class="muted">${H(e, d)} – ${H(e, oe(d, 6))}</span>
                      </button>`;
    })}
                  </div>
                  <label class="row"><span class="muted">${n(e, "week_anchor")}</span>
                    <input class="inp" type="date" .value=${t.start_date ?? a}
                      @change=${(r) => this._sub("repeat", { start_date: r.target.value || null })} /></label>` : p}`}
    `;
  }
  _interval() {
    const e = this.hass, t = this.d.repeat;
    return l`<div class="row">
      <span>${n(e, "every")}</span>
      <input class="inp num" type="number" min="1" max="60" .value=${String(t.interval)}
        @change=${(s) => this._sub("repeat", { interval: $(Number(s.target.value) || 1, 1, 60) })} />
      <select class="inp" @change=${(s) => this._sub("repeat", { unit: s.target.value })}>
        <option value="days" ?selected=${t.unit === "days"}>${n(e, "unit_days")}</option>
        <option value="weeks" ?selected=${t.unit === "weeks"}>${n(e, "unit_weeks")}</option>
      </select>
      <span>${n(e, "from")}</span>
      <input class="inp" type="date" .value=${t.start_date ?? ie(e)}
        @change=${(s) => this._sub("repeat", { start_date: s.target.value || null })} />
    </div>`;
  }
  _pattern() {
    const e = this.hass, t = this.d.repeat, s = t.start_date ?? ie(e);
    return l`<div class="muted">${n(e, "pattern_hint")}</div>
      <div class="row">
        <span>${n(e, "pattern_cycle")}</span>
        <input class="inp num" type="number" min="1" max="42" .value=${String(t.pattern.length)}
          @change=${(i) => {
      const a = $(Number(i.target.value) || 1, 1, 42);
      this._sub("repeat", { pattern: Array.from({ length: a }, (r, c) => t.pattern[c] ?? !1) });
    }} />
        <span>${n(e, "pattern_day1")}</span>
        <input class="inp" type="date" .value=${s}
          @change=${(i) => this._sub("repeat", { start_date: i.target.value || null })} />
      </div>
      <div class="pattern">
        ${t.pattern.map(
      (i, a) => l`<button class="wtile" aria-pressed=${i}
            @click=${() => this._sub("repeat", { pattern: t.pattern.map((r, c) => c === a ? !r : r), start_date: s })}>
            <b>${n(e, "day_n", { n: a + 1 })}</b><span class="muted">${i ? n(e, "week_on") : n(e, "week_off")}</span>
          </button>`
    )}
      </div>`;
  }
  _calendar() {
    const e = this.hass, t = this.d, s = ie(e), i = oe(s, -(((/* @__PURE__ */ new Date(`${s}T12:00:00Z`)).getUTCDay() + 6) % 7)), a = Array.from({ length: 28 }, (r, c) => oe(i, c));
    return l`<div class="tile">
      <div class="row" style="margin-bottom:8px">
        <span class="grow">${n(e, "preview_4w")}</span>
        <span class="muted">${n(e, "preview_legend")}</span>
      </div>
      <div class="cal">
        ${Le(e).map((r) => l`<span class="head">${r}</span>`)}
        ${a.map((r) => {
      const c = r >= s && (Rt(t, r) || t.once?.date === r), d = r === t.skip_date;
      return l`<span class="${c ? "on" : ""} ${d ? "skip" : ""}" title=${H(e, r)}>${Number(r.slice(8))}</span>`;
    })}
      </div>
    </div>`;
  }
  _holidayTile() {
    const e = this.hass, t = this.d;
    return l`<div class="tile row">
      <div class="grow">
        <div>${n(e, "holidays")}</div>
        <div class="muted">
          ${this.holidayEntity ? n(e, "holidays_hint", { entity: E(e, this.holidayEntity) }) : n(e, "holidays_none")}
        </div>
      </div>
      ${this._toggle(t.wake_on_holidays, (s) => this._patch({ wake_on_holidays: s }), n(e, "holidays"))}
    </div>`;
  }
  // ----------------------------------------------------------- conditions
  _condSection() {
    const e = this.hass, t = this.d, s = [], i = t.presence.entities;
    i.length && !this._simple && s.push(i.map((r) => E(e, r)).join(", ")), t.shift.weather.enabled && s.push(n(e, "rule_weather")), t.shift.travel.enabled && s.push(n(e, "rule_travel")), (t.shift.weather.enabled || t.shift.travel.enabled) && s.push(n(e, "shift_upto", { min: t.shift.max }));
    const a = this._simple ? n(e, "section_weather") : n(e, "section_cond");
    return this._section(
      "cond",
      a,
      s.join(" · ") || n(e, "none"),
      () => this._simple ? this._simpleWeather() : this._condBody()
    );
  }
  _weatherMinutes(e) {
    return this.d.shift.weather.minutes[e] ?? this.settings?.weather_minutes[e] ?? 0;
  }
  _simpleWeather() {
    const e = this.hass, t = this.d.shift.weather;
    return l`<div class="muted">${n(e, "simple_weather_hint")}</div>
      <div class="row">
        ${It.map((s) => {
      const i = t.enabled && t.conditions.includes(s);
      return l`<button class="chip" aria-pressed=${i} @click=${() => {
        const a = i ? t.conditions.filter((r) => r !== s) : [...t.conditions, s];
        this._sub("shift", { weather: { ...t, enabled: a.length > 0, conditions: a } });
      }}>${n(e, `weather_${s}`)} <span class="muted">−${this._weatherMinutes(s)} min</span></button>`;
    })}
      </div>
      ${this.settings?.weather_entity ? p : l`<div class="muted">${n(e, "weather_entity_missing")}</div>`}`;
  }
  _condBody() {
    const e = this.hass, s = this.d.kind === "wake";
    return l`
      ${this._presenceBlock()}
      ${s ? l`<div class="divider"></div>${this._shiftBlock()}` : p}
      <div class="tile row soon">
        <div class="grow"><div>${n(e, "calendar_title")}</div><div class="muted">${n(e, "calendar_hint")}</div></div>
        <span class="badge">${n(e, "from_version", { v: "0.4" })}</span>
      </div>
    `;
  }
  _presenceBlock() {
    const e = this.hass, t = this.d.presence, s = (i) => this._sub("presence", { entities: i });
    return l`<div class="lbl">${n(e, "presence")}</div>
      <div class="muted">${n(e, t.entities.length ? "presence_hint" : "presence_off")}</div>
      <div class="row">
        ${this._persons().map((i) => {
      const a = t.entities.includes(i.entity_id);
      return l`<button class="chip" aria-pressed=${a}
            @click=${() => {
        const r = [...t.entities];
        s(a ? r.filter((c) => c !== i.entity_id) : [...r, i.entity_id]);
      }}>${this._avatar(i.entity_id)}${E(e, i.entity_id)}
            <span class="muted">${e?.states[i.entity_id]?.state === "home" ? n(e, "home") : n(e, "away")}</span>
          </button>`;
    })}
        ${t.entities.filter((i) => !i.startsWith("person.")).map(
      (i) => l`<span class="chip" aria-pressed="true">${E(e, i)}
              <button class="x" @click=${() => s(t.entities.filter((a) => a !== i))}>✕</button></span>`
    )}
        <button class="chip" aria-expanded=${this._morePresence} @click=${() => this._morePresence = !this._morePresence}>+</button>
      </div>
      ${this._morePresence ? this._picker(["device_tracker", "binary_sensor", "zone", "person", "input_boolean"], t.entities, (i) => s(i ?? []), {
      multiple: !0,
      areaPick: !0,
      label: n(e, "presence_more")
    }) : p}
      <div class="row">
        <label class="row"><input type="checkbox" .checked=${t.skip_when_away}
          @change=${(i) => this._sub("presence", { skip_when_away: i.target.checked })} />
          ${n(e, "skip_when_away")}</label>
        <label class="row"><input type="checkbox" .checked=${t.stop_when_away}
          @change=${(i) => this._sub("presence", { stop_when_away: i.target.checked })} />
          ${n(e, "stop_when_away")}</label>
      </div>`;
  }
  _shiftBlock() {
    const e = this.hass, t = this.d.shift, s = t.weather, i = t.travel, a = this.settings, r = [];
    if (s.enabled) {
      for (const h of s.conditions)
        r.push({
          key: h,
          label: n(e, `weather_${h}`),
          minutes: this._weatherMinutes(h),
          color: "var(--db-weather)",
          editable: this._expert,
          note: this._expert ? n(e, "shift_drag_hint") : n(e, "shift_from_settings")
        });
      const d = s.cold_minutes ?? a?.cold_minutes ?? 0;
      d && r.push({
        key: "cold",
        label: n(e, "shift_cold", { below: s.cold_below ?? a?.cold_below ?? 0 }),
        minutes: d,
        color: "var(--db-weather)",
        editable: this._expert,
        note: this._expert ? n(e, "shift_drag_hint") : n(e, "shift_from_settings")
      });
    }
    if (i.enabled) {
      const d = i.sensor ? Number(e?.states[i.sensor]?.state) : NaN, h = Number.isFinite(d) && !i.arrive_by;
      r.push({
        key: "travel",
        label: n(e, "rule_travel"),
        minutes: h ? Math.min(240, Math.max(0, Math.round(d - i.usual))) : null,
        color: "var(--db-travel)",
        editable: !1,
        note: Number.isFinite(d) ? n(e, "travel_now", { min: Math.round(d) }) : n(e, "travel_depends")
      });
    }
    const c = (d, h, u) => l`<div class="rule ${h ? "open" : ""}">
      <span class="bar-dot" style="background:var(--db-${d})"></span>
      <div class="grow"><b>${n(e, `rule_${d}`)}</b><div class="muted">${u}</div></div>
      ${this._toggle(
      h,
      (m) => this._sub("shift", { [d]: { ...t[d], enabled: m } }),
      n(e, `rule_${d}`)
    )}
    </div>`;
    return l`<div class="lbl">${n(e, "shift_title")}</div>
      <div class="muted">${n(e, "shift_intro")}</div>
      <div class="rules">
        ${c("weather", s.enabled, n(e, "rule_weather_d"))}
        ${c("travel", i.enabled, n(e, "rule_travel_d"))}
      </div>
      ${s.enabled ? this._weatherDetail() : p}
      ${i.enabled ? this._travelDetail() : p}
      ${r.length ? l`<div class="tile"><db-shift-line .hass=${e} .bands=${r} .cap=${t.max} .combine=${t.combine}
            .time=${this._wakeTime} .lead=${this.d.light_lead} .gradient=${Y(this._effectiveSettings())}
            @cap-change=${(d) => this._sub("shift", { max: d.detail.minutes })}
            @band-change=${(d) => {
      const { key: h, minutes: u } = d.detail;
      h === "cold" ? this._sub("shift", { weather: { ...s, cold_minutes: u } }) : this._sub("shift", { weather: { ...s, minutes: { ...s.minutes, [h]: u } } });
    }}></db-shift-line></div>` : p}
      ${r.length && this._expert ? l`<label class="row"><span>${n(e, "combine")}</span>
            <select class="inp" @change=${(d) => this._sub("shift", { combine: d.target.value })}>
              <option value="max" ?selected=${t.combine === "max"}>${n(e, "combine_max")}</option>
              <option value="sum" ?selected=${t.combine === "sum"}>${n(e, "combine_sum")}</option>
            </select></label>` : p}
      ${r.length ? l`<label class="row"><input type="checkbox" .checked=${t.notify}
            @change=${(d) => this._sub("shift", { notify: d.target.checked })} />
            ${n(e, "shift_notify")}</label>` : p}`;
  }
  _weatherDetail() {
    const e = this.hass, t = this.d.shift.weather, s = this.settings, i = (a) => this._sub("shift", { weather: { ...t, ...a } });
    return l`<div class="tile" style="display:flex;flex-direction:column;gap:10px">
      <div class="muted">
        ${s?.weather_entity ? n(e, "weather_source", { entity: E(e, s.weather_entity) }) : n(e, "weather_entity_missing")}
      </div>
      <div class="grid2">
        ${It.map((a) => {
      const r = t.conditions.includes(a);
      return l`<label class="cond">
            <input type="checkbox" .checked=${r}
              @change=${() => i({ conditions: r ? t.conditions.filter((c) => c !== a) : [...t.conditions, a] })} />
            <span class="grow">${n(e, `weather_${a}`)}</span>
            ${this._expert ? l`<input class="inp num" type="number" min="0" max="240" .value=${String(this._weatherMinutes(a))}
                  @change=${(c) => i({ minutes: { ...t.minutes, [a]: $(Number(c.target.value), 0, 240) } })} />` : l`<span class="tabular">${this._weatherMinutes(a)}</span>`}
            <span>min</span>
          </label>`;
    })}
      </div>
      <div class="muted">${n(e, "weather_storm_hint", { level: s?.warning_level ?? 2 })}</div>
      ${this._expert ? l`<div class="row">
            <span>${n(e, "cold_below")}</span>
            <input class="inp num" type="number" step="0.5" placeholder=${String(s?.cold_below ?? 0)}
              .value=${t.cold_below === null ? "" : String(t.cold_below)}
              @change=${(a) => {
      const r = a.target.value;
      i({ cold_below: r === "" ? null : Number(r) });
    }} /><span>°C →</span>
            <input class="inp num" type="number" min="0" max="240" placeholder=${String(s?.cold_minutes ?? 10)}
              .value=${t.cold_minutes === null ? "" : String(t.cold_minutes)}
              @change=${(a) => {
      const r = a.target.value;
      i({ cold_minutes: r === "" ? null : $(Number(r), 0, 240) });
    }} /><span>${n(e, "min_earlier")}</span>
          </div>` : l`<div class="muted">${n(e, "cold_settings", { below: s?.cold_below ?? 0, min: s?.cold_minutes ?? 10 })}</div>`}
    </div>`;
  }
  _travelDetail() {
    const e = this.hass, t = this.d.shift.travel, s = (i) => this._sub("shift", { travel: { ...t, ...i } });
    return l`<div class="tile" style="display:flex;flex-direction:column;gap:10px">
      ${this._picker(["sensor"], t.sensor, (i) => s({ sensor: i || null }), { label: n(e, "travel_sensor"), units: ["min", "minutes"] })}
      <div class="grid2">
        <label class="field">${n(e, "travel_usual")}
          <input class="inp" type="number" min="0" max="240" .value=${String(t.usual)}
            @change=${(i) => s({ usual: $(Number(i.target.value), 0, 240) })} /></label>
        <label class="field">${n(e, "travel_routine")}
          <input class="inp" type="number" min="0" max="240" .value=${String(t.routine)}
            @change=${(i) => s({ routine: $(Number(i.target.value), 0, 240) })} /></label>
        <label class="field">${n(e, "travel_arrive")}
          <input class="inp" type="time" .value=${t.arrive_by ?? ""}
            @change=${(i) => s({ arrive_by: i.target.value || null })} /></label>
      </div>
      <div class="muted">${t.arrive_by ? n(e, "travel_arrive_hint") : n(e, "travel_usual_hint")}</div>
    </div>`;
  }
  // ----------------------------------------------------------------- light
  _effectiveSettings() {
    const e = this._profile(this.d.light.profile);
    return e && !this._unlocked ? e.settings : this.d.light.settings;
  }
  _lightSection() {
    const e = this.hass, t = this.d, s = this._lights, i = this._profile(t.light.profile), a = s.length ? `${n(e, "n_lights", { n: s.length })} · ${i && !this._unlocked ? i.name : n(e, `curve_${this._effectiveSettings().curve}`)}` : n(e, "no_lights");
    return this._section("light", n(e, "section_light"), a, () => this._lightBody());
  }
  _lightBody() {
    const e = this.hass, t = this.d, s = this._lights, i = this._profile(t.light.profile), a = !!i && !this._unlocked, r = this._effectiveSettings(), c = s.filter((u) => Bt(e?.states[u]?.attributes.supported_color_modes).color), d = s.filter((u) => !c.includes(u)), h = M(y(this._wakeTime) - t.light_lead);
    return l`
      <div class="lbl">${n(e, "targets")}</div>
      ${this._picker(["light"], s, (u) => this._sub("light", { targets: { entity_id: u ?? [] } }), {
      multiple: !0,
      areaPick: !0,
      label: n(e, "targets_hint")
    })}
      ${s.length ? p : l`<div class="muted">${n(e, "no_lights")}</div>`}
      <div class="divider"></div>
      <div class="lbl">${this._simple ? n(e, "light_settings") : n(e, "light_common")}</div>
      ${!this._simple || i ? this._profileRow(i) : p}
      <db-light-settings
        .hass=${e}
        .settings=${r}
        .mode=${this.mode}
        .locked=${a}
        .duration=${t.light_lead}
        .start=${h}
        .colorLamps=${c.map((u) => E(e, u))}
        .plainLamps=${d.map((u) => E(e, u))}
        .showFine=${t.kind === "wake"}
        @settings-change=${(u) => this._sub("light", { settings: u.detail })}
      ></db-light-settings>
      ${!this._simple && s.length > 1 ? this._overrides(s, h) : p}
    `;
  }
  _profileRow(e) {
    const t = this.hass, s = this.d;
    return this._unlocked ? l`<div class="lock">
        <span>${n(t, "profile_new")}</span>
        <input class="inp grow" .value=${this._newProfileName} placeholder=${n(t, "profile_name_required")}
          @input=${(i) => this._newProfileName = i.target.value} />
        <button class="btn" @click=${() => {
      this._unlocked = !1, this._newProfileName = "";
    }}>${n(t, "discard")}</button>
      </div>` : l`<div class="lock">
      ${e ? l`<span class="grow">${n(t, "profile_locked", { name: e.name })}</span>` : l`<span class="grow">${n(t, "profile_own")}</span>`}
      <select class="inp" @change=${(i) => {
      const a = i.target.value || null, r = this._profile(a);
      this._patch({
        light: { ...s.light, profile: a, settings: r ? structuredClone(r.settings) : s.light.settings },
        light_lead: r && this._simple ? r.duration : s.light_lead
      });
    }}>
        <option value="" ?selected=${!e}>${n(t, "profile_none")}</option>
        ${this.lightProfiles.map((i) => l`<option value=${i.id} ?selected=${i.id === s.light.profile}>${i.name}</option>`)}
      </select>
      ${e ? l`<button class="btn" @click=${() => {
      this._unlocked = !0, this._newProfileName = n(t, "profile_copy_name", { name: e.name }), this._sub("light", { settings: structuredClone(e.settings) });
    }}>${n(t, "customize")}</button>` : p}
    </div>`;
  }
  _overrides(e, t) {
    const s = this.hass, i = this.d, a = i.light.overrides, r = (d) => a.findIndex((h) => h.target.entity_id?.length === 1 && h.target.entity_id[0] === d), c = (d) => this._sub("light", { overrides: d });
    return l`<div class="divider"></div>
      <div class="lbl">${n(s, "per_target")}</div>
      <div class="muted">${n(s, "per_target_hint")}</div>
      ${e.map((d) => {
      const h = r(d), u = h >= 0 ? a[h] : void 0, m = this._overrideOpen === e.indexOf(d), _ = Bt(s?.states[d]?.attributes.supported_color_modes), g = u ? this._profile(u.profile) : void 0;
      return l`<div class="tile" style="display:flex;flex-direction:column;gap:10px">
          <button class="t row" style="border:none;background:none;cursor:pointer;padding:0;text-align:left"
            aria-expanded=${m} @click=${() => this._overrideOpen = m ? -1 : e.indexOf(d)}>
            <b class="grow">${E(s, d)}</b>
            <span class="badge">${u ? g ? g.name : n(s, "own_settings") : n(s, "uses_common")}</span>
          </button>
          ${m ? l`<div class="row">
                  <label class="row"><input type="checkbox" .checked=${!!u}
                    @change=${(b) => c(
        b.target.checked ? [...a, { target: { entity_id: [d] }, profile: null, settings: structuredClone(this._effectiveSettings()) }] : a.filter((x, w) => w !== h)
      )} />${n(s, "use_own")}</label>
                  ${u ? l`<select class="inp" @change=${(b) => {
        const x = b.target.value || null, w = structuredClone(a);
        w[h] = { ...w[h], profile: x }, c(w);
      }}>
                        <option value="" ?selected=${!u.profile}>${n(s, "profile_none")}</option>
                        ${this.lightProfiles.map((b) => l`<option value=${b.id} ?selected=${b.id === u.profile}>${b.name}</option>`)}
                      </select>` : p}
                </div>
                ${u ? l`<db-light-settings .hass=${s} .settings=${g ? g.settings : u.settings} .mode=${this.mode} .locked=${!!g}
                      .duration=${i.light_lead} .start=${t}
                      .colorLamps=${_.color ? [E(s, d)] : []}
                      .plainLamps=${_.color ? [] : [E(s, d)]}
                      .showFine=${i.kind === "wake"}
                      @settings-change=${(b) => {
        const x = structuredClone(a);
        x[h] = { ...x[h], settings: b.detail }, c(x);
      }}></db-light-settings>` : p}` : p}
        </div>`;
    })}`;
  }
  // ---------------------------------------------------------------- others
  _audioSection() {
    const e = this.hass;
    return this._section(
      "audio",
      n(e, "section_audio"),
      n(e, "from_version", { v: "0.3" }),
      () => l`<div class="muted">${n(e, "audio_soon")}</div>`
    );
  }
  _actionsSection() {
    const e = this.hass, t = this.d.actions, s = Ht.reduce((i, a) => i + t[a].length, 0);
    return this._section(
      "act",
      n(e, "section_actions"),
      s ? n(e, "n_actions", { n: s }) : n(e, "optional"),
      () => l`<div class="seg" role="group">
          ${Ht.map(
        (i) => l`<button aria-pressed=${this._phase === i} @click=${() => this._phase = i}>
              ${n(e, `phase_${i}`)}${t[i].length ? ` (${t[i].length})` : ""}
            </button>`
      )}
        </div>
        <div class="muted">${n(e, `phase_${this._phase}_hint`)}</div>
        ${this._selector(
        { action: {} },
        t[this._phase],
        (i) => this._patch({ actions: { ...t, [this._phase]: i ?? [] } })
      )}`
    );
  }
  _noneSection() {
    const e = this.hass, t = this.d, s = t.last_call, i = this._snoozeMinutes, a = this._snoozeCount, r = this._wakeTime, c = M(y(r) + i * a), d = this.lastCallProfiles.find((m) => m.id === s.profile) ?? this.lastCallProfiles[0], h = s.enabled ? n(e, "lc_summary", { time: z(e, c), name: d?.name ?? "" }) : n(e, "lc_stop_at", { time: z(e, c) }), u = [
      { title: n(e, "ladder_ring"), time: z(e, r), desc: n(e, "ladder_ring_d"), on: !0 },
      {
        title: n(e, "ladder_snooze", { n: a, m: i }),
        time: `${z(e, r)} – ${z(e, c)}`,
        desc: n(e, "ladder_snooze_d"),
        on: !0
      },
      s.enabled ? {
        title: n(e, "ladder_last_call"),
        time: `${z(e, c)} – ${z(e, M(y(c) + this._lcDuration))}`,
        desc: n(e, "ladder_last_call_d", { name: d?.name ?? "" }),
        on: !0
      } : { title: n(e, "ladder_stop"), time: z(e, c), desc: n(e, "ladder_stop_d"), on: !0 }
    ];
    return this._section("none", n(e, "section_none"), h, () => l`
      <div class="row">
        <div class="muted grow">${n(e, "none_hint")}</div>
        <span>${n(e, "last_call")}</span>
        ${this._toggle(s.enabled, (m) => this._sub("last_call", { enabled: m }), n(e, "last_call"))}
      </div>
      <div class="ladder">
        ${u.map(
      (m, _) => l`<div class="step ${m.on ? "" : "off"}">
            <div class="n"><span>${_ + 1}</span>${_ < u.length - 1 ? l`<i></i>` : p}</div>
            <div class="c">
              <div class="row"><b class="grow">${m.title}</b><span class="tabular muted">${m.time}</span></div>
              <div class="muted">${m.desc}</div>
            </div>
          </div>`
    )}
      </div>
      <label class="row">
        <span>${s.enabled ? n(e, "lc_at") : n(e, "stop_at")}</span>
        <input class="inp time" type="time" .value=${c} @change=${(m) => {
      let _ = y(m.target.value) - y(r);
      _ < -720 && (_ += 1440), this._sub("snooze", { count: $(Math.round(_ / i), 1, 10) });
    }} />
        <span class="muted">${n(e, "lc_snap", { n: a })}</span>
      </label>
      ${s.enabled ? l`<div class="lcp">
              ${this.lastCallProfiles.map(
      (m) => l`<button class="pick" aria-pressed=${m.id === s.profile} @click=${() => this._sub("last_call", { profile: m.id })}>
                  <b>${m.name}</b>
                  <span class="muted">${n(e, "lc_profile_desc", { min: m.duration, bri: Math.round(m.brightness) })}</span>
                </button>`
    )}
            </div>
            <div><button class="btn" @click=${() => S(this, "daybreak-tab", { tab: "last_call" })}>${n(e, "profiles_manage")}</button></div>` : p}
      <div class="tile row">
        <div class="grow"><div>${n(e, "stop_on_light_off")}</div><div class="muted">${n(e, "stop_on_light_off_d")}</div></div>
        ${this._toggle(t.stop_on_light_off, (m) => this._patch({ stop_on_light_off: m }), n(e, "stop_on_light_off"))}
      </div>
    `);
  }
  _notifyTargets() {
    return Object.keys(this.hass?.states ?? {}).filter((e) => e.startsWith("notify."));
  }
  _fallbackSection() {
    const e = this.hass, t = this.d.fallback, s = this._lights, i = t.notify ?? this.settings?.notify ?? null, a = [
      Object.keys(t.lights).length ? n(e, "fb_n_spare", { n: Object.keys(t.lights).length }) : "",
      i ? E(e, i) : ""
    ].filter(Boolean).join(" · "), r = (h) => this._sub("fallback", h), c = l`<div class="field">
      ${n(e, "fb_notify")}
      <input class="inp" list="db-notify" .value=${t.notify ?? ""} placeholder=${this.settings?.notify ?? n(e, "fb_notify_ph")}
        @change=${(h) => r({ notify: h.target.value.trim() || null })} />
      <datalist id="db-notify">${this._notifyTargets().map((h) => l`<option value=${h}>${E(e, h)}</option>`)}</datalist>
    </div>`, d = (h) => {
      const u = h ? t.lights[h] ?? "" : Object.values(t.lights)[0] ?? "";
      return this._picker(["light"], u || null, (m) => {
        const _ = { ...t.lights };
        for (const g of h ? [h] : s)
          m ? _[g] = m : delete _[g];
        r({ lights: _ });
      }, { label: h ? E(e, h) : n(e, "fb_spare") });
    };
    return this._section(
      "fb",
      n(e, "section_fb"),
      a || n(e, "none"),
      () => this._simple ? l`<div class="muted">${n(e, "fb_spare_hint")}</div>${d(null)}${c}` : l`<div class="lbl">${n(e, "fb_spare")}</div>
            <div class="muted">${n(e, "fb_spare_hint")}</div>
            ${s.length ? s.map((h) => d(h)) : l`<div class="muted">${n(e, "no_lights")}</div>`}
            <div class="lbl">${n(e, "fb_notifications")}</div>
            ${c}
            <div class="notify">
              ${ai.map(
        (h) => l`<span>${n(e, `ev_${h}`)}</span>
                  <input type="checkbox" .checked=${t.events.includes(h)}
                    @change=${(u) => r({
          events: u.target.checked ? [...t.events, h] : t.events.filter((m) => m !== h)
        })} />`
      )}
            </div>
            <label class="row"><input type="checkbox" .checked=${t.persistent}
              @change=${(h) => r({ persistent: h.target.checked })} />${n(e, "fb_persistent")}</label>`
    );
  }
  render() {
    if (!this._draft) return p;
    const e = this.d.kind;
    return l`
      ${this._header()}
      <div class="body">
        <div class="muted">${n(this.hass, `mode_${this.mode}_hint`)}</div>
        ${this._head()}
        ${this._timeSection()}
        ${e === "wake" || !this._simple ? this._condSection() : p}
        ${this._lightSection()}
        ${e === "wake" ? this._audioSection() : p}
        ${this._simple ? p : this._actionsSection()}
        ${!this._simple && e === "wake" ? this._noneSection() : p}
        ${this._fallbackSection()}
      </div>
    `;
  }
};
ft.styles = [
  K,
  F`
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
let A = ft;
C([
  f({ attribute: !1 })
], A.prototype, "hass");
C([
  f({ attribute: !1 })
], A.prototype, "alarm");
C([
  f({ attribute: !1 })
], A.prototype, "settings");
C([
  f({ attribute: !1 })
], A.prototype, "lightProfiles");
C([
  f({ attribute: !1 })
], A.prototype, "lastCallProfiles");
C([
  f({ attribute: !1 })
], A.prototype, "holidayEntity");
C([
  f()
], A.prototype, "mode");
C([
  f({ type: Boolean })
], A.prototype, "isNew");
C([
  f({ type: Boolean })
], A.prototype, "saving");
C([
  f({ type: Boolean })
], A.prototype, "narrow");
C([
  v()
], A.prototype, "_draft");
C([
  v()
], A.prototype, "_open");
C([
  v()
], A.prototype, "_ownerPick");
C([
  v()
], A.prototype, "_morePresence");
C([
  v()
], A.prototype, "_phase");
C([
  v()
], A.prototype, "_unlocked");
C([
  v()
], A.prototype, "_newProfileName");
C([
  v()
], A.prototype, "_sun");
C([
  v()
], A.prototype, "_overrideOpen");
customElements.define("daybreak-alarm-editor", A);
var oi = Object.defineProperty, Z = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && oi(e, t, i), i;
};
const bt = class bt extends L {
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
    S(this, "hass-notification", { message: he(this.hass, e) });
  }
  _startEdit(e, t) {
    const s = this.hass, i = structuredClone(e);
    t && (delete i.id, delete i.builtin, i.name = n(s, "profile_copy_name", { name: e.name })), this._edit = i, this._confirmed = !1;
  }
  _new() {
    this._edit = { id: "", name: n(this.hass, "profile_new_name"), duration: 30, settings: as() }, this._confirmed = !1;
  }
  async _save() {
    const e = this.hass, t = this._edit;
    if (!e || !t) return;
    if (!t.name.trim()) {
      this._error(new Error(n(e, "profile_name_required")));
      return;
    }
    const s = { ...t };
    s.id || delete s.id;
    try {
      const i = await we(e, "light", s, this._confirmed);
      this._sel = i.id, this._edit = void 0;
    } catch (i) {
      this._error(i);
    }
  }
  async _delete(e) {
    if (!(!this.hass || !confirm(n(this.hass, "profile_delete_confirm", { name: e.name }))))
      try {
        await ts(this.hass, "light", e.id), this._sel = "natural", this._edit = void 0;
      } catch (t) {
        this._error(t);
      }
  }
  render() {
    const e = this.hass, t = this._profiles.filter((a) => a.builtin), s = this._profiles.filter((a) => !a.builtin), i = (a) => l`<button class="item" aria-current=${!this._edit && this._sel === a.id}
      @click=${() => {
      this._sel = a.id, this._edit = void 0;
    }}>
      <i style="background:${Y(a.settings)}"></i>
      <span><b>${a.name}</b><span class="muted">${n(e, `curve_${a.settings.curve}`)} · ${a.duration} min</span></span>
    </button>`;
    return l`<p class="muted" style="margin:0">${n(e, "profiles_intro")}</p>
      <div class="wrap">
        <aside class="card">
          <button class="btn primary" @click=${this._new}>+ ${n(e, "profile_new_btn")}</button>
          <div class="lbl" style="margin-top:8px">${n(e, "templates")}</div>
          ${t.map(i)}
          <div class="lbl" style="margin-top:8px">${n(e, "own_profiles")}</div>
          ${s.length ? s.map(i) : l`<span class="muted">${n(e, "none")}</span>`}
        </aside>
        <main class="card">${this._edit ? this._editor() : this._detail()}</main>
      </div>`;
  }
  _detail() {
    const e = this.hass, t = this._profiles.find((h) => h.id === this._sel) ?? this._profiles[0];
    if (!t) return p;
    const s = t.settings, i = this._users(t.id), a = this._shared(t.id), c = ye(s, "bri").map(([h], u) => {
      const m = xe(s, h);
      return {
        n: u + 1,
        pct: Math.round(h * 100),
        min: Math.round(h * t.duration),
        bri: Math.round(m.bri),
        ct: (() => {
          const _ = xe(s, h, { ct: !0, color: !1 }).kelvin;
          return _ ? `${Math.round(_ / 10) * 10} K` : "–";
        })(),
        css: lt(m, !1)
      };
    }), d = [
      ["duration", `${t.duration} min`],
      ["curve", n(e, `curve_${s.curve}`)],
      ["ls_brightness", `${Math.round(s.brightness[0])} → ${Math.round(s.brightness[1])} %`],
      s.color_mode === "ct" ? ["ls_ct", `${s.kelvin[0]} → ${s.kelvin[1]} K`] : ["ls_color", n(e, `colors_${s.colors}`)],
      ["fine_ringing", n(e, `ringing_${s.ringing}`)],
      ["fine_after", n(e, `after_stop_${s.after_stop}`)]
    ];
    return l`
      <div class="row">
        <h2 class="grow">${t.name}</h2>
        ${t.builtin ? l`<span class="chip">${n(e, "template_ro")}</span>` : p}
        ${t.builtin || a ? l`<button class="btn" @click=${() => this._startEdit(t, !0)}>${n(e, "edit_copy")}</button>` : l`<button class="btn" @click=${() => this._startEdit(t, !1)}>${n(e, "edit")}</button>`}
        ${!t.builtin && !i.length ? l`<button class="btn danger" @click=${() => this._delete(t)}>${n(e, "delete")}</button>` : p}
      </div>
      ${a ? l`<div class="warn">${n(e, "profile_shared_hint")}</div>` : p}
      <div class="ramp" style="background:${Y(s)}"></div>
      <div class="facts">${d.map(([h, u]) => l`<div><span class="muted">${n(e, h)}</span><b>${u}</b></div>`)}</div>
      <div class="lbl">${n(e, "curve_points")}</div>
      <table>
        <thead><tr><th>#</th><th>${n(e, "ls_share")}</th><th>${n(e, "minute")}</th><th>${n(e, "ls_brightness")}</th>
          <th>${n(e, "ls_ct")}</th><th>${n(e, "ls_color")}</th></tr></thead>
        <tbody>${c.map(
      (h) => l`<tr><td>${h.n}</td><td>${h.pct} %</td><td>${h.min}</td><td>${h.bri} %</td><td>${h.ct}</td>
            <td><span class="sw" style="background:${h.css}"></span></td></tr>`
    )}</tbody>
      </table>
      <div class="muted">
        ${n(e, "used_by")}: ${i.length ? i.map((h) => h.name).join(", ") : n(e, "nobody")}
      </div>
    `;
  }
  _editor() {
    const e = this.hass, t = this._edit, s = this._editMode ?? this.mode, i = t.id ? this._users(t.id) : [], a = t.id ? this._shared(t.id) : !1, r = Object.keys(e?.states ?? {}).filter((d) => d.startsWith("light.")), c = i.length > 1;
    return l`
      <div class="row">
        <input class="inp name" .value=${t.name} aria-label=${n(e, "f_name")}
          @input=${(d) => this._edit = { ...t, name: d.target.value }} />
        <div class="seg" role="group">
          ${["simple", "normal", "expert"].map(
      (d) => l`<button aria-pressed=${s === d} @click=${() => this._editMode = d}>${n(e, `mode_${d}`)}</button>`
    )}
        </div>
      </div>
      ${a ? l`<div class="warn"><span class="grow">${n(e, "profile_shared_hint")}</span>
            <button class="btn" @click=${() => this._startEdit(t, !0)}>${n(e, "edit_copy")}</button></div>` : p}
      ${!a && i.length ? l`<label class="warn">
            ${c ? l`<input type="checkbox" .checked=${this._confirmed} @change=${(d) => this._confirmed = d.target.checked} />` : p}
            <span>${n(e, "profile_in_use_hint", { n: i.length, names: i.map((d) => d.name).join(", ") })}</span>
          </label>` : p}
      <label class="row">
        <span>${n(e, "duration")}</span>
        <input class="inp num" type="number" min="0" max="240" .value=${String(t.duration)}
          @change=${(d) => this._edit = { ...t, duration: Number(d.target.value) || 0 }} />
        <span>min</span>
        <span class="muted">${n(e, "profile_duration_hint")}</span>
      </label>
      <db-light-settings .hass=${e} .settings=${t.settings} .mode=${s} .duration=${t.duration || 30} .start=${"06:00"}
        .locked=${a}
        @settings-change=${(d) => this._edit = { ...t, settings: d.detail }}></db-light-settings>
      ${e?.user?.is_admin ? l`<div class="tile row">
            <span>${n(e, "preview_on")}</span>
            <select class="inp" @change=${(d) => this._previewLight = d.target.value}>
              <option value="">–</option>
              ${r.map((d) => l`<option value=${d} ?selected=${d === this._previewLight}>${e.states[d].attributes.friendly_name ?? d}</option>`)}
            </select>
            <input class="grow" type="range" min="0" max="1" step="0.01" .value=${String(this._previewAt)}
              ?disabled=${!this._previewLight} style="accent-color:var(--db-accent)"
              @change=${(d) => {
      this._previewAt = Number(d.target.value), this._previewLight && Hs(e, [this._previewLight], t.settings, this._previewAt).catch((h) => this._error(h));
    }} />
            <span class="tabular">${z(e, M(360 + this._previewAt * (t.duration || 30)))}</span>
          </div>` : p}
      <div class="row" style="justify-content:flex-end">
        ${t.id && !i.length && !t.builtin ? l`<button class="btn danger" @click=${() => this._delete(t)}>${n(e, "delete")}</button>` : p}
        <span class="grow"></span>
        <button class="btn" @click=${() => this._edit = void 0}>${n(e, "cancel")}</button>
        <button class="btn primary" ?disabled=${a || c && !this._confirmed} @click=${this._save}>
          ${n(e, "profile_save")}
        </button>
      </div>
    `;
  }
};
bt.styles = [
  K,
  F`
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
let j = bt;
Z([
  f({ attribute: !1 })
], j.prototype, "hass");
Z([
  f({ attribute: !1 })
], j.prototype, "snapshot");
Z([
  f()
], j.prototype, "mode");
Z([
  v()
], j.prototype, "_sel");
Z([
  v()
], j.prototype, "_edit");
Z([
  v()
], j.prototype, "_editMode");
Z([
  v()
], j.prototype, "_confirmed");
Z([
  v()
], j.prototype, "_previewLight");
Z([
  v()
], j.prototype, "_previewAt");
customElements.define("db-profiles-view", j);
var li = Object.defineProperty, Se = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && li(e, t, i), i;
};
const vt = class vt extends L {
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
    S(this, "hass-notification", { message: he(this.hass, e) });
  }
  _describe(e) {
    const t = this.hass, s = Fe(t, e.targets);
    return [
      n(t, "lc_profile_desc", { min: e.duration, bri: Math.round(e.brightness) }),
      s.length ? s.map((i) => E(t, i)).join(", ") : n(t, "lc_alarm_lights"),
      e.actions.length ? n(t, "n_actions", { n: e.actions.length }) : ""
    ].filter(Boolean).join(" · ");
  }
  _start(e, t) {
    const s = structuredClone(e);
    t && (s.id = "", delete s.builtin, s.name = n(this.hass, "profile_copy_name", { name: e.name })), this._edit = s, this._confirmed = !1;
  }
  async _save() {
    const e = this.hass, t = this._edit;
    if (!e || !t) return;
    const s = { ...t };
    s.id || delete s.id;
    try {
      const i = await we(e, "last_call", s, this._confirmed);
      this._sel = i.id, this._edit = void 0;
    } catch (i) {
      this._error(i);
    }
  }
  render() {
    const e = this.hass, t = this.snapshot?.settings.default_last_call;
    return l`<p class="muted" style="margin:0">${n(e, "lc_intro")}</p>
      <div class="wrap">
        <aside class="card">
          <button class="btn primary" @click=${() => this._start({ id: "", name: n(e, "lc_new_name"), duration: 10, targets: {}, brightness: 100, kelvin: 5e3, actions: [] }, !1)}>
            + ${n(e, "profile_new_btn")}
          </button>
          ${this._profiles.map(
      (s) => l`<button class="item" aria-current=${!this._edit && this._sel === s.id}
              @click=${() => {
        this._sel = s.id, this._edit = void 0;
      }}>
              <b>${s.name}${s.id === t ? l` <span class="muted">· ${n(e, "default")}</span>` : p}</b>
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
    const s = this._users(t.id), i = this._shared(t.id), a = this.snapshot?.settings.default_last_call === t.id;
    return l`
      <div class="row">
        <h2 class="grow">${t.name}</h2>
        ${a ? l`<span class="chip">${n(e, "default")}</span>` : l`<button class="btn" @click=${() => e && ot(e, { default_last_call: t.id }).catch((r) => this._error(r))}>
              ${n(e, "make_default")}</button>`}
        ${t.builtin || i ? l`<button class="btn" @click=${() => this._start(t, !0)}>${n(e, "edit_copy")}</button>` : l`<button class="btn" @click=${() => this._start(t, !1)}>${n(e, "edit")}</button>`}
      </div>
      <div class="muted">${n(e, "lc_detail_hint")}</div>
      <div class="tile">${this._describe(t)}${t.kelvin ? ` · ${t.kelvin} K` : ""}</div>
      ${i ? l`<div class="warn">${n(e, "profile_shared_hint")}</div>` : p}
      <div class="muted">${n(e, "used_by")}: ${s.length ? s.map((r) => r.name).join(", ") : n(e, "nobody")}</div>
      <div class="muted">${n(e, "audio_lc_soon")}</div>
    `;
  }
  _editor() {
    const e = this.hass, t = this._edit, s = t.id ? this._users(t.id) : [], i = t.id ? this._shared(t.id) : !1, a = s.length > 1, r = (c) => this._edit = { ...t, ...c };
    return l`
      <input class="inp" style="font-size:20px;height:44px" .value=${t.name} aria-label=${n(e, "f_name")}
        @input=${(c) => r({ name: c.target.value })} />
      ${i ? l`<div class="warn">${n(e, "profile_shared_hint")}</div>` : p}
      ${!i && s.length ? l`<label class="warn">
            ${a ? l`<input type="checkbox" .checked=${this._confirmed} @change=${(c) => this._confirmed = c.target.checked} />` : p}
            <span>${n(e, "profile_in_use_hint", { n: s.length, names: s.map((c) => c.name).join(", ") })}</span>
          </label>` : p}
      <div class="grid">
        <label class="field">${n(e, "lc_duration")}
          <input class="inp" type="number" min="1" max="120" .value=${String(t.duration)}
            @change=${(c) => r({ duration: $(Number(c.target.value) || 1, 1, 120) })} /></label>
        <label class="field">${n(e, "ls_brightness")} (%)
          <input class="inp" type="number" min="0" max="100" .value=${String(t.brightness)}
            @change=${(c) => r({ brightness: $(Number(c.target.value), 0, 100) })} /></label>
        <label class="field">${n(e, "ls_ct")} (K)
          <input class="inp" type="number" min="1500" max="6500" step="50" placeholder="–" .value=${t.kelvin ? String(t.kelvin) : ""}
            @change=${(c) => {
      const d = c.target.value;
      r({ kelvin: d ? $(Number(d), 1500, 6500) : null });
    }} /></label>
      </div>
      <div class="lbl">${n(e, "lc_lights")}</div>
      <div class="muted">${n(e, "lc_lights_hint")}</div>
      <db-entity-picker .hass=${e} .domains=${["light"]} multiple areaPick .value=${Fe(e, t.targets)}
        @value-changed=${(c) => {
      c.stopPropagation(), r({ targets: { entity_id: c.detail.value ?? [] } });
    }}></db-entity-picker>
      <div class="lbl">${n(e, "lc_actions")}</div>
      <div class="muted">${n(e, "lc_actions_hint")}</div>
      <ha-selector .required=${!1} .hass=${e} .selector=${{ action: {} }} .value=${t.actions}
        @value-changed=${(c) => r({ actions: c.detail.value ?? [] })}></ha-selector>
      <div class="row">
        ${t.id && !s.length && !t.builtin ? l`<button class="btn danger" @click=${async () => {
      if (!(!e || !confirm(n(e, "profile_delete_confirm", { name: t.name }))))
        try {
          await ts(e, "last_call", t.id), this._edit = void 0, this._sel = "all_on";
        } catch (c) {
          this._error(c);
        }
    }}>${n(e, "delete")}</button>` : p}
        <span class="grow"></span>
        <button class="btn" @click=${() => this._edit = void 0}>${n(e, "cancel")}</button>
        <button class="btn primary" ?disabled=${i || a && !this._confirmed} @click=${this._save}>
          ${n(e, "profile_save")}</button>
      </div>
    `;
  }
};
vt.styles = [
  K,
  F`
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
let Q = vt;
Se([
  f({ attribute: !1 })
], Q.prototype, "hass");
Se([
  f({ attribute: !1 })
], Q.prototype, "snapshot");
Se([
  v()
], Q.prototype, "_sel");
Se([
  v()
], Q.prototype, "_edit");
Se([
  v()
], Q.prototype, "_confirmed");
customElements.define("db-last-call-view", Q);
var ci = Object.defineProperty, ht = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && ci(e, t, i), i;
};
const di = ["snow", "storm", "rain"], $t = class $t extends L {
  constructor() {
    super(...arguments), this._busy = !1;
  }
  get s() {
    return this.snapshot.settings;
  }
  async _set(e) {
    if (this.hass)
      try {
        await ot(this.hass, e);
      } catch (t) {
        S(this, "hass-notification", { message: he(this.hass, t) });
      }
  }
  _sel(e, t, s, i, a = {}) {
    return l`<db-entity-picker .hass=${this.hass} .domains=${e} .value=${t} .label=${i}
      .multiple=${!!a.multiple} .deviceClass=${a.deviceClass}
      @value-changed=${(r) => {
      r.stopPropagation(), s(r.detail.value);
    }}></db-entity-picker>`;
  }
  _presets() {
    const e = this.hass, t = this.s.snooze_presets, s = (a) => this._set({ snooze_presets: a }), i = (a, r) => s(t.map((c, d) => d === a ? { ...c, ...r } : c));
    return l`
      ${t.map(
      (a, r) => l`<div class="preset">
          <input type="radio" name="def" .checked=${this.s.default_snooze === a.id} aria-label=${n(e, "default")}
            @change=${() => this._set({ default_snooze: a.id })} />
          <input class="inp" .value=${a.name} @change=${(c) => i(r, { name: c.target.value || a.name })} />
          <input class="inp num" type="number" min="1" max="60" .value=${String(a.minutes)}
            @change=${(c) => i(r, { minutes: $(Number(c.target.value) || 1, 1, 60) })} />
          <span>min</span>
          <button class="btn" ?disabled=${t.length <= 1} aria-label=${n(e, "delete")}
            @click=${() => s(t.filter((c, d) => d !== r))}>✕</button>
        </div>`
    )}
      <div class="row">
        <button class="btn" ?disabled=${t.length >= 12}
          @click=${() => s([...t, { id: `p${Date.now().toString(36)}`, name: n(e, "preset_new"), minutes: 10 }])}>
          + ${n(e, "preset_add")}</button>
        <span class="grow"></span>
        <label class="row"><span>${n(e, "default_count")}</span>
          <input class="inp num" type="number" min="1" max="10" .value=${String(this.s.default_snooze_count)}
            @change=${(a) => this._set({ default_snooze_count: $(Number(a.target.value) || 1, 1, 10) })} />
          <span>×</span></label>
      </div>
      <div class="muted">${n(e, "presets_hint")}</div>
    `;
  }
  _export() {
    const e = this.snapshot, t = {
      daybreak: 2,
      alarms: e.alarms.map(({ runtime: a, ...r }) => r),
      light_profiles: e.light_profiles.filter((a) => !a.builtin),
      last_call_profiles: e.last_call_profiles.filter((a) => !a.builtin),
      settings: e.settings
    }, s = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), i = document.createElement("a");
    i.href = URL.createObjectURL(s), i.download = `daybreak-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`, i.click(), setTimeout(() => URL.revokeObjectURL(i.href), 1e3);
  }
  async _import(e) {
    const t = this.hass, s = e.target, i = s.files?.[0];
    if (s.value = "", !(!t || !i)) {
      this._busy = !0;
      try {
        const a = JSON.parse(await i.text());
        if (a?.daybreak !== 2) throw new Error(n(t, "import_invalid"));
        const r = a.alarms ?? [];
        if (!confirm(n(t, "import_confirm", { n: r.length }))) return;
        const c = {};
        for (const h of a.light_profiles ?? []) {
          const { id: u, ...m } = h;
          c[u] = (await we(t, "light", m)).id;
        }
        const d = {};
        for (const h of a.last_call_profiles ?? []) {
          const { id: u, ...m } = h;
          d[u] = (await we(t, "last_call", m)).id;
        }
        for (const h of r) {
          const u = structuredClone(h);
          delete u.id, u.light?.profile && (u.light.profile = c[u.light.profile] ?? u.light.profile);
          for (const m of u.light?.overrides ?? []) m.profile && (m.profile = c[m.profile] ?? m.profile);
          u.last_call?.profile && (u.last_call.profile = d[u.last_call.profile] ?? u.last_call.profile), await Qt(t, u);
        }
        S(this, "hass-notification", { message: n(t, "import_done", { n: r.length }) });
      } catch (a) {
        S(this, "hass-notification", { message: he(t, a) });
      } finally {
        this._busy = !1;
      }
    }
  }
  render() {
    const e = this.hass;
    if (!this.snapshot) return l``;
    const t = this.s;
    return l`
      <section class="card">
        <h2>${n(e, "settings_general")}</h2>
        <div class="row">
          <span>${n(e, "default_mode")}</span>
          <div class="seg" role="group">
            ${["simple", "normal", "expert"].map(
      (s) => l`<button aria-pressed=${t.default_mode === s} @click=${() => this._set({ default_mode: s })}>
                ${n(e, `mode_${s}`)}</button>`
    )}
          </div>
        </div>
        <div class="muted">${n(e, "default_mode_hint")}</div>
        ${this._sel(
      ["binary_sensor"],
      t.holiday_entity,
      (s) => this._set({ holiday_entity: s || null }),
      n(e, "holiday_entity")
    )}
        <div class="muted">
          ${this.snapshot.holiday_entity ? n(e, "holiday_used", { entity: E(e, this.snapshot.holiday_entity) }) : n(e, "holidays_none")}
        </div>
        ${this._sel(["notify"], t.notify, (s) => this._set({ notify: s || null }), n(e, "notify_default"))}
        <div class="muted">${n(e, "notify_hint")}</div>
      </section>

      <section class="card">
        <h2>${n(e, "settings_snooze")}</h2>
        ${this._presets()}
      </section>

      <section class="card">
        <h2>${n(e, "settings_weather")}</h2>
        <div class="muted">${n(e, "settings_weather_hint")}</div>
        ${this._sel(["weather"], t.weather_entity, (s) => this._set({ weather_entity: s || null }), n(e, "weather_entity"))}
        <div class="grid">
          ${di.map(
      (s) => l`<label class="cell"><span class="grow">${n(e, `weather_${s}`)}</span>
              <input class="inp num" type="number" min="0" max="240" .value=${String(t.weather_minutes[s] ?? 0)}
                @change=${(i) => this._set({ weather_minutes: { ...t.weather_minutes, [s]: $(Number(i.target.value), 0, 240) } })} />
              <span>min</span></label>`
    )}
          <label class="cell"><span class="grow">${n(e, "cold_below")}</span>
            <input class="inp num" type="number" step="0.5" .value=${String(t.cold_below)}
              @change=${(s) => this._set({ cold_below: Number(s.target.value) })} /><span>°C</span></label>
          <label class="cell"><span class="grow">${n(e, "cold_minutes")}</span>
            <input class="inp num" type="number" min="0" max="240" .value=${String(t.cold_minutes)}
              @change=${(s) => this._set({ cold_minutes: $(Number(s.target.value), 0, 240) })} /><span>min</span></label>
        </div>
        ${this._sel(
      ["sensor"],
      t.temperature_entity,
      (s) => this._set({ temperature_entity: s || null }),
      n(e, "temperature_entity"),
      { deviceClass: "temperature" }
    )}
        ${this._sel(
      ["sensor", "binary_sensor"],
      t.warning_entities,
      (s) => this._set({ warning_entities: s ?? [] }),
      n(e, "warning_entities"),
      { multiple: !0 }
    )}
        <label class="row"><span>${n(e, "warning_level")}</span>
          <select class="inp" @change=${(s) => this._set({ warning_level: Number(s.target.value) })}>
            ${[1, 2, 3, 4].map((s) => l`<option value=${s} ?selected=${t.warning_level === s}>${n(e, `warning_${s}`)}</option>`)}
          </select></label>
      </section>

      <section class="card">
        <h2>${n(e, "settings_backup")}</h2>
        <div class="muted">${n(e, "backup_hint")}</div>
        <div class="row">
          <button class="btn" @click=${this._export}>${n(e, "export")}</button>
          <label class="btn" style="cursor:pointer">
            ${n(e, "import")}<input type="file" accept="application/json,.json" hidden ?disabled=${this._busy} @change=${this._import} />
          </label>
        </div>
      </section>
    `;
  }
};
$t.styles = [
  K,
  F`
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
    `
];
let _e = $t;
ht([
  f({ attribute: !1 })
], _e.prototype, "hass");
ht([
  f({ attribute: !1 })
], _e.prototype, "snapshot");
ht([
  v()
], _e.prototype, "_busy");
customElements.define("db-settings-view", _e);
var hi = Object.defineProperty, q = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && hi(e, t, i), i;
};
const pi = ["wake", "sleep", "kids"], ui = {
  wake: "linear-gradient(90deg,#3a1a12,#b4441f,#ff8a4c,#ffd9a0)",
  sleep: "linear-gradient(90deg,#ffb36b,#b5577a,#3d3a78,#0b1020)",
  kids: "linear-gradient(90deg,#e0402a 0 50%,#3cc864 50% 100%)"
}, wt = class wt extends L {
  constructor() {
    super(...arguments), this.narrow = !1, this._tab = "alarms", this._saving = !1, this._now = Date.now(), this._ready = !1, this._chooser = !1, this._onceOpen = !1, this._onceTime = "";
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this._now = Date.now(), 3e4), Js().then(() => this._ready = !0), this._subscribe();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this._timer), this._unsub?.(), this._unsub = void 0;
  }
  updated(e) {
    e.has("hass") && this._subscribe();
  }
  _subscribe() {
    this._unsub || !this.hass || !this.isConnected || (this._unsub = is(this.hass, (e) => {
      this._snapshot = fs(this.hass, e), this._mode = void 0;
    }));
  }
  get _editorMode() {
    return this._mode ?? this._snapshot?.settings.default_mode ?? "normal";
  }
  _error(e) {
    S(this, "hass-notification", { message: he(this.hass, e) });
  }
  // ------------------------------------------------------------- editing
  _new(e) {
    const t = this.hass, s = Ot(e, n(t, `kind_${e}_name`)), i = this._snapshot?.settings;
    i && (s.last_call.profile = i.default_last_call);
    const a = Object.values(t?.states ?? {}).find(
      (r) => r.entity_id.startsWith("person.") && r.attributes.user_id && t?.user?.id === r.attributes.user_id
    );
    a && (s.owners = [a.entity_id]), this._chooser = !1, this._editing = { alarm: s };
  }
  _edit(e) {
    const { runtime: t, id: s, ...i } = e;
    this._editing = { alarm: os(Ot(i.kind), i), id: s };
  }
  async _save(e) {
    if (!(!this.hass || !this._editing)) {
      this._saving = !0;
      try {
        const t = structuredClone(e.detail.alarm), s = e.detail.newProfile;
        if (s) {
          const i = await we(this.hass, "light", s);
          t.light.profile = i.id;
        }
        delete t.id, this._editing.id ? await js(this.hass, this._editing.id, t) : await Qt(this.hass, t), this._editing = void 0;
      } catch (t) {
        this._error(t);
      } finally {
        this._saving = !1;
      }
    }
  }
  async _delete() {
    const e = this._editing;
    if (!(!this.hass || !e?.id) && confirm(n(this.hass, "delete_confirm", { name: e.alarm.name })))
      try {
        await Us(this.hass, e.id), this._editing = void 0;
      } catch (t) {
        this._error(t);
      }
  }
  async _action(e, t, s = {}) {
    if (this.hass)
      try {
        await es(this.hass, e, t, s);
      } catch (i) {
        this._error(i);
      }
  }
  _setMode(e) {
    this._mode = e.detail.mode, this.hass && ot(this.hass, { default_mode: e.detail.mode }).catch((t) => this._error(t));
  }
  // -------------------------------------------------------------- render
  render() {
    const e = this.hass, t = ["alarms", "profiles", "last_call", "settings"];
    return l`
      <div class="toolbar">
        <ha-menu-button .hass=${e} .narrow=${this.narrow}></ha-menu-button>
        ${Is(28)}
        <h1>${this._editing ? this._editing.alarm.name || n(e, "new_alarm") : n(e, "title")}</h1>
      </div>
      ${this._editing ? p : l`<div class="tabs" role="tablist">
            ${t.map(
      (s) => l`<button role="tab" aria-selected=${this._tab === s} @click=${() => this._tab = s}>
                ${n(e, `tab_${s}`)}
              </button>`
    )}
          </div>`}
      <main>${this._body()}</main>
    `;
  }
  _body() {
    const e = this._snapshot;
    if (!e || !this._ready) return l`<div class="loading">…</div>`;
    if (this._editing)
      return l`<daybreak-alarm-editor
        .hass=${this.hass}
        .alarm=${this._editing.alarm}
        .settings=${e.settings}
        .lightProfiles=${e.light_profiles}
        .lastCallProfiles=${e.last_call_profiles}
        .holidayEntity=${e.holiday_entity}
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
        return l`<db-profiles-view .hass=${this.hass} .snapshot=${e} .mode=${this._editorMode}></db-profiles-view>`;
      case "last_call":
        return l`<db-last-call-view .hass=${this.hass} .snapshot=${e}></db-last-call-view>`;
      case "settings":
        return l`<db-settings-view .hass=${this.hass} .snapshot=${e}></db-settings-view>`;
      default:
        return this._alarms(e);
    }
  }
  _alarms(e) {
    const t = this.hass, s = e.alarms.filter((a) => Qe.includes(a.runtime.state)), i = [...e.alarms].sort(
      (a, r) => (a.runtime.next_alarm ?? "9999").localeCompare(r.runtime.next_alarm ?? "9999")
    );
    return l`
      ${s.map((a) => this._activeCard(a))}
      ${this._top(e)}
      <section class="card list" aria-label=${n(t, "tab_alarms")}>
        ${i.length ? i.map((a) => this._row(a)) : l`<div class="empty">${n(t, "no_alarms")}</div>`}
      </section>
      ${this._chooser ? l`<section class="card chooser">
            <b>${n(t, "new_what")}</b>
            <div class="kinds">
              ${pi.map(
      (a) => l`<button class="kind" @click=${() => this._new(a)}>
                  <i style="background:${ui[a]}"></i>
                  <b>${n(t, `kind_${a}`)}</b>
                  <span class="muted">${n(t, `kind_${a}_d`)}</span>
                </button>`
    )}
            </div>
          </section>` : p}
      <button class="btn primary fab" aria-expanded=${this._chooser} @click=${() => this._chooser = !this._chooser}>
        + ${n(t, "new_alarm")}
      </button>
    `;
  }
  _activeCard(e) {
    const t = this.hass, s = e.runtime, i = s.state === "snoozed" && s.snooze_until ? n(t, "state_snoozed", { time: V(t, s.snooze_until) }) : n(t, `state_${s.state}`);
    return l`<section class="card active">
      <div class="grow">
        <div class="nm">${e.name}${s.test ? l`<span class="badge">${n(t, "test_badge")}</span>` : p}</div>
        <div class="muted">${i}${s.snoozes ? ` · ${n(t, "snoozed_n", { n: s.snoozes })}` : ""}</div>
      </div>
      ${e.kind === "wake" && (s.state === "ringing" || s.state === "snoozed") ? l`<button class="btn" @click=${() => this._action("snooze", e.id)}>${n(t, "snooze")}</button>` : p}
      <button class="btn primary" @click=${() => this._action("stop", e.id)}>${n(t, "stop")}</button>
    </section>`;
  }
  _top(e) {
    const t = this.hass, s = e.next, i = s ? e.alarms.find((u) => u.id === s.alarm_id) : void 0;
    if (!s || !i)
      return l`<section class="card hero"><div class="lbl">${n(t, "next_alarm")}</div>
        <div class="muted">${n(t, "no_next")}</div></section>`;
    const a = i.runtime, r = e.light_profiles.find((u) => u.id === i.light.profile), c = r?.settings ?? i.light.settings, d = Fe(t, i.light.targets), h = ie(t, new Date(s.time));
    return l`<div class="top">
      <section class="card hero">
        <div class="lbl">${n(t, "next_alarm")} · ${H(t, s.time)}</div>
        <div class="times">
          ${a.next_light_start && a.next_light_start !== s.time ? l`<div><div class="muted">${n(t, "tl_light_start")}</div>
                <div class="mid tabular">${V(t, a.next_light_start)}</div></div>` : p}
          <div><div class="muted">${n(t, "tl_wake")}</div><div class="big tabular">${V(t, s.time)}</div></div>
          <span class="grow"></span>
          <div style="text-align:right"><div class="muted">${n(t, "in_label")}</div>
            <div style="font-size:20px;font-weight:600">${et(t, s.time, this._now)}</div></div>
        </div>
        <div class="ramp" style="background:${Y(c)}"></div>
        <div class="row">
          <span class="chip">${i.name}</span>
          ${d.length ? l`<span class="chip">${n(t, "n_lights", { n: d.length })}</span>` : p}
          ${r ? l`<span class="chip">${r.name}</span>` : p}
          ${a.shift ? l`<span class="chip" aria-pressed="true">${n(t, "shifted_by", { min: a.shift })}</span>` : p}
          ${i.once?.date === h ? l`<span class="chip" aria-pressed="true">${n(t, "once_badge")}</span>` : p}
        </div>
      </section>
      <section class="card quick">
        <div class="lbl">${n(t, "quick")}</div>
        <button class="btn" @click=${() => this._action("test", i.id)}>▶ ${n(t, "quick_test")}</button>
        ${i.skip_date ? l`<button class="btn" @click=${() => this._action("cancel_skip", i.id)}>↺ ${n(t, "cancel_skip")}</button>` : l`<button class="btn" @click=${() => this._action("skip_next", i.id)}>⇥ ${n(t, "quick_skip")}</button>`}
        ${i.once ? l`<button class="btn" @click=${() => this._action("clear_once", i.id)}>✕ ${n(t, "quick_once_clear")}</button>` : l`<button class="btn" aria-expanded=${this._onceOpen} @click=${() => {
      this._onceOpen = !this._onceOpen, this._onceTime = ct(t, a.next_base ?? s.time);
    }}>◷ ${n(t, "quick_once")}</button>`}
        ${this._onceOpen && !i.once ? l`<div class="row">
              <input class="inp time" type="time" .value=${this._onceTime}
                @change=${(u) => this._onceTime = u.target.value} />
              <button class="btn primary" @click=${async () => {
      if (!(!t || !this._onceTime))
        try {
          await qs(t, i.id, ie(t, new Date(a.next_base ?? s.time)), this._onceTime), this._onceOpen = !1;
        } catch (u) {
          this._error(u);
        }
    }}>${n(t, "save")}</button>
            </div>` : p}
      </section>
    </div>`;
  }
  _row(e) {
    const t = this.hass, s = e.runtime, i = Le(t), a = e.repeat.type === "weekly" ? l`<div class="pills">${i.map((d, h) => l`<span class=${e.repeat.days.includes(h) ? "on" : ""}>${d.slice(0, 2)}</span>`)}</div>` : p;
    let r;
    Qe.includes(s.state) ? r = n(t, `state_${s.state}`) : e.skip_date ? r = n(t, "skipped", { date: H(t, e.skip_date) }) : s.next_alarm ? r = `${H(t, s.next_alarm)} · ${et(t, s.next_alarm, this._now)}` : r = n(t, `state_${s.state}`);
    const c = s.next_alarm ? V(t, s.next_alarm) : e.wake.type === "fixed" ? z(t, e.wake.time) : "–";
    return l`<div class="alarm ${e.enabled ? "" : "off"}" role="button" tabindex="0"
      @click=${() => this._edit(e)} @keydown=${(d) => d.key === "Enter" && this._edit(e)}>
      <div>
        <div class="time tabular">${c}</div>
        ${s.next_light_start && s.next_light_start !== s.next_alarm ? l`<div class="muted">${n(t, "light_from", { time: V(t, s.next_light_start) })}</div>` : p}
      </div>
      <div class="grow">
        <div class="nm">${e.name}
          ${e.kind !== "wake" ? l`<span class="badge">${n(t, `kind_${e.kind}`)}</span>` : p}
          ${s.shift ? l`<span class="badge">${n(t, "shifted_by", { min: s.shift })}</span>` : p}
        </div>
        ${a}
        <div class="muted">${e.repeat.type === "weekly" ? "" : dt(t, e) + " · "}${r}</div>
      </div>
      <button class="switch" role="switch" aria-checked=${e.enabled} aria-label=${n(t, "enabled")}
        @click=${(d) => {
      d.stopPropagation(), this._action(e.enabled ? "disable" : "enable", e.id);
    }}></button>
      <span class="muted" aria-hidden="true">›</span>
    </div>`;
  }
};
wt.styles = [
  K,
  F`
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
let O = wt;
q([
  f({ attribute: !1 })
], O.prototype, "hass");
q([
  f({ type: Boolean, reflect: !0 })
], O.prototype, "narrow");
q([
  v()
], O.prototype, "_snapshot");
q([
  v()
], O.prototype, "_tab");
q([
  v()
], O.prototype, "_editing");
q([
  v()
], O.prototype, "_mode");
q([
  v()
], O.prototype, "_saving");
q([
  v()
], O.prototype, "_now");
q([
  v()
], O.prototype, "_ready");
q([
  v()
], O.prototype, "_chooser");
q([
  v()
], O.prototype, "_onceOpen");
q([
  v()
], O.prototype, "_onceTime");
customElements.get("daybreak-panel") || customElements.define("daybreak-panel", O);
var _i = Object.defineProperty, Ae = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && _i(e, t, i), i;
};
class re extends L {
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
    this._unsub || !this.hass || !this.isConnected || (this._unsub = is(this.hass, (e) => this.snapshot = e));
  }
  async act(e, t, s) {
    s?.stopPropagation();
    try {
      await es(this.hass, e, t.id);
    } catch (i) {
      S(this, "hass-notification", { message: he(this.hass, i) });
    }
  }
  isActive(e) {
    return Qe.includes(e.runtime.state);
  }
  stateText(e) {
    const t = this.hass, s = e.runtime;
    return s.state === "snoozed" && s.snooze_until ? n(t, "state_snoozed", { time: V(t, s.snooze_until) }) : this.isActive(e) ? n(t, `state_${s.state}`) : e.skip_date ? n(t, "skipped", { date: H(t, e.skip_date) }) : s.next_alarm ? `${H(t, s.next_alarm)} · ${et(t, s.next_alarm, this.now)}` : n(t, `state_${s.state}`);
  }
  repeatText(e) {
    return dt(this.hass, e);
  }
  rampOf(e) {
    const t = this.snapshot?.light_profiles.find((s) => s.id === e.light.profile);
    return Y(t?.settings ?? e.light.settings);
  }
  /** Progress 0..1 of a running sunrise. */
  progressOf(e) {
    const t = e.runtime;
    if (t.state !== "sunrise" || !t.light_start || !t.alarm_time) return null;
    const s = new Date(t.light_start).getTime(), i = new Date(t.alarm_time).getTime();
    return i > s ? Math.min(1, Math.max(0, (this.now - s) / (i - s))) : 1;
  }
}
Ae([
  f({ attribute: !1 })
], re.prototype, "hass");
Ae([
  f({ reflect: !0, attribute: "card-style" })
], re.prototype, "cardStyle");
Ae([
  f({ type: Boolean, reflect: !0 })
], re.prototype, "accent");
Ae([
  v()
], re.prototype, "snapshot");
Ae([
  v()
], re.prototype, "now");
const ds = [
  K,
  F`
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
], hs = (o) => [
  {
    name: "style",
    selector: {
      select: {
        mode: "dropdown",
        options: ["ha", "mushroom", "bubble"].map((e) => ({ value: e, label: n(o, `style_${e}`) }))
      }
    }
  },
  { name: "accent", selector: { boolean: {} } }
], ps = (o) => (e) => n(o, `c_${e.name}`);
var mi = Object.defineProperty, gi = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && mi(e, t, i), i;
};
const fi = () => document.querySelector("home-assistant")?.hass, yt = class yt extends re {
  static getConfigForm() {
    const e = fi();
    return {
      schema: [
        { name: "title", selector: { text: {} } },
        { name: "show_disabled", selector: { boolean: {} } },
        { name: "show_controls", selector: { boolean: {} } },
        ...hs(e)
      ],
      computeLabel: ps(e)
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
    const t = this.hass, s = this.isActive(e), i = e.runtime.next_alarm ? V(t, e.runtime.next_alarm) : z(t, e.wake.time), a = e.kind === "sleep" ? "mdi:weather-night" : e.kind === "kids" ? "mdi:traffic-light" : "mdi:weather-sunset-up", r = this.progressOf(e);
    return l`<div class="r ${e.enabled ? "" : "off"}">
        <span class="icon ${s ? "on" : ""}"><ha-icon .icon=${a}></ha-icon></span>
        <div class="grow">
          <div class="name">${i} · ${e.name}</div>
          <div class="state">${this.repeatText(e)} · ${this.stateText(e)}</div>
        </div>
        <button class="switch" role="switch" aria-checked=${e.enabled} aria-label=${e.name}
          @click=${(c) => this.act(e.enabled ? "disable" : "enable", e, c)}></button>
      </div>
      ${r !== null ? l`<div class="progress" style="margin:0 4px 4px 56px"><div style="width:${r * 100}%;background:${this.rampOf(e)}"></div></div>` : p}
      ${s && this._config?.show_controls ? l`<div class="features">
            ${e.kind === "wake" && (e.runtime.state === "ringing" || e.runtime.state === "snoozed") ? l`<button class="feature" @click=${() => this.act("snooze", e)}><ha-icon icon="mdi:sleep"></ha-icon>${n(t, "snooze")}</button>` : p}
            <button class="feature primary" @click=${() => this.act("stop", e)}><ha-icon icon="mdi:alarm-off"></ha-icon>${n(t, "stop")}</button>
          </div>` : p}`;
  }
  render() {
    const e = this._config;
    if (!e) return p;
    let t = [...this.snapshot?.alarms ?? []].sort(
      (s, i) => (s.runtime.next_alarm ?? "9").localeCompare(i.runtime.next_alarm ?? "9")
    );
    return e.alarms?.length && (t = t.filter((s) => e.alarms.includes(s.id))), e.show_disabled || (t = t.filter((s) => s.enabled)), l`<ha-card>
      ${e.title ? l`<div class="title">${e.title}</div>` : p}
      <div class="rows">
        ${this.snapshot ? t.length ? t.map((s) => this._row(s)) : l`<div class="empty">${n(this.hass, "no_alarms")}</div>` : l`<div class="empty">…</div>`}
      </div>
    </ha-card>`;
  }
};
yt.styles = [
  ...ds,
  F`
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
let Re = yt;
gi([
  v()
], Re.prototype, "_config");
customElements.get("daybreak-alarms-card") || customElements.define("daybreak-alarms-card", Re);
var bi = Object.defineProperty, vi = (o, e, t, s) => {
  for (var i = void 0, a = o.length - 1, r; a >= 0; a--)
    (r = o[a]) && (i = r(e, t, i) || i);
  return i && bi(e, t, i), i;
};
const $i = () => document.querySelector("home-assistant")?.hass, xt = class xt extends re {
  static getConfigForm() {
    const e = $i();
    return {
      schema: [
        {
          name: "size",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "tile", label: n(e, "size_tile") },
                { value: "large", label: n(e, "size_large") }
              ]
            }
          }
        },
        { name: "alarm", selector: { text: {} } },
        { name: "show_buttons", selector: { boolean: {} } },
        { name: "show_progress", selector: { boolean: {} } },
        ...hs(e)
      ],
      computeLabel: ps(e)
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
    return s || t.filter((i) => i.runtime.next_alarm && i.kind === "wake").sort((i, a) => i.runtime.next_alarm.localeCompare(a.runtime.next_alarm))[0];
  }
  _buttons(e) {
    const t = this.hass;
    if (!this._config?.show_buttons || !this.isActive(e)) return p;
    const s = e.kind === "wake" && (e.runtime.state === "ringing" || e.runtime.state === "snoozed");
    return l`<div class="features">
      ${s ? l`<button class="feature" @click=${() => this.act("snooze", e)}><ha-icon icon="mdi:sleep"></ha-icon>${n(t, "snooze")}</button>` : p}
      <button class="feature primary" @click=${() => this.act("stop", e)}><ha-icon icon="mdi:alarm-off"></ha-icon>${n(t, "stop")}</button>
    </div>`;
  }
  _progress(e) {
    const t = this.progressOf(e);
    return !this._config?.show_progress || t === null ? p : l`<div class="progress"><div style="width:${t * 100}%;background:${this.rampOf(e)}"></div></div>`;
  }
  render() {
    const e = this._config;
    if (!e) return p;
    const t = this.hass, s = this._pick(), i = s?.runtime.next_alarm ?? s?.runtime.alarm_time;
    return e.size === "large" ? l`<ha-card><div class="large">
        <div class="top"><span>${n(t, "next_alarm")}</span><span>${s && i ? H(t, i) : ""}</span></div>
        <div class="big">${s && i ? V(t, i) : "–"}</div>
        <div class="sub">${s ? `${s.name} · ${this.stateText(s)}` : n(t, "no_next")}</div>
        ${s ? this._progress(s) : p}
        ${s ? this._buttons(s) : p}
      </div></ha-card>` : l`<ha-card><div class="tile">
      <div class="head">
        <span class="icon ${s && this.isActive(s) ? "on" : ""}"><ha-icon icon="mdi:weather-sunset-up"></ha-icon></span>
        <div class="info">
          <div class="name">${s ? `${i ? V(t, i) : ""} · ${s.name}` : n(t, "title")}</div>
          <div class="state">${s ? this.stateText(s) : n(t, "no_next")}</div>
        </div>
      </div>
      ${s ? this._progress(s) : p}
      ${s ? this._buttons(s) : p}
    </div></ha-card>`;
  }
};
xt.styles = [
  ...ds,
  F`
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
let je = xt;
vi([
  v()
], je.prototype, "_config");
customElements.get("daybreak-next-card") || customElements.define("daybreak-next-card", je);
const We = document.querySelector("home-assistant")?.hass;
window.customCards = window.customCards || [];
for (const o of [
  { type: "daybreak-alarms-card", name: n(We, "card_name"), description: n(We, "card_desc") },
  { type: "daybreak-next-card", name: n(We, "next_card_name"), description: n(We, "next_card_desc") }
])
  window.customCards.some((e) => e.type === o.type) || window.customCards.push({ ...o, preview: !0 });
console.info("%c DAYBREAK %c 0.2.0 ", "color:#3a2410;background:#ffcf7a;font-weight:bold", "color:#ffcf7a;background:#3a2410");
