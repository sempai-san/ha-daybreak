// Runs before any element is defined. If another DayBreak version is already
// running in this page (the app kept the page open during an update), the
// browser cannot replace its elements: stop here and leave the reload to the user.
declare const __DAYBREAK_VERSION__: string;

declare global {
  interface Window {
    __daybreakVersion?: string;
  }
}

const mine = __DAYBREAK_VERSION__;
const running = window.__daybreakVersion ?? (customElements.get("daybreak-panel") ? "old" : undefined);

if (running && running !== mine) {
  // Never reload by itself: the running panel shows a banner with a reload button.
  throw new Error(`DayBreak ${running} is already running; reload the page to use ${mine}.`);
}
window.__daybreakVersion = mine;

export {};
