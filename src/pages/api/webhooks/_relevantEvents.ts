import Stripe from 'stripe';
import { saveSubscription } from '../_lib/manageSubscription';

export const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;

      await saveSubscription({
        subscriptionId: subscription.id,
        customerId: subscription.customer.toString(),
        createAction: false,
      });

      break;
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = checkoutSession.subscription as string;
      const customerId = checkoutSession.customer as string;

      await saveSubscription({
        subscriptionId,
        customerId,
        createAction: true,
      });
      break;

    default:
      throw new Error('Unhandled event.');
  }
};
