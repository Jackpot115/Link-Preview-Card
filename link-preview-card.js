/**
 * Copyright 2025 Matt C
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `Link-Preview-Card`
 * 
 * @demo index.html
 * @element embedd-component
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "",
      url: "",
      data: null,
      error: false,
      loading: false
    };

  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      image: { type: String },
      url: { type: String },
      data: { type: Object },
      loading: { type: Boolean, reflect: true, attribute: "loading" },
      error: { type: Boolean },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
     :host {
      display: block;
      color: var(--ddd-theme-primary-2);
      font-family: var('--ddd-font-primary', sans-serif);
      border: var(--ddd-primary, #ccc);
      border-radius: var(--ddd-border-radius, 5px);
      padding: var(--ddd-spacing-4);
      max-width: 500px;
    }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }

      h3 span {
        font-size: var(--embedd-component-label-font-size, var(--ddd-font-size-s));
      }


    .preview {
      display: flex;
      flex-direction: column;
      gap: var(--ddd-spacing-2);
    }

    //Link color

    .preview img {
      width: 100%;
      border-radius: var(--ddd-border-radius-2);
    }

    .preview a {
      font-weight: var(--ddd-font-weight-bold, bold);
      color: var(--ddd-primary, #005bbb);
      text-decoration: none;
    }

    @media (max-width: 600px) {
      :host {
        max-width: 300px;
        padding: var(--ddd-spacing-3);
      }
    }

    // The Spinner  

    .loading {
      text-align: center;
    }

      .loader-spinner {
        border: 16px solid #f3f3f3;
        border-top: 16px solid #FF0000; 
        border-radius: 50%;
        width: 100px;
        height: 100px;
        animation: spin 2s linear infinite;
        }

        @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
        }

        // The parts

        ::part(header) {
        font-size: var(--embedd-component-header-font-size, 1.5rem);
        font-weight: var(--embedd-component-header-font-weight, bold);
        color: var(--embedd-component-header-color, black);
      }

      ::part(link) {
        color: var(--embedd-component-link-color, blue);
        text-decoration: var(--embedd-component-link-decoration, none);
      }

      ::part(description) {
        font-size: var(--embedd-component-description-font-size, 1rem);
        color: var(--embedd-component-description-color, #333);
      }

    `];
  }

  // JSON grabbing the data

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

      this.title = this.data["og:title"] || "No Title Available";
    } catch (e) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }


  updated(changedProperties) {
    if (changedProperties.has("url") && this.url) {
      this.fetchPreview(this.url);
    }
  }

  // Updating the title to change colors based on the URL

  DefaultTheme() {
    if (this.url.includes("psu.edu")) {
      return "--ddd-primary-2"
    }
    else {
      return "--ddd-primary-20";
    }
  }



  // Lit render the HTML
  render() {

    if (this.loading) {
      return html`
        <div class="loading">
          <div class="loader-spinner"></div>
        </div>
      `;
    }

    if (this.error || !this.data) {
      return html`<div class="error">No preview available</div>`;
    }
    
    return html`
      <div class="preview">
        <h2>${this.title}</h2>
        <a href="${this.url}" target="_blank">${this.data["og:title"] || this.url}</a>
        <p>${this.data["og:description"] || "No description available"}</p>
        ${this.data["og:image"]
          ? html`<img src="${this.data["og:image"]}" alt="Preview Image">`
          : ""}
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

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);
