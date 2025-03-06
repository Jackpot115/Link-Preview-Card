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
      url: "URL",

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
      
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--embedd-component-label-font-size, var(--ddd-font-size-s));
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

      .emb-img {
        width: 200px;
        height: 200px;
      }

    `];
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
<slot></slot>
  <h3><span>${this.t.title}:</span> <a href="${this.url}">${this.url}</a>
  <div class="loader"></div>
  <div><img class="emb-img" src="https://t4.ftcdn.net/jpg/01/43/42/83/240_F_143428338_gcxw3Jcd0tJpkvvb53pfEztwtU9sxsgT.jpg" /></div>
</div>`;
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