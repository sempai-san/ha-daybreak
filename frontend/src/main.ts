// Entry point: registers the sidebar panel and the Lovelace cards.
import { t } from "./i18n";
import "./panel";
import "./cards/alarms-card";
import "./cards/next-card";

declare global {
  interface Window {
    customCards?: { type: string; name: string; description: string; preview?: boolean }[];
  }
}

const hass = (document.querySelector("home-assistant") as any)?.hass;
window.customCards = window.customCards || [];
for (const card of [
  { type: "daybreak-alarms-card", name: t(hass, "card_name"), description: t(hass, "card_desc") },
  { type: "daybreak-next-card", name: t(hass, "next_card_name"), description: t(hass, "next_card_desc") },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) {
    window.customCards.push({ ...card, preview: true });
  }
}

console.info("%c DAYBREAK %c 0.2.0 ", "color:#3a2410;background:#ffcf7a;font-weight:bold", "color:#ffcf7a;background:#3a2410");
