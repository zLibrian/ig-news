import { Roboto } from '@next/font/google';
import { Header } from '../components/Header';
import '../styles/globals.scss';

const roboto = Roboto({
  weight: ['400', '500', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className}>
      <head />
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
