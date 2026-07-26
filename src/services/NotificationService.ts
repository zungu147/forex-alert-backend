/**
 * Notification Service
 * Handles sending push notifications via Firebase Cloud Messaging (FCM)
 */

import { getMessaging, getFirestore, Collections } from '@config/firebase';
import { logger } from '@utils/logger';
import { v4 as uuidv4 } from 'uuid';

export interface PushNotificationPayload {
  deviceId: string;
  fcmToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: boolean;
  badge?: string;
}

export interface NotificationLog {
  id: string;
  deviceId: string;
  alertId: string;
  title: string;
  body: string;
  status: 'sent' | 'failed';
  sentAt: Date;
  error?: string;
}

export class NotificationService {
  private messaging = getMessaging();
  private db = getFirestore();
  private collection = Collections.NOTIFICATIONS;

  /**
   * Send push notification to device
   */
  async sendPushNotification(payload: PushNotificationPayload): Promise<boolean> {
    try {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        android: {
          priority: 'high' as const,
          notification: {
            sound: payload.sound ? 'default' : undefined,
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          },
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: payload.title,
                body: payload.body,
              },
              sound: payload.sound ? 'default' : undefined,
              badge: payload.badge || '1',
            },
          },
        },
        webpush: {
          notification: {
            title: payload.title,
            body: payload.body,
            icon: payload.badge,
          },
        },
        token: payload.fcmToken,
      };

      const messageId = await this.messaging.send(message);
      logger.info(`Push notification sent: ${messageId} to device: ${payload.deviceId}`);

      // Log notification
      await this.logNotification({
        deviceId: payload.deviceId,
        title: payload.title,
        body: payload.body,
        status: 'sent',
      });

      return true;
    } catch (error) {
      logger.error('Error sending push notification:', error);

      // Log failed notification
      await this.logNotification({
        deviceId: payload.deviceId,
        title: payload.title,
        body: payload.body,
        status: 'failed',
        error: (error as Error).message,
      });

      return false;
    }
  }

  /**
   * Send alert triggered notification
   */
  async sendAlertNotification(
    deviceId: string,
    fcmToken: string,
    alertId: string,
    symbol: string,
    currentPrice: number,
    targetPrice: number,
  ): Promise<boolean> {
    try {
      const notification = await this.sendPushNotification({
        deviceId,
        fcmToken,
        title: `${symbol} Alert Triggered!`,
        body: `Current: ${currentPrice.toFixed(2)} | Target: ${targetPrice.toFixed(2)}`,
        data: {
          alertId,
          symbol,
          currentPrice: currentPrice.toString(),
          targetPrice: targetPrice.toString(),
          type: 'alert_triggered',
        },
        sound: true,
        badge: '1',
      });

      return notification;
    } catch (error) {
      logger.error('Error sending alert notification:', error);
      return false;
    }
  }

  /**
   * Send bulk notifications to multiple devices
   */
  async sendBulkNotifications(
    payloads: PushNotificationPayload[],
  ): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    for (const payload of payloads) {
      const success = await this.sendPushNotification(payload);
      results.set(payload.deviceId, success);
    }

    return results;
  }

  /**
   * Log notification in Firestore
   */
  private async logNotification(data: {
    deviceId: string;
    title: string;
    body: string;
    status: 'sent' | 'failed';
    error?: string;
  }): Promise<void> {
    try {
      const notificationLog: NotificationLog = {
        id: uuidv4(),
        deviceId: data.deviceId,
        alertId: '', // Will be set by caller if needed
        title: data.title,
        body: data.body,
        status: data.status,
        sentAt: new Date(),
        error: data.error,
      };

      await this.db.collection(this.collection).doc(notificationLog.id).set(notificationLog);
    } catch (error) {
      logger.error('Error logging notification:', error);
    }
  }

  /**
   * Get notification history for a device
   */
  async getNotificationHistory(deviceId: string, limit: number = 50): Promise<NotificationLog[]> {
    try {
      const snapshot = await this.db
        .collection(this.collection)
        .where('deviceId', '==', deviceId)
        .orderBy('sentAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => doc.data()) as NotificationLog[];
    } catch (error) {
      logger.error('Error getting notification history:', error);
      throw error;
    }
  }
}

export default new NotificationService();
