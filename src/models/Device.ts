/**
 * Device Model
 * Represents a device that uses the Forex Alert App
 */

export interface Device {
  id: string;
  deviceId: string; // Unique device identifier (UUID)
  fcmToken: string; // Firebase Cloud Messaging token for push notifications
  deviceName?: string; // Device name (e.g., "iPhone 13", "Samsung Galaxy S21")
  deviceType: 'ios' | 'android' | 'web'; // Device type
  osVersion?: string; // Operating system version
  appVersion: string; // App version
  isActive: boolean; // Whether device is still active
  subscriptionPlan: 'free' | 'premium'; // Current subscription plan
  alertsCount: number; // Current number of alerts
  maxAlerts: number; // Maximum allowed alerts based on plan
  createdAt: Date;
  updatedAt: Date;
  lastPingAt?: Date; // Last time device checked in
}

export interface CreateDeviceDTO {
  deviceId: string;
  fcmToken: string;
  deviceName?: string;
  deviceType: 'ios' | 'android' | 'web';
  osVersion?: string;
  appVersion: string;
}

export interface UpdateDeviceDTO {
  fcmToken?: string;
  deviceName?: string;
  isActive?: boolean;
  appVersion?: string;
}

export const createDeviceModel = (
  data: CreateDeviceDTO,
): Omit<Device, 'id' | 'createdAt' | 'updatedAt'> => ({
  deviceId: data.deviceId,
  fcmToken: data.fcmToken,
  deviceName: data.deviceName,
  deviceType: data.deviceType,
  osVersion: data.osVersion,
  appVersion: data.appVersion,
  isActive: true,
  subscriptionPlan: 'free',
  alertsCount: 0,
  maxAlerts: 5,
  lastPingAt: new Date(),
});
