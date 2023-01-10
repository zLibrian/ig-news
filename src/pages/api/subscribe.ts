import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../services/stripe';
import { getSession } from 'next-auth/react';

async function subscribe(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true });
  }

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
      success_url: 'http://localhost:3000/posts',
      cancel_url: 'http://localhost:3000/',
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

export default subscribe;
