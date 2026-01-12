import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { CameraCheckService } from '../services/camera.service.js';
import { ZuiWebRtcPeer, type PeerConnectionState } from '../webrtc/zui-webrtc-peer.js';
import { BroadcastChannelSignalProvider, ManualSignalProvider, type SignalProvider } from '../webrtc/signaling.js';

@customElement('zui-video-call')
export class ZuiVideoCall extends LitElement {
  @state() private _localStream: MediaStream | null = null;
  @state() private _connectionState: PeerConnectionState = 'new';
  @state() private _myId: string = Math.random().toString(36).substring(7);
  @state() private _isCallStarted = false;
  
  // Manual Signaling State
  @state() private _signalingMode: 'broadcast' | 'manual' = 'broadcast';
  @state() private _manualSignalOut: string = '';
  @state() private _manualSignalIn: string = '';

  private _peer: ZuiWebRtcPeer | null = null;
  private _manualSignalProvider: ManualSignalProvider | null = null;

  @query('#remote-video') private _remoteVideo!: HTMLVideoElement;

  static styles = css`
    :host {
      display: block;
      font-family: 'Inter', sans-serif;
    }

    .call-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      background: #1e293b;
      padding: 16px;
      border-radius: 12px;
      position: relative;
    }

    .video-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .video-wrapper {
      position: relative;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      aspect-ratio: 16/9;
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .local-video-wrapper {
        border: 2px solid #3b82f6;
    }

    .label {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(0,0,0,0.6);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    .controls, .mode-switch {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 16px;
      flex-wrap: wrap;
    }

    button {
      padding: 10px 24px;
      border-radius: 24px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.1s;
    }

    button:active { transform: scale(0.95); }

    .btn-start { background: #10b981; color: white; }
    .btn-hangup { background: #ef4444; color: white; }
    .btn-copy { background: #3b82f6; color: white; padding: 6px 12px; font-size: 0.8rem; }
    .btn-submit { background: #8b5cf6; color: white; padding: 6px 12px; font-size: 0.8rem; }

    .status-overlay {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(0,0,0,0.5);
      color: #fff;
    }
    
    .status-checking { color: #facc15; }
    .status-connected { color: #34d399; }
    .status-disconnected { color: #f87171; }

    .manual-box {
        background: rgba(0,0,0,0.2);
        padding: 12px;
        border-radius: 8px;
        margin-top: 16px;
    }
    
    .manual-row {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
    }

    textarea {
        flex: 1;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff;
        border-radius: 4px;
        padding: 8px;
        font-family: monospace;
        font-size: 0.8rem;
        resize: vertical;
        min-height: 60px;
    }

    .mode-select {
        background: #334155;
        color: white;
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #475569;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this._startLocalVideo();
    this._initPeer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopLocalVideo();
    this._peer?.close();
  }

  private async _startLocalVideo() {
    try {
      this._localStream = await CameraCheckService.getStream();
    } catch (e) {
      console.error('Failed to get camera', e);
    }
  }

  private _stopLocalVideo() {
    this._localStream?.getTracks().forEach(track => track.stop());
  }

  private _outgoingBuffer: any[] = [];

  private _initPeer() {
    // Clean up old
    this._peer?.close();
    this._isCallStarted = false;
    this._manualSignalOut = '';
    this._outgoingBuffer = [];

    let signal: SignalProvider;

    if (this._signalingMode === 'broadcast') {
        signal = new BroadcastChannelSignalProvider('demo-call');
    } else {
        this._manualSignalProvider = new ManualSignalProvider();
        this._manualSignalProvider.onOutgoing = (msg) => {
            console.log('Manual Signal Outgoing:', msg);
            this._outgoingBuffer.push(msg);
            this._manualSignalOut = JSON.stringify(this._outgoingBuffer);
            this.requestUpdate();
        };
        signal = this._manualSignalProvider;
    }

    this._peer = new ZuiWebRtcPeer(signal, this._myId);
    
    this._peer.onTrack = (_track, stream) => {
      if (this._remoteVideo) {
        this._remoteVideo.srcObject = stream;
        this._remoteVideo.play().catch(e => console.error('Remote play failed', e));
      }
    };

    this._peer.onConnectionStateChange = (state) => {
      this._connectionState = state;
      this.requestUpdate();
    };

    this._peer.start();
  }

  private async _startCall() {
    this._isCallStarted = true;
    if (this._localStream && this._peer) {
        this._localStream.getTracks().forEach(track => {
            this._peer!.addTrack(track, this._localStream!);
        });
        await this._peer.call();
    }
  }

  private _handleModeChange(e: Event) {
      const mode = (e.target as HTMLSelectElement).value as any;
      if (mode !== this._signalingMode) {
          this._signalingMode = mode;
          this._initPeer(); // Re-init with new signal provider
      }
  }

  private _injectManualSignal() {
      if (!this._manualSignalIn || !this._manualSignalProvider) return;
      try {
          const content = JSON.parse(this._manualSignalIn);
          const messages = Array.isArray(content) ? content : [content];
          
          for (const msg of messages) {
             this._manualSignalProvider.injectMessage(msg);
          }
          
          this._manualSignalIn = ''; // Clear after injection
          
          // Auto-start peer if we received an offer and haven't started (though usually start() is called on init)
          // But we need to ensure local tracks are added if we are ANSWERING manual call
          if (!this._isCallStarted) {
             this._isCallStarted = true;
             if (this._localStream && this._peer) {
                this._localStream.getTracks().forEach(track => {
                    this._peer!.addTrack(track, this._localStream!);
                });
             }
          }

      } catch (e) {
          alert('Invalid Signal JSON');
      }
  }

  render() {
    return html`
      <div class="call-container">
        <div class="status-overlay status-${this._connectionState}">
          ${this._connectionState}
        </div>

        <div class="video-grid">
          <!-- Local Video -->
          <div class="video-wrapper local-video-wrapper">
            <video .srcObject=${this._localStream} @loadedmetadata=${(e: any) => e.target.play()} muted playsinline></video>
            <div class="label">You (${this._myId})</div>
          </div>

          <!-- Remote Video -->
          <div class="video-wrapper">
            <video id="remote-video" playsinline autoplay></video>
            <div class="label">Remote Peer</div>
          </div>
        </div>

        <div class="controls">
             <div class="mode-switch">
                <select class="mode-select" @change=${this._handleModeChange} ?disabled=${this._isCallStarted}>
                    <option value="broadcast" ?selected=${this._signalingMode === 'broadcast'}>Local Tab (BroadcastChannel)</option>
                    <option value="manual" ?selected=${this._signalingMode === 'manual'}>Cross-Browser (Manual)</option>
                </select>
            </div>

          ${this._isCallStarted 
            ? html`<button class="btn-hangup" @click=${() => location.reload()}>End Call</button>`
            : html`<button class="btn-start" @click=${this._startCall}>Start Call</button>`
          }
        </div>

        ${this._signalingMode === 'manual' ? html`
            <div class="manual-box">
                <div class="manual-row">
                    <div style="flex:1">
                        <div style="font-size:0.8rem; color:#9ca3af; margin-bottom:4px;">1. Copy this to other browser:</div>
                        <textarea readonly .value=${this._manualSignalOut} @click=${(e:any) => e.target.select()} placeholder="Outgoing signal will appear here..."></textarea>
                    </div>
                    <div style="flex:1">
                        <div style="font-size:0.8rem; color:#9ca3af; margin-bottom:4px;">2. Paste response from other browser:</div>
                        <textarea .value=${this._manualSignalIn} @input=${(e:any) => this._manualSignalIn = e.target.value} placeholder="Paste incoming signal here..."></textarea>
                        <button class="btn-submit" @click=${this._injectManualSignal} ?disabled=${!this._manualSignalIn}>Process Signal</button>
                    </div>
                </div>
                <div style="font-size: 0.75rem; color: #64748b; margin-top: 8px;">
                    <b>Instructions:</b> One peer clicks "Start Call" to generate Offer. Copy Offer to Peer B. Peer B processes Offer, generating Answer. Copy Answer back to Peer A. Copy candidates if needed.
                </div>
            </div>
        ` : ''}

      </div>
    `;
  }
}

