# DayBreak

**A fully customisable sunrise alarm clock for Home Assistant.**

DayBreak wakes you up gently: your lights fade in like a sunrise before the alarm time. You manage alarms in a dedicated sidebar panel and control them from dashboard cards. Every alarm is also available to automations as entities, events and actions.

> **Status:** v0.4. Sunrise, sleep and kids lights, sun-based times, automatic shifts, profiles, audio, phone notifications with Snooze/Stop and climate before waking up work. Calendars are on the [roadmap](#roadmap).

![DayBreak panel](docs/images/panel.png)

## Features

**Alarms and times**
- Three kinds: **wake-up light** (sunrise before the alarm), **sleep light** (fades out while you fall asleep) and **OK-to-wake light** for kids (red = stay in bed, green = get up)
- Fixed time, or **follow the sun**: sunrise/sunset or civil, nautical or astronomical twilight, with an offset and earliest/latest limits
- Repeat on weekdays (also every 2nd/3rd/4th week), every X days/weeks, a free **shift pattern**, or once
- **Only once different** (e.g. tomorrow earlier) without touching the normal schedule
- **Public holidays** are skipped via the Workday integration (normal free days are not treated as holidays)
- Owners per alarm; presence check (skip when nobody is home, stop when everybody leaves) only when you pick presence entities

**Wake earlier automatically**
- Weather (snow/ice, storm incl. official warnings such as DWD, heavy rain, cold) and **travel time** (e.g. Waze, with "arrive by" and your morning routine)
- Several rules: take the strongest one or add them up, always capped by a maximum
- Rules are checked again while the sunrise is running: the light start moves along, or a running sunrise gets shorter without jumping

**Light**
- Lights, groups, areas, devices or labels; settings shared by all lamps or **per lamp**
- **Start per lamp**: every lamp gets its own row on the time line and can start later (e.g. one lamp gently from the beginning, another one strongly shortly before the alarm); it still reaches its target at the alarm time
- Four ready-made curves or your own **draggable curve**, one curve for everything or separate curves for brightness and colour
- **Colour temperature or colour** (sunrise, dawn, pastel or your own colour sequence); white-only lamps follow a matching colour temperature
- **Light profiles** (templates and your own). Profiles used by alarms of different people are locked; changes are saved as a new profile
- Pulse or blink while ringing (accessibility), switch off after stopping or 30 min later, spare lamp if a lamp is unreachable

**Snooze and "if nobody reacts"**
- Snooze options (e.g. 5/9/15 min) are defined once in the settings and chosen per alarm
- After N snoozes the **last call** starts: a profile with all lights on and any actions, for a limited time only; otherwise the alarm stops by itself
- Turning a lamp off by hand stops the alarm (optional)

**Audio and phone**
- Music Assistant (playlist, radio, album, track – with search in the editor), a sound URL and a spoken announcement (text-to-speech template, e.g. time and temperature)
- Music starts a few minutes before the alarm, quietly, and gets louder; it pauses while snoozing and the old volume is restored afterwards. The volume is a smooth curve: add or remove points and drag them, or type time and volume of the selected point
- **Speaker button**: pause on the speaker (e.g. tapping a HomePod) snoozes, during the last call it stops the alarm
- Last call profiles can bring their own audio and volume
- **Phone notifications with Snooze and Stop** to the owners' Home Assistant apps (found automatically) and other devices; the last call can be a **critical alert** that rings even in Do Not Disturb

**Climate**
- Thermostats and air conditioners (heat, cool, heat/cool, auto, dry, fan), fans, humidifiers and dehumidifiers, water heaters and plain switches (e.g. an electric blanket)
- Start a fixed time before the alarm, or **learned**: DayBreak measures how fast the room warms up or cools down and starts just in time (planned with the weather forecast in the evening, adjusted with the current temperature shortly before)
- Only when needed (room not at the target yet), only when somebody is home, only when it is colder/warmer outside than a limit; pauses while a window is open
- After waking up: back to the previous state, switch off, or keep running while somebody is home
- **Climate profiles** shared by several alarms, or own settings per alarm

**More**
- Actions at light start, alarm, snooze and stop (any Home Assistant action)
- Push notifications (e.g. alarm moved, lamp not reachable) and Home Assistant notifications for problems
- **Simple / Advanced / Expert** editor, works on phone, tablet and desktop. In the settings you choose which options Simple and Advanced show (e.g. hide audio); Expert always shows everything
- After an update the DayBreak page reloads itself once, so no cache clearing is needed
- Import/export of alarms and profiles
- Dashboard cards in Home Assistant style, optionally Mushroom or Bubble look
- English and German UI

| Editor | Light profiles |
| --- | --- |
| ![Editor](docs/images/editor.png) | ![Light profiles](docs/images/profiles.png) |

## Installation

### HACS (custom repository)

1. In HACS, open the menu (⋮) → **Custom repositories**.
2. Add `https://github.com/sempai-san/hacs_daybreak` with type **Integration**.
3. Install **DayBreak** and restart Home Assistant.
4. Go to **Settings → Devices & services → Add integration → DayBreak**.

A **DayBreak** entry then appears in the sidebar. You do not need to register any dashboard resource: the cards load automatically.

### Manual

Copy `custom_components/daybreak` into your `config/custom_components` folder, restart and add the integration.

## Dashboard cards

![Cards](docs/images/cards.png)

```yaml
type: custom:daybreak-alarms-card
title: Alarms
show_disabled: true
show_controls: true     # snooze / stop while an alarm is running
style: ha               # ha, mushroom or bubble
accent: false           # DayBreak colours instead of the theme colour
```

```yaml
type: custom:daybreak-next-card
size: tile              # tile or large (bedside / wall tablet)
alarm: Workday          # optional name or id, default = whichever rings next
show_buttons: true
show_progress: true
style: ha
accent: true
```

Both cards have a visual editor.

## Entities

Each alarm gets its own device with:

| Entity | Description |
| --- | --- |
| `switch.<alarm>` | Alarm enabled |
| `switch.<alarm>_skip_next` | Skip the next occurrence |
| `sensor.<alarm>_next_alarm` | Next alarm time (timestamp) |
| `sensor.<alarm>_status` | `disabled`, `idle`, `scheduled`, `sunrise`, `ringing`, `snoozed`, `last_call` |
| `button.<alarm>_snooze` / `_stop` / `_test` | Actions |

Global: `sensor.daybreak_next_alarm` (the next alarm of all alarms) and `binary_sensor.daybreak_alarm_active`.

## Actions

| Action | Data |
| --- | --- |
| `daybreak.snooze` | `alarm_id` or `entity_id` (optional, default = all ringing), `minutes` |
| `daybreak.stop` | `alarm_id` or `entity_id` (optional, default = all running) |
| `daybreak.skip_next` | `alarm_id` or `entity_id` |
| `daybreak.cancel_skip` | `alarm_id` or `entity_id` |
| `daybreak.test` | `alarm_id` or `entity_id`, `duration` (seconds) |
| `daybreak.set_once` | `alarm_id` or `entity_id`, `date`, `time`, `light_lead` (optional) |
| `daybreak.clear_once` | `alarm_id` or `entity_id` |

Example: a bedside button snoozes on a short press and stops on a long press.

```yaml
triggers:
  - trigger: state
    entity_id: event.bedside_button
    to: ~
actions:
  - choose:
      - conditions: "{{ trigger.to_state.attributes.event_type == 'short_press' }}"
        sequence:
          - action: daybreak.snooze
    default:
      - action: daybreak.stop
```

## Events

`daybreak_sunrise_started`, `daybreak_alarm_ringing`, `daybreak_alarm_snoozed`, `daybreak_alarm_stopped`, `daybreak_alarm_skipped`, `daybreak_alarm_finished`, `daybreak_last_call`, `daybreak_alarm_shifted`. Every event carries `alarm_id`, `name` and `kind`. Some events carry more data, such as `reason` (`stopped`, `auto_stop`, `manual_light_off`, `away`, `last_call_timeout`, …) or `test`.

Alarm and last call actions can use the variables `alarm_id`, `name`, `phase` and `test` in templates.

```yaml
triggers:
  - trigger: event
    event_type: daybreak_alarm_ringing
actions:
  - action: cover.open_cover
    target:
      entity_id: cover.bedroom
```

## Updating from 0.1

Your alarms are converted automatically. The snooze length becomes a snooze option and a custom last call becomes a last call profile.

## Roadmap

- **0.5**: calendars with keyword rules (per calendar), travel to an appointment's location, more conditions
- **1.0**: Home Assistant brands entry and submission to the HACS default store

## Development

```bash
# backend
pip install -r requirements_test.txt ruff
pytest
ruff check . && ruff format --check .

# frontend (the built bundle is committed)
cd frontend && npm ci && npm run build
```

## License

[MIT](LICENSE)
