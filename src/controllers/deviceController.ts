/**
 * Device Controller
 * Handles HTTP requests for device operations
 */

import { Router, Request, Response } from 'express';
import { logger } from '@utils/logger';
import { asyncHandler, CustomError } from '@middlewares/errorHandler';

const router = Router();

/**
 * POST /api/v1/devices/register
 * Register or get device
 */
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const { deviceId, fcmToken, deviceName, deviceType, osVersion, appVersion } = req.body;

    // Validation
    if (!deviceId || !fcmToken || !deviceType || !appVersion) {
      throw new CustomError(400, 'Missing required fields');
    }

    if (!['ios', 'android', 'web'].includes(deviceType)) {
      throw new CustomError(400, 'Invalid device type');
    }

    // TODO: Implement device registration logic
    // This will be implemented in the next iteration

    res.status(200).json({
      success: true,
      message: 'Device registered successfully',
      data: {
        deviceId,
        subscriptionPlan: 'free',
        maxAlerts: 5,
      },
    });
  }),
);

/**
 * GET /api/v1/devices/:deviceId
 * Get device info
 */
router.get(
  '/:deviceId',
  asyncHandler(async (req: Request, res: Response) => {
    const { deviceId } = req.params;

    // TODO: Implement device retrieval logic

    res.status(200).json({
      success: true,
      data: {
        deviceId,
        subscriptionPlan: 'free',
        maxAlerts: 5,
        alertsCount: 0,
      },
    });
  }),
);

/**
 * PATCH /api/v1/devices/:deviceId
 * Update device FCM token or info
 */
router.patch(
  '/:deviceId',
  asyncHandler(async (req: Request, res: Response) => {
    const { deviceId } = req.params;
    const { fcmToken, deviceName, appVersion } = req.body;

    // TODO: Implement device update logic

    res.status(200).json({
      success: true,
      message: 'Device updated successfully',
    });
  }),
);

/**
 * POST /api/v1/devices/:deviceId/ping
 * Device ping for last seen tracking
 */
router.post(
  '/:deviceId/ping',
  asyncHandler(async (req: Request, res: Response) => {
    const { deviceId } = req.params;

    // TODO: Implement device ping logic

    res.status(200).json({
      success: true,
      message: 'Device ping recorded',
    });
  }),
);

export default router;
