export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  module?: string;
  data?: any;
}

type LogListener = (entry: LogEntry) => void;

export class LoggerService {
  private static _listeners: Set<LogListener> = new Set();
  private static _history: LogEntry[] = [];
  private static _maxHistory = 1000;

  static debug(message: string, module?: string, data?: any) {
    this._log('DEBUG', message, module, data);
  }

  static info(message: string, module?: string, data?: any) {
    this._log('INFO', message, module, data);
  }

  static warn(message: string, module?: string, data?: any) {
    this._log('WARN', message, module, data);
  }

  static error(message: string, module?: string, data?: any) {
    this._log('ERROR', message, module, data);
  }

  static subscribe(listener: LogListener) {
    this._listeners.add(listener);
    // Optionally replay history to new listeners? 
    // For now, let's keep it simple: new listeners only get new logs.
    // Or we could add a method `getHistory()`
  }

  static unsubscribe(listener: LogListener) {
    this._listeners.delete(listener);
  }

  static getHistory(): LogEntry[] {
    return [...this._history];
  }

  static clear() {
    this._history = [];
    // Notify clear? Or just let listeners handle next update?
    // We might need a separate event for "cleared" if we want UI to wipe instantly without a new log.
    // For simplicity, we won't emit a log event on clear, but UI should likely poll or we need a 'change' event structure.
    // Actually, let's emit a special system log or just rely on the UI calling getHistory on init.
    // To properly update UI on clear, we might want a 'clear' event, but let's stick to the LogListener pattern.
    // UI can call clear() and then manually clear its local state.
  }

  private static _log(level: LogLevel, message: string, module?: string, data?: any) {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      level,
      message,
      module,
      data
    };

    this._history.push(entry);
    if (this._history.length > this._maxHistory) {
      this._history.shift();
    }

    this._listeners.forEach(l => l(entry));
    
    // Also log to console for dev convenience
    const style = this._getConsoleStyle(level);
    const prefix = module ? `[${module}]` : '';
    console.log(`%c[${level}]${prefix} ${message}`, style, data || '');
  }

  private static _getConsoleStyle(level: LogLevel): string {
    switch (level) {
      case 'DEBUG': return 'color: #9ca3af';
      case 'INFO': return 'color: #3b82f6';
      case 'WARN': return 'color: #f59e0b';
      case 'ERROR': return 'color: #ef4444; font-weight: bold';
      default: return '';
    }
  }
}
