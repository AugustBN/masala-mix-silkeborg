/**
 * Payment provider abstraction.
 * Swap `activeProvider` for any real implementation (Stripe, Quickpay, MobilePay, etc.)
 * Set VITE_PAYMENT_PROVIDER in .env to enable a real provider.
 */

export interface PaymentResult {
  success: boolean;
  redirectUrl?: string;
  sessionId?: string;
  error?: string;
}

export interface PaymentProvider {
  name: string;
  initiatePayment: (params: {
    amountDKK: number;
    orderId: string;
    customerEmail: string;
    customerName: string;
    description: string;
  }) => Promise<PaymentResult>;
}

// --- Stub provider (used until a real provider is configured) ---
const stubProvider: PaymentProvider = {
  name: 'stub',
  initiatePayment: async ({ orderId, amountDKK }) => {
    console.info(`[payment:stub] orderId=${orderId} amount=${amountDKK} DKK — no provider configured`);
    return { success: false, error: 'No payment provider configured. Set VITE_PAYMENT_PROVIDER in .env.' };
  },
};

// --- Swap point: add real providers here ---
// Example Stripe:
//   import { stripeProvider } from './providers/stripe';
// Example Quickpay:
//   import { quickpayProvider } from './providers/quickpay';

const PROVIDER = import.meta.env.VITE_PAYMENT_PROVIDER ?? 'stub';

const providerMap: Record<string, PaymentProvider> = {
  stub: stubProvider,
  // stripe: stripeProvider,
  // quickpay: quickpayProvider,
};

export const paymentProvider: PaymentProvider = providerMap[PROVIDER] ?? stubProvider;
