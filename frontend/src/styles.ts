import { css } from "lit";

/** Shared look: follows the HA theme, DayBreak accent for sunrise elements. */
export const shared = css`
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
`;
