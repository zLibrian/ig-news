import Stripe from 'stripe';
import { saveSubscription } from '../_lib/manageSubscription';

export const relevantEvents = new Set(['checkout.session.completed']);

export const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = checkoutSession.subscription as string;
      const customerId = checkoutSession.customer as string;

      await saveSubscription({ subscriptionId, customerId });

      break;
    default:
      throw new Error('Unhandled event.');
  }
};
