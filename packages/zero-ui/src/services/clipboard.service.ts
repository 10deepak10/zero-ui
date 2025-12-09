export type ClipboardPermissionStatus = 'granted' | 'denied' | 'prompt';

export interface ClipboardHistoryItem {
  type: 'read' | 'write';
  content: string;
  timestamp: number;
  status: 'success' | 'error';
}

export class ClipboardCheckService {
  private static permissionListeners: Array<(status: ClipboardPermissionStatus) => void> = [];
  private static historyListeners: Array<(history: ClipboardHistoryItem[]) => void> = [];
  private static history: ClipboardHistoryItem[] = [];

  /**
   * Check clipboard read permission status
   */
  static async checkPermission(): Promise<ClipboardPermissionStatus> {
    if (!navigator.permissions) {
      // Fallback: assume prompt if Permissions API not available
      return 'prompt';
    }

    try {
      const result = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
      return result.state as ClipboardPermissionStatus;
    } catch (e) {
      // Some browsers don't support clipboard-read permission query
      return 'prompt';
    }
  }

  /**
   * Subscribe to permission changes
   */
  static async subscribe(callback: (status: ClipboardPermissionStatus) => void): Promise<void> {
    this.permissionListeners.push(callback);

    if (!navigator.permissions) return;

    try {
      const result = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
      result.addEventListener('change', () => {
        const newStatus = result.state as ClipboardPermissionStatus;
        this.permissionListeners.forEach(listener => listener(newStatus));
      });
    } catch (e) {
      // Permission query not supported
    }
  }

  /**
   * Unsubscribe from permission changes
   */
  static unsubscribe(callback: (status: ClipboardPermissionStatus) => void): void {
    this.permissionListeners = this.permissionListeners.filter(listener => listener !== callback);
  }

  /**
   * Read text from clipboard
   */
  static async readText(): Promise<string> {
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not supported');
    }

    try {
      const text = await navigator.clipboard.readText();
      this.addToHistory('read', text, 'success');
      return text;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read clipboard: ${error.message}`);
      }
      throw new Error('Failed to read clipboard');
    }
  }

  /**
   * Write text to clipboard
   */
  static async writeText(text: string): Promise<void> {
    if (!navigator.clipboard) {
      // Fallback to legacy method
      return this.writeTextLegacy(text);
    }

    try {
      await navigator.clipboard.writeText(text);
      this.addToHistory('write', text, 'success');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to write to clipboard: ${error.message}`);
      }
      throw new Error('Failed to write to clipboard');
    }
  }

  /**
   * Legacy fallback for writing to clipboard
   */
  private static writeTextLegacy(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
          this.addToHistory('write', text, 'success');
          resolve();
        } else {
          reject(new Error('Copy command failed'));
        }
      } catch (error) {
        document.body.removeChild(textarea);
        reject(error);
      }
    });
  }

  /**
   * Check if Clipboard API is supported
   */
  static isSupported(): boolean {
    return 'clipboard' in navigator;
  }

  /**
   * Add item to history
   */
  private static addToHistory(type: 'read' | 'write', content: string, status: 'success' | 'error') {
    const item: ClipboardHistoryItem = {
      type,
      content,
      timestamp: Date.now(),
      status
    };
    
    this.history = [item, ...this.history].slice(0, 50); // Keep last 50 items
    this.historyListeners.forEach(listener => listener(this.history));
  }

  /**
   * Get current history
   */
  static getHistory(): ClipboardHistoryItem[] {
    return [...this.history];
  }

  /**
   * Clear history
   */
  static clearHistory(): void {
    this.history = [];
    this.historyListeners.forEach(listener => listener(this.history));
  }

  /**
   * Subscribe to history changes
   */
  static subscribeToHistory(callback: (history: ClipboardHistoryItem[]) => void): void {
    this.historyListeners.push(callback);
    callback(this.history); // Immediate update
  }

  /**
   * Unsubscribe from history changes
   */
  static unsubscribeFromHistory(callback: (history: ClipboardHistoryItem[]) => void): void {
    this.historyListeners = this.historyListeners.filter(listener => listener !== callback);
  }
}
