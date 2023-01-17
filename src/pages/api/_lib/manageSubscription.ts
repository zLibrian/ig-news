import { Fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';
import { stripe } from '../../../services/stripe';

type ManageSubscriptionProps = {
  subscriptionId: string;
  customerId: string;
  createAction: boolean;
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

  if (props.createAction) {
    await Fauna.query(
      q.Create(q.Collection('subscriptions'), { data: subscriptionData })
    );
  } else {
    await Fauna.query(
      q.Replace(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('subscription_by_id'), props.subscriptionId))
        ),
        { data: subscriptionData }
      )
    );
  }
}
