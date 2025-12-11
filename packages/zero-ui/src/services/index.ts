export * from './battery.service.js';
export * from './browser.service.js';
export * from './extension.service.js';
export * from './formatter.service.js';
export * from './gpu.service.js';
export * from './logger.service.js';
export * from './network.service.js';
export * from './notification.service.js';
export * from './os.service.js';
export * from './proctoring.service.js';
export * from './screen.service.js';
export * from './storage.service.js';
export * from './syntax-highlighter.service.js';
export * from './theme.service.js';
export * from './event-bus.service.js';

// Resolve ambiguities with named exports
export { ClipboardCheckService, type ClipboardPermissionStatus, type ClipboardHistoryItem as ClipboardCheckHistoryItem } from './clipboard.service.js';
export { ClipboardHistoryService, getClipboardHistoryService, type ClipboardHistoryItem, type ClipboardHistoryOptions } from './clipboard-history.service.js';

export { CameraCheckService, type PermissionStatus as CameraPermissionStatus, type CameraDevice } from './camera.service.js';
export { GeolocationCheckService, type PermissionStatus as GeolocationPermissionStatus } from './geolocation.service.js';
export { MicCheckService, type PermissionStatus as MicPermissionStatus, type MicDevice } from './mic.service.js';
