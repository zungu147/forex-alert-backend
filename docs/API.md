# Forex Alert Backend - API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Overview
This document outlines all available API endpoints for the Forex Alert Backend.

## Endpoints

### Health Check
```
GET /health
```
Returns server health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

---

## Alerts

### Create Alert
```
POST /alerts
```
Create a new price alert.

**Request Body:**
```json
{
  "deviceId": "device-123",
  "symbol": "EURUSD",
  "condition": "above",
  "targetPrice": 1.0950
}
```

**Parameters:**
- `deviceId` (string, required): Device identifier
- `symbol` (string, required): Forex symbol (e.g., EURUSD, XAUUSD)
- `condition` (string, required): Alert condition - `above`, `below`, or `crosses`
- `targetPrice` (number, required): Target price level

**Response (201):**
```json
{
  "success": true,
  "message": "Alert created successfully",
  "data": {
    "id": "alert-uuid",
    "deviceId": "device-123",
    "symbol": "EURUSD",
    "condition": "above",
    "targetPrice": 1.0950,
    "status": "active",
    "isEnabled": true,
    "triggerCount": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get Alert
```
GET /alerts/:alertId
```
Retrieve a specific alert.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "alert-uuid",
    "deviceId": "device-123",
    "symbol": "EURUSD",
    "condition": "above",
    "targetPrice": 1.0950,
    "currentPrice": 1.0925,
    "status": "active",
    "isEnabled": true,
    "triggerCount": 2,
    "lastTriggeredAt": "2024-01-15T09:15:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Get Device Alerts
```
GET /alerts/device/:deviceId
```
Get all alerts for a specific device.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "alert-1",
      "deviceId": "device-123",
      "symbol": "EURUSD",
      "condition": "above",
      "targetPrice": 1.0950,
      "status": "active",
      "isEnabled": true,
      "triggerCount": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Update Alert
```
PATCH /alerts/:alertId
```
Update an existing alert.

**Request Body:**
```json
{
  "targetPrice": 1.1000,
  "condition": "below",
  "isEnabled": false,
  "status": "paused"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Alert updated successfully",
  "data": {
    "id": "alert-uuid",
    "deviceId": "device-123",
    "symbol": "EURUSD",
    "condition": "below",
    "targetPrice": 1.1000,
    "status": "paused",
    "isEnabled": false,
    "triggerCount": 0,
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Delete Alert
```
DELETE /alerts/:alertId
```
Delete a specific alert.

**Response (200):**
```json
{
  "success": true,
  "message": "Alert deleted successfully"
}
```

---

## Devices

### Register Device
```
POST /devices/register
```
Register a new device or update existing device.

**Request Body:**
```json
{
  "deviceId": "device-123",
  "fcmToken": "fcm-token-string",
  "deviceName": "iPhone 13",
  "deviceType": "ios",
  "osVersion": "16.2",
  "appVersion": "1.0.0"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Device registered successfully",
  "data": {
    "deviceId": "device-123",
    "subscriptionPlan": "free",
    "maxAlerts": 5,
    "alertsCount": 0
  }
}
```

---

### Get Device Info
```
GET /devices/:deviceId
```
Get device information and subscription status.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deviceId": "device-123",
    "subscriptionPlan": "free",
    "maxAlerts": 5,
    "alertsCount": 2,
    "deviceType": "ios",
    "lastPingAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Update Device
```
PATCH /devices/:deviceId
```
Update device FCM token or information.

**Request Body:**
```json
{
  "fcmToken": "new-fcm-token",
  "deviceName": "iPhone 13 Pro",
  "appVersion": "1.0.1"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Device updated successfully"
}
```

---

### Device Ping
```
POST /devices/:deviceId/ping
```
Record device activity ping.

**Response (200):**
```json
{
  "success": true,
  "message": "Device ping recorded"
}
```

---

## Watchlist

### Get Watchlist
```
GET /watchlist/:deviceId
```
Retrieve watchlist for a device.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deviceId": "device-123",
    "items": [
      {
        "id": "watchlist-item-1",
        "symbol": "EURUSD",
        "displayName": "Euro / US Dollar",
        "order": 1,
        "addedAt": "2024-01-15T10:00:00.000Z"
      },
      {
        "id": "watchlist-item-2",
        "symbol": "XAUUSD",
        "displayName": "Gold",
        "order": 2,
        "addedAt": "2024-01-15T10:05:00.000Z"
      }
    ]
  }
}
```

---

### Add to Watchlist
```
POST /watchlist/:deviceId/add
```
Add a symbol to watchlist.

**Request Body:**
```json
{
  "symbol": "BTCUSD",
  "displayName": "Bitcoin"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Symbol added to watchlist"
}
```

---

### Remove from Watchlist
```
DELETE /watchlist/:deviceId/remove/:symbol
```
Remove a symbol from watchlist.

**Response (200):**
```json
{
  "success": true,
  "message": "Symbol removed from watchlist"
}
```

---

### Reorder Watchlist
```
PUT /watchlist/:deviceId/reorder
```
Reorder watchlist items.

**Request Body:**
```json
{
  "items": [
    { "id": "watchlist-item-2", "order": 1 },
    { "id": "watchlist-item-1", "order": 2 }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Watchlist reordered successfully"
}
```

---

## Subscriptions

### Get Subscription
```
GET /subscription/:deviceId
```
Get subscription information for a device.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "deviceId": "device-123",
    "plan": "free",
    "maxAlerts": 5,
    "hasAds": true,
    "fastUpdates": false,
    "advancedIndicators": false,
    "moreNotificationOptions": false,
    "status": "active",
    "startDate": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### Upgrade Subscription
```
POST /subscription/:deviceId/upgrade
```
Upgrade to premium subscription.

**Request Body:**
```json
{
  "billingPeriod": "monthly"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Subscription upgraded to premium",
  "data": {
    "plan": "premium",
    "billingPeriod": "monthly",
    "maxAlerts": null,
    "hasAds": false,
    "fastUpdates": true,
    "advancedIndicators": true,
    "moreNotificationOptions": true,
    "startDate": "2024-01-15T11:00:00.000Z",
    "endDate": "2024-02-15T11:00:00.000Z"
  }
}
```

---

### Cancel Subscription
```
POST /subscription/:deviceId/cancel
```
Cancel premium subscription.

**Response (200):**
```json
{
  "success": true,
  "message": "Subscription cancelled"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required fields",
  "statusCode": 400
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Alert not found",
  "statusCode": 404
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Something went wrong. Please try again later.",
  "statusCode": 500
}
```

---

## Status Codes

- `200`: OK - Request successful
- `201`: Created - Resource created successfully
- `400`: Bad Request - Invalid request parameters
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server error

---

## Next Steps

More endpoints will be added for:
- Real-time price data
- Background job management
- Notification history
- Analytics and reporting
