/**
 * Alert Model
 * Represents a price alert for forex pairs
 */

export type AlertCondition = 'above' | 'below' | 'crosses';
export type AlertStatus = 'active' | 'triggered' | 'paused' | 'deleted';

export interface Alert {
  id: string;
  deviceId: string; // Device that created this alert
  symbol: string; // Forex symbol (e.g., EURUSD, XAUUSD, BTC)
  condition: AlertCondition; // above, below, or crosses
  targetPrice: number; // The price level to watch
  currentPrice?: number; // Last known price
  status: AlertStatus; // Current status of alert
  isEnabled: boolean; // Whether alert is enabled
  triggerCount: number; // Number of times this alert has been triggered
  lastTriggeredAt?: Date; // Last time this alert was triggered
  createdAt: Date;
  updatedAt: Date;
  expiredAt?: Date; // When the alert expires (if applicable)
}

export interface CreateAlertDTO {
  deviceId: string;
  symbol: string;
  condition: AlertCondition;
  targetPrice: number;
}

export interface UpdateAlertDTO {
  targetPrice?: number;
  condition?: AlertCondition;
  isEnabled?: boolean;
  status?: AlertStatus;
}

export interface AlertTriggerPayload {
  alertId: string;
  deviceId: string;
  symbol: string;
  currentPrice: number;
  targetPrice: number;
  condition: AlertCondition;
  triggeredAt: Date;
}

export const createAlertModel = (
  data: CreateAlertDTO,
): Omit<Alert, 'id' | 'createdAt' | 'updatedAt'> => ({
  deviceId: data.deviceId,
  symbol: data.symbol,
  condition: data.condition,
  targetPrice: data.targetPrice,
  status: 'active',
  isEnabled: true,
  triggerCount: 0,
});
