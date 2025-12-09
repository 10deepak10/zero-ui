export interface ClipboardHistoryItem {
  id: string;
  content: string;
  timestamp: number;
  type: 'text' | 'html' | 'image';
  mimeType?: string;
}

export interface ClipboardHistoryOptions {
  maxItems?: number;
  persistToStorage?: boolean;
  storageKey?: string;
}

/**
 * Service to track clipboard history at the application level
 * Note: This only tracks clipboard operations that go through this service,
 * not system-wide clipboard changes (which browsers don't allow for security)
 */
export class ClipboardHistoryService {
  private history: ClipboardHistoryItem[] = [];
  private maxItems: number;
  private persistToStorage: boolean;
  private storageKey: string;
  private listeners: Set<(history: ClipboardHistoryItem[]) => void> = new Set();

  constructor(options: ClipboardHistoryOptions = {}) {
    this.maxItems = options.maxItems || 50;
    this.persistToStorage = options.persistToStorage ?? true;
    this.storageKey = options.storageKey || 'zui-clipboard-history';

    if (this.persistToStorage) {
      this.loadFromStorage();
    }
  }

  /**
   * Copy text to clipboard and add to history
   */
  async copyText(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      this.addToHistory({
        id: this.generateId(),
        content: text,
        timestamp: Date.now(),
        type: 'text',
      });
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }

  /**
   * Read current clipboard content and add to history
   * Note: This requires user interaction (e.g., button click)
   */
  async captureClipboard(): Promise<ClipboardHistoryItem | null> {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const item: ClipboardHistoryItem = {
          id: this.generateId(),
          content: text,
          timestamp: Date.now(),
          type: 'text',
        };
        this.addToHistory(item);
        return item;
      }
      return null;
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      return null;
    }
  }

  /**
   * Add item to history manually
   */
  addToHistory(item: ClipboardHistoryItem): void {
    // Check if this content already exists in recent history
    const existingIndex = this.history.findIndex(
      h => h.content === item.content && h.type === item.type
    );

    if (existingIndex !== -1) {
      // Remove the old entry
      this.history.splice(existingIndex, 1);
    }

    // Add to the beginning
    this.history.unshift(item);

    // Trim to max items
    if (this.history.length > this.maxItems) {
      this.history = this.history.slice(0, this.maxItems);
    }

    if (this.persistToStorage) {
      this.saveToStorage();
    }

    this.notifyListeners();
  }

  /**
   * Get all history items
   */
  getHistory(): ClipboardHistoryItem[] {
    return [...this.history];
  }

  /**
   * Get history item by ID
   */
  getItemById(id: string): ClipboardHistoryItem | undefined {
    return this.history.find(item => item.id === id);
  }

  /**
   * Copy item from history back to clipboard
   */
  async copyFromHistory(id: string): Promise<boolean> {
    const item = this.getItemById(id);
    if (!item) return false;

    try {
      await navigator.clipboard.writeText(item.content);
      // Move this item to the top of history
      this.addToHistory({ ...item, timestamp: Date.now() });
      return true;
    } catch (error) {
      console.error('Failed to copy from history:', error);
      return false;
    }
  }

  /**
   * Remove item from history
   */
  removeItem(id: string): void {
    this.history = this.history.filter(item => item.id !== id);
    if (this.persistToStorage) {
      this.saveToStorage();
    }
    this.notifyListeners();
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    this.history = [];
    if (this.persistToStorage) {
      this.saveToStorage();
    }
    this.notifyListeners();
  }

  /**
   * Search history
   */
  search(query: string): ClipboardHistoryItem[] {
    const lowerQuery = query.toLowerCase();
    return this.history.filter(item =>
      item.content.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Subscribe to history changes
   */
  subscribe(listener: (history: ClipboardHistoryItem[]) => void): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getHistory()));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch (error) {
      console.error('Failed to save clipboard history to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load clipboard history from storage:', error);
      this.history = [];
    }
  }
}

// Singleton instance
let instance: ClipboardHistoryService | null = null;

/**
 * Get the singleton clipboard history service instance
 */
export function getClipboardHistoryService(
  options?: ClipboardHistoryOptions
): ClipboardHistoryService {
  if (!instance) {
    instance = new ClipboardHistoryService(options);
  }
  return instance;
}
