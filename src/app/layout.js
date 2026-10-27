import { Noto_Sans_KR, Bagel_Fat_One } from 'next/font/google';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
});

const bagelFatOne = Bagel_Fat_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-bagel-fat-one',
});

export const metadata = {
  metadataBase: new URL('https://jolib-booking.vercel.app'),
  title: '조립공간 체험 예약',
  description: '끼우고 · 쌓고 · 만드는 모듈형 조립 체험 예약',
  openGraph: {
    type: 'website',
    title: '조립공간 체험 예약',
    description: '🧩 끼우고 · 쌓고 · 만드는 모듈형 조립 체험 예약',
    url: 'https://jolib-booking.vercel.app',
    siteName: '조립공간 체험 예약',
    locale: 'ko_KR',
    images: [{ url: '/og-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '조립공간 체험 예약',
    description: '🧩 끼우고 · 쌓고 · 만드는 모듈형 조립 체험 예약',
    images: ['/og-image.jpg'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${bagelFatOne.variable}`}>
      <body style={{ fontFamily: 'var(--font-noto-sans-kr), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
