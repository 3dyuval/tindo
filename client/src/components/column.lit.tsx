import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";


@customElement("tin-column")
export class Column extends LitElement {
  static styles = css`
      :host {
          display: flex;
          flex-direction: column;
      }
  `;

  @property() title: any = "doing";

  columnTemplate() {
    return html`
        <div class="column">
            <h2>${this.title}</h2>
        </div>
    `;
  }

  render() {
    return html`
        ${this.columnTemplate()}
        <slot name="column-content"></slot>
    `;
  }
}