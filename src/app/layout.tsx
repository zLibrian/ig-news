import { Roboto } from '@next/font/google';
import { Header } from '../components/Header';
import NextAuthProvider from '../Context/NextAuthProvider';
import '../styles/globals.scss';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={roboto.className}>
        <NextAuthProvider>
          <Header />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
