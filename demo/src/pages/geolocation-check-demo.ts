import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/geolocation-check';

@customElement('geolocation-check-demo')
export class GeolocationCheckDemo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
      color: white;
    }

    h1 {
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .description {
      margin-bottom: 30px;
      color: #9ca3af;
      line-height: 1.6;
    }

    .demo-container {
      max-width: 500px;
    }
  `;

  render() {
    return html`
      <h1>Geolocation Check Component</h1>
      <p class="description">
        The <code>&lt;zui-geolocation-check&gt;</code> component uses the Geolocation API to retrieve your current position.
        It handles permissions, errors, and displays coordinates with a link to open them in a map.
      </p>

      <div class="demo-container">
        <zui-geolocation-check></zui-geolocation-check>
      </div>
    `;
  }
}
