import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@deepverse/zero-ui/mic-check';

@customElement('mic-check-demo')
export class MicCheckDemo extends LitElement {
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
      max-width: 600px;
      display: grid;
      gap: 24px;
    }
  `;

  render() {
    return html`
      <h1>Microphone Check Component</h1>
      <p class="description">
        The <code>&lt;zui-mic-check&gt;</code> component manages microphone permissions and verifies audio input.
        It features an integrated visualizer to visually confirm that the microphone is capturing sound.
      </p>

      <div class="demo-container">
        <!-- Default with visualizer enabled -->
        <zui-mic-check showVisualizer></zui-mic-check>
      </div>
    `;
  }
}
