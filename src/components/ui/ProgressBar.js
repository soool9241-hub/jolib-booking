import styles from '../styles/ProgressBar.module.css';

export default function ProgressBar({ step, onBack }) {
  const labels = ['날짜', '시간', '정보'];
  return (
    <div className={styles.bar}>
      <button className={styles.backBtn} onClick={onBack}>←</button>
      <div className={styles.steps}>
        {labels.map((l, i) => (
          <div key={i} className={styles.item}>
            <div
              className={styles.dot}
              style={{
                background: step > i + 1 ? '#FF6B35' : step === i + 1 ? '#FF6B35' : '#ddd',
                transform: step === i + 1 ? 'scale(1.2)' : 'scale(1)',
              }}
            >
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 11, color: step >= i + 1 ? '#FF6B35' : '#bbb', fontWeight: step === i + 1 ? 700 : 400 }}>
              {l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
