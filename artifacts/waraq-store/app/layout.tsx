import type { Metadata } from 'next';
import '../src/index.css';
import './store.css';
import { CartProvider } from '../components/CartProvider';
import { Navbar } from '../components/Navbar';
import { StoreFooter } from '../components/StoreFooter';

export const metadata: Metadata = {
  title: 'وَرَق — أخضر يجدد بيتك',
  description:
    'نباتات ظل منزلية سهلة العناية، أصص يدوية ومجموعات عناية بالتربة.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <StoreFooter />
        </CartProvider>
      </body>
    </html>
  );
}
