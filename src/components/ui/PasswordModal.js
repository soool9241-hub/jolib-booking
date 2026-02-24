import styles from '../styles/Modal.module.css';

export default function PasswordModal({ pw, setPw, pwErr, setPwErr, onLogin, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.pwBox}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>관리자 로그인</h3>
        <input
          className={styles.pwInput}
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={e => { setPw(e.target.value); setPwErr(false); }}
          onKeyDown={e => e.key === 'Enter' && onLogin()}
          autoFocus
        />
        {pwErr && <div className={styles.pwError}>비밀번호가 틀렸습니다</div>}
        <div className={styles.btnRow}>
          <button className={styles.okBtn} onClick={onLogin}>로그인</button>
          <button className={styles.cancelBtn} onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
