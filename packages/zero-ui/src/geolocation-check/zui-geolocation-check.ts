import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { GeolocationCheckService, type PermissionStatus } from '../services/geolocation.service.js';

@customElement('zui-geolocation-check')
export class ZuiGeolocationCheck extends LitElement {
  @state() private _position: GeolocationPosition | null = null;
  @state() private _error: string | null = null;
  @state() private _permission: PermissionStatus = 'prompt';
  @state() private _loading = false;
  @state() private _watchId: number | null = null;

  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: var(--card-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--card-border, rgba(255, 255, 255, 0.1));
      border-radius: 12px;
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .title {
      font-size: 0.9rem;
      color: var(--text-muted, #9ca3af);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-badge {
      font-size: 0.8rem;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-granted { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .status-denied { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .status-prompt { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }

    .action-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 20px 0;
    }

    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    button:hover {
      background: #2563eb;
    }

    button:disabled {
      background: #1f2937;
      color: #6b7280;
      cursor: not-allowed;
    }

    .coords-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 20px;
    }

    .coord-item {
      background: var(--bg-muted, rgba(255, 255, 255, 0.05));
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }

    .coord-label {
      font-size: 0.8rem;
      color: var(--text-muted, #9ca3af);
      margin-bottom: 4px;
    }

    .coord-value {
      font-size: 1.2rem;
      font-weight: 600;
      font-family: monospace;
    }

    .map-link {
      display: inline-block;
      margin-top: 20px;
      color: #3b82f6;
      text-decoration: none;
      font-size: 0.9rem;
      border-bottom: 1px dashed #3b82f6;
      transition: all 0.2s;
    }
    
    .map-link:hover {
      color: #60a5fa;
      border-bottom-style: solid;
    }

    .error-msg {
      color: #f87171;
      text-align: center;
      margin-top: 10px;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    this._permission = await GeolocationCheckService.checkPermission();
    if (this._permission === 'granted') {
      this._startWatching();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopWatching();
  }

  private _startWatching() {
    if (this._watchId !== null) return;
    
    this._loading = true;
    this._error = null;

    try {
      this._watchId = GeolocationCheckService.watchPosition(
        (position) => {
          this._position = position;
          this._loading = false;
          this._permission = 'granted';
        },
        (error) => {
          this._loading = false;
          this._handleError(error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } catch (e) {
      this._error = 'Geolocation not supported';
      this._loading = false;
    }
  }

  private _stopWatching() {
    if (this._watchId !== null) {
      GeolocationCheckService.clearWatch(this._watchId);
      this._watchId = null;
    }
  }

  private _handleRequest = () => {
    this._startWatching();
    // Also trigger a single get for immediate feedback if watch is slow
    if (!this._position) {
       GeolocationCheckService.getPosition({ enableHighAccuracy: true })
        .then(pos => {
          this._position = pos;
          this._permission = 'granted';
          this._loading = false;
        })
        .catch(err => {
          this._handleError(err);
          this._loading = false;
        });
    }
  };

  private _handleError(error: GeolocationPositionError) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        this._error = 'Location access denied.';
        this._permission = 'denied';
        break;
      case error.POSITION_UNAVAILABLE:
        this._error = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        this._error = 'The request to get user location timed out.';
        break;
      default:
        this._error = 'An unknown error occurred.';
    }
    this._stopWatching();
  }

  render() {
    return html`
      <div class="card">
        <div class="header">
          <span class="title">Geolocation Check</span>
          <span class="status-badge status-${this._permission}">${this._permission}</span>
        </div>

        ${!this._position ? this._renderEmptyState() : this._renderData()}
      </div>
    `;
  }

  private _renderEmptyState() {
    return html`
      <div class="action-area">
        <p style="text-align: center; color: var(--text-muted); max-width: 300px;">
          Access your current location coordinates, altitude, and speed using the Geolocation API.
        </p>
        <button @click=${this._handleRequest} ?disabled=${this._loading}>
          ${this._loading ? 'Locating...' : '📍 Get My Location'}
        </button>
        ${this._error ? html`<div class="error-msg">${this._error}</div>` : ''}
      </div>
    `;
  }

  private _renderData() {
    if (!this._position) return html``;
    const { latitude, longitude, accuracy, altitude, speed } = this._position.coords;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    return html`
      <div class="coords-grid">
        <div class="coord-item">
          <div class="coord-label">Latitude</div>
          <div class="coord-value">${latitude.toFixed(6)}</div>
        </div>
        <div class="coord-item">
          <div class="coord-label">Longitude</div>
          <div class="coord-value">${longitude.toFixed(6)}</div>
        </div>
        <div class="coord-item">
          <div class="coord-label">Accuracy</div>
          <div class="coord-value">±${Math.round(accuracy)}m</div>
        </div>
        <div class="coord-item">
          <div class="coord-label">Altitude</div>
          <div class="coord-value">${altitude ? `${Math.round(altitude)}m` : 'N/A'}</div>
        </div>
        <div class="coord-item">
          <div class="coord-label">Speed</div>
          <div class="coord-value">${speed ? `${speed.toFixed(1)} m/s` : '0 m/s'}</div>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${mapUrl}" target="_blank" class="map-link">
          Open in Maps ↗
        </a>
      </div>
    `;
  }
}
