/**
 * Copyright 2025 Matt C
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `embedd-component`
 * 
 * @demo index.html
 * @element embedd-component
 */
export class EmbeddComponent extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "embedd-component";
  }

  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Link",
      url: "",
      data: null,
      loading: false,
      error: false,
    };

    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/embedd-component.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      image: { type: String },
      url: { type: String },
      data: { type: Object },
      loading: { type: Boolean },
      error: { type: Boolean },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
     :host {
      display: block;
      font-family: Arial, sans-serif;
      border: 1px solid var(--ddd-primary, #ccc);
      border-radius: 8px;
      padding: 16px;
      max-width: 400px;
      background: brown;
    }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--embedd-component-label-font-size, var(--ddd-font-size-s));
      }

      .loading {
      text-align: center;
    }

    .error {
      color: red;
      text-align: center;
    }

    .preview {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .preview img {
      width: 100%;
      border-radius: 5px;
    }

    .preview a {
      font-weight: bold;
      color: var(--ddd-primary, #005bbb);
      text-decoration: none;
    }

    .metadata {
      font-size: 12px;
      color: #555;
      background: #f9f9f9;
      padding: 10px;
      border-radius: 5px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    @media (max-width: 600px) {
      :host {
        max-width: 300px;
        padding: 10px;
      }
    }

    //To toggle the loader spinner 

    :host([fancy]) .loader {
        display: none;
      }
      
      .loader {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #FF0000; /* Blue */
        border-radius: 50%;
        width: 100px;
        height: 100px;
        animation: spin 2s linear infinite;
        }

        @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
        }

/**


      .emb-img {
        width: 200px;
        height: 200px;
      }
 */

    `];
  }

  firstUpdated() {
    this.fetchPreview();
  }

  async fetchPreview() {
    if (!this.url) return;
    this.loading = true;
    this.error = false;

    try {
      const response = await fetch(`https://open-apis.hax.cloud/api/services/website/metadata?q=${this.url}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const json = await response.json();
      this.data = json.data;
    } catch (e) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  updated(changedProperties) {
    if (changedProperties.has("url")) {
      this.fetchPreview();
    }
  }



  // Lit render the HTML
  render() {
    if (this.loading) {
      return html`<div class="loading">Loading...</div>`;
    }

    if (this.error || !this.data) {
      return html`<div class="error">No preview available</div>`;
    }
    
    return html`
<div class="preview">
        <a href="${this.url}" target="_blank">${this.data["og:title"] || this.url}</a>
        <p>${this.data["og:description"] || "No description available"}</p>
        ${this.data["og:image"]
          ? html`<img src="${this.data["og:image"]}" alt="Preview Image">`
          : ""}
      </div>
      <div class="metadata">
        ${JSON.stringify(this.data, null, 2)}
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(EmbeddComponent.tag, EmbeddComponent);