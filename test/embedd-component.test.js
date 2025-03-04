import { html, fixture, expect } from '@open-wc/testing';
import "../embedd-component.js";

describe("EmbeddComponent test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <embedd-component
        title="title"
      ></embedd-component>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
