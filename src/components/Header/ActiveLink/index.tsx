'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../page.module.scss';

type ActiveLinkProps = LinkProps & {
  children: React.ReactNode;
};

export function ActiveLink({ children, ...props }: ActiveLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={
        pathname === props.href || pathname?.startsWith(String(props.as))
          ? styles.active
          : ''
      }
    >
      {children}
    </Link>
  );
}
