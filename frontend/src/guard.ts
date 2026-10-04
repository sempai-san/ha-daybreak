// Runs before any element is defined. If another DayBreak version is already
// running in this page (the app kept the page open during an update), the
// browser cannot replace its elements: reload once so only the new one runs.
declare const __DAYBREAK_VERSION__: string;

declare global {
  interface Window {
    __daybreakVersion?: string;
  }
}

const mine = __DAYBREAK_VERSION__;
const running = window.__daybreakVersion ?? (customElements.get("daybreak-panel") ? "old" : undefined);

if (running && running !== mine) {
  const key = `daybreak-reloaded-${mine}`;
  let reload = false;
  try {
    reload = !sessionStorage.getItem(key);
    sessionStorage.setItem(key, "1");
  } catch {
    // Storage blocked: do not risk a reload loop.
  }
  if (reload) window.location.reload();
  // Stop here: defining the elements a second time would fail half-way.
  throw new Error(`DayBreak ${running} is already running; reload the page to use ${mine}.`);
}
window.__daybreakVersion = mine;

export {};
