import { EventBusService } from './event-bus.service.js';

export type ConnectionState = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';

export interface ConnectOptions {
  secure?: boolean;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  mock?: boolean;
  encryption?: {
    enabled: boolean;
  };
}

export interface ZuiSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp?: number;
  channel?: string;
  source?: 'client' | 'server';
}

type MessageHandler<T = any> = (payload: T) => void;

export class ZuiSocketService {
  private static _state: ConnectionState = 'idle';
  private static _ws: WebSocket | null = null;
  private static _url: string = '';
  private static _options: ConnectOptions = {
    secure: true,
    autoReconnect: true,
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
    mock: false
  };
  
  private static _reconnectAttempts = 0;
  private static _reconnectTimer: any = null;
  private static _channels: Set<string> = new Set();
  
  // Local event handlers map: type -> Set<Handler>
  private static _handlers: Map<string, Set<MessageHandler>> = new Map();

  // Encryption
  private static _encryptionKey: CryptoKey | null = null;
  private static _iv: Uint8Array | null = null; // In real-world, IV should be unique per message or managed carefully

  static async connect(url: string, options?: ConnectOptions) {
    this._url = url;
    this._options = { ...this._options, ...options };
    
    // Enforce WSS in production if not specifically disabled or localhost
    if (this._options.secure && !this._url.startsWith('wss://') && !this._url.startsWith('ws://localhost') && !this._url.startsWith('ws://127.0.0.1')) {
       console.error('[ZuiSocket] Security Error: WSS is required for non-localhost connections.');
       this._state = 'error';
       this._notifyStateChange();
       EventBusService.emit('socket:error', { message: 'WSS required' }, 'ZuiSocketService');
       return;
    }

    if (this._options.encryption?.enabled) {
      await this._generateSessionKey();
    }

    if (this._options.mock) {
      this._simulateConnection();
      return;
    }

    if (this._state === 'connected' || this._state === 'connecting') {
      console.warn('[ZuiSocket] Already connected or connecting.');
      return;
    }

    this._attemptConnection();
  }

  static disconnect() {
    this._state = 'disconnected';
    if (this._ws) {
      this._ws.close();
      this._ws = null;
    }
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = null;
    }
    this._encryptionKey = null;
    this._notifyStateChange();
    EventBusService.emit('socket:disconnected', null, 'ZuiSocketService');
  }

  static join(channel: string, meta?: any) {
    if (!this._channels.has(channel)) {
      this._channels.add(channel);
      this.send('sys:join', { channel, meta });
      EventBusService.emit('socket:joined', { channel }, 'ZuiSocketService');
    }
  }

  static leave(channel: string) {
    if (this._channels.has(channel)) {
      this._channels.delete(channel);
      this.send('sys:leave', { channel });
      EventBusService.emit('socket:left', { channel }, 'ZuiSocketService');
    }
  }

  static async send<T>(type: string, payload: T) {
    if (this._state !== 'connected' && !this._options.mock) {
      console.warn('[ZuiSocket] Cannot send message, socket is not connected.');
      return;
    }

    let finalPayload: any = payload;
    let encrypted = false;

    if (this._options.encryption?.enabled && this._encryptionKey) {
        try {
            finalPayload = await this._encryptPayload(payload);
            encrypted = true;
        } catch (e) {
            console.error('[ZuiSocket] Encryption failed', e);
            return;
        }
    }

    const message: ZuiSocketMessage<any> = {
      type,
      payload: finalPayload,
      timestamp: Date.now(),
      source: 'client'
    };

    if (encrypted) {
        (message as any).encrypted = true;
    }

    if (this._options.mock) {
      this._mockSend(message);
      return;
    }

    this._ws?.send(JSON.stringify(message));
  }

  static sendTo<T>(channel: string, type: string, payload: T) {
     // For this implementation, we just wrap send but ensure channel is in payload or logic
     // In a real implementation we might wrap the whole message in a channel envelope.
     // Here we will use a convention or if the server supports it directly.
     // For simplicity and matching the previous interface:
     this.send(type, { ...payload, _targetChannel: channel });
  }

  static on<T>(type: string, handler: MessageHandler<T>) {
    if (!this._handlers.has(type)) {
      this._handlers.set(type, new Set());
    }
    this._handlers.get(type)!.add(handler as MessageHandler);
  }

  static off(type: string, handler?: MessageHandler) {
    if (!handler) {
      this._handlers.delete(type);
    } else {
      this._handlers.get(type)?.delete(handler);
    }
  }

  static getState(): ConnectionState {
    return this._state;
  }

  // --- Private Implementation ---

  private static _attemptConnection() {
    this._state = this._reconnectAttempts > 0 ? 'reconnecting' : 'connecting';
    this._notifyStateChange();

    try {
      this._ws = new WebSocket(this._url);
      
      this._ws.onopen = this._handleOpen.bind(this);
      this._ws.onmessage = this._handleMessage.bind(this);
      this._ws.onclose = this._handleClose.bind(this);
      this._ws.onerror = this._handleError.bind(this);

    } catch (err) {
      console.error('[ZuiSocket] Connection error:', err);
      this._handleError(err as Event);
    }
  }

  private static _handleOpen(_event: Event) {
    this._state = 'connected';
    this._reconnectAttempts = 0;
    this._notifyStateChange();
    EventBusService.emit('socket:connected', { url: this._url }, 'ZuiSocketService');
    
    // Re-join channels if any
    this._channels.forEach(channel => {
      this.send('sys:join', { channel });
    });
  }

  private static async _handleMessage(event: MessageEvent) {
    try {
      const data: ZuiSocketMessage = JSON.parse(event.data);
      
      let payload = data.payload;
      if ((data as any).encrypted && this._options.encryption?.enabled && this._encryptionKey) {
          try {
             payload = await this._decryptPayload(data.payload);
             data.payload = payload;
          } catch (e) {
              console.error('[ZuiSocket] Decryption failed', e);
              return;
          }
      }

      // Dispatch to internal handlers
      if (this._handlers.has(data.type)) {
        this._handlers.get(data.type)!.forEach(handler => handler(data.payload));
      }

      // Dispatch to EventBus
      EventBusService.emit(`socket:message:${data.type}`, data, 'ZuiSocketService');
      EventBusService.emit('socket:message', data, 'ZuiSocketService');

    } catch (err) {
      console.error('[ZuiSocket] Failed to parse message:', err);
    }
  }

  private static _handleClose(event: CloseEvent) {
    if (this._state === 'disconnected') return; // Intentional disconnect

    this._state = 'disconnected';
    this._ws = null;
    this._notifyStateChange();
    
    EventBusService.emit('socket:disconnected', { code: event.code, reason: event.reason }, 'ZuiSocketService');

    if (this._options.autoReconnect) {
      this._tryReconnect();
    }
  }

  private static _handleError(event: Event) {
    this._state = 'error';
    this._notifyStateChange();
    EventBusService.emit('socket:error', event, 'ZuiSocketService');
  }

  private static _tryReconnect() {
    if (this._reconnectAttempts >= (this._options.maxReconnectAttempts || 5)) {
      console.error('[ZuiSocket] Max reconnect attempts reached.');
      return;
    }

    this._reconnectAttempts++;
    const delay = (this._options.reconnectInterval || 5000); 
    
    console.log(`[ZuiSocket] Reconnecting in ${delay}ms... (Attempt ${this._reconnectAttempts})`);
    
    this._reconnectTimer = setTimeout(() => {
      this._attemptConnection();
    }, delay);
  }

  private static _notifyStateChange() {
    EventBusService.emit('socket:state_change', { state: this._state }, 'ZuiSocketService');
  }

  // --- Encryption Helpers ---
  
  private static async _generateSessionKey() {
      // In a real app, this would involve key exchange. 
      // Here we just generate a key for generic usage to demonstrate the capability.
      try {
        this._encryptionKey = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );
      } catch (e) {
          console.error('[ZuiSocket] Failed to generate encryption key', e);
      }
  }

  private static async _encryptPayload(data: any): Promise<string> {
      if (!this._encryptionKey) throw new Error("No encryption key");
      
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(JSON.stringify(data));
      try {
        const iv = new Uint8Array(12);
        window.crypto.getRandomValues(iv);
        this._iv = iv;
      } catch (e) {
         console.error('[ZuiSocket] Failed to generate IV', e);
         throw e;
      }
      
      const encryptedBuffer = await window.crypto.subtle.encrypt(
          {
              name: "AES-GCM",
              iv: this._iv as any
          },
          this._encryptionKey,
          encodedData
      );

      // We need to send IV + Ciphertext. typically IV is prepended.
      // For JSON friendliness, we'll base64 encode both.
      // Format: "IV|CIPHERTEXT" (base64)
      const ivStr = this._arrayBufferToBase64(this._iv);
      const cipherStr = this._arrayBufferToBase64(encryptedBuffer);
      return `${ivStr}|${cipherStr}`;
  }

  private static async _decryptPayload(cipherString: string): Promise<any> {
      if (!this._encryptionKey) throw new Error("No encryption key");
      
      const parts = cipherString.split('|');
      if (parts.length !== 2) throw new Error("Invalid encrypted format");
      
      const iv = this._base64ToArrayBuffer(parts[0]);
      const ciphertext = this._base64ToArrayBuffer(parts[1]);
      
      const decryptedBuffer = await window.crypto.subtle.decrypt(
          {
              name: "AES-GCM",
              iv: iv
          },
          this._encryptionKey,
          ciphertext
      );
      
      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decryptedBuffer));
  }

  private static _arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
      let binary = '';
      const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
  }

  private static _base64ToArrayBuffer(base64: string): ArrayBuffer {
      const binary_string = window.atob(base64);
      const len = binary_string.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
  }

  // --- Mock Implementation ---

  private static _simulateConnection() {
    this._state = 'connecting';
    this._notifyStateChange();
    
    setTimeout(() => {
      this._state = 'connected';
      this._notifyStateChange();
      EventBusService.emit('socket:connected', { url: 'mock://server', mock: true }, 'ZuiSocketService');
      
      this._startMockTraffic();
    }, 1000);
  }

  private static async _mockSend(message: ZuiSocketMessage) {
    console.log('[ZuiSocket] [MOCK SEND]', message);
    
    // Simulate encryption delay if enabled
    if ((message as any).encrypted) {
        await new Promise(r => setTimeout(r, 10)); // tiny encryption delay
    }

    // Echo back after delay
    setTimeout(async () => {
      // let payload = message.payload;
        
        // If it was sent encrypted, we pretend the server decrypted it, processed it, and re-encrypted the response
        // But for this mock, since we share the key in the static class, we can actually "decrypt" and "encrypt" it back if we wanted.
        // Or simpler: just echo the encrypted blob back as if it's an echo.
        // If we want to simulate server response "received", we should probably send a plaintext system message or an encrypted one.
        
        // Let's create a new response payload
        const responseData = { originalType: message.type, status: 'received_mock' };
        let responsePayload = responseData;
        let isEncrypted = false;

        if (this._options.encryption?.enabled && this._encryptionKey) {
             // To simulate server sending back encrypted data, we use the same key (symmetric)
             try {
                responsePayload = await this._encryptPayload(responseData) as any;
                isEncrypted = true;
             } catch(e) { console.error("Mock encryption failed", e); }
        }

        const response: ZuiSocketMessage = {
            type: 'ack',
            payload: responsePayload,
            timestamp: Date.now(),
            source: 'server',
            channel: message.channel
        };

        if (isEncrypted) {
            (response as any).encrypted = true;
        }
        
        // Dispatch echo (Need to decrypt for handlers if encrypted)
        let processedPayload = response.payload;
        if (isEncrypted && this._encryptionKey) {
             try {
                 processedPayload = await this._decryptPayload(response.payload);
             } catch(e) { console.error("Mock decryption failed", e); }
        }

         // Dispatch to internal handlers
        if (this._handlers.has(response.type)) {
            this._handlers.get(response.type)!.forEach(handler => handler(processedPayload));
        }
    
        // We emit the raw event to bus (maybe with encrypted payload? usually bus wants decrypted)
        // Let's emit the decrypted version for easier debugging in bus
        const decryptedResponse = { ...response, payload: processedPayload };
        
        EventBusService.emit(`socket:message:${response.type}`, decryptedResponse, 'ZuiSocketService');
        EventBusService.emit('socket:message', decryptedResponse, 'ZuiSocketService');
    }, 500);
  }

  private static _startMockTraffic() {
      // Simulate random keep-alive or periodic messages
      setInterval(() => {
          if (this._state === 'connected') {
              const ping: ZuiSocketMessage = {
                  type: 'ping',
                  payload: { time: Date.now() },
                  timestamp: Date.now(),
                  source: 'server'
              };
               EventBusService.emit(`socket:message:ping`, ping, 'ZuiSocketService');
          }
      }, 10000);
  }
}
