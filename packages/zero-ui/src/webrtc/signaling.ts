export interface SignalMessage {
  type: 'offer' | 'answer' | 'candidate';
  payload: any;
  senderId: string;
  targetId?: string;
}

export interface SignalProvider {
  connect(myId: string): void;
  disconnect(): void;
  send(message: SignalMessage): void;
  onMessage(callback: (message: SignalMessage) => void): void;
}

export class BroadcastChannelSignalProvider implements SignalProvider {
  private _channel: BroadcastChannel;
  private _callback: ((message: SignalMessage) => void) | null = null;
  private _myId: string = '';

  constructor(channelName: string = 'zui-webrtc-signaling') {
    this._channel = new BroadcastChannel(channelName);
    this._channel.onmessage = this._handleMessage;
  }

  connect(myId: string) {
    this._myId = myId;
  }

  disconnect() {
    this._channel.close();
  }

  send(message: SignalMessage) {
    this._channel.postMessage(message);
  }

  onMessage(callback: (message: SignalMessage) => void) {
    this._callback = callback;
  }

  private _handleMessage = (event: MessageEvent) => {
    const message = event.data as SignalMessage;
    if (message.senderId === this._myId) return;
    
    if (this._callback) {
      this._callback(message);
    }
  };
}

export class ManualSignalProvider implements SignalProvider {
  private _callback: ((message: SignalMessage) => void) | null = null;
  public onOutgoing: ((message: SignalMessage) => void) | null = null;
  connect(_myId: string) {
    // ID not needed for manual
  }

  disconnect() {
    this._callback = null;
  }

  send(message: SignalMessage) {
    console.log('ManualSignalProvider.send:', message);
    if (this.onOutgoing) {
      this.onOutgoing(message);
    }
  }

  onMessage(callback: (message: SignalMessage) => void) {
    this._callback = callback;
  }

  // Helper to manually inject incoming message
  public injectMessage(message: SignalMessage) {
    if (this._callback) {
      this._callback(message);
    }
  }
}

