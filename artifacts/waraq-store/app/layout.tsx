import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'وَرَق — أخضر يجدد بيتك',
  description:
    'نباتات ظل منزلية سهلة العناية، أصص يدوية ومجموعات عناية بالتربة.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
