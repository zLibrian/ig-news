import Image from 'next/image';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './page.module.scss';

const getProductIdAndAmount = async () => {
  const price = await stripe.prices.retrieve('price_1MJOc5D88dJm5CJ9wMQkyLV6', {
    expand: ['product'],
  });

  const product = {
    productId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format((price.unit_amount || 0) / 100),
  };

  return product;
};

export default async function Home() {
  const product = await getProductIdAndAmount();

  return (
    <main className={styles.heroContainer}>
      <section className={styles.heroContent}>
        <p>👏 Hey, welcome</p>
        <h2>
          News about <br />
          the <span>React</span> world
        </h2>
        <p>
          Get access to all the publications <br />
          <span>for {product.amount} month</span>
        </p>
        <SubscribeButton priceId={product.productId} />
      </section>
      <Image
        src="/images/avatar.svg"
        alt="woman coding"
        width={340}
        height={520}
      />
    </main>
  );
}
