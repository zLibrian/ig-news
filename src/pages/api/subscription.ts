import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../services/stripe';
import { getSession } from 'next-auth/react';

export async function subscription(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(401).end('Unauthorized');
    }

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email as string,
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      success_url: String(process.env.STRIPE_SUCCESS_URL),
      cancel_url: String(process.env.STRIPE_CANCEL_URL),
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      line_items: [{ price: 'price_1MJOc5D88dJm5CJ9wMQkyLV6', quantity: 1 }],
    });

    return res.status(200).json({ sessionId: checkoutSession.id });
  }

  res.setHeader('Allow', 'POST');
  return res.status(405).end('Method not allowed');
}
