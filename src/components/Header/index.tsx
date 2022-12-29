import Image from 'next/image';
import { SignInButton } from '../SignInButton';
import { ActiveLink } from './ActiveLink';

import styles from './page.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src="/images/logo.svg" alt="ig.news" width={100} height={100} />
        <nav>
          <ActiveLink href="/">Home</ActiveLink>
          <ActiveLink href="/posts">Posts</ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
