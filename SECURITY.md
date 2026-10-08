# Security and privacy

## What DayBreak does with your data

- DayBreak runs entirely inside your Home Assistant. It has **no cloud service, no telemetry and no analytics**, and the code opens no network connections of its own.
- Everything it does goes through Home Assistant services: lights, speakers, climate, `notify` for phone messages, the calendar and (optionally) the Waze integration. Which outside services receive data is decided by those integrations, not by DayBreak.
- Settings and the history are stored in Home Assistant's own storage (`.storage/daybreak*`). Nothing is uploaded.
- The panel and cards load only files from your Home Assistant. No external scripts, fonts or images. (Cover art shown while searching Music Assistant comes from the addresses Music Assistant returns.)
- Only administrators can create, change or delete alarms and settings, or read the history details. Other users can see the alarms and snooze or stop them.

## Reporting a problem

Please report security or privacy problems privately via the repository's *Security → Report a vulnerability*, not as a public issue.
