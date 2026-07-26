/**
 * Alert Repository
 * Data access layer for Alert operations
 */

import { getFirestore, Collections } from '@config/firebase';
import { Alert, CreateAlertDTO, UpdateAlertDTO } from '@models/Alert';
import { logger } from '@utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class AlertRepository {
  private db = getFirestore();
  private collection = Collections.ALERTS;

  /**
   * Create a new alert
   */
  async create(data: CreateAlertDTO): Promise<Alert> {
    try {
      const alertId = uuidv4();
      const timestamp = new Date();

      const alertData: Omit<Alert, 'id'> = {
        deviceId: data.deviceId,
        symbol: data.symbol,
        condition: data.condition,
        targetPrice: data.targetPrice,
        status: 'active',
        isEnabled: true,
        triggerCount: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await this.db.collection(this.collection).doc(alertId).set(alertData);

      logger.info(`Alert created: ${alertId} for device: ${data.deviceId}`);

      return {
        id: alertId,
        ...alertData,
      };
    } catch (error) {
      logger.error('Error creating alert:', error);
      throw error;
    }
  }

  /**
   * Get alert by ID
   */
  async getById(alertId: string): Promise<Alert | null> {
    try {
      const doc = await this.db.collection(this.collection).doc(alertId).get();
      if (!doc.exists) {
        return null;
      }
      return {
        id: doc.id,
        ...doc.data(),
      } as Alert;
    } catch (error) {
      logger.error('Error getting alert by ID:', error);
      throw error;
    }
  }

  /**
   * Get all alerts for a device
   */
  async getByDeviceId(deviceId: string): Promise<Alert[]> {
    try {
      const snapshot = await this.db
        .collection(this.collection)
        .where('deviceId', '==', deviceId)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Alert[];
    } catch (error) {
      logger.error('Error getting alerts by device ID:', error);
      throw error;
    }
  }

  /**
   * Get active alerts for a symbol
   */
  async getActiveBySymbol(symbol: string): Promise<Alert[]> {
    try {
      const snapshot = await this.db
        .collection(this.collection)
        .where('symbol', '==', symbol)
        .where('status', '==', 'active')
        .where('isEnabled', '==', true)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Alert[];
    } catch (error) {
      logger.error('Error getting active alerts by symbol:', error);
      throw error;
    }
  }

  /**
   * Update alert
   */
  async update(alertId: string, data: UpdateAlertDTO): Promise<Alert | null> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await this.db.collection(this.collection).doc(alertId).update(updateData);

      return this.getById(alertId);
    } catch (error) {
      logger.error('Error updating alert:', error);
      throw error;
    }
  }

  /**
   * Delete alert
   */
  async delete(alertId: string): Promise<boolean> {
    try {
      await this.db.collection(this.collection).doc(alertId).delete();
      logger.info(`Alert deleted: ${alertId}`);
      return true;
    } catch (error) {
      logger.error('Error deleting alert:', error);
      throw error;
    }
  }

  /**
   * Get all alerts
   */
  async getAll(): Promise<Alert[]> {
    try {
      const snapshot = await this.db.collection(this.collection).get();
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Alert[];
    } catch (error) {
      logger.error('Error getting all alerts:', error);
      throw error;
    }
  }

  /**
   * Increment trigger count
   */
  async incrementTriggerCount(alertId: string): Promise<void> {
    try {
      const alert = await this.getById(alertId);
      if (alert) {
        await this.db.collection(this.collection).doc(alertId).update({
          triggerCount: alert.triggerCount + 1,
          lastTriggeredAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      logger.error('Error incrementing trigger count:', error);
      throw error;
    }
  }
}

export default new AlertRepository();
