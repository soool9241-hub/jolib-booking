import { Noto_Sans_KR, Bagel_Fat_One } from 'next/font/google';
import { CURRENT } from '@/projects';
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

// 공유 미리보기(카톡 등)는 진행 중인 프로젝트 정보를 쓴다
const OPEN = CURRENT.status === 'open';
const TITLE = OPEN ? `${CURRENT.intro.title} 체험 예약 | 조립공간` : '조립공간 체험 예약';
const DESC = (OPEN && CURRENT.ogDescription) || '🧩 끼우고 · 쌓고 · 만드는 모듈형 조립 체험 예약';
const OG_IMAGE = (OPEN && CURRENT.ogImage) || '/og-image.jpg';

export const metadata = {
  metadataBase: new URL('https://jolib-booking.vercel.app'),
  title: TITLE,
  description: DESC,
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESC,
    url: 'https://jolib-booking.vercel.app',
    siteName: '조립공간 체험 예약',
    locale: 'ko_KR',
    images: [{ url: OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: [OG_IMAGE],
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
