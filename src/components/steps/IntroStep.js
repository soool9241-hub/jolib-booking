import s from '../styles/IntroStep.module.css';

export default function IntroStep({ onStart, onAdminClick }) {
  return (
    <div>
      <div className={s.hero}>
        <div className={s.heroBg1} />
        <div className={s.heroBg2} />
        <div className={s.heroBg3} />
        <div className={s.heroContent}>
          <div className={s.festTag}>🏮 완주 정월대보름 한마당</div>
          <h1 className={s.heroTitle}>달토끼집 만들기</h1>
          <p className={s.heroSub}>끼우고 · 쌓고 · 만드는 모듈형 조립 체험</p>
        </div>
      </div>

      <div style={{ padding: '28px 20px 0' }}>
        <div className={s.aboutCard}>
          <div style={{ fontSize: 44, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>🌕</div>
          <h3 className={s.aboutH}>미션!</h3>
          <p className={s.aboutP}>
            정월대보름을 맞이하여 완주 둔산공원에 놀러온 달토끼들에게 <strong>잠시 쉬어가는 집을 만들어 주세요!</strong>
          </p>
          <p className={s.aboutP2}>
            토끼들에게 주어진 시간은 <strong>20분!</strong> 과연 어떤 달토끼집이 탄생할까요?
          </p>
        </div>
      </div>

      <div style={{ padding: '28px 20px 0' }}>
        <h3 className={s.secTitle}>체험 방법 안내</h3>
        <div className={s.howList}>
          <div className={s.howCard}>
            <div className={s.howBadge} style={{ background: '#FFB347' }}>STEP 1</div>
            <div style={{ fontSize: 36, marginBottom: 8, marginTop: 4 }}>📋</div>
            <div className={s.howTitle}>달토끼집 만들기 미션 설명</div>
            <div className={s.howDesc}>{'체험 미션과 조립 방법을\n안내받아요'}</div>
          </div>
          <div className={s.howCard}>
            <div className={s.howBadge} style={{ background: '#FF6B35' }}>STEP 2</div>
            <div style={{ fontSize: 36, marginBottom: 8, marginTop: 4 }}>🤲</div>
            <div className={s.howTitle}>20분간 조립 체험</div>
            <div className={s.howDesc}>{'나무 조각을 끼우고 쌓아서\n나만의 작품을 만들어요'}</div>
          </div>
          <div className={s.howCard}>
            <div className={s.howBadge} style={{ background: '#4caf50' }}>STEP 3</div>
            <div style={{ fontSize: 36, marginBottom: 8, marginTop: 4 }}>🐰</div>
            <div className={s.howTitle}>토끼와 함께 사진 촬영</div>
            <div className={s.howDesc}>{'완성된 달토끼집에 놀러온\n토끼와 함께 사진 찍어요'}</div>
          </div>
        </div>
      </div>

      <div className={s.infoStrip}>
        <div className={s.infoItem}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>📅</div>
          <div className={s.infoLabel}>일정</div>
          <div className={s.infoValue}>2/28 ~ 3/1</div>
        </div>
        <div className={s.infoDivider} />
        <div className={s.infoItem}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>⏱️</div>
          <div className={s.infoLabel}>체험시간</div>
          <div className={s.infoValue}>20분</div>
        </div>
        <div className={s.infoDivider} />
        <div className={s.infoItem}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>👧</div>
          <div className={s.infoLabel}>타임당</div>
          <div className={s.infoValue}>최대 6명</div>
        </div>
      </div>

      <div className={s.noticeBox}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>📢</div>
        <div className={s.noticeText}>
          {'저녁 시간대는 예약이 몰릴 수 있으니\n'}
          <strong>미리 신청해서 예약해주세요!</strong>
        </div>
      </div>

      <div className={s.ctaSection}>
        <button className={s.ctaBtn} onClick={onStart}>체험 예약하기 →</button>
        <div className={s.ctaSub}>체험비 1인 5,000원부터</div>
      </div>

      <button className={s.adminLink} onClick={onAdminClick}>관리자 모드</button>
    </div>
  );
}
