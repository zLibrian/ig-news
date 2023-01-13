import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { stripe } from '../../../services/stripe';
import { buffer } from './_helpers';
import { handleStripeWebhookEvent, relevantEvents } from './_relevantEvents';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function WebHooks(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buff = await buffer(req);
    const secret = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buff,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    try {
      if (relevantEvents.has(event.type)) {
        await handleStripeWebhookEvent(event);
      }
    } catch (err: any) {
      return res.json({ error: 'Webhook handler failed.' });
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}

export default WebHooks;
