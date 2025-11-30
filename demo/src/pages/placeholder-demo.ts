import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('placeholder-demo')
export class PlaceholderDemo extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      color: var(--text-muted);
      padding: 2rem;
      box-sizing: border-box;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.125rem;
      max-width: 500px;
      line-height: 1.5;
    }

    .icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }
  `;

  @property({ type: String })
  componentName = 'Component';

  render() {
    return html`
      <div class="icon">🚧</div>
      <h1>${this.componentName}</h1>
      <p>This component is planned for a future release. Stay tuned!</p>
    `;
  }
}
