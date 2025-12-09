export type NotificationPermissionStatus = 'granted' | 'denied' | 'default';

export class NotificationCheckService {
  static getPermission(): NotificationPermissionStatus {
    if (!('Notification' in window)) {
      return 'denied'; // Treat missing support as denied/unavailable
    }
    return Notification.permission as NotificationPermissionStatus;
  }

  static async requestPermission(): Promise<NotificationPermissionStatus> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    const permission = await Notification.requestPermission();
    return permission as NotificationPermissionStatus;
  }

  static sendNotification(title: string, options?: NotificationOptions): boolean {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }
    
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted. Current permission:', Notification.permission);
      return false;
    }

    try {
      const notification = new Notification(title, options);
      console.log('Notification sent successfully:', title);
      
      // Optional: Add event listeners for debugging
      notification.onshow = () => console.log('Notification shown');
      notification.onerror = (e) => console.error('Notification error:', e);
      notification.onclick = () => console.log('Notification clicked');
      
      return true;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return false;
    }
  }
}
