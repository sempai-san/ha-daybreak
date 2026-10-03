const De = {
  title: "DayBreak",
  new_alarm: "New alarm",
  no_alarms: "No alarms yet. Create your first sunrise alarm.",
  next_alarm: "Next alarm",
  no_next: "No alarm scheduled",
  in: "in {time}",
  edit: "Edit",
  delete: "Delete",
  delete_confirm: 'Delete alarm "{name}"?',
  duplicate: "Duplicate",
  save: "Save",
  cancel: "Cancel",
  back: "Back",
  test: "Test",
  test_hint: "Runs the alarm now with a 1 minute sunrise.",
  skip_next: "Skip next",
  cancel_skip: "Don't skip",
  skipped: "Skipped on {date}",
  snooze: "Snooze",
  stop: "Stop",
  once: "Once",
  every_day: "Every day",
  weekdays: "Weekdays",
  weekend: "Weekend",
  on_date: "On {date}",
  sunrise_min: "{min} min sunrise",
  no_lights: "No lights selected",
  mode: "Mode",
  mode_simple: "Simple",
  mode_normal: "Normal",
  mode_expert: "Expert",
  section_time: "Time",
  section_light: "Light",
  section_curve: "Sunrise curve",
  section_behavior: "Snooze & stop",
  section_no_reaction: "If nobody reacts",
  no_reaction_hint: "Stops the alarm when everybody has left. Overslept? A last call switches lights on and runs your actions for a limited time.",
  section_last_call: "Last call",
  repeat: "Repeat",
  preview: "Preview",
  minutes_before: "min before",
  alarm: "Alarm",
  points: "Curve points",
  add_point: "Add point",
  point_time: "Position (%)",
  point_brightness: "Brightness (%)",
  point_kelvin: "Color temp. (K)",
  remove: "Remove",
  state_disabled: "Disabled",
  state_idle: "Idle",
  state_scheduled: "Scheduled",
  state_sunrise: "Sunrise",
  state_ringing: "Ringing",
  state_snoozed: "Snoozed until {time}",
  state_last_call: "Last call",
  test_badge: "Test",
  error: "Error: {msg}",
  // form fields
  f_name: "Name",
  f_time: "Alarm time",
  f_date: "Date (one-time alarm, optional)",
  f_target: "Lights, areas or devices",
  f_duration: "Sunrise duration (minutes before alarm time)",
  f_start_brightness: "Start brightness (%)",
  f_end_brightness: "End brightness (%)",
  f_use_color_temp: "Use color temperature",
  f_start_kelvin: "Start color temperature",
  f_end_kelvin: "End color temperature",
  f_curve: "Curve",
  f_step_seconds: "Update interval (seconds)",
  f_snooze_minutes: "Snooze duration (minutes)",
  f_snooze_light: "Light while snoozing",
  f_auto_stop_minutes: "Stop automatically after (minutes, 0 = never)",
  f_after_stop: "Light after stopping",
  f_stop_on_light_off: "Turning the lights off stops the alarm",
  f_entities: "Presence (persons, trackers, occupancy sensors)",
  f_skip_when_away: "Skip the alarm when nobody is home",
  f_stop_when_away: "Stop the alarm when everybody leaves",
  f_enabled: "Last call when overslept",
  f_after_minutes: "Last call after (minutes after alarm time, unless stopped)",
  lc_duration: "Maximum duration (minutes)",
  lc_target: "Lights for the last call (empty = alarm lights)",
  f_brightness: "Brightness (%)",
  f_kelvin: "Color temperature",
  f_actions: "Additional actions (scene, script, music…)",
  curve_linear: "Linear",
  curve_smooth: "Smooth (recommended)",
  curve_custom: "Custom points",
  snooze_light_keep: "Keep on",
  snooze_light_dim: "Dim to start brightness",
  snooze_light_off: "Turn off",
  after_stop_keep: "Keep on",
  after_stop_off: "Turn off",
  // card editor
  c_title: "Title",
  c_alarms: "Alarms (empty = all)",
  c_show_disabled: "Show disabled alarms",
  c_show_controls: "Show test/skip buttons",
  card_name: "DayBreak alarms",
  card_desc: "Shows your DayBreak alarms with countdown, snooze and stop.",
  next_card_name: "DayBreak next alarm",
  next_card_desc: "Compact tile with the next alarm and a countdown."
}, st = {
  new_alarm: "Neuer Wecker",
  no_alarms: "Noch keine Wecker. Erstelle deinen ersten Lichtwecker.",
  next_alarm: "Nächster Wecker",
  no_next: "Kein Wecker geplant",
  in: "in {time}",
  edit: "Bearbeiten",
  delete: "Löschen",
  delete_confirm: "Wecker „{name}“ löschen?",
  duplicate: "Duplizieren",
  save: "Speichern",
  cancel: "Abbrechen",
  back: "Zurück",
  test: "Testen",
  test_hint: "Startet den Wecker sofort mit 1 Minute Sonnenaufgang.",
  skip_next: "Nächsten überspringen",
  cancel_skip: "Nicht überspringen",
  skipped: "Übersprungen am {date}",
  snooze: "Schlummern",
  stop: "Stoppen",
  once: "Einmalig",
  every_day: "Täglich",
  weekdays: "Werktags",
  weekend: "Wochenende",
  on_date: "Am {date}",
  sunrise_min: "{min} Min. Sonnenaufgang",
  no_lights: "Keine Lampen gewählt",
  mode: "Modus",
  mode_simple: "Einfach",
  mode_normal: "Normal",
  mode_expert: "Experte",
  section_time: "Zeit",
  section_light: "Licht",
  section_curve: "Lichtverlauf",
  section_behavior: "Schlummern & Stoppen",
  section_no_reaction: "Wenn niemand reagiert",
  no_reaction_hint: "Stoppt den Wecker, wenn alle weg sind. Verschlafen? Ein letzter Versuch schaltet Lampen ein und führt deine Aktionen für begrenzte Zeit aus.",
  section_last_call: "Letzter Versuch",
  repeat: "Wiederholen",
  preview: "Vorschau",
  minutes_before: "Min. vorher",
  alarm: "Wecker",
  points: "Verlaufspunkte",
  add_point: "Punkt hinzufügen",
  point_time: "Position (%)",
  point_brightness: "Helligkeit (%)",
  point_kelvin: "Farbtemp. (K)",
  remove: "Entfernen",
  state_disabled: "Deaktiviert",
  state_idle: "Inaktiv",
  state_scheduled: "Geplant",
  state_sunrise: "Sonnenaufgang",
  state_ringing: "Klingelt",
  state_snoozed: "Schlummert bis {time}",
  state_last_call: "Letzter Versuch",
  test_badge: "Test",
  error: "Fehler: {msg}",
  f_name: "Name",
  f_time: "Weckzeit",
  f_date: "Datum (einmaliger Wecker, optional)",
  f_target: "Lampen, Räume oder Geräte",
  f_duration: "Dauer des Sonnenaufgangs (Minuten vor der Weckzeit)",
  f_start_brightness: "Starthelligkeit (%)",
  f_end_brightness: "Endhelligkeit (%)",
  f_use_color_temp: "Farbtemperatur verwenden",
  f_start_kelvin: "Start-Farbtemperatur",
  f_end_kelvin: "End-Farbtemperatur",
  f_curve: "Verlauf",
  f_step_seconds: "Aktualisierungsintervall (Sekunden)",
  f_snooze_minutes: "Schlummerdauer (Minuten)",
  f_snooze_light: "Licht beim Schlummern",
  f_auto_stop_minutes: "Automatisch stoppen nach (Minuten, 0 = nie)",
  f_after_stop: "Licht nach dem Stoppen",
  f_stop_on_light_off: "Ausschalten der Lampen stoppt den Wecker",
  f_entities: "Anwesenheit (Personen, Tracker, Präsenzsensoren)",
  f_skip_when_away: "Wecker überspringen, wenn niemand zu Hause ist",
  f_stop_when_away: "Wecker stoppen, wenn alle gehen",
  f_enabled: "Letzter Versuch bei Verschlafen",
  f_after_minutes: "Letzter Versuch nach (Minuten nach der Weckzeit, falls nicht gestoppt)",
  lc_duration: "Maximale Dauer (Minuten)",
  lc_target: "Lampen für den letzten Versuch (leer = Weckerlampen)",
  f_brightness: "Helligkeit (%)",
  f_kelvin: "Farbtemperatur",
  f_actions: "Zusätzliche Aktionen (Szene, Skript, Musik …)",
  curve_linear: "Linear",
  curve_smooth: "Sanft (empfohlen)",
  curve_custom: "Eigene Punkte",
  snooze_light_keep: "Anlassen",
  snooze_light_dim: "Auf Starthelligkeit dimmen",
  snooze_light_off: "Ausschalten",
  after_stop_keep: "Anlassen",
  after_stop_off: "Ausschalten",
  c_title: "Titel",
  c_alarms: "Wecker (leer = alle)",
  c_show_disabled: "Deaktivierte Wecker anzeigen",
  c_show_controls: "Test-/Überspringen-Knöpfe anzeigen",
  card_name: "DayBreak Wecker",
  card_desc: "Zeigt deine DayBreak-Wecker mit Countdown, Schlummern und Stoppen.",
  next_card_name: "DayBreak nächster Wecker",
  next_card_desc: "Kompakte Kachel mit dem nächsten Wecker und Countdown."
}, Ue = { en: De, de: st };
function it(n) {
  const e = (n?.locale?.language || n?.language || navigator.language || "en").split("-")[0];
  return e in Ue ? e : "en";
}
function o(n, e, t = {}) {
  return (Ue[it(n)][e] ?? De[e]).replace(/\{(\w+)\}/g, (i, r) => String(t[r] ?? ""));
}
function He(n) {
  const e = new Intl.DateTimeFormat(se(n), { weekday: "short" });
  return [...Array(7).keys()].map((t) => e.format(new Date(2024, 0, 1 + t)));
}
function se(n) {
  return n?.locale?.language || n?.language || navigator.language || "en";
}
const J = globalThis, le = J.ShadowRoot && (J.ShadyCSS === void 0 || J.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ce = /* @__PURE__ */ Symbol(), ke = /* @__PURE__ */ new WeakMap();
let We = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== ce) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (le && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = ke.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && ke.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const nt = (n) => new We(typeof n == "string" ? n : n + "", void 0, ce), O = (n, ...e) => {
  const t = n.length === 1 ? n[0] : e.reduce((s, i, r) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[r + 1], n[0]);
  return new We(t, n, ce);
}, rt = (n, e) => {
  if (le) n.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = J.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, n.appendChild(s);
  }
}, xe = le ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return nt(t);
})(n) : n;
const { is: at, defineProperty: ot, getOwnPropertyDescriptor: lt, getOwnPropertyNames: ct, getOwnPropertySymbols: ht, getPrototypeOf: dt } = Object, ie = globalThis, we = ie.trustedTypes, pt = we ? we.emptyScript : "", ut = ie.reactiveElementPolyfillSupport, H = (n, e) => n, Y = { toAttribute(n, e) {
  switch (e) {
    case Boolean:
      n = n ? pt : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, e) {
  let t = n;
  switch (e) {
    case Boolean:
      t = n !== null;
      break;
    case Number:
      t = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(n);
      } catch {
        t = null;
      }
  }
  return t;
} }, he = (n, e) => !at(n, e), Ae = { attribute: !0, type: String, converter: Y, reflect: !1, useDefault: !1, hasChanged: he };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), ie.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let T = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ae) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && ot(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: r } = lt(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: i, set(a) {
      const d = i?.call(this);
      r?.call(this, a), this.requestUpdate(e, d, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ae;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const e = dt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const t = this.properties, s = [...ct(t), ...ht(t)];
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
      for (const i of s) t.unshift(xe(i));
    } else e !== void 0 && t.push(xe(e));
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
    return rt(e, this.constructor.elementStyles), e;
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
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : Y).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), a = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : Y;
      this._$Em = i;
      const d = a.fromAttribute(t, r.type);
      this[i] = d ?? this._$Ej?.get(i) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, i = !1, r) {
    if (e !== void 0) {
      const a = this.constructor;
      if (i === !1 && (r = this[e]), s ??= a.getPropertyOptions(e), !((s.hasChanged ?? he)(r, t) || s.useDefault && s.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: r }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), r !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, r] of s) {
        const { wrapped: a } = r, d = this[i];
        a !== !0 || this._$AL.has(i) || d === void 0 || this.C(i, void 0, r, d);
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
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[H("elementProperties")] = /* @__PURE__ */ new Map(), T[H("finalized")] = /* @__PURE__ */ new Map(), ut?.({ ReactiveElement: T }), (ie.reactiveElementVersions ??= []).push("2.1.2");
const de = globalThis, Se = (n) => n, Q = de.trustedTypes, Ee = Q ? Q.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, Re = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, je = "?" + w, mt = `<${je}>`, P = document, W = () => P.createComment(""), R = (n) => n === null || typeof n != "object" && typeof n != "function", pe = Array.isArray, _t = (n) => pe(n) || typeof n?.[Symbol.iterator] == "function", re = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ce = /-->/g, ze = />/g, E = RegExp(`>|${re}(?:([^\\s"'>=/]+)(${re}*=${re}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Pe = /'/g, Me = /"/g, Be = /^(?:script|style|textarea|title)$/i, Ie = (n) => (e, ...t) => ({ _$litType$: n, strings: e, values: t }), c = Ie(1), Te = Ie(2), L = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), Le = /* @__PURE__ */ new WeakMap(), z = P.createTreeWalker(P, 129);
function Ve(n, e) {
  if (!pe(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ee !== void 0 ? Ee.createHTML(e) : e;
}
const ft = (n, e) => {
  const t = n.length - 1, s = [];
  let i, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = U;
  for (let d = 0; d < t; d++) {
    const l = n[d];
    let h, u, m = -1, f = 0;
    for (; f < l.length && (a.lastIndex = f, u = a.exec(l), u !== null); ) f = a.lastIndex, a === U ? u[1] === "!--" ? a = Ce : u[1] !== void 0 ? a = ze : u[2] !== void 0 ? (Be.test(u[2]) && (i = RegExp("</" + u[2], "g")), a = E) : u[3] !== void 0 && (a = E) : a === E ? u[0] === ">" ? (a = i ?? U, m = -1) : u[1] === void 0 ? m = -2 : (m = a.lastIndex - u[2].length, h = u[1], a = u[3] === void 0 ? E : u[3] === '"' ? Me : Pe) : a === Me || a === Pe ? a = E : a === Ce || a === ze ? a = U : (a = E, i = void 0);
    const b = a === E && n[d + 1].startsWith("/>") ? " " : "";
    r += a === U ? l + mt : m >= 0 ? (s.push(h), l.slice(0, m) + Re + l.slice(m) + w + b) : l + w + (m === -2 ? d : b);
  }
  return [Ve(n, r + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class j {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let r = 0, a = 0;
    const d = e.length - 1, l = this.parts, [h, u] = ft(e, t);
    if (this.el = j.createElement(h, s), z.currentNode = this.el.content, t === 2 || t === 3) {
      const m = this.el.content.firstChild;
      m.replaceWith(...m.childNodes);
    }
    for (; (i = z.nextNode()) !== null && l.length < d; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const m of i.getAttributeNames()) if (m.endsWith(Re)) {
          const f = u[a++], b = i.getAttribute(m).split(w), Z = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: r, name: Z[2], strings: b, ctor: Z[1] === "." ? bt : Z[1] === "?" ? vt : Z[1] === "@" ? $t : ne }), i.removeAttribute(m);
        } else m.startsWith(w) && (l.push({ type: 6, index: r }), i.removeAttribute(m));
        if (Be.test(i.tagName)) {
          const m = i.textContent.split(w), f = m.length - 1;
          if (f > 0) {
            i.textContent = Q ? Q.emptyScript : "";
            for (let b = 0; b < f; b++) i.append(m[b], W()), z.nextNode(), l.push({ type: 2, index: ++r });
            i.append(m[f], W());
          }
        }
      } else if (i.nodeType === 8) if (i.data === je) l.push({ type: 2, index: r });
      else {
        let m = -1;
        for (; (m = i.data.indexOf(w, m + 1)) !== -1; ) l.push({ type: 7, index: r }), m += w.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const s = P.createElement("template");
    return s.innerHTML = e, s;
  }
}
function N(n, e, t = n, s) {
  if (e === L) return e;
  let i = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const r = R(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(n), i._$AT(n, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = i : t._$Cl = i), i !== void 0 && (e = N(n, i._$AS(n, e.values), i, s)), e;
}
class gt {
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
    const { el: { content: t }, parts: s } = this._$AD, i = (e?.creationScope ?? P).importNode(t, !0);
    z.currentNode = i;
    let r = z.nextNode(), a = 0, d = 0, l = s[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let h;
        l.type === 2 ? h = new V(r, r.nextSibling, this, e) : l.type === 1 ? h = new l.ctor(r, l.name, l.strings, this, e) : l.type === 6 && (h = new yt(r, this, e)), this._$AV.push(h), l = s[++d];
      }
      a !== l?.index && (r = z.nextNode(), a++);
    }
    return z.currentNode = P, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class V {
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
    e = N(this, e, t), R(e) ? e === p || e == null || e === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : e !== this._$AH && e !== L && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : _t(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== p && R(this._$AH) ? this._$AA.nextSibling.data = e : this.T(P.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = j.createElement(Ve(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const r = new gt(i, this), a = r.u(this.options);
      r.p(t), this.T(a), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = Le.get(e.strings);
    return t === void 0 && Le.set(e.strings, t = new j(e)), t;
  }
  k(e) {
    pe(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const r of e) i === t.length ? t.push(s = new V(this.O(W()), this.O(W()), this, this.options)) : s = t[i], s._$AI(r), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = Se(e).nextSibling;
      Se(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
let ne = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, r) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(e, t = this, s, i) {
    const r = this.strings;
    let a = !1;
    if (r === void 0) e = N(this, e, t, 0), a = !R(e) || e !== this._$AH && e !== L, a && (this._$AH = e);
    else {
      const d = e;
      let l, h;
      for (e = r[0], l = 0; l < r.length - 1; l++) h = N(this, d[s + l], t, l), h === L && (h = this._$AH[l]), a ||= !R(h) || h !== this._$AH[l], h === p ? e = p : e !== p && (e += (h ?? "") + r[l + 1]), this._$AH[l] = h;
    }
    a && !i && this.j(e);
  }
  j(e) {
    e === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
};
class bt extends ne {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === p ? void 0 : e;
  }
}
class vt extends ne {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== p);
  }
}
class $t extends ne {
  constructor(e, t, s, i, r) {
    super(e, t, s, i, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = N(this, e, t, 0) ?? p) === L) return;
    const s = this._$AH, i = e === p && s !== p || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, r = e !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class yt {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    N(this, e);
  }
}
const kt = de.litHtmlPolyfillSupport;
kt?.(j, V), (de.litHtmlVersions ??= []).push("3.3.3");
const xt = (n, e, t) => {
  const s = t?.renderBefore ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = t?.renderBefore ?? null;
    s._$litPart$ = i = new V(e.insertBefore(W(), r), r, void 0, t ?? {});
  }
  return i._$AI(n), i;
};
const ue = globalThis;
class k extends T {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = xt(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return L;
  }
}
k._$litElement$ = !0, k.finalized = !0, ue.litElementHydrateSupport?.({ LitElement: k });
const wt = ue.litElementPolyfillSupport;
wt?.({ LitElement: k });
(ue.litElementVersions ??= []).push("4.2.2");
const At = { attribute: !0, type: String, converter: Y, reflect: !1, hasChanged: he }, St = (n = At, e, t) => {
  const { kind: s, metadata: i } = t;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), s === "setter" && ((n = Object.create(n)).wrapped = !0), r.set(t.name, n), s === "accessor") {
    const { name: a } = t;
    return { set(d) {
      const l = e.get.call(this);
      e.set.call(this, d), this.requestUpdate(a, l, n, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(a, void 0, n, d), d;
    } };
  }
  if (s === "setter") {
    const { name: a } = t;
    return function(d) {
      const l = this[a];
      e.call(this, d), this.requestUpdate(a, l, n, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function _(n) {
  return (e, t) => typeof t == "object" ? St(n, e, t) : ((s, i, r) => {
    const a = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, s), a ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(n, e, t);
}
function g(n) {
  return _({ ...n, state: !0, attribute: !1 });
}
const oe = ["sunrise", "ringing", "snoozed", "last_call"], Et = (n, e) => n.callWS({ type: "daybreak/alarm/create", alarm: e }), qe = (n, e, t) => n.callWS({ type: "daybreak/alarm/update", alarm_id: e, changes: t }), Ct = (n, e) => n.callWS({ type: "daybreak/alarm/delete", alarm_id: e }), Fe = (n, e, t, s = {}) => n.callWS({ type: "daybreak/alarm/action", action: e, alarm_id: t, ...s }), Ne = /* @__PURE__ */ new WeakMap();
function Ze(n, e) {
  let t = Ne.get(n.connection);
  t || (t = { listeners: /* @__PURE__ */ new Set() }, Ne.set(n.connection, t));
  const s = t;
  return s.listeners.add(e), s.last && e(s.last), s.unsub || (s.unsub = n.connection.subscribeMessage(
    (i) => {
      s.last = i, s.listeners.forEach((r) => r(i));
    },
    { type: "daybreak/subscribe" }
  ), s.unsub.catch(() => {
    s.unsub = void 0;
  })), () => {
    if (s.listeners.delete(e), s.listeners.size === 0 && s.unsub) {
      const i = s.unsub;
      s.unsub = void 0, s.last = void 0, i.then((r) => r()).catch(() => {
      });
    }
  };
}
const Ke = (n) => n?.config?.time_zone || void 0;
function Ge(n) {
  const e = n?.locale?.time_format;
  if (e === "12") return !0;
  if (e === "24") return !1;
}
function X(n, e) {
  const t = typeof e == "string" ? new Date(e) : e;
  return new Intl.DateTimeFormat(se(n), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: Ge(n),
    timeZone: Ke(n)
  }).format(t);
}
function Je(n, e) {
  const [t, s] = e.split(":").map(Number);
  return new Intl.DateTimeFormat(se(n), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: Ge(n),
    timeZone: "UTC"
  }).format(new Date(Date.UTC(2024, 0, 1, t, s)));
}
function B(n, e) {
  const t = typeof e == "string" ? new Date(e) : e;
  return new Intl.DateTimeFormat(se(n), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: Ke(n)
  }).format(t);
}
function me(n, e = Date.now()) {
  let t = Math.max(0, Math.round((new Date(n).getTime() - e) / 6e4));
  const s = Math.floor(t / 1440);
  t -= s * 1440;
  const i = Math.floor(t / 60);
  return t -= i * 60, s ? `${s} d ${i} h` : i ? `${i} h ${String(t).padStart(2, "0")} min` : `${t} min`;
}
function zt(n, e) {
  const t = [...e.days].sort();
  if (!t.length)
    return e.date ? o(n, "on_date", { date: B(n, `${e.date}T12:00:00Z`) }) : o(n, "once");
  if (t.length === 7) return o(n, "every_day");
  if (t.join() === "0,1,2,3,4") return o(n, "weekdays");
  if (t.join() === "5,6") return o(n, "weekend");
  const s = He(n);
  return t.map((i) => s[i]).join(", ");
}
function Pt(n) {
  const e = n / 100;
  let t, s, i;
  e <= 66 ? (t = 255, s = 99.4708025861 * Math.log(e) - 161.1195681661, i = e <= 19 ? 0 : 138.5177312231 * Math.log(e - 10) - 305.0447927307) : (t = 329.698727446 * Math.pow(e - 60, -0.1332047592), s = 288.1221695283 * Math.pow(e - 60, -0.0755148492), i = 255);
  const r = (a) => Math.round(Math.min(255, Math.max(0, a)));
  return [r(t), r(s), r(i)];
}
function Mt(n, e) {
  const t = Math.min(1, Math.max(0, e)), s = n.use_color_temp;
  if (n.curve === "custom" && n.points.length >= 2) {
    const r = [...n.points].sort((l, h) => l.t - h.t), a = s ? n.end_kelvin : null;
    if (t <= r[0].t) return { brightness: r[0].brightness, kelvin: s ? r[0].kelvin || a : null };
    for (let l = 0; l < r.length - 1; l++) {
      const h = r[l], u = r[l + 1];
      if (t <= u.t) {
        const m = u.t - h.t, f = m <= 0 ? 0 : (t - h.t) / m, b = h.kelvin && u.kelvin ? h.kelvin + (u.kelvin - h.kelvin) * f : h.kelvin || u.kelvin || a;
        return { brightness: h.brightness + (u.brightness - h.brightness) * f, kelvin: s ? b : null };
      }
    }
    const d = r[r.length - 1];
    return { brightness: d.brightness, kelvin: s ? d.kelvin || a : null };
  }
  const i = n.curve === "linear" ? t : t * t * (3 - 2 * t) * 0.4 + t * t * 0.6;
  return {
    brightness: n.start_brightness + (n.end_brightness - n.start_brightness) * i,
    kelvin: s ? n.start_kelvin + (n.end_kelvin - n.start_kelvin) * t : null
  };
}
let Oe;
function _e() {
  return customElements.get("ha-form") && customElements.get("ha-selector") ? Promise.resolve() : (Oe ??= (async () => {
    const n = await window.loadCardHelpers?.();
    n && await (await n.createCardElement({ type: "entities", entities: [] }))?.constructor?.getConfigElement?.(), await customElements.whenDefined("ha-form");
  })(), Oe);
}
function $(n, e, t = {}) {
  n.dispatchEvent(new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 }));
}
var Tt = Object.defineProperty, Ye = (n, e, t, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(e, t, i) || i);
  return i && Tt(e, t, i), i;
};
const K = 300, C = 90, ae = 60, fe = class fe extends k {
  render() {
    if (!this.light) return c``;
    const e = this.light, t = [...Array(ae + 1).keys()].map((h) => {
      const u = h / ae;
      return { x: u, ...Mt(e, u) };
    }), s = `g${Math.random().toString(36).slice(2, 8)}`, i = t.filter((h, u) => u % 6 === 0 || u === ae).map((h) => {
      const [u, m, f] = h.kelvin ? Pt(h.kelvin) : [255, 214, 170], b = 0.15 + 0.85 * (h.brightness / 100);
      return Te`<stop offset=${h.x} stop-color=${`rgb(${u},${m},${f})`} stop-opacity=${b}></stop>`;
    }), r = t.map((h) => `${(h.x * K).toFixed(1)},${(C - h.brightness / 100 * C).toFixed(1)}`), a = `M0,${C} L${r.join(" L")} L${K},${C} Z`, d = `M${r.join(" L")}`, l = e.curve === "custom" ? e.points.map(
      (h) => Te`<circle cx=${h.t * K} cy=${C - h.brightness / 100 * C} r="3.5" class="pt"></circle>`
    ) : [];
    return c`
      <svg viewBox="0 0 ${K} ${C}" preserveAspectRatio="none" role="img" aria-label=${o(this.hass, "preview")}>
        <defs>
          <linearGradient id=${s} x1="0" x2="1" y1="0" y2="0">${i}</linearGradient>
        </defs>
        <path d=${a} fill=${`url(#${s})`}></path>
        <path d=${d} class="line"></path>
        ${l}
      </svg>
      <div class="axis">
        <span>−${e.duration} min</span>
        <span>${o(this.hass, "alarm")}</span>
      </div>
    `;
  }
};
fe.styles = O`
    :host {
      display: block;
    }
    svg {
      width: 100%;
      height: 96px;
      display: block;
      border-radius: 8px;
      background: var(--secondary-background-color, #222);
    }
    .line {
      fill: none;
      stroke: var(--primary-text-color);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
      opacity: 0.8;
    }
    .pt {
      fill: var(--primary-color);
      stroke: var(--card-background-color, #fff);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .axis {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }
  `;
let I = fe;
Ye([
  _({ attribute: !1 })
], I.prototype, "hass");
Ye([
  _({ attribute: !1 })
], I.prototype, "light");
customElements.get("daybreak-curve-preview") || customElements.define("daybreak-curve-preview", I);
var Lt = Object.defineProperty, D = (n, e, t, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(e, t, i) || i);
  return i && Lt(e, t, i), i;
};
const Nt = {
  name: "",
  enabled: !0,
  time: "07:00",
  days: [0, 1, 2, 3, 4],
  date: null,
  skip_date: null,
  light: {
    target: {},
    duration: 30,
    start_brightness: 1,
    end_brightness: 100,
    use_color_temp: !0,
    start_kelvin: 2200,
    end_kelvin: 4e3,
    curve: "smooth",
    points: [],
    step_seconds: 15
  },
  behavior: {
    snooze_minutes: 9,
    snooze_light: "keep",
    auto_stop_minutes: 30,
    after_stop: "keep",
    stop_on_light_off: !0
  },
  presence: { entities: [], skip_when_away: !0, stop_when_away: !0 },
  last_call: {
    enabled: !1,
    after_minutes: 20,
    duration: 10,
    target: {},
    brightness: 100,
    kelvin: 5e3,
    actions: []
  }
}, Ot = [
  { t: 0, brightness: 1, kelvin: 2e3 },
  { t: 0.66, brightness: 30, kelvin: 2700 },
  { t: 1, brightness: 100, kelvin: 4e3 }
], y = (n, e, t = 1, s, i = "box") => ({
  number: { min: n, max: e, step: t, mode: i, unit_of_measurement: s }
}), ge = class ge extends k {
  constructor() {
    super(...arguments), this.mode = "normal", this.isNew = !1, this.saving = !1, this._label = (e) => o(this.hass, `f_${e.name}`), this._lcLabel = (e) => o(this.hass, ["duration", "target"].includes(e.name) ? `lc_${e.name}` : `f_${e.name}`);
  }
  willUpdate(e) {
    e.has("alarm") && this.alarm && (this._draft = structuredClone(this.alarm));
  }
  _opts(e, t) {
    return t.map((s) => ({ value: s, label: o(this.hass, `${e}_${s}`) }));
  }
  _baseSchema() {
    const e = [
      { name: "name", selector: { text: {} } },
      { name: "time", required: !0, selector: { time: { no_second: !0 } } }
    ];
    return this.mode === "expert" && !this._draft?.days.length && e.push({ name: "date", selector: { date: {} } }), e;
  }
  _lightSchema() {
    const e = [
      { name: "target", selector: { target: { entity: { domain: "light" } } } },
      { name: "duration", selector: y(0, 240, 1, "min", "slider") }
    ];
    return this.mode === "simple" || (this._draft?.light.curve !== "custom" && e.push(
      { name: "start_brightness", selector: y(0, 100, 1, "%", "slider") },
      { name: "end_brightness", selector: y(1, 100, 1, "%", "slider") }
    ), e.push({ name: "use_color_temp", selector: { boolean: {} } }), this._draft?.light.use_color_temp && this._draft.light.curve !== "custom" && e.push(
      { name: "start_kelvin", selector: { color_temp: { unit: "kelvin", min: 1500, max: 6500 } } },
      { name: "end_kelvin", selector: { color_temp: { unit: "kelvin", min: 1500, max: 6500 } } }
    )), e;
  }
  _curveSchema() {
    const e = this.mode === "expert" ? ["smooth", "linear", "custom"] : ["smooth", "linear"], t = [
      { name: "curve", required: !0, selector: { select: { mode: "dropdown", options: this._opts("curve", e) } } }
    ];
    return this.mode === "expert" && t.push({ name: "step_seconds", selector: y(2, 120, 1, "s") }), t;
  }
  _behaviorSchema() {
    const e = [
      { name: "snooze_minutes", selector: y(1, 60, 1, "min") },
      { name: "auto_stop_minutes", selector: y(0, 720, 1, "min") },
      {
        name: "after_stop",
        required: !0,
        selector: { select: { mode: "dropdown", options: this._opts("after_stop", ["keep", "off"]) } }
      }
    ];
    return this.mode === "expert" && e.push(
      {
        name: "snooze_light",
        required: !0,
        selector: { select: { mode: "dropdown", options: this._opts("snooze_light", ["keep", "dim", "off"]) } }
      },
      { name: "stop_on_light_off", selector: { boolean: {} } }
    ), e;
  }
  _presenceSchema() {
    const e = [
      { name: "entities", selector: { entity: { multiple: !0, domain: ["person", "device_tracker", "binary_sensor", "input_boolean", "zone", "group"] } } }
    ];
    return this.mode === "expert" && this._draft?.presence.entities.length && e.push(
      { name: "skip_when_away", selector: { boolean: {} } },
      { name: "stop_when_away", selector: { boolean: {} } }
    ), e;
  }
  _lastCallSchema() {
    const e = [{ name: "enabled", selector: { boolean: {} } }];
    return this._draft?.last_call.enabled && (e.push(
      { name: "after_minutes", selector: y(1, 240, 1, "min") },
      { name: "duration", selector: y(1, 120, 1, "min") }
    ), this.mode === "expert" && e.push(
      { name: "target", selector: { target: { entity: { domain: "light" } } } },
      { name: "brightness", selector: y(1, 100, 1, "%", "slider") },
      { name: "kelvin", selector: { color_temp: { unit: "kelvin", min: 1500, max: 6500 } } },
      { name: "actions", selector: { action: {} } }
    )), e;
  }
  _patch(e, t) {
    const s = structuredClone(this._draft);
    if (e === "root")
      Object.assign(s, t), typeof s.time == "string" && (s.time = s.time.slice(0, 5)), s.date || (s.date = null);
    else if (e === "light") {
      const i = t.curve === "custom" && s.light.curve !== "custom";
      Object.assign(s.light, t), i && s.light.points.length < 2 && (s.light.points = structuredClone(Ot));
    } else
      Object.assign(s[e], t);
    this._draft = s;
  }
  _toggleDay(e) {
    const t = new Set(this._draft.days);
    t.has(e) ? t.delete(e) : t.add(e), this._patch("root", { days: [...t].sort(), ...t.size ? { date: null } : {} });
  }
  _presetDays(e) {
    this._patch("root", { days: e, ...e.length ? { date: null } : {} });
  }
  _setPoint(e, t, s) {
    const i = structuredClone(this._draft.light.points), r = Number(s);
    Number.isNaN(r) || (t === "t" ? i[e].t = Math.min(1, Math.max(0, r / 100)) : t === "brightness" ? i[e].brightness = Math.min(100, Math.max(0, r)) : i[e].kelvin = s === "" ? null : Math.min(6500, Math.max(1500, r)), this._patch("light", { points: i }));
  }
  _addPoint() {
    const e = [...this._draft.light.points].sort((r, a) => r.t - a.t);
    let t = 0;
    for (let r = 1; r < e.length - 1; r++)
      e[r + 1].t - e[r].t > e[t + 1].t - e[t].t && (t = r);
    const s = e[t], i = e[t + 1] ?? { t: 1, brightness: 100, kelvin: 4e3 };
    e.splice(t + 1, 0, {
      t: Math.round((s.t + i.t) / 2 * 100) / 100,
      brightness: Math.round((s.brightness + i.brightness) / 2),
      kelvin: s.kelvin && i.kelvin ? Math.round((s.kelvin + i.kelvin) / 2) : s.kelvin ?? i.kelvin ?? null
    }), this._patch("light", { points: e });
  }
  _removePoint(e) {
    const t = this._draft.light.points.filter((s, i) => i !== e);
    this._patch("light", { points: t });
  }
  _save() {
    const e = structuredClone(this._draft);
    e.name = e.name.trim() || o(this.hass, "alarm"), e.light.points = [...e.light.points].sort((t, s) => t.t - s.t), $(this, "daybreak-save", { alarm: e });
  }
  _setMode(e) {
    $(this, "daybreak-mode", { mode: e });
  }
  _form(e, t, s) {
    return c`<ha-form
      .hass=${this.hass}
      .data=${t}
      .schema=${e}
      .computeLabel=${s === "last_call" ? this._lcLabel : this._label}
      @value-changed=${(i) => this._patch(s, i.detail.value)}
    ></ha-form>`;
  }
  render() {
    const e = this._draft;
    if (!e) return p;
    const t = He(this.hass), s = this.hass;
    return c`
      <div class="modes" role="tablist">
        ${["simple", "normal", "expert"].map(
      (i) => c`<button role="tab" class=${i === this.mode ? "sel" : ""} @click=${() => this._setMode(i)}>
            ${o(s, `mode_${i}`)}
          </button>`
    )}
      </div>

      <ha-card>
        <h2><ha-icon icon="mdi:clock-outline"></ha-icon>${o(s, "section_time")}</h2>
        <div class="content">
          ${this._form(this._baseSchema(), e, "root")}
          <div class="label">${o(s, "repeat")}</div>
          <div class="days">
            ${[0, 1, 2, 3, 4, 5, 6].map(
      (i) => c`<button class="day ${e.days.includes(i) ? "sel" : ""}" @click=${() => this._toggleDay(i)}>
                ${t[i]}
              </button>`
    )}
          </div>
          <div class="presets">
            <button @click=${() => this._presetDays([0, 1, 2, 3, 4])}>${o(s, "weekdays")}</button>
            <button @click=${() => this._presetDays([5, 6])}>${o(s, "weekend")}</button>
            <button @click=${() => this._presetDays([0, 1, 2, 3, 4, 5, 6])}>${o(s, "every_day")}</button>
            <button @click=${() => this._presetDays([])}>${o(s, "once")}</button>
          </div>
        </div>
      </ha-card>

      <ha-card>
        <h2><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>${o(s, "section_light")}</h2>
        <div class="content">${this._form(this._lightSchema(), e.light, "light")}</div>
      </ha-card>

      ${this.mode !== "simple" ? c`<ha-card>
            <h2><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon>${o(s, "section_curve")}</h2>
            <div class="content">
              <daybreak-curve-preview .hass=${s} .light=${e.light}></daybreak-curve-preview>
              ${this._form(this._curveSchema(), e.light, "light")}
              ${e.light.curve === "custom" ? this._renderPoints() : p}
            </div>
          </ha-card>` : c`<ha-card>
            <div class="content">
              <daybreak-curve-preview .hass=${s} .light=${e.light}></daybreak-curve-preview>
            </div>
          </ha-card>`}

      ${this.mode !== "simple" ? c`<ha-card>
            <h2><ha-icon icon="mdi:sleep"></ha-icon>${o(s, "section_behavior")}</h2>
            <div class="content">${this._form(this._behaviorSchema(), e.behavior, "behavior")}</div>
          </ha-card>` : p}

      ${this.mode !== "simple" ? c`<ha-card>
            <h2><ha-icon icon="mdi:account-clock-outline"></ha-icon>${o(s, "section_no_reaction")}</h2>
            <div class="content">
              <p class="hint">${o(s, "no_reaction_hint")}</p>
              ${this._form(this._presenceSchema(), e.presence, "presence")}
              <div class="label">${o(s, "section_last_call")}</div>
              ${this._form(this._lastCallSchema(), e.last_call, "last_call")}
            </div>
          </ha-card>` : p}

      <div class="footer">
        ${this.isNew ? p : c`<button class="danger" @click=${() => $(this, "daybreak-delete")}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${o(s, "delete")}
            </button>`}
        <span class="spacer"></span>
        <button @click=${() => $(this, "daybreak-cancel")}>${o(s, "cancel")}</button>
        <button class="primary" ?disabled=${this.saving} @click=${this._save}>${o(s, "save")}</button>
      </div>
    `;
  }
  _renderPoints() {
    const e = this.hass, t = this._draft.light.points, s = this._draft.light.use_color_temp;
    return c`
      <div class="label">${o(e, "points")}</div>
      <table class="points">
        <thead>
          <tr>
            <th>${o(e, "point_time")}</th>
            <th>${o(e, "point_brightness")}</th>
            ${s ? c`<th>${o(e, "point_kelvin")}</th>` : p}
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${t.map(
      (i, r) => c`<tr>
              <td><input type="number" min="0" max="100" .value=${String(Math.round(i.t * 100))}
                @change=${(a) => this._setPoint(r, "t", a.target.value)} /></td>
              <td><input type="number" min="0" max="100" .value=${String(i.brightness)}
                @change=${(a) => this._setPoint(r, "brightness", a.target.value)} /></td>
              ${s ? c`<td><input type="number" min="1500" max="6500" step="50" .value=${i.kelvin ? String(i.kelvin) : ""}
                    @change=${(a) => this._setPoint(r, "kelvin", a.target.value)} /></td>` : p}
              <td>
                <button class="icon" title=${o(e, "remove")} ?disabled=${t.length <= 2}
                  @click=${() => this._removePoint(r)}><ha-icon icon="mdi:close"></ha-icon></button>
              </td>
            </tr>`
    )}
        </tbody>
      </table>
      <button class="add" @click=${this._addPoint}><ha-icon icon="mdi:plus"></ha-icon>${o(e, "add_point")}</button>
    `;
  }
};
ge.styles = O`
    :host {
      display: block;
    }
    ha-card {
      margin-bottom: 16px;
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 16px 16px 0;
      font-size: 1.15em;
      font-weight: 500;
    }
    .content {
      padding: 12px 16px 16px;
    }
    .hint {
      margin: 0 0 12px;
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .label {
      margin: 16px 0 8px;
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .modes {
      display: inline-flex;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .modes button {
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      padding: 8px 16px;
      font: inherit;
      cursor: pointer;
    }
    .modes button.sel {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .days {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .day {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
    }
    .day.sel {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .presets {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .presets button,
    .add,
    .footer button {
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-color);
      border-radius: 16px;
      padding: 6px 12px;
      font: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .add {
      margin-top: 8px;
    }
    .points {
      width: 100%;
      border-collapse: collapse;
    }
    .points th {
      text-align: left;
      font-weight: 400;
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }
    .points input {
      width: 100%;
      box-sizing: border-box;
      padding: 6px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
    .points td {
      padding: 3px;
    }
    .icon {
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .footer {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 8px 0 32px;
    }
    .spacer {
      flex: 1;
    }
    .footer .primary {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
      padding: 8px 20px;
    }
    .footer .danger {
      color: var(--error-color, #db4437);
    }
    button[disabled] {
      opacity: 0.5;
      cursor: default;
    }
    daybreak-curve-preview {
      margin-bottom: 12px;
    }
  `;
let x = ge;
D([
  _({ attribute: !1 })
], x.prototype, "hass");
D([
  _({ attribute: !1 })
], x.prototype, "alarm");
D([
  _({ attribute: !1 })
], x.prototype, "mode");
D([
  _({ type: Boolean })
], x.prototype, "isNew");
D([
  _({ type: Boolean })
], x.prototype, "saving");
D([
  g()
], x.prototype, "_draft");
customElements.get("daybreak-alarm-editor") || customElements.define("daybreak-alarm-editor", x);
var Dt = Object.defineProperty, q = (n, e, t, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(e, t, i) || i);
  return i && Dt(e, t, i), i;
};
const be = class be extends k {
  constructor() {
    super(...arguments), this.controls = !1, this.editable = !1, this.now = Date.now();
  }
  async _action(e, t) {
    if (t?.stopPropagation(), !(!this.hass || !this.alarm))
      try {
        await Fe(this.hass, e, this.alarm.id);
      } catch (s) {
        $(this, "hass-notification", { message: o(this.hass, "error", { msg: s?.message ?? s }) });
      }
  }
  async _toggle(e) {
    if (e.stopPropagation(), !this.hass || !this.alarm) return;
    const t = e.target.checked;
    await qe(this.hass, this.alarm.id, { enabled: t });
  }
  _open() {
    this.editable && $(this, "daybreak-edit", { alarm: this.alarm });
  }
  _status() {
    const e = this.alarm, t = e.runtime, s = this.hass;
    return t.state === "snoozed" && t.snooze_until ? o(s, "state_snoozed", { time: X(s, t.snooze_until) }) : oe.includes(t.state) ? o(s, `state_${t.state}`) : e.skip_date ? o(s, "skipped", { date: B(s, `${e.skip_date}T12:00:00Z`) }) : t.next_alarm ? `${B(s, t.next_alarm)} · ${o(s, "in", { time: me(t.next_alarm, this.now) })}` : o(s, `state_${t.state}`);
  }
  render() {
    const e = this.alarm;
    if (!e) return p;
    const t = e.runtime, s = oe.includes(t.state), i = Object.values(e.light.target).some((r) => r?.length);
    return c`
      <div class="row ${s ? "active" : ""} ${e.enabled ? "" : "off"} ${this.editable ? "clickable" : ""}"
           @click=${this._open}>
        <div class="main">
          <div class="time">${Je(this.hass, e.time)}</div>
          <div class="meta">
            <div class="name">
              ${e.name}
              ${t.test ? c`<span class="badge">${o(this.hass, "test_badge")}</span>` : p}
            </div>
            <div class="sub">
              ${zt(this.hass, e)}
              ${i && e.light.duration ? c` · <ha-icon icon="mdi:weather-sunset-up"></ha-icon>${e.light.duration} min` : p}
            </div>
            <div class="status">${this._status()}</div>
          </div>
          <ha-switch .checked=${e.enabled} @change=${this._toggle} @click=${(r) => r.stopPropagation()}></ha-switch>
        </div>
        ${s ? c`<div class="actions big">
              ${t.state === "ringing" ? c`<button class="btn" @click=${(r) => this._action("snooze", r)}>
                    <ha-icon icon="mdi:sleep"></ha-icon>${o(this.hass, "snooze")}
                  </button>` : p}
              <button class="btn primary" @click=${(r) => this._action("stop", r)}>
                <ha-icon icon="mdi:alarm-off"></ha-icon>${o(this.hass, "stop")}
              </button>
            </div>` : this.controls && e.enabled ? c`<div class="actions">
                ${e.skip_date ? c`<button class="btn flat" @click=${(r) => this._action("cancel_skip", r)}>
                      <ha-icon icon="mdi:undo"></ha-icon>${o(this.hass, "cancel_skip")}
                    </button>` : t.next_alarm ? c`<button class="btn flat" @click=${(r) => this._action("skip_next", r)}>
                        <ha-icon icon="mdi:debug-step-over"></ha-icon>${o(this.hass, "skip_next")}
                      </button>` : p}
                <button class="btn flat" title=${o(this.hass, "test_hint")} @click=${(r) => this._action("test", r)}>
                  <ha-icon icon="mdi:play-circle-outline"></ha-icon>${o(this.hass, "test")}
                </button>
              </div>` : p}
      </div>
    `;
  }
};
be.styles = O`
    :host {
      display: block;
    }
    .row {
      padding: 12px 16px;
      border-radius: 12px;
      transition: background 0.2s;
    }
    .row.clickable {
      cursor: pointer;
    }
    .row.clickable:hover {
      background: var(--secondary-background-color);
    }
    .row.active {
      background: linear-gradient(90deg, rgba(255, 166, 77, 0.22), rgba(255, 214, 140, 0.08));
    }
    .row.off .time,
    .row.off .name {
      opacity: 0.5;
    }
    .main {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .time {
      font-size: 2.2em;
      font-weight: 300;
      font-variant-numeric: tabular-nums;
      line-height: 1;
      min-width: 3.1em;
    }
    .meta {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sub,
    .status {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .sub ha-icon {
      --mdc-icon-size: 16px;
      vertical-align: -3px;
      margin-right: 2px;
    }
    .badge {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-radius: 8px;
      padding: 0 6px;
      font-size: 0.75em;
      margin-left: 6px;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .actions.big .btn {
      flex: 1;
      justify-content: center;
      padding: 12px;
      font-size: 1.05em;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      border-radius: 20px;
      padding: 6px 12px;
      font: inherit;
      cursor: pointer;
    }
    .btn.primary {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .btn.flat {
      border-color: transparent;
      background: transparent;
      color: var(--primary-color);
      padding: 4px 8px;
    }
    .btn ha-icon {
      --mdc-icon-size: 18px;
    }
  `;
let A = be;
q([
  _({ attribute: !1 })
], A.prototype, "hass");
q([
  _({ attribute: !1 })
], A.prototype, "alarm");
q([
  _({ type: Boolean })
], A.prototype, "controls");
q([
  _({ type: Boolean })
], A.prototype, "editable");
q([
  _({ type: Number })
], A.prototype, "now");
customElements.get("daybreak-alarm-row") || customElements.define("daybreak-alarm-row", A);
var Ut = Object.defineProperty, S = (n, e, t, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(e, t, i) || i);
  return i && Ut(e, t, i), i;
};
const Qe = "daybreak-editor-mode";
function Ht() {
  try {
    const n = localStorage.getItem(Qe);
    if (n === "simple" || n === "normal" || n === "expert") return n;
  } catch {
  }
  return "normal";
}
const ve = class ve extends k {
  constructor() {
    super(...arguments), this.narrow = !1, this._mode = Ht(), this._saving = !1, this._now = Date.now(), this._ready = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this._now = Date.now(), 3e4), _e().then(() => this._ready = !0), this._subscribe();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this._timer), this._unsub?.(), this._unsub = void 0;
  }
  updated(e) {
    e.has("hass") && this._subscribe();
  }
  _subscribe() {
    this._unsub || !this.hass || !this.isConnected || (this._unsub = Ze(this.hass, (e) => this._snapshot = e));
  }
  _new() {
    const e = structuredClone(Nt);
    e.name = o(this.hass, "alarm"), this._editing = { alarm: e };
  }
  _edit(e) {
    const { runtime: t, id: s, ...i } = e.detail.alarm;
    this._editing = { alarm: i, id: s };
  }
  async _save(e) {
    if (!(!this.hass || !this._editing)) {
      this._saving = !0;
      try {
        const t = e.detail.alarm;
        this._editing.id ? await qe(this.hass, this._editing.id, t) : await Et(this.hass, t), this._editing = void 0;
      } catch (t) {
        this._notify(o(this.hass, "error", { msg: t?.message ?? String(t) }));
      } finally {
        this._saving = !1;
      }
    }
  }
  async _delete() {
    const e = this._editing;
    !this.hass || !e?.id || confirm(o(this.hass, "delete_confirm", { name: e.alarm.name })) && (await Ct(this.hass, e.id), this._editing = void 0);
  }
  _setMode(e) {
    this._mode = e.detail.mode;
    try {
      localStorage.setItem(Qe, this._mode);
    } catch {
    }
  }
  _notify(e) {
    $(this, "hass-notification", { message: e });
  }
  render() {
    const e = this.hass, t = this._editing;
    return c`
      <div class="toolbar">
        ${t ? c`<button class="icon" title=${o(e, "back")} @click=${() => this._editing = void 0}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>` : c`<ha-menu-button .hass=${e} .narrow=${this.narrow}></ha-menu-button>`}
        <div class="title">${t ? t.alarm.name || o(e, "new_alarm") : o(e, "title")}</div>
      </div>
      <div class="body">
        ${t ? this._renderEditor() : this._renderList()}
      </div>
    `;
  }
  _renderEditor() {
    return this._ready ? c`<daybreak-alarm-editor
      .hass=${this.hass}
      .alarm=${this._editing.alarm}
      .mode=${this._mode}
      .isNew=${!this._editing.id}
      .saving=${this._saving}
      @daybreak-save=${this._save}
      @daybreak-cancel=${() => this._editing = void 0}
      @daybreak-delete=${this._delete}
      @daybreak-mode=${this._setMode}
    ></daybreak-alarm-editor>` : c`<div class="loading">…</div>`;
  }
  _renderList() {
    const e = this.hass, t = this._snapshot;
    if (!t) return c`<div class="loading">…</div>`;
    const s = t.next, i = s && t.alarms.find((a) => a.id === s.alarm_id), r = [...t.alarms].sort((a, d) => a.time.localeCompare(d.time));
    return c`
      <div class="hero">
        <ha-icon icon="mdi:weather-sunset-up"></ha-icon>
        <div>
          <div class="hero-label">${o(e, "next_alarm")}</div>
          ${s && i ? c`<div class="hero-time">${X(e, s.time)}</div>
                <div class="hero-sub">
                  ${B(e, s.time)} · ${o(e, "in", { time: me(s.time, this._now) })} ·
                  ${i.name}
                </div>` : c`<div class="hero-sub">${o(e, "no_next")}</div>`}
        </div>
      </div>

      <ha-card>
        ${r.length ? r.map(
      (a) => c`<daybreak-alarm-row
                .hass=${e}
                .alarm=${a}
                .now=${this._now}
                controls
                editable
                @daybreak-edit=${this._edit}
              ></daybreak-alarm-row>`
    ) : c`<div class="empty">${o(e, "no_alarms")}</div>`}
      </ha-card>

      <button class="fab" @click=${this._new}>
        <ha-icon icon="mdi:plus"></ha-icon><span>${o(e, "new_alarm")}</span>
      </button>
    `;
  }
};
ve.styles = O`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, inherit);
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      height: var(--header-height, 56px);
      padding: 0 12px;
      box-sizing: border-box;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color, #fff));
      border-bottom: var(--app-header-border-bottom, none);
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .title {
      font-size: 20px;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon {
      border: none;
      background: transparent;
      color: inherit;
      padding: 8px;
      cursor: pointer;
      border-radius: 50%;
    }
    .body {
      max-width: 760px;
      margin: 0 auto;
      padding: 16px;
      padding-bottom: 96px;
    }
    .hero {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      margin-bottom: 16px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: linear-gradient(135deg, #ff9a5a 0%, #ffcf7a 60%, #ffe8b0 100%);
      color: #3a2410;
    }
    .hero > ha-icon {
      --mdc-icon-size: 48px;
    }
    .hero-label {
      font-size: 0.9em;
      opacity: 0.8;
    }
    .hero-time {
      font-size: 2.6em;
      font-weight: 300;
      line-height: 1.1;
    }
    .hero-sub {
      opacity: 0.85;
    }
    ha-card {
      padding: 4px 0;
    }
    daybreak-alarm-row + daybreak-alarm-row {
      border-top: 1px solid var(--divider-color);
    }
    .empty,
    .loading {
      padding: 32px 16px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .fab {
      position: fixed;
      right: 24px;
      bottom: 24px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 20px;
      border: none;
      border-radius: 16px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    }
  `;
let v = ve;
S([
  _({ attribute: !1 })
], v.prototype, "hass");
S([
  _({ type: Boolean, reflect: !0 })
], v.prototype, "narrow");
S([
  g()
], v.prototype, "_snapshot");
S([
  g()
], v.prototype, "_editing");
S([
  g()
], v.prototype, "_mode");
S([
  g()
], v.prototype, "_saving");
S([
  g()
], v.prototype, "_now");
S([
  g()
], v.prototype, "_ready");
customElements.get("daybreak-panel") || customElements.define("daybreak-panel", v);
var Wt = Object.defineProperty, F = (n, e, t, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(e, t, i) || i);
  return i && Wt(e, t, i), i;
};
class M extends k {
  constructor() {
    super(...arguments), this.now = Date.now();
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
    this._unsub || !this.hass || !this.isConnected || (this._unsub = Ze(this.hass, (e) => this.snapshot = e));
  }
}
F([
  _({ attribute: !1 })
], M.prototype, "hass");
F([
  g()
], M.prototype, "snapshot");
F([
  g()
], M.prototype, "now");
const $e = class $e extends M {
  static getConfigElement() {
    return document.createElement("daybreak-alarms-card-editor");
  }
  static getStubConfig() {
    return { show_controls: !0 };
  }
  setConfig(e) {
    this._config = { show_disabled: !0, show_controls: !0, ...e };
  }
  getCardSize() {
    return 1 + (this.snapshot?.alarms.length ?? 2) * 2;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, min_rows: 2 };
  }
  render() {
    const e = this._config;
    if (!e) return p;
    const t = this.hass;
    let s = [...this.snapshot?.alarms ?? []].sort((i, r) => i.time.localeCompare(r.time));
    return e.alarms?.length && (s = s.filter((i) => e.alarms.includes(i.id))), e.show_disabled || (s = s.filter((i) => i.enabled)), c`
      <ha-card .header=${e.title}>
        ${this.snapshot ? s.length ? s.map(
      (i) => c`<daybreak-alarm-row
                  .hass=${t}
                  .alarm=${i}
                  .now=${this.now}
                  .controls=${e.show_controls ?? !0}
                ></daybreak-alarm-row>`
    ) : c`<div class="empty">${o(t, "no_alarms")}</div>` : c`<div class="empty">…</div>`}
      </ha-card>
    `;
  }
};
$e.styles = O`
    ha-card {
      padding: 4px 0;
    }
    daybreak-alarm-row + daybreak-alarm-row {
      border-top: 1px solid var(--divider-color);
    }
    .empty {
      padding: 24px 16px;
      text-align: center;
      color: var(--secondary-text-color);
    }
  `;
let ee = $e;
F([
  g()
], ee.prototype, "_config");
class Xe extends M {
  constructor() {
    super(...arguments), this._label = (e) => o(this.hass, `c_${e.name}`);
  }
  setConfig(e) {
    this._config = e;
  }
  connectedCallback() {
    super.connectedCallback(), _e().then(() => this.requestUpdate());
  }
  _schema() {
    const e = (this.snapshot?.alarms ?? []).map((t) => ({ value: t.id, label: `${t.time} ${t.name}` }));
    return [
      { name: "title", selector: { text: {} } },
      { name: "alarms", selector: { select: { multiple: !0, mode: "list", options: e } } },
      { name: "show_disabled", selector: { boolean: {} } },
      { name: "show_controls", selector: { boolean: {} } }
    ];
  }
  render() {
    return this._config ? c`<ha-form
      .hass=${this.hass}
      .data=${{ show_disabled: !0, show_controls: !0, ...this._config }}
      .schema=${this._schema()}
      .computeLabel=${this._label}
      @value-changed=${(e) => $(this, "config-changed", { config: e.detail.value })}
    ></ha-form>` : p;
  }
}
F([
  g()
], Xe.prototype, "_config");
customElements.get("daybreak-alarms-card") || (customElements.define("daybreak-alarms-card", ee), customElements.define("daybreak-alarms-card-editor", Xe));
var Rt = Object.defineProperty, et = (n, e, t, s) => {
  for (var i = void 0, r = n.length - 1, a; r >= 0; r--)
    (a = n[r]) && (i = a(e, t, i) || i);
  return i && Rt(e, t, i), i;
};
const ye = class ye extends M {
  static getConfigElement() {
    return document.createElement("daybreak-next-card-editor");
  }
  static getStubConfig() {
    return {};
  }
  setConfig(e) {
    this._config = e;
  }
  getCardSize() {
    return 2;
  }
  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 4, min_rows: 2 };
  }
  _pick() {
    const e = this.snapshot?.alarms ?? [], t = this._config?.alarm ? e.filter((r) => r.id === this._config.alarm) : e, s = t.find((r) => oe.includes(r.runtime.state)), i = t.filter((r) => r.runtime.next_alarm).sort((r, a) => r.runtime.next_alarm.localeCompare(a.runtime.next_alarm));
    return { active: s, alarm: i[0] };
  }
  async _act(e, t) {
    try {
      await Fe(this.hass, e, t.id);
    } catch (s) {
      $(this, "hass-notification", { message: o(this.hass, "error", { msg: s?.message ?? s }) });
    }
  }
  render() {
    if (!this._config) return p;
    const e = this.hass, { alarm: t, active: s } = this._pick();
    if (s) {
      const i = s.runtime, r = i.state === "snoozed" && i.snooze_until ? o(e, "state_snoozed", { time: X(e, i.snooze_until) }) : o(e, `state_${i.state}`);
      return c`<ha-card class="active">
        <div class="top">
          <ha-icon icon="mdi:weather-sunset-up"></ha-icon>
          <div>
            <div class="time">${Je(e, s.time)}</div>
            <div class="sub">${s.name} · ${r}</div>
          </div>
        </div>
        <div class="buttons">
          ${i.state === "ringing" ? c`<button @click=${() => this._act("snooze", s)}>
                <ha-icon icon="mdi:sleep"></ha-icon>${o(e, "snooze")}
              </button>` : p}
          <button class="primary" @click=${() => this._act("stop", s)}>
            <ha-icon icon="mdi:alarm-off"></ha-icon>${o(e, "stop")}
          </button>
        </div>
      </ha-card>`;
    }
    return c`<ha-card>
      <div class="top">
        <ha-icon icon=${t ? "mdi:alarm" : "mdi:alarm-off"}></ha-icon>
        <div>
          ${t?.runtime.next_alarm ? c`<div class="time">${X(e, t.runtime.next_alarm)}</div>
                <div class="sub">
                  ${B(e, t.runtime.next_alarm)} ·
                  ${o(e, "in", { time: me(t.runtime.next_alarm, this.now) })}
                </div>
                <div class="sub">${t.name}</div>` : c`<div class="sub">${this.snapshot ? o(e, "no_next") : "…"}</div>`}
        </div>
      </div>
    </ha-card>`;
  }
};
ye.styles = O`
    ha-card {
      height: 100%;
      box-sizing: border-box;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12px;
    }
    ha-card.active {
      background: linear-gradient(135deg, #ff9a5a 0%, #ffcf7a 70%, #ffe8b0 100%);
      color: #3a2410;
    }
    .top {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .top > ha-icon {
      --mdc-icon-size: 36px;
      color: var(--state-icon-color, var(--primary-color));
    }
    .active .top > ha-icon {
      color: inherit;
    }
    .time {
      font-size: 2em;
      font-weight: 300;
      line-height: 1.1;
      font-variant-numeric: tabular-nums;
    }
    .sub {
      font-size: 0.9em;
      opacity: 0.8;
    }
    .buttons {
      display: flex;
      gap: 8px;
    }
    button {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px;
      border-radius: 12px;
      border: 1px solid rgba(58, 36, 16, 0.3);
      background: rgba(255, 255, 255, 0.5);
      color: inherit;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
    }
    button.primary {
      background: #3a2410;
      color: #ffe8b0;
      border-color: #3a2410;
    }
  `;
let te = ye;
et([
  g()
], te.prototype, "_config");
class tt extends M {
  setConfig(e) {
    this._config = e;
  }
  connectedCallback() {
    super.connectedCallback(), _e().then(() => this.requestUpdate());
  }
  render() {
    if (!this._config) return p;
    const t = [{ name: "alarm", selector: { select: { mode: "dropdown", options: (this.snapshot?.alarms ?? []).map((s) => ({ value: s.id, label: `${s.time} ${s.name}` })) } } }];
    return c`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${t}
      .computeLabel=${() => o(this.hass, "c_alarms")}
      @value-changed=${(s) => $(this, "config-changed", { config: s.detail.value })}
    ></ha-form>`;
  }
}
et([
  g()
], tt.prototype, "_config");
customElements.get("daybreak-next-card") || (customElements.define("daybreak-next-card", te), customElements.define("daybreak-next-card-editor", tt));
const G = document.querySelector("home-assistant")?.hass;
window.customCards = window.customCards || [];
for (const n of [
  { type: "daybreak-alarms-card", name: o(G, "card_name"), description: o(G, "card_desc") },
  { type: "daybreak-next-card", name: o(G, "next_card_name"), description: o(G, "next_card_desc") }
])
  window.customCards.some((e) => e.type === n.type) || window.customCards.push({ ...n, preview: !0 });
console.info("%c DAYBREAK %c 0.1.0 ", "color:#3a2410;background:#ffcf7a;font-weight:bold", "color:#ffcf7a;background:#3a2410");
