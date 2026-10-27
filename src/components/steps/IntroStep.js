import Image from 'next/image';
import { BOOKING_OPEN, INTRO, PT } from '@/lib/constants';
import { fmt } from '@/utils/helpers';
import s from '../styles/IntroStep.module.css';

const BADGE_COLORS = ['#FFB347', '#FF6B35', '#4caf50', '#9C6ADE'];

export default function IntroStep({ onStart, onAdminClick }) {
  return (
    <div>
      <div className={s.hero}>
        <div className={s.heroBg1} />
        <div className={s.heroBg2} />
        <div className={s.heroBg3} />
        <div className={s.heroContent}>
          <div className={s.festTag}>{INTRO.tag}</div>
          <h1 className={s.heroTitle}>{INTRO.title}</h1>
          <p className={s.heroSub}>{INTRO.sub}</p>
        </div>
      </div>

      <div style={{ padding: '28px 20px 0' }}>
        <div className={s.aboutCard}>
          {INTRO.image ? (
            <Image src={INTRO.image} alt={INTRO.imageAlt || INTRO.title} width={1440} height={1440} priority
              sizes="(max-width: 480px) 100vw, 440px" className={s.missionImg} />
          ) : (
            <div style={{ fontSize: 44, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>{INTRO.icon}</div>
          )}
          <h3 className={s.aboutH}>{INTRO.missionTitle}</h3>
          <p className={s.aboutP}>{INTRO.mission}</p>
        </div>
      </div>

      {INTRO.cards?.length > 0 && (
        <div style={{ padding: '28px 20px 0' }}>
          <h3 className={s.secTitle}>체험 소개</h3>
          <div className={s.cardList}>
            {INTRO.cards.map(c => (
              <Image key={c.src} src={c.src} alt={c.alt} width={1440} height={1440}
                sizes="(max-width: 480px) 100vw, 440px" className={s.cardImg} />
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '28px 20px 0' }}>
        <h3 className={s.secTitle}>체험 방법 안내</h3>
        <div className={s.howList}>
          {INTRO.steps.map((st, i) => (
            <div key={i} className={s.howCard}>
              <div className={s.howBadge} style={{ background: BADGE_COLORS[i % BADGE_COLORS.length] }}>STEP {i + 1}</div>
              <div style={{ fontSize: 36, marginBottom: 8, marginTop: 4 }}>{st.icon}</div>
              <div className={s.howTitle}>{st.title}</div>
              <div className={s.howDesc}>{st.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {INTRO.info.length > 3 && (
        <div className={s.infoGrid}>
          {INTRO.info.map((it, i) => (
            <div key={i} className={s.infoCell}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{it.icon}</div>
              <div className={s.infoLabel}>{it.label}</div>
              <div className={s.infoValue}>{it.value}</div>
            </div>
          ))}
        </div>
      )}

      {INTRO.info.length > 0 && INTRO.info.length <= 3 && (
        <div className={s.infoStrip}>
          {INTRO.info.map((it, i) => (
            <div key={i} style={{ display: 'contents' }}>
              {i > 0 && <div className={s.infoDivider} />}
              <div className={s.infoItem}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{it.icon}</div>
                <div className={s.infoLabel}>{it.label}</div>
                <div className={s.infoValue}>{it.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {INTRO.recommend?.length > 0 && (
        <div style={{ padding: '28px 20px 0' }}>
          <h3 className={s.secTitle}>{INTRO.recommendTitle}</h3>
          <ul className={s.recList}>
            {INTRO.recommend.map((r, i) => <li key={i} className={s.recItem}>✔️ {r}</li>)}
          </ul>
        </div>
      )}

      {INTRO.photos?.length > 0 && (
        <div style={{ padding: '28px 0 0' }}>
          <h3 className={s.secTitle}>{INTRO.photosTitle}</h3>
          <div className={s.photoRow}>
            {INTRO.photos.map(src => (
              <div key={src} className={s.photoBox}>
                <Image src={src} alt={INTRO.photosTitle} fill sizes="200px" style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {INTRO.notice && (
        <div className={s.noticeBox}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>📢</div>
          <div className={s.noticeText}>{INTRO.notice}</div>
        </div>
      )}

      <div className={s.ctaSection}>
        <button className={s.ctaBtn} onClick={onStart}>체험 예약하기 →</button>
        {BOOKING_OPEN && <div className={s.ctaSub}>체험비 1인 {fmt(PT)}부터</div>}
      </div>

      <button className={s.adminLink} onClick={onAdminClick}>관리자 모드</button>
    </div>
  );
}
