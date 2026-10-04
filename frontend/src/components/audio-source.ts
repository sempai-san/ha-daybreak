import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { maSearch, type AudioSource, type HomeAssistant, type MaItem } from "../api";
import { errorText, t, type StringKey } from "../i18n";
import { shared } from "../styles";
import { fireEvent } from "../util";

const TYPES: AudioSource["type"][] = ["music_assistant", "url", "none"];
const MEDIA: AudioSource["media_type"][] = ["playlist", "radio", "album", "track", "artist"];

/**
 * What to play: Music Assistant (with search), a sound URL or nothing.
 * Emits "source-change" with the complete source.
 */
export class DbAudioSource extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) source!: AudioSource;
  @property({ type: Boolean }) hasMusicAssistant = true;
  /** Label of the "none" choice (e.g. "keep the alarm's music"). */
  @property() noneLabel = "";
  @state() private _query = "";
  @state() private _type: AudioSource["media_type"] | "" = "";
  @state() private _results?: MaItem[];
  @state() private _busy = false;
  @state() private _error = "";

  static styles = [
    shared,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .results {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--db-line);
        border-radius: 12px;
        max-height: 300px;
        overflow: auto;
      }
      .item {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 48px;
        padding: 6px 10px;
        border: none;
        background: none;
        cursor: pointer;
        text-align: left;
      }
      .item:hover {
        background: var(--db-tile);
      }
      .item img,
      .item .ph {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        object-fit: cover;
        background: var(--db-tile);
        flex: none;
      }
      .chosen {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--db-accent) 12%, transparent);
      }
      .search {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .search input {
        flex: 1;
        min-width: 160px;
      }
    `,
  ];

  private _set(change: Partial<AudioSource>) {
    fireEvent(this, "source-change", { ...this.source, ...change });
  }

  private async _search() {
    if (!this.hass || !this._query.trim()) return;
    this._busy = true;
    this._error = "";
    try {
      this._results = await maSearch(this.hass, this._query.trim(), this._type || undefined);
    } catch (err) {
      this._error = errorText(this.hass, err);
      this._results = undefined;
    } finally {
      this._busy = false;
    }
  }

  render() {
    const hass = this.hass;
    const s = this.source;
    if (!s) return nothing;
    return html`
      <div class="seg" role="group">
        ${TYPES.map(
          (ty) => html`<button aria-pressed=${s.type === ty} @click=${() => this._set({ type: ty })}>
            ${ty === "none" && this.noneLabel ? this.noneLabel : t(hass, `src_${ty}` as StringKey)}
          </button>`,
        )}
      </div>
      ${s.type === "music_assistant"
        ? html`${!this.hasMusicAssistant ? html`<div class="muted">${t(hass, "ma_missing")}</div>` : nothing}
            ${s.media_id
              ? html`<div class="chosen">
                  <span class="grow"><b>${s.name || s.media_id}</b>
                    <div class="muted">${t(hass, `media_${s.media_type}` as StringKey)}</div></span>
                  <button class="btn" @click=${() => this._set({ media_id: "", name: "" })}>${t(hass, "change")}</button>
                </div>`
              : html`<div class="search">
                    <input class="inp" type="search" placeholder=${t(hass, "ma_search_ph")} .value=${this._query}
                      @input=${(e: Event) => (this._query = (e.target as HTMLInputElement).value)}
                      @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this._search()} />
                    <select class="inp" @change=${(e: Event) => (this._type = (e.target as HTMLSelectElement).value as AudioSource["media_type"])}>
                      <option value="">${t(hass, "media_all")}</option>
                      ${MEDIA.map((m) => html`<option value=${m} ?selected=${this._type === m}>${t(hass, `media_${m}` as StringKey)}</option>`)}
                    </select>
                    <button class="btn primary" ?disabled=${this._busy} @click=${this._search}>${t(hass, "search")}</button>
                  </div>
                  ${this._error ? html`<div class="muted">${this._error}</div>` : nothing}
                  ${this._results
                    ? this._results.length
                      ? html`<div class="results">
                          ${this._results.map(
                            (r) => html`<button class="item" @click=${() =>
                              this._set({ media_id: r.uri, media_type: r.media_type, name: r.artist ? `${r.name} – ${r.artist}` : r.name })}>
                              ${r.image ? html`<img src=${r.image} alt="" />` : html`<span class="ph"></span>`}
                              <span class="grow"><div>${r.name}</div>
                                <div class="muted">${t(hass, `media_${r.media_type}` as StringKey)}${r.artist ? ` · ${r.artist}` : ""}</div></span>
                            </button>`,
                          )}
                        </div>`
                      : html`<div class="muted">${t(hass, "picker_none")}</div>`
                    : nothing}
                  <details>
                    <summary class="muted">${t(hass, "ma_manual")}</summary>
                    <div class="search" style="margin-top:8px">
                      <input class="inp" placeholder="library://playlist/1" .value=${s.media_id}
                        @change=${(e: Event) => this._set({ media_id: (e.target as HTMLInputElement).value.trim(), name: "" })} />
                    </div>
                  </details>`}`
        : nothing}
      ${s.type === "url"
        ? html`<input class="inp" type="url" placeholder="https://… / media-source://…" .value=${s.url}
              @change=${(e: Event) => this._set({ url: (e.target as HTMLInputElement).value.trim() })} />
            <div class="muted">${t(hass, "url_hint")}</div>`
        : nothing}
    `;
  }
}

customElements.define("db-audio-source", DbAudioSource);
