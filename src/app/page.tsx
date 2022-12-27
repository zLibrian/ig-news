import Image from 'next/image';
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './page.module.scss';

const getData = async () => {
  const response = await fetch('https://rickandmortyapi.com/api/character', {
    next: { revalidate: 60 * 60 * 24 },
  });
  const data = await response.json();
  return data;
};

export default async function Home() {
  const data = await getData();
  console.log(data);
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
          <span>for {`$9.90`} month</span>
        </p>
        <SubscribeButton />
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
