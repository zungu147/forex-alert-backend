/**
 * Alert Controller
 * Handles HTTP requests for alert operations
 */

import { Router, Request, Response } from 'express';
import AlertRepository from '@repositories/AlertRepository';
import { logger } from '@utils/logger';
import { asyncHandler, CustomError } from '@middlewares/errorHandler';
import { CreateAlertDTO, UpdateAlertDTO } from '@models/Alert';

const router = Router();

/**
 * POST /api/v1/alerts
 * Create a new alert
 */
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { deviceId, symbol, condition, targetPrice } = req.body;

    // Validation
    if (!deviceId || !symbol || !condition || targetPrice === undefined) {
      throw new CustomError(400, 'Missing required fields');
    }

    if (!['above', 'below', 'crosses'].includes(condition)) {
      throw new CustomError(400, 'Invalid condition');
    }

    if (typeof targetPrice !== 'number' || targetPrice <= 0) {
      throw new CustomError(400, 'Invalid target price');
    }

    const alertData: CreateAlertDTO = {
      deviceId,
      symbol: symbol.toUpperCase(),
      condition,
      targetPrice,
    };

    const alert = await AlertRepository.create(alertData);

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert,
    });
  }),
);

/**
 * GET /api/v1/alerts/:alertId
 * Get alert by ID
 */
router.get(
  '/:alertId',
  asyncHandler(async (req: Request, res: Response) => {
    const { alertId } = req.params;

    const alert = await AlertRepository.getById(alertId);
    if (!alert) {
      throw new CustomError(404, 'Alert not found');
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  }),
);

/**
 * GET /api/v1/alerts/device/:deviceId
 * Get all alerts for a device
 */
router.get(
  '/device/:deviceId',
  asyncHandler(async (req: Request, res: Response) => {
    const { deviceId } = req.params;

    const alerts = await AlertRepository.getByDeviceId(deviceId);

    res.status(200).json({
      success: true,
      data: alerts,
      count: alerts.length,
    });
  }),
);

/**
 * PATCH /api/v1/alerts/:alertId
 * Update alert
 */
router.patch(
  '/:alertId',
  asyncHandler(async (req: Request, res: Response) => {
    const { alertId } = req.params;
    const updates: UpdateAlertDTO = req.body;

    // Validation
    if (updates.condition && !['above', 'below', 'crosses'].includes(updates.condition)) {
      throw new CustomError(400, 'Invalid condition');
    }

    if (updates.targetPrice !== undefined && (typeof updates.targetPrice !== 'number' || updates.targetPrice <= 0)) {
      throw new CustomError(400, 'Invalid target price');
    }

    const alert = await AlertRepository.update(alertId, updates);
    if (!alert) {
      throw new CustomError(404, 'Alert not found');
    }

    res.status(200).json({
      success: true,
      message: 'Alert updated successfully',
      data: alert,
    });
  }),
);

/**
 * DELETE /api/v1/alerts/:alertId
 * Delete alert
 */
router.delete(
  '/:alertId',
  asyncHandler(async (req: Request, res: Response) => {
    const { alertId } = req.params;

    const success = await AlertRepository.delete(alertId);
    if (!success) {
      throw new CustomError(404, 'Alert not found');
    }

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully',
    });
  }),
);

/**
 * GET /api/v1/alerts
 * Get all active alerts
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const alerts = await AlertRepository.getAll();

    res.status(200).json({
      success: true,
      data: alerts,
      count: alerts.length,
    });
  }),
);

export default router;
