// ── Platform-wide pricing & commission config ───────────────────────────────
// Single source of truth — admin-editable, consumed by tipster onboarding,
// subscription flows, and payout calculations.

export interface PlatformPricing {
  /** One-time fee (NGN) to upgrade a user account to tipster */
  tipsterRegistrationFeeNgn: number;
  /** Arena's cut on VIP channel subscription revenue (%) */
  subscriptionCommissionPercent: number;
  /** Arena's cut on paid single predictions (%) */
  predictionCommissionPercent: number;
  /** Fee deducted on tipster payout withdrawals (%) */
  payoutProcessingFeePercent: number;
  /** Minimum monthly VIP channel price tipsters can set */
  minChannelPriceNgn: number;
  /** Maximum monthly VIP channel price tipsters can set */
  maxChannelPriceNgn: number;
  /** Suggested default VIP price shown during onboarding */
  defaultChannelPriceNgn: number;
  currency: 'NGN';
  updatedAt: string;
}

export const DEFAULT_PLATFORM_PRICING: PlatformPricing = {
  tipsterRegistrationFeeNgn: 5000,
  subscriptionCommissionPercent: 15,
  predictionCommissionPercent: 10,
  payoutProcessingFeePercent: 2,
  minChannelPriceNgn: 500,
  maxChannelPriceNgn: 50000,
  defaultChannelPriceNgn: 2500,
  currency: 'NGN',
  updatedAt: new Date().toISOString(),
};

/** Calculate tipster earnings after Arena commission */
export function calcTipsterEarnings(grossNgn: number, commissionPercent: number) {
  const commission = Math.round(grossNgn * (commissionPercent / 100));
  return {
    gross: grossNgn,
    commission,
    net: grossNgn - commission,
    commissionPercent,
  };
}

export function formatNgn(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}
