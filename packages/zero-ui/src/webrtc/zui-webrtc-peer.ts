import { type SignalProvider, type SignalMessage } from './signaling.js';

export type PeerConnectionState = RTCPeerConnectionState;

export class ZuiWebRtcPeer {
  private _pc: RTCPeerConnection | null = null;
  private _signal: SignalProvider;
  private _myId: string;
  private _remoteId: string | null = null;
  
  public onTrack: ((track: MediaStreamTrack, stream: MediaStream) => void) | null = null;
  public onConnectionStateChange: ((state: PeerConnectionState) => void) | null = null;

  constructor(signalProvider: SignalProvider, myId: string) {
    this._signal = signalProvider;
    this._myId = myId;
    this._signal.onMessage(this._handleSignal);
  }

  public async start(config: RTCConfiguration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }) {
    this._pc = new RTCPeerConnection(config);
    
    this._pc.onicecandidate = (event) => {
      if (event.candidate) {
        this._signal.send({
          type: 'candidate',
          payload: event.candidate.toJSON(),
          senderId: this._myId
        });
      }
    };

    this._pc.ontrack = (event) => {
      if (this.onTrack) {
        this.onTrack(event.track, event.streams[0]);
      }
    };

    this._pc.onconnectionstatechange = () => {
        if (this.onConnectionStateChange && this._pc) {
            this.onConnectionStateChange(this._pc.connectionState);
        }
    };

    this._signal.connect(this._myId);
  }

  public addTrack(track: MediaStreamTrack, stream: MediaStream) {
    if (this._pc) {
      this._pc.addTrack(track, stream);
    }
  }

  public async call() {
    if (!this._pc) return;
    
    const offer = await this._pc.createOffer();
    await this._pc.setLocalDescription(offer);
    
    this._signal.send({
      type: 'offer',
      payload: offer,
      senderId: this._myId
    });
  }

  public close() {
    if (this._pc) {
      this._pc.close();
      this._pc = null;
    }
  //  this._signal.disconnect(); // Keep signal open for re-connect scenarios or let consumer handle
  }

  private _handleSignal = async (message: SignalMessage) => {
    if (!this._pc) return;

    try {
      if (message.type === 'offer') {
          // Implicitly accept call from anyone in this demo
          this._remoteId = message.senderId;
          await this._pc.setRemoteDescription(new RTCSessionDescription(message.payload));
          
          const answer = await this._pc.createAnswer();
          await this._pc.setLocalDescription(answer);
          
          this._signal.send({
            type: 'answer',
            payload: answer,
            senderId: this._myId,
            targetId: this._remoteId // target the caller
          });

      } else if (message.type === 'answer') {
          await this._pc.setRemoteDescription(new RTCSessionDescription(message.payload));
      
      } else if (message.type === 'candidate') {
          await this._pc.addIceCandidate(new RTCIceCandidate(message.payload));
      }
    } catch (e) {
      console.error('Signaling Error:', e);
    }
  };
}
