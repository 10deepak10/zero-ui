
export interface EventBusEvent<T = any> {
  name: string;
  data: T;
  timestamp: number;
  source?: string;
  id: string;
}

export type EventCallback<T = any> = (event: EventBusEvent<T>) => void;

export class EventBusService {
  // Map of event name -> Set of callbacks
  private static _listeners: Map<string, Set<EventCallback>> = new Map();
  // Set of callbacks that listen to ALL events
  private static _globalListeners: Set<EventCallback> = new Set();
  
  // Keep a history of recent events for debugging/visualizing
  private static _history: EventBusEvent[] = [];
  private static _maxHistory = 1000;

  static subscribe<T>(eventName: string, callback: EventCallback<T>) {
    if (!this._listeners.has(eventName)) {
      this._listeners.set(eventName, new Set());
    }
    this._listeners.get(eventName)!.add(callback as EventCallback);
  }

  static subscribeAll(callback: EventCallback) {
    this._globalListeners.add(callback);
  }

  static unsubscribe<T>(eventName: string, callback: EventCallback<T>) {
    this._listeners.get(eventName)?.delete(callback as EventCallback);
  }

  static unsubscribeAll(callback: EventCallback) {
    this._globalListeners.delete(callback);
  }

  static emit<T>(eventName: string, data: T, source?: string) {
    const event: EventBusEvent<T> = {
      id: crypto.randomUUID(),
      name: eventName,
      data,
      timestamp: Date.now(),
      source
    };

    this._addToHistory(event);

    // Notify specific listeners
    this._listeners.get(eventName)?.forEach(cb => {
      try {
        cb(event);
      } catch (e) {
        console.error(`[EventBus] Error in listener for ${eventName}:`, e);
      }
    });

    // Notify global listeners
    this._globalListeners.forEach(cb => {
      try {
        cb(event);
      } catch (e) {
        console.error(`[EventBus] Error in global listener:`, e);
      }
    });
  }

  static getHistory(): EventBusEvent[] {
    return [...this._history];
  }

  static clearHistory() {
    this._history = [];
    // We notify global listeners of a special clear event? 
    // Or simpler: The UI component can handle the clear action directly.
    // If we want to be reactive to clearing, we might emit an internal event.
    this.emit('sys:clear_history', null, 'EventBusService');
  }

  private static _addToHistory(event: EventBusEvent) {
    this._history.push(event);
    if (this._history.length > this._maxHistory) {
      this._history.shift();
    }
  }
}
