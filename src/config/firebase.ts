/**
 * Firebase Configuration and Initialization
 * Handles Firebase Admin SDK setup and Firestore initialization
 */

import admin from 'firebase-admin';
import { logger } from '@utils/logger';

let db: FirebaseFirestore.Firestore;
let messaging: admin.messaging.Messaging;

/**
 * Initialize Firebase Admin SDK
 */
export const initializeFirebase = async (): Promise<void> => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      db = admin.firestore();
      messaging = admin.messaging();
      logger.info('Firebase already initialized');
      return;
    }

    // Initialize Firebase Admin
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    // Get Firestore instance
    db = admin.firestore();

    // Get FCM messaging instance
    messaging = admin.messaging();

    // Test connection
    await db.collection('_test').doc('_test').set({ test: true });
    await db.collection('_test').doc('_test').delete();

    logger.info('Firebase initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Firebase:', error);
    throw error;
  }
};

/**
 * Get Firestore instance
 */
export const getFirestore = (): FirebaseFirestore.Firestore => {
  if (!db) {
    throw new Error('Firebase has not been initialized. Call initializeFirebase() first.');
  }
  return db;
};

/**
 * Get Firebase Messaging instance
 */
export const getMessaging = (): admin.messaging.Messaging => {
  if (!messaging) {
    throw new Error('Firebase Messaging has not been initialized. Call initializeFirebase() first.');
  }
  return messaging;
};

/**
 * Firestore collections configuration
 */
export const Collections = {
  DEVICES: 'devices',
  ALERTS: 'alerts',
  WATCHLIST: 'watchlist',
  PRICES: 'prices',
  SUBSCRIPTIONS: 'subscriptions',
  USERS: 'users',
  NOTIFICATIONS: 'notifications',
  AUDIT_LOGS: 'audit_logs',
} as const;

export type CollectionName = typeof Collections[keyof typeof Collections];

export default {
  initializeFirebase,
  getFirestore,
  getMessaging,
  Collections,
};
