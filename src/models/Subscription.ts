/**
 * Subscription Model
 * Represents device subscription plans
 */

export type SubscriptionPlan = 'free' | 'premium';
export type BillingPeriod = 'monthly' | 'yearly';

export interface Subscription {
  id: string;
  deviceId: string;
  plan: SubscriptionPlan;
  billingPeriod?: BillingPeriod;
  maxAlerts: number;
  hasAds: boolean;
  fastUpdates: boolean;
  advancedIndicators: boolean;
  moreNotificationOptions: boolean;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  renewalDate?: Date;
  paymentMethodId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionDTO {
  deviceId: string;
  plan: SubscriptionPlan;
  billingPeriod?: BillingPeriod;
}

export interface UpgradeSubscriptionDTO {
  deviceId: string;
  plan: SubscriptionPlan;
  billingPeriod?: BillingPeriod;
}

export const PLAN_FEATURES = {
  free: {
    maxAlerts: 5,
    hasAds: true,
    fastUpdates: false,
    advancedIndicators: false,
    moreNotificationOptions: false,
  },
  premium: {
    maxAlerts: Infinity,
    hasAds: false,
    fastUpdates: true,
    advancedIndicators: true,
    moreNotificationOptions: true,
  },
} as const;

export const createSubscriptionModel = (
  data: CreateSubscriptionDTO,
): Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'> => {
  const features = PLAN_FEATURES[data.plan];
  const endDate = data.billingPeriod === 'yearly'
    ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    : new Date(new Date().setMonth(new Date().getMonth() + 1));

  return {
    deviceId: data.deviceId,
    plan: data.plan,
    billingPeriod: data.billingPeriod || 'monthly',
    maxAlerts: features.maxAlerts,
    hasAds: features.hasAds,
    fastUpdates: features.fastUpdates,
    advancedIndicators: features.advancedIndicators,
    moreNotificationOptions: features.moreNotificationOptions,
    status: 'active',
    startDate: new Date(),
    endDate,
  };
};
