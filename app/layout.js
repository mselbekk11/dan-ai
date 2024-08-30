import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

const imageURL = `https://www.morganai.vip/og.png`;

export const metadata = {
  title: 'Morgan AI',
  description: 'Generate images of Morgan',
  openGraph: {
    images: [imageURL],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
