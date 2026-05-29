import { loadStripe } from '@stripe/stripe-js';

// CRITICAL: TEST MODE ONLY — no real charges will be made
// Replace with your own Stripe test publishable key
const STRIPE_PUBLIC_KEY =
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
  'pk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const formatCents = (cents: number): string => {
  return `€${(cents / 100).toFixed(2)}`;
};
