'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton } from '../SignInButton';

import styles from './page.module.scss';

export function Header() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src="/images/logo.svg" alt="ig.news" width={100} height={100} />
        <nav>
          <Link className={pathname === '/' ? styles.active : ''} href="/">
            Home
          </Link>
          <Link
            className={pathname?.includes('/post') ? styles.active : ''}
            href="/posts"
          >
            Post
          </Link>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
