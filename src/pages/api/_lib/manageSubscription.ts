import { Fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';
import { stripe } from '../../../services/stripe';

type ManageSubscriptionProps = {
  subscriptionId: string;
  customerId: string;
};

export async function saveSubscription(props: ManageSubscriptionProps) {
  const userRef = await Fauna.query(
    q.Select(
      'ref',
      q.Get(q.Match(q.Index('user_by_stripe_customer_id'), props.customerId))
    )
  );

  const subscription = await stripe.subscriptions.retrieve(
    props.subscriptionId
  );

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
  };

  await Fauna.query(
    q.If(
      q.Not(
        q.Exists(
          q.Match(q.Index('user_by_stripe_customer_id'), subscription.id)
        )
      ),
      q.Create(q.Collection('subscriptions'), { data: subscriptionData }),
      q.Replace(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('user_by_stripe_customer_id'), subscription.id))
        ),
        { data: subscriptionData }
      )
    )
  );
}
