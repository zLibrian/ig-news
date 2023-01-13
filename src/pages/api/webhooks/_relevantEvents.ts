import Stripe from 'stripe';

export const relevantEvents = new Set(['checkout.session.completed']);

export const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('Checkout session completed. EEEEEEEEEEEEEEEEE');
      break;
    default:
      throw new Error('Unhandled event.');
  }
};
