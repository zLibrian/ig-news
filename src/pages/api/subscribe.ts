import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../services/stripe';
import { getSession } from 'next-auth/react';
import { Fauna } from '../../services/fauna';
import { query as q } from 'faunadb';

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

async function subscribe(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session?.user) {
      return res.status(401).end('Unauthorized');
    }

    const user = await Fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email as string)
        )
      )
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email as string,
      });

      await Fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      customerId = stripeCustomer.id;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
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
