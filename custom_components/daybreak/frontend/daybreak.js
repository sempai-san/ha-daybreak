const Ut = {
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
}, se = {
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
}, Lt = { en: Ut, de: se };
function ie(n) {
  const t = (n?.locale?.language || n?.language || navigator.language || "en").split("-")[0];
  return t in Lt ? t : "en";
}
function a(n, t, e = {}) {
  return (Lt[ie(n)][t] ?? Ut[t]).replace(/\{(\w+)\}/g, (i, r) => String(e[r] ?? ""));
}
function Ht(n) {
  const t = new Intl.DateTimeFormat(st(n), { weekday: "short" });
  return [...Array(7).keys()].map((e) => t.format(new Date(2024, 0, 1 + e)));
}
function st(n) {
  return n?.locale?.language || n?.language || navigator.language || "en";
}
const J = globalThis, lt = J.ShadowRoot && (J.ShadyCSS === void 0 || J.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ct = /* @__PURE__ */ Symbol(), xt = /* @__PURE__ */ new WeakMap();
let Rt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== ct) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (lt && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = xt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && xt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ne = (n) => new Rt(typeof n == "string" ? n : n + "", void 0, ct), D = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((s, i, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + n[r + 1], n[0]);
  return new Rt(e, n, ct);
}, re = (n, t) => {
  if (lt) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = J.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, n.appendChild(s);
  }
}, kt = lt ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ne(e);
})(n) : n;
const { is: oe, defineProperty: ae, getOwnPropertyDescriptor: le, getOwnPropertyNames: ce, getOwnPropertySymbols: de, getPrototypeOf: he } = Object, it = globalThis, wt = it.trustedTypes, pe = wt ? wt.emptyScript : "", ue = it.reactiveElementPolyfillSupport, H = (n, t) => n, Y = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? pe : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, dt = (n, t) => !oe(n, t), At = { attribute: !0, type: String, converter: Y, reflect: !1, useDefault: !1, hasChanged: dt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), it.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let T = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = At) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && ae(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: r } = le(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const h = i?.call(this);
      r?.call(this, o), this.requestUpdate(t, h, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? At;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const t = he(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const e = this.properties, s = [...ce(e), ...de(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(kt(i));
    } else t !== void 0 && e.push(kt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return re(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : Y).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : Y;
      this._$Em = i;
      const h = o.fromAttribute(e, r.type);
      this[i] = h ?? this._$Ej?.get(i) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, r) {
    if (t !== void 0) {
      const o = this.constructor;
      if (i === !1 && (r = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? dt)(r, e) || s.useDefault && s.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: r }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
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
        const { wrapped: o } = r, h = this[i];
        o !== !0 || this._$AL.has(i) || h === void 0 || this.C(i, void 0, r, h);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[H("elementProperties")] = /* @__PURE__ */ new Map(), T[H("finalized")] = /* @__PURE__ */ new Map(), ue?.({ ReactiveElement: T }), (it.reactiveElementVersions ??= []).push("2.1.2");
const ht = globalThis, St = (n) => n, Q = ht.trustedTypes, Et = Q ? Q.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, jt = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Wt = "?" + k, me = `<${Wt}>`, z = document, R = () => z.createComment(""), j = (n) => n === null || typeof n != "object" && typeof n != "function", pt = Array.isArray, _e = (n) => pt(n) || typeof n?.[Symbol.iterator] == "function", rt = `[ 	
\f\r]`, L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ct = /-->/g, zt = />/g, S = RegExp(`>|${rt}(?:([^\\s"'>=/]+)(${rt}*=${rt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Pt = /'/g, Mt = /"/g, Bt = /^(?:script|style|textarea|title)$/i, It = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), c = It(1), Tt = It(2), N = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), Nt = /* @__PURE__ */ new WeakMap(), C = z.createTreeWalker(z, 129);
function qt(n, t) {
  if (!pt(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Et !== void 0 ? Et.createHTML(t) : t;
}
const fe = (n, t) => {
  const e = n.length - 1, s = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = L;
  for (let h = 0; h < e; h++) {
    const l = n[h];
    let d, u, m = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, u = o.exec(l), u !== null); ) f = o.lastIndex, o === L ? u[1] === "!--" ? o = Ct : u[1] !== void 0 ? o = zt : u[2] !== void 0 ? (Bt.test(u[2]) && (i = RegExp("</" + u[2], "g")), o = S) : u[3] !== void 0 && (o = S) : o === S ? u[0] === ">" ? (o = i ?? L, m = -1) : u[1] === void 0 ? m = -2 : (m = o.lastIndex - u[2].length, d = u[1], o = u[3] === void 0 ? S : u[3] === '"' ? Mt : Pt) : o === Mt || o === Pt ? o = S : o === Ct || o === zt ? o = L : (o = S, i = void 0);
    const b = o === S && n[h + 1].startsWith("/>") ? " " : "";
    r += o === L ? l + me : m >= 0 ? (s.push(d), l.slice(0, m) + jt + l.slice(m) + k + b) : l + k + (m === -2 ? h : b);
  }
  return [qt(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class W {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let r = 0, o = 0;
    const h = t.length - 1, l = this.parts, [d, u] = fe(t, e);
    if (this.el = W.createElement(d, s), C.currentNode = this.el.content, e === 2 || e === 3) {
      const m = this.el.content.firstChild;
      m.replaceWith(...m.childNodes);
    }
    for (; (i = C.nextNode()) !== null && l.length < h; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const m of i.getAttributeNames()) if (m.endsWith(jt)) {
          const f = u[o++], b = i.getAttribute(m).split(k), Z = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: r, name: Z[2], strings: b, ctor: Z[1] === "." ? be : Z[1] === "?" ? ve : Z[1] === "@" ? $e : nt }), i.removeAttribute(m);
        } else m.startsWith(k) && (l.push({ type: 6, index: r }), i.removeAttribute(m));
        if (Bt.test(i.tagName)) {
          const m = i.textContent.split(k), f = m.length - 1;
          if (f > 0) {
            i.textContent = Q ? Q.emptyScript : "";
            for (let b = 0; b < f; b++) i.append(m[b], R()), C.nextNode(), l.push({ type: 2, index: ++r });
            i.append(m[f], R());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Wt) l.push({ type: 2, index: r });
      else {
        let m = -1;
        for (; (m = i.data.indexOf(k, m + 1)) !== -1; ) l.push({ type: 7, index: r }), m += k.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = z.createElement("template");
    return s.innerHTML = t, s;
  }
}
function O(n, t, e = n, s) {
  if (t === N) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const r = j(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(n), i._$AT(n, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = O(n, i._$AS(n, t.values), i, s)), t;
}
class ge {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? z).importNode(e, !0);
    C.currentNode = i;
    let r = C.nextNode(), o = 0, h = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let d;
        l.type === 2 ? d = new q(r, r.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (d = new ye(r, this, t)), this._$AV.push(d), l = s[++h];
      }
      o !== l?.index && (r = C.nextNode(), o++);
    }
    return C.currentNode = z, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class q {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = O(this, t, e), j(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== N && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : _e(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && j(this._$AH) ? this._$AA.nextSibling.data = t : this.T(z.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = W.createElement(qt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const r = new ge(i, this), o = r.u(this.options);
      r.p(e), this.T(o), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = Nt.get(t.strings);
    return e === void 0 && Nt.set(t.strings, e = new W(t)), e;
  }
  k(t) {
    pt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const r of t) i === e.length ? e.push(s = new q(this.O(R()), this.O(R()), this, this.options)) : s = e[i], s._$AI(r), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = St(t).nextSibling;
      St(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
let nt = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, r) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, i) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = O(this, t, e, 0), o = !j(t) || t !== this._$AH && t !== N, o && (this._$AH = t);
    else {
      const h = t;
      let l, d;
      for (t = r[0], l = 0; l < r.length - 1; l++) d = O(this, h[s + l], e, l), d === N && (d = this._$AH[l]), o ||= !j(d) || d !== this._$AH[l], d === p ? t = p : t !== p && (t += (d ?? "") + r[l + 1]), this._$AH[l] = d;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
};
class be extends nt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class ve extends nt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class $e extends nt {
  constructor(t, e, s, i, r) {
    super(t, e, s, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = O(this, t, e, 0) ?? p) === N) return;
    const s = this._$AH, i = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== p && (s === p || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ye {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const xe = ht.litHtmlPolyfillSupport;
xe?.(W, q), (ht.litHtmlVersions ??= []).push("3.3.3");
const ke = (n, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = e?.renderBefore ?? null;
    s._$litPart$ = i = new q(t.insertBefore(R(), r), r, void 0, e ?? {});
  }
  return i._$AI(n), i;
};
const ut = globalThis;
class y extends T {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ke(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return N;
  }
}
y._$litElement$ = !0, y.finalized = !0, ut.litElementHydrateSupport?.({ LitElement: y });
const we = ut.litElementPolyfillSupport;
we?.({ LitElement: y });
(ut.litElementVersions ??= []).push("4.2.2");
const Ae = { attribute: !0, type: String, converter: Y, reflect: !1, hasChanged: dt }, Se = (n = Ae, t, e) => {
  const { kind: s, metadata: i } = e;
  let r = globalThis.litPropertyMetadata.get(i);
  if (r === void 0 && globalThis.litPropertyMetadata.set(i, r = /* @__PURE__ */ new Map()), s === "setter" && ((n = Object.create(n)).wrapped = !0), r.set(e.name, n), s === "accessor") {
    const { name: o } = e;
    return { set(h) {
      const l = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(o, l, n, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(o, void 0, n, h), h;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(h) {
      const l = this[o];
      t.call(this, h), this.requestUpdate(o, l, n, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function _(n) {
  return (t, e) => typeof e == "object" ? Se(n, t, e) : ((s, i, r) => {
    const o = i.hasOwnProperty(r);
    return i.constructor.createProperty(r, s), o ? Object.getOwnPropertyDescriptor(i, r) : void 0;
  })(n, t, e);
}
function g(n) {
  return _({ ...n, state: !0, attribute: !1 });
}
const at = ["sunrise", "ringing", "snoozed"], Ee = (n, t) => n.callWS({ type: "daybreak/alarm/create", alarm: t }), Ft = (n, t, e) => n.callWS({ type: "daybreak/alarm/update", alarm_id: t, changes: e }), Ce = (n, t) => n.callWS({ type: "daybreak/alarm/delete", alarm_id: t }), Kt = (n, t, e, s = {}) => n.callWS({ type: "daybreak/alarm/action", action: t, alarm_id: e, ...s }), Ot = /* @__PURE__ */ new WeakMap();
function Zt(n, t) {
  let e = Ot.get(n.connection);
  e || (e = { listeners: /* @__PURE__ */ new Set() }, Ot.set(n.connection, e));
  const s = e;
  return s.listeners.add(t), s.last && t(s.last), s.unsub || (s.unsub = n.connection.subscribeMessage(
    (i) => {
      s.last = i, s.listeners.forEach((r) => r(i));
    },
    { type: "daybreak/subscribe" }
  ), s.unsub.catch(() => {
    s.unsub = void 0;
  })), () => {
    if (s.listeners.delete(t), s.listeners.size === 0 && s.unsub) {
      const i = s.unsub;
      s.unsub = void 0, s.last = void 0, i.then((r) => r()).catch(() => {
      });
    }
  };
}
const Vt = (n) => n?.config?.time_zone || void 0;
function Gt(n) {
  const t = n?.locale?.time_format;
  if (t === "12") return !0;
  if (t === "24") return !1;
}
function X(n, t) {
  const e = typeof t == "string" ? new Date(t) : t;
  return new Intl.DateTimeFormat(st(n), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: Gt(n),
    timeZone: Vt(n)
  }).format(e);
}
function Jt(n, t) {
  const [e, s] = t.split(":").map(Number);
  return new Intl.DateTimeFormat(st(n), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: Gt(n),
    timeZone: "UTC"
  }).format(new Date(Date.UTC(2024, 0, 1, e, s)));
}
function B(n, t) {
  const e = typeof t == "string" ? new Date(t) : t;
  return new Intl.DateTimeFormat(st(n), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: Vt(n)
  }).format(e);
}
function mt(n, t = Date.now()) {
  let e = Math.max(0, Math.round((new Date(n).getTime() - t) / 6e4));
  const s = Math.floor(e / 1440);
  e -= s * 1440;
  const i = Math.floor(e / 60);
  return e -= i * 60, s ? `${s} d ${i} h` : i ? `${i} h ${String(e).padStart(2, "0")} min` : `${e} min`;
}
function ze(n, t) {
  const e = [...t.days].sort();
  if (!e.length)
    return t.date ? a(n, "on_date", { date: B(n, `${t.date}T12:00:00Z`) }) : a(n, "once");
  if (e.length === 7) return a(n, "every_day");
  if (e.join() === "0,1,2,3,4") return a(n, "weekdays");
  if (e.join() === "5,6") return a(n, "weekend");
  const s = Ht(n);
  return e.map((i) => s[i]).join(", ");
}
function Pe(n) {
  const t = n / 100;
  let e, s, i;
  t <= 66 ? (e = 255, s = 99.4708025861 * Math.log(t) - 161.1195681661, i = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307) : (e = 329.698727446 * Math.pow(t - 60, -0.1332047592), s = 288.1221695283 * Math.pow(t - 60, -0.0755148492), i = 255);
  const r = (o) => Math.round(Math.min(255, Math.max(0, o)));
  return [r(e), r(s), r(i)];
}
function Me(n, t) {
  const e = Math.min(1, Math.max(0, t)), s = n.use_color_temp;
  if (n.curve === "custom" && n.points.length >= 2) {
    const r = [...n.points].sort((l, d) => l.t - d.t), o = s ? n.end_kelvin : null;
    if (e <= r[0].t) return { brightness: r[0].brightness, kelvin: s ? r[0].kelvin || o : null };
    for (let l = 0; l < r.length - 1; l++) {
      const d = r[l], u = r[l + 1];
      if (e <= u.t) {
        const m = u.t - d.t, f = m <= 0 ? 0 : (e - d.t) / m, b = d.kelvin && u.kelvin ? d.kelvin + (u.kelvin - d.kelvin) * f : d.kelvin || u.kelvin || o;
        return { brightness: d.brightness + (u.brightness - d.brightness) * f, kelvin: s ? b : null };
      }
    }
    const h = r[r.length - 1];
    return { brightness: h.brightness, kelvin: s ? h.kelvin || o : null };
  }
  const i = n.curve === "linear" ? e : e * e * (3 - 2 * e) * 0.4 + e * e * 0.6;
  return {
    brightness: n.start_brightness + (n.end_brightness - n.start_brightness) * i,
    kelvin: s ? n.start_kelvin + (n.end_kelvin - n.start_kelvin) * e : null
  };
}
let Dt;
function _t() {
  return customElements.get("ha-form") && customElements.get("ha-selector") ? Promise.resolve() : (Dt ??= (async () => {
    const n = await window.loadCardHelpers?.();
    n && await (await n.createCardElement({ type: "entities", entities: [] }))?.constructor?.getConfigElement?.(), await customElements.whenDefined("ha-form");
  })(), Dt);
}
function $(n, t, e = {}) {
  n.dispatchEvent(new CustomEvent(t, { detail: e, bubbles: !0, composed: !0 }));
}
var Te = Object.defineProperty, Yt = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (i = o(t, e, i) || i);
  return i && Te(t, e, i), i;
};
const V = 300, E = 90, ot = 60, ft = class ft extends y {
  render() {
    if (!this.light) return c``;
    const t = this.light, e = [...Array(ot + 1).keys()].map((d) => {
      const u = d / ot;
      return { x: u, ...Me(t, u) };
    }), s = `g${Math.random().toString(36).slice(2, 8)}`, i = e.filter((d, u) => u % 6 === 0 || u === ot).map((d) => {
      const [u, m, f] = d.kelvin ? Pe(d.kelvin) : [255, 214, 170], b = 0.15 + 0.85 * (d.brightness / 100);
      return Tt`<stop offset=${d.x} stop-color=${`rgb(${u},${m},${f})`} stop-opacity=${b}></stop>`;
    }), r = e.map((d) => `${(d.x * V).toFixed(1)},${(E - d.brightness / 100 * E).toFixed(1)}`), o = `M0,${E} L${r.join(" L")} L${V},${E} Z`, h = `M${r.join(" L")}`, l = t.curve === "custom" ? t.points.map(
      (d) => Tt`<circle cx=${d.t * V} cy=${E - d.brightness / 100 * E} r="3.5" class="pt"></circle>`
    ) : [];
    return c`
      <svg viewBox="0 0 ${V} ${E}" preserveAspectRatio="none" role="img" aria-label=${a(this.hass, "preview")}>
        <defs>
          <linearGradient id=${s} x1="0" x2="1" y1="0" y2="0">${i}</linearGradient>
        </defs>
        <path d=${o} fill=${`url(#${s})`}></path>
        <path d=${h} class="line"></path>
        ${l}
      </svg>
      <div class="axis">
        <span>−${t.duration} min</span>
        <span>${a(this.hass, "alarm")}</span>
      </div>
    `;
  }
};
ft.styles = D`
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
let I = ft;
Yt([
  _({ attribute: !1 })
], I.prototype, "hass");
Yt([
  _({ attribute: !1 })
], I.prototype, "light");
customElements.get("daybreak-curve-preview") || customElements.define("daybreak-curve-preview", I);
var Ne = Object.defineProperty, U = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (i = o(t, e, i) || i);
  return i && Ne(t, e, i), i;
};
const Oe = {
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
  }
}, De = [
  { t: 0, brightness: 1, kelvin: 2e3 },
  { t: 0.66, brightness: 30, kelvin: 2700 },
  { t: 1, brightness: 100, kelvin: 4e3 }
], M = (n, t, e = 1, s, i = "box") => ({
  number: { min: n, max: t, step: e, mode: i, unit_of_measurement: s }
}), gt = class gt extends y {
  constructor() {
    super(...arguments), this.mode = "normal", this.isNew = !1, this.saving = !1, this._label = (t) => a(this.hass, `f_${t.name}`);
  }
  willUpdate(t) {
    t.has("alarm") && this.alarm && (this._draft = structuredClone(this.alarm));
  }
  _opts(t, e) {
    return e.map((s) => ({ value: s, label: a(this.hass, `${t}_${s}`) }));
  }
  _baseSchema() {
    const t = [
      { name: "name", selector: { text: {} } },
      { name: "time", required: !0, selector: { time: { no_second: !0 } } }
    ];
    return this.mode === "expert" && !this._draft?.days.length && t.push({ name: "date", selector: { date: {} } }), t;
  }
  _lightSchema() {
    const t = [
      { name: "target", selector: { target: { entity: { domain: "light" } } } },
      { name: "duration", selector: M(0, 240, 1, "min", "slider") }
    ];
    return this.mode === "simple" || (this._draft?.light.curve !== "custom" && t.push(
      { name: "start_brightness", selector: M(0, 100, 1, "%", "slider") },
      { name: "end_brightness", selector: M(1, 100, 1, "%", "slider") }
    ), t.push({ name: "use_color_temp", selector: { boolean: {} } }), this._draft?.light.use_color_temp && this._draft.light.curve !== "custom" && t.push(
      { name: "start_kelvin", selector: { color_temp: { unit: "kelvin", min: 1500, max: 6500 } } },
      { name: "end_kelvin", selector: { color_temp: { unit: "kelvin", min: 1500, max: 6500 } } }
    )), t;
  }
  _curveSchema() {
    const t = this.mode === "expert" ? ["smooth", "linear", "custom"] : ["smooth", "linear"], e = [
      { name: "curve", required: !0, selector: { select: { mode: "dropdown", options: this._opts("curve", t) } } }
    ];
    return this.mode === "expert" && e.push({ name: "step_seconds", selector: M(2, 120, 1, "s") }), e;
  }
  _behaviorSchema() {
    const t = [
      { name: "snooze_minutes", selector: M(1, 60, 1, "min") },
      { name: "auto_stop_minutes", selector: M(0, 720, 1, "min") },
      {
        name: "after_stop",
        required: !0,
        selector: { select: { mode: "dropdown", options: this._opts("after_stop", ["keep", "off"]) } }
      }
    ];
    return this.mode === "expert" && t.push(
      {
        name: "snooze_light",
        required: !0,
        selector: { select: { mode: "dropdown", options: this._opts("snooze_light", ["keep", "dim", "off"]) } }
      },
      { name: "stop_on_light_off", selector: { boolean: {} } }
    ), t;
  }
  _patch(t, e) {
    const s = structuredClone(this._draft);
    if (t === "root")
      Object.assign(s, e), typeof s.time == "string" && (s.time = s.time.slice(0, 5)), s.date || (s.date = null);
    else if (t === "light") {
      const i = e.curve === "custom" && s.light.curve !== "custom";
      Object.assign(s.light, e), i && s.light.points.length < 2 && (s.light.points = structuredClone(De));
    } else
      Object.assign(s.behavior, e);
    this._draft = s;
  }
  _toggleDay(t) {
    const e = new Set(this._draft.days);
    e.has(t) ? e.delete(t) : e.add(t), this._patch("root", { days: [...e].sort(), ...e.size ? { date: null } : {} });
  }
  _presetDays(t) {
    this._patch("root", { days: t, ...t.length ? { date: null } : {} });
  }
  _setPoint(t, e, s) {
    const i = structuredClone(this._draft.light.points), r = Number(s);
    Number.isNaN(r) || (e === "t" ? i[t].t = Math.min(1, Math.max(0, r / 100)) : e === "brightness" ? i[t].brightness = Math.min(100, Math.max(0, r)) : i[t].kelvin = s === "" ? null : Math.min(6500, Math.max(1500, r)), this._patch("light", { points: i }));
  }
  _addPoint() {
    const t = [...this._draft.light.points].sort((r, o) => r.t - o.t);
    let e = 0;
    for (let r = 1; r < t.length - 1; r++)
      t[r + 1].t - t[r].t > t[e + 1].t - t[e].t && (e = r);
    const s = t[e], i = t[e + 1] ?? { t: 1, brightness: 100, kelvin: 4e3 };
    t.splice(e + 1, 0, {
      t: Math.round((s.t + i.t) / 2 * 100) / 100,
      brightness: Math.round((s.brightness + i.brightness) / 2),
      kelvin: s.kelvin && i.kelvin ? Math.round((s.kelvin + i.kelvin) / 2) : s.kelvin ?? i.kelvin ?? null
    }), this._patch("light", { points: t });
  }
  _removePoint(t) {
    const e = this._draft.light.points.filter((s, i) => i !== t);
    this._patch("light", { points: e });
  }
  _save() {
    const t = structuredClone(this._draft);
    t.name = t.name.trim() || a(this.hass, "alarm"), t.light.points = [...t.light.points].sort((e, s) => e.t - s.t), $(this, "daybreak-save", { alarm: t });
  }
  _setMode(t) {
    $(this, "daybreak-mode", { mode: t });
  }
  _form(t, e, s) {
    return c`<ha-form
      .hass=${this.hass}
      .data=${e}
      .schema=${t}
      .computeLabel=${this._label}
      @value-changed=${(i) => this._patch(s, i.detail.value)}
    ></ha-form>`;
  }
  render() {
    const t = this._draft;
    if (!t) return p;
    const e = Ht(this.hass), s = this.hass;
    return c`
      <div class="modes" role="tablist">
        ${["simple", "normal", "expert"].map(
      (i) => c`<button role="tab" class=${i === this.mode ? "sel" : ""} @click=${() => this._setMode(i)}>
            ${a(s, `mode_${i}`)}
          </button>`
    )}
      </div>

      <ha-card>
        <h2><ha-icon icon="mdi:clock-outline"></ha-icon>${a(s, "section_time")}</h2>
        <div class="content">
          ${this._form(this._baseSchema(), t, "root")}
          <div class="label">${a(s, "repeat")}</div>
          <div class="days">
            ${[0, 1, 2, 3, 4, 5, 6].map(
      (i) => c`<button class="day ${t.days.includes(i) ? "sel" : ""}" @click=${() => this._toggleDay(i)}>
                ${e[i]}
              </button>`
    )}
          </div>
          <div class="presets">
            <button @click=${() => this._presetDays([0, 1, 2, 3, 4])}>${a(s, "weekdays")}</button>
            <button @click=${() => this._presetDays([5, 6])}>${a(s, "weekend")}</button>
            <button @click=${() => this._presetDays([0, 1, 2, 3, 4, 5, 6])}>${a(s, "every_day")}</button>
            <button @click=${() => this._presetDays([])}>${a(s, "once")}</button>
          </div>
        </div>
      </ha-card>

      <ha-card>
        <h2><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon>${a(s, "section_light")}</h2>
        <div class="content">${this._form(this._lightSchema(), t.light, "light")}</div>
      </ha-card>

      ${this.mode !== "simple" ? c`<ha-card>
            <h2><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon>${a(s, "section_curve")}</h2>
            <div class="content">
              <daybreak-curve-preview .hass=${s} .light=${t.light}></daybreak-curve-preview>
              ${this._form(this._curveSchema(), t.light, "light")}
              ${t.light.curve === "custom" ? this._renderPoints() : p}
            </div>
          </ha-card>` : c`<ha-card>
            <div class="content">
              <daybreak-curve-preview .hass=${s} .light=${t.light}></daybreak-curve-preview>
            </div>
          </ha-card>`}

      ${this.mode !== "simple" ? c`<ha-card>
            <h2><ha-icon icon="mdi:sleep"></ha-icon>${a(s, "section_behavior")}</h2>
            <div class="content">${this._form(this._behaviorSchema(), t.behavior, "behavior")}</div>
          </ha-card>` : p}

      <div class="footer">
        ${this.isNew ? p : c`<button class="danger" @click=${() => $(this, "daybreak-delete")}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${a(s, "delete")}
            </button>`}
        <span class="spacer"></span>
        <button @click=${() => $(this, "daybreak-cancel")}>${a(s, "cancel")}</button>
        <button class="primary" ?disabled=${this.saving} @click=${this._save}>${a(s, "save")}</button>
      </div>
    `;
  }
  _renderPoints() {
    const t = this.hass, e = this._draft.light.points, s = this._draft.light.use_color_temp;
    return c`
      <div class="label">${a(t, "points")}</div>
      <table class="points">
        <thead>
          <tr>
            <th>${a(t, "point_time")}</th>
            <th>${a(t, "point_brightness")}</th>
            ${s ? c`<th>${a(t, "point_kelvin")}</th>` : p}
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${e.map(
      (i, r) => c`<tr>
              <td><input type="number" min="0" max="100" .value=${String(Math.round(i.t * 100))}
                @change=${(o) => this._setPoint(r, "t", o.target.value)} /></td>
              <td><input type="number" min="0" max="100" .value=${String(i.brightness)}
                @change=${(o) => this._setPoint(r, "brightness", o.target.value)} /></td>
              ${s ? c`<td><input type="number" min="1500" max="6500" step="50" .value=${i.kelvin ? String(i.kelvin) : ""}
                    @change=${(o) => this._setPoint(r, "kelvin", o.target.value)} /></td>` : p}
              <td>
                <button class="icon" title=${a(t, "remove")} ?disabled=${e.length <= 2}
                  @click=${() => this._removePoint(r)}><ha-icon icon="mdi:close"></ha-icon></button>
              </td>
            </tr>`
    )}
        </tbody>
      </table>
      <button class="add" @click=${this._addPoint}><ha-icon icon="mdi:plus"></ha-icon>${a(t, "add_point")}</button>
    `;
  }
};
gt.styles = D`
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
let x = gt;
U([
  _({ attribute: !1 })
], x.prototype, "hass");
U([
  _({ attribute: !1 })
], x.prototype, "alarm");
U([
  _({ attribute: !1 })
], x.prototype, "mode");
U([
  _({ type: Boolean })
], x.prototype, "isNew");
U([
  _({ type: Boolean })
], x.prototype, "saving");
U([
  g()
], x.prototype, "_draft");
customElements.get("daybreak-alarm-editor") || customElements.define("daybreak-alarm-editor", x);
var Ue = Object.defineProperty, F = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (i = o(t, e, i) || i);
  return i && Ue(t, e, i), i;
};
const bt = class bt extends y {
  constructor() {
    super(...arguments), this.controls = !1, this.editable = !1, this.now = Date.now();
  }
  async _action(t, e) {
    if (e?.stopPropagation(), !(!this.hass || !this.alarm))
      try {
        await Kt(this.hass, t, this.alarm.id);
      } catch (s) {
        $(this, "hass-notification", { message: a(this.hass, "error", { msg: s?.message ?? s }) });
      }
  }
  async _toggle(t) {
    if (t.stopPropagation(), !this.hass || !this.alarm) return;
    const e = t.target.checked;
    await Ft(this.hass, this.alarm.id, { enabled: e });
  }
  _open() {
    this.editable && $(this, "daybreak-edit", { alarm: this.alarm });
  }
  _status() {
    const t = this.alarm, e = t.runtime, s = this.hass;
    return e.state === "snoozed" && e.snooze_until ? a(s, "state_snoozed", { time: X(s, e.snooze_until) }) : at.includes(e.state) ? a(s, `state_${e.state}`) : t.skip_date ? a(s, "skipped", { date: B(s, `${t.skip_date}T12:00:00Z`) }) : e.next_alarm ? `${B(s, e.next_alarm)} · ${a(s, "in", { time: mt(e.next_alarm, this.now) })}` : a(s, `state_${e.state}`);
  }
  render() {
    const t = this.alarm;
    if (!t) return p;
    const e = t.runtime, s = at.includes(e.state), i = Object.values(t.light.target).some((r) => r?.length);
    return c`
      <div class="row ${s ? "active" : ""} ${t.enabled ? "" : "off"} ${this.editable ? "clickable" : ""}"
           @click=${this._open}>
        <div class="main">
          <div class="time">${Jt(this.hass, t.time)}</div>
          <div class="meta">
            <div class="name">
              ${t.name}
              ${e.test ? c`<span class="badge">${a(this.hass, "test_badge")}</span>` : p}
            </div>
            <div class="sub">
              ${ze(this.hass, t)}
              ${i && t.light.duration ? c` · <ha-icon icon="mdi:weather-sunset-up"></ha-icon>${t.light.duration} min` : p}
            </div>
            <div class="status">${this._status()}</div>
          </div>
          <ha-switch .checked=${t.enabled} @change=${this._toggle} @click=${(r) => r.stopPropagation()}></ha-switch>
        </div>
        ${s ? c`<div class="actions big">
              ${e.state === "ringing" ? c`<button class="btn" @click=${(r) => this._action("snooze", r)}>
                    <ha-icon icon="mdi:sleep"></ha-icon>${a(this.hass, "snooze")}
                  </button>` : p}
              <button class="btn primary" @click=${(r) => this._action("stop", r)}>
                <ha-icon icon="mdi:alarm-off"></ha-icon>${a(this.hass, "stop")}
              </button>
            </div>` : this.controls && t.enabled ? c`<div class="actions">
                ${t.skip_date ? c`<button class="btn flat" @click=${(r) => this._action("cancel_skip", r)}>
                      <ha-icon icon="mdi:undo"></ha-icon>${a(this.hass, "cancel_skip")}
                    </button>` : e.next_alarm ? c`<button class="btn flat" @click=${(r) => this._action("skip_next", r)}>
                        <ha-icon icon="mdi:debug-step-over"></ha-icon>${a(this.hass, "skip_next")}
                      </button>` : p}
                <button class="btn flat" title=${a(this.hass, "test_hint")} @click=${(r) => this._action("test", r)}>
                  <ha-icon icon="mdi:play-circle-outline"></ha-icon>${a(this.hass, "test")}
                </button>
              </div>` : p}
      </div>
    `;
  }
};
bt.styles = D`
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
let w = bt;
F([
  _({ attribute: !1 })
], w.prototype, "hass");
F([
  _({ attribute: !1 })
], w.prototype, "alarm");
F([
  _({ type: Boolean })
], w.prototype, "controls");
F([
  _({ type: Boolean })
], w.prototype, "editable");
F([
  _({ type: Number })
], w.prototype, "now");
customElements.get("daybreak-alarm-row") || customElements.define("daybreak-alarm-row", w);
var Le = Object.defineProperty, A = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (i = o(t, e, i) || i);
  return i && Le(t, e, i), i;
};
const Qt = "daybreak-editor-mode";
function He() {
  try {
    const n = localStorage.getItem(Qt);
    if (n === "simple" || n === "normal" || n === "expert") return n;
  } catch {
  }
  return "normal";
}
const vt = class vt extends y {
  constructor() {
    super(...arguments), this.narrow = !1, this._mode = He(), this._saving = !1, this._now = Date.now(), this._ready = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this._now = Date.now(), 3e4), _t().then(() => this._ready = !0), this._subscribe();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this._timer), this._unsub?.(), this._unsub = void 0;
  }
  updated(t) {
    t.has("hass") && this._subscribe();
  }
  _subscribe() {
    this._unsub || !this.hass || !this.isConnected || (this._unsub = Zt(this.hass, (t) => this._snapshot = t));
  }
  _new() {
    const t = structuredClone(Oe);
    t.name = a(this.hass, "alarm"), this._editing = { alarm: t };
  }
  _edit(t) {
    const { runtime: e, id: s, ...i } = t.detail.alarm;
    this._editing = { alarm: i, id: s };
  }
  async _save(t) {
    if (!(!this.hass || !this._editing)) {
      this._saving = !0;
      try {
        const e = t.detail.alarm;
        this._editing.id ? await Ft(this.hass, this._editing.id, e) : await Ee(this.hass, e), this._editing = void 0;
      } catch (e) {
        this._notify(a(this.hass, "error", { msg: e?.message ?? String(e) }));
      } finally {
        this._saving = !1;
      }
    }
  }
  async _delete() {
    const t = this._editing;
    !this.hass || !t?.id || confirm(a(this.hass, "delete_confirm", { name: t.alarm.name })) && (await Ce(this.hass, t.id), this._editing = void 0);
  }
  _setMode(t) {
    this._mode = t.detail.mode;
    try {
      localStorage.setItem(Qt, this._mode);
    } catch {
    }
  }
  _notify(t) {
    $(this, "hass-notification", { message: t });
  }
  render() {
    const t = this.hass, e = this._editing;
    return c`
      <div class="toolbar">
        ${e ? c`<button class="icon" title=${a(t, "back")} @click=${() => this._editing = void 0}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>` : c`<ha-menu-button .hass=${t} .narrow=${this.narrow}></ha-menu-button>`}
        <div class="title">${e ? e.alarm.name || a(t, "new_alarm") : a(t, "title")}</div>
      </div>
      <div class="body">
        ${e ? this._renderEditor() : this._renderList()}
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
    const t = this.hass, e = this._snapshot;
    if (!e) return c`<div class="loading">…</div>`;
    const s = e.next, i = s && e.alarms.find((o) => o.id === s.alarm_id), r = [...e.alarms].sort((o, h) => o.time.localeCompare(h.time));
    return c`
      <div class="hero">
        <ha-icon icon="mdi:weather-sunset-up"></ha-icon>
        <div>
          <div class="hero-label">${a(t, "next_alarm")}</div>
          ${s && i ? c`<div class="hero-time">${X(t, s.time)}</div>
                <div class="hero-sub">
                  ${B(t, s.time)} · ${a(t, "in", { time: mt(s.time, this._now) })} ·
                  ${i.name}
                </div>` : c`<div class="hero-sub">${a(t, "no_next")}</div>`}
        </div>
      </div>

      <ha-card>
        ${r.length ? r.map(
      (o) => c`<daybreak-alarm-row
                .hass=${t}
                .alarm=${o}
                .now=${this._now}
                controls
                editable
                @daybreak-edit=${this._edit}
              ></daybreak-alarm-row>`
    ) : c`<div class="empty">${a(t, "no_alarms")}</div>`}
      </ha-card>

      <button class="fab" @click=${this._new}>
        <ha-icon icon="mdi:plus"></ha-icon><span>${a(t, "new_alarm")}</span>
      </button>
    `;
  }
};
vt.styles = D`
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
let v = vt;
A([
  _({ attribute: !1 })
], v.prototype, "hass");
A([
  _({ type: Boolean, reflect: !0 })
], v.prototype, "narrow");
A([
  g()
], v.prototype, "_snapshot");
A([
  g()
], v.prototype, "_editing");
A([
  g()
], v.prototype, "_mode");
A([
  g()
], v.prototype, "_saving");
A([
  g()
], v.prototype, "_now");
A([
  g()
], v.prototype, "_ready");
customElements.get("daybreak-panel") || customElements.define("daybreak-panel", v);
var Re = Object.defineProperty, K = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (i = o(t, e, i) || i);
  return i && Re(t, e, i), i;
};
class P extends y {
  constructor() {
    super(...arguments), this.now = Date.now();
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this.now = Date.now(), 3e4), this._subscribe();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this._timer), this._unsub?.(), this._unsub = void 0;
  }
  updated(t) {
    t.has("hass") && this._subscribe();
  }
  _subscribe() {
    this._unsub || !this.hass || !this.isConnected || (this._unsub = Zt(this.hass, (t) => this.snapshot = t));
  }
}
K([
  _({ attribute: !1 })
], P.prototype, "hass");
K([
  g()
], P.prototype, "snapshot");
K([
  g()
], P.prototype, "now");
const $t = class $t extends P {
  static getConfigElement() {
    return document.createElement("daybreak-alarms-card-editor");
  }
  static getStubConfig() {
    return { show_controls: !0 };
  }
  setConfig(t) {
    this._config = { show_disabled: !0, show_controls: !0, ...t };
  }
  getCardSize() {
    return 1 + (this.snapshot?.alarms.length ?? 2) * 2;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, min_rows: 2 };
  }
  render() {
    const t = this._config;
    if (!t) return p;
    const e = this.hass;
    let s = [...this.snapshot?.alarms ?? []].sort((i, r) => i.time.localeCompare(r.time));
    return t.alarms?.length && (s = s.filter((i) => t.alarms.includes(i.id))), t.show_disabled || (s = s.filter((i) => i.enabled)), c`
      <ha-card .header=${t.title}>
        ${this.snapshot ? s.length ? s.map(
      (i) => c`<daybreak-alarm-row
                  .hass=${e}
                  .alarm=${i}
                  .now=${this.now}
                  .controls=${t.show_controls ?? !0}
                ></daybreak-alarm-row>`
    ) : c`<div class="empty">${a(e, "no_alarms")}</div>` : c`<div class="empty">…</div>`}
      </ha-card>
    `;
  }
};
$t.styles = D`
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
let tt = $t;
K([
  g()
], tt.prototype, "_config");
class Xt extends P {
  constructor() {
    super(...arguments), this._label = (t) => a(this.hass, `c_${t.name}`);
  }
  setConfig(t) {
    this._config = t;
  }
  connectedCallback() {
    super.connectedCallback(), _t().then(() => this.requestUpdate());
  }
  _schema() {
    const t = (this.snapshot?.alarms ?? []).map((e) => ({ value: e.id, label: `${e.time} ${e.name}` }));
    return [
      { name: "title", selector: { text: {} } },
      { name: "alarms", selector: { select: { multiple: !0, mode: "list", options: t } } },
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
      @value-changed=${(t) => $(this, "config-changed", { config: t.detail.value })}
    ></ha-form>` : p;
  }
}
K([
  g()
], Xt.prototype, "_config");
customElements.get("daybreak-alarms-card") || (customElements.define("daybreak-alarms-card", tt), customElements.define("daybreak-alarms-card-editor", Xt));
var je = Object.defineProperty, te = (n, t, e, s) => {
  for (var i = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (i = o(t, e, i) || i);
  return i && je(t, e, i), i;
};
const yt = class yt extends P {
  static getConfigElement() {
    return document.createElement("daybreak-next-card-editor");
  }
  static getStubConfig() {
    return {};
  }
  setConfig(t) {
    this._config = t;
  }
  getCardSize() {
    return 2;
  }
  getGridOptions() {
    return { columns: 6, rows: 2, min_columns: 4, min_rows: 2 };
  }
  _pick() {
    const t = this.snapshot?.alarms ?? [], e = this._config?.alarm ? t.filter((r) => r.id === this._config.alarm) : t, s = e.find((r) => at.includes(r.runtime.state)), i = e.filter((r) => r.runtime.next_alarm).sort((r, o) => r.runtime.next_alarm.localeCompare(o.runtime.next_alarm));
    return { active: s, alarm: i[0] };
  }
  async _act(t, e) {
    try {
      await Kt(this.hass, t, e.id);
    } catch (s) {
      $(this, "hass-notification", { message: a(this.hass, "error", { msg: s?.message ?? s }) });
    }
  }
  render() {
    if (!this._config) return p;
    const t = this.hass, { alarm: e, active: s } = this._pick();
    if (s) {
      const i = s.runtime, r = i.state === "snoozed" && i.snooze_until ? a(t, "state_snoozed", { time: X(t, i.snooze_until) }) : a(t, `state_${i.state}`);
      return c`<ha-card class="active">
        <div class="top">
          <ha-icon icon="mdi:weather-sunset-up"></ha-icon>
          <div>
            <div class="time">${Jt(t, s.time)}</div>
            <div class="sub">${s.name} · ${r}</div>
          </div>
        </div>
        <div class="buttons">
          ${i.state === "ringing" ? c`<button @click=${() => this._act("snooze", s)}>
                <ha-icon icon="mdi:sleep"></ha-icon>${a(t, "snooze")}
              </button>` : p}
          <button class="primary" @click=${() => this._act("stop", s)}>
            <ha-icon icon="mdi:alarm-off"></ha-icon>${a(t, "stop")}
          </button>
        </div>
      </ha-card>`;
    }
    return c`<ha-card>
      <div class="top">
        <ha-icon icon=${e ? "mdi:alarm" : "mdi:alarm-off"}></ha-icon>
        <div>
          ${e?.runtime.next_alarm ? c`<div class="time">${X(t, e.runtime.next_alarm)}</div>
                <div class="sub">
                  ${B(t, e.runtime.next_alarm)} ·
                  ${a(t, "in", { time: mt(e.runtime.next_alarm, this.now) })}
                </div>
                <div class="sub">${e.name}</div>` : c`<div class="sub">${this.snapshot ? a(t, "no_next") : "…"}</div>`}
        </div>
      </div>
    </ha-card>`;
  }
};
yt.styles = D`
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
let et = yt;
te([
  g()
], et.prototype, "_config");
class ee extends P {
  setConfig(t) {
    this._config = t;
  }
  connectedCallback() {
    super.connectedCallback(), _t().then(() => this.requestUpdate());
  }
  render() {
    if (!this._config) return p;
    const e = [{ name: "alarm", selector: { select: { mode: "dropdown", options: (this.snapshot?.alarms ?? []).map((s) => ({ value: s.id, label: `${s.time} ${s.name}` })) } } }];
    return c`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${e}
      .computeLabel=${() => a(this.hass, "c_alarms")}
      @value-changed=${(s) => $(this, "config-changed", { config: s.detail.value })}
    ></ha-form>`;
  }
}
te([
  g()
], ee.prototype, "_config");
customElements.get("daybreak-next-card") || (customElements.define("daybreak-next-card", et), customElements.define("daybreak-next-card-editor", ee));
const G = document.querySelector("home-assistant")?.hass;
window.customCards = window.customCards || [];
for (const n of [
  { type: "daybreak-alarms-card", name: a(G, "card_name"), description: a(G, "card_desc") },
  { type: "daybreak-next-card", name: a(G, "next_card_name"), description: a(G, "next_card_desc") }
])
  window.customCards.some((t) => t.type === n.type) || window.customCards.push({ ...n, preview: !0 });
console.info("%c DAYBREAK %c 0.1.0 ", "color:#3a2410;background:#ffcf7a;font-weight:bold", "color:#ffcf7a;background:#3a2410");
