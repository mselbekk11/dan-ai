import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

const imageURL = `https://www.morganai.vip/og.png`;

export const metadata = {
  title: 'DUNIEL AI',
  description: 'Generate images of Dan',
  openGraph: {
    images: [imageURL],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
        <Script src='https://scripts.simpleanalyticscdn.com/latest.js' />
      </body>
    </html>
  );
}
