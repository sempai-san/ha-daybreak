# Security and privacy

## What DayBreak does with your data

- DayBreak runs entirely inside your Home Assistant. It has **no cloud service, no telemetry and no analytics**, and the code opens no network connections of its own.
- Everything it does goes through Home Assistant services: lights, speakers, climate, `notify` for phone messages, the calendar and (optionally) the Waze integration. Which outside services receive data is decided by those integrations, not by DayBreak.
- Settings and the history are stored in Home Assistant's own storage (`.storage/daybreak*`). Nothing is uploaded.
- The panel and cards load only files from your Home Assistant. No external scripts, fonts or images. (Cover art shown while searching Music Assistant comes from the addresses Music Assistant returns.)
- Administrators see and change all alarms (each shows which user it belongs to), the settings, profiles and history details.
- Other users only see and change **their own** alarms. They can only choose entities Home Assistant lets them control, only their own person and phone, and cannot set free actions (those can call any service). The administrator's profiles and sensors are available to them only if the administrator turns on *Let users use my profiles and sensors* in the settings (use only, never change).
- Note: Home Assistant's own services and the per-alarm entities (switches, buttons) follow Home Assistant's normal permissions, not DayBreak's.

## Reporting a problem

Please report security or privacy problems privately via the repository's *Security → Report a vulnerability*, not as a public issue.
