import Image from 'next/image';
import styles from './page.module.scss';

export default function Home() {
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
        <button type="button">Subscribe now</button>
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
