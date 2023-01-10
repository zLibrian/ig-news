'use client';

import { signIn, useSession } from 'next-auth/react';
import styles from './styles.module.scss';
import { api } from '../../services/api/axios';
import { getStripeJs } from '../../services/stripe-js';

type SubscribeButtonProps = {
  priceId: string;
};

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();

  const handleSubscription = async () => {
    if (!session) {
      signIn('github');
      return;
    }

    try {
      const { data } = await api.post('/subscribe');

      const { sessionId } = data;

      const stripe = await getStripeJs();

      await stripe?.redirectToCheckout({ sessionId });
    } catch (error: any) {
      console.log(error);
      alert('An error occurred');
    }
  };

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscription}>
      Subscribe now
    </button>
  );
}
