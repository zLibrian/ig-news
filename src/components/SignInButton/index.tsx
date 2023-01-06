'use client';

import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { useSession, signIn, signOut } from 'next-auth/react';

import styles from './styles.module.scss';

export function SignInButton() {
  const { data: isUserLoggedIn } = useSession();

  return isUserLoggedIn ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}>
      <FaGithub color="#04d361" />
      {isUserLoggedIn.user?.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      onClick={() => signIn('github')}
      type="button"
      className={styles.signInButton}>
      <FaGithub color="#eba417" />
      Sign in with GitHub
    </button>
  );
}
