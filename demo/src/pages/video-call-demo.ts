import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../../../packages/zero-ui/src/video-call/zui-video-call.js';
import '../components/demo-page';
import '../components/demo-example';

@customElement('video-call-demo')
export class VideoCallDemo extends LitElement {
  static styles = css`
    .demo-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .instruction-card {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        color: #93c5fd;
    }
  `;

  render() {
    return html`
      <demo-page
        name="Video Call (P2P)"
        description="WebRTC video call demo using local browser signaling."
      >
        <div class="demo-wrapper">
          <div class="instruction-card">
             <strong>How to test:</strong>
             <ol>
               <li>Open this page in a <b>New Tab</b> (so you have two tabs open).</li>
               <li>Grant camera permissions in both tabs.</li>
               <li>Click <b>Start Call</b> in one of the tabs.</li>
               <li>The other tab should automatically answer (via BroadcastChannel signaling).</li>
             </ol>
          </div>

          <zui-video-call></zui-video-call>
        </div>
      </demo-page>
    `;
  }
}
