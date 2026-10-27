import { BOOKING_OPEN } from '@/lib/constants';
import s from '../styles/IntroStep.module.css';

export default function IntroStep({ onStart, onAdminClick }) {
  return (
    <div>
      <div className={s.hero}>
        <div className={s.heroBg1} />
        <div className={s.heroBg2} />
        <div className={s.heroBg3} />
        <div className={s.heroContent}>
          <div className={s.festTag}>🧩 조립공간</div>
          <h1 className={s.heroTitle}>체험 예약</h1>
          <p className={s.heroSub}>끼우고 · 쌓고 · 만드는 모듈형 조립 체험</p>
        </div>
      </div>

      <div style={{ padding: '28px 20px 0' }}>
        <div className={s.aboutCard}>
          <div style={{ fontSize: 44, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>🧩</div>
          <h3 className={s.aboutH}>{BOOKING_OPEN ? '예약 진행 중!' : '다음 체험 준비 중'}</h3>
          <p className={s.aboutP}>
            {BOOKING_OPEN
              ? <>{'지금 체험 예약을 받고 있어요.\n'}<strong>원하는 날짜와 시간을 골라주세요!</strong></>
              : <>{'새로운 체험을 준비하고 있어요.\n'}<strong>체험이 열리면 이곳에서 예약할 수 있어요!</strong></>}
          </p>
        </div>
      </div>

      <div style={{ padding: '28px 20px 0' }}>
        <h3 className={s.secTitle}>체험 방법 안내</h3>
        <div className={s.howList}>
          <div className={s.howCard}>
            <div className={s.howBadge} style={{ background: '#FFB347' }}>STEP 1</div>
            <div style={{ fontSize: 36, marginBottom: 8, marginTop: 4 }}>📋</div>
            <div className={s.howTitle}>체험 안내</div>
            <div className={s.howDesc}>{'체험 미션과 조립 방법을\n안내받아요'}</div>
          </div>
          <div className={s.howCard}>
            <div className={s.howBadge} style={{ background: '#FF6B35' }}>STEP 2</div>
            <div style={{ fontSize: 36, marginBottom: 8, marginTop: 4 }}>🤲</div>
            <div className={s.howTitle}>조립 체험</div>
            <div className={s.howDesc}>{'나무 조각을 끼우고 쌓아서\n나만의 작품을 만들어요'}</div>
          </div>
          <div className={s.howCard}>
            <div className={s.howBadge} style={{ background: '#4caf50' }}>STEP 3</div>
            <div style={{ fontSize: 36, marginBottom: 8, marginTop: 4 }}>📸</div>
            <div className={s.howTitle}>완성작 사진 촬영</div>
            <div className={s.howDesc}>{'내가 만든 작품과 함께\n사진을 찍어요'}</div>
          </div>
        </div>
      </div>

      {!BOOKING_OPEN && (
        <div className={s.noticeBox}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>📢</div>
          <div className={s.noticeText}>
            {'지금은 예약을 받고 있지 않아요\n'}
            <strong>지난 체험의 예약 현황만 볼 수 있어요</strong>
          </div>
        </div>
      )}

      <div className={s.ctaSection}>
        <button className={s.ctaBtn} onClick={onStart}>체험 예약하기 →</button>
      </div>

      <button className={s.adminLink} onClick={onAdminClick}>관리자 모드</button>
    </div>
  );
}
