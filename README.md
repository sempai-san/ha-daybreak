# DayBreak

**A fully customisable sunrise alarm clock for Home Assistant.**

DayBreak wakes you up gently: your lights fade in like a sunrise before the alarm time. You manage alarms in a dedicated sidebar panel and control them from dashboard cards. Every alarm is also available to automations as entities, events and actions.

> **Status:** early development (v0.1). The core alarm, sunrise and panel work. Audio, calendars, conditions and much more are on the [roadmap](#roadmap).

![DayBreak panel](docs/images/panel.png)

## Features (v0.1)

- **Multiple alarms**, each with a name, time and weekdays, or as a one-time alarm (optionally on a fixed date)
- **Sunrise light**: fades lights, light groups, areas, devices or labels in over a configurable time before the alarm
  - start/end brightness and start/end colour temperature
  - curves: *smooth* (recommended), *linear* or *custom* with any number of points
  - works with brightness-only, colour-temperature and colour lights
- **Snooze, stop, skip next, test run**: from the panel, cards, entities or actions
- **Auto stop** after a configurable time, with the light kept on or turned off
- **Manual override**: turning the alarm lights off stops the alarm
- **Simple / Normal / Expert** editor modes
- **Dashboard cards** with visual editors
- English and German UI

| Editor | Cards |
| --- | --- |
| ![Editor](docs/images/editor.png) | ![Cards](docs/images/cards.png) |

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

```yaml
type: custom:daybreak-alarms-card
title: Alarms
show_disabled: true
show_controls: true     # test / skip buttons
alarms: []              # optional list of alarm ids, empty = all
```

```yaml
type: custom:daybreak-next-card
alarm: 1a2b3c4d5e6f     # optional, default = whichever rings next
```

While an alarm is running, both cards show large **Snooze** and **Stop** buttons.

## Entities

Each alarm gets its own device with:

| Entity | Description |
| --- | --- |
| `switch.<alarm>` | Alarm enabled |
| `switch.<alarm>_skip_next` | Skip the next occurrence |
| `sensor.<alarm>_next_alarm` | Next alarm time (timestamp) |
| `sensor.<alarm>_status` | `disabled`, `idle`, `scheduled`, `sunrise`, `ringing`, `snoozed` |
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

`daybreak_sunrise_started`, `daybreak_alarm_ringing`, `daybreak_alarm_snoozed`, `daybreak_alarm_stopped`, `daybreak_alarm_skipped`, `daybreak_alarm_finished`. Every event carries `alarm_id` and `name`. Some events carry more data, such as `reason` or `test`.

```yaml
triggers:
  - trigger: event
    event_type: daybreak_alarm_ringing
actions:
  - action: cover.open_cover
    target:
      entity_id: cover.bedroom
```

## Roadmap

- **0.2**: graphical curve editor, RGB colours, audio (media players, Music Assistant, volume ramp), actions during/after the alarm, presets, stop/snooze through a media player's own controls, mobile notifications with snooze/stop
- **0.3**: calendars with keyword rules (per calendar), exceptions, holidays and vacation, conditions (presence, entity, template), travel-time adjustments (e.g. Waze)
- **0.4**: sunrise-based triggers, light sensor and weather adaptations, profiles, fallback chains, notifications
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
