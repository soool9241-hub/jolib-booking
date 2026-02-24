import styles from '../styles/Modal.module.css';

export default function EditModal({ editing, editF, setEditF, onSave, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.editBox}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>✏️ 예약 수정</h3>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{editing.date} {editing.time}</div>

        <div className={styles.editGroup}>
          <label className={styles.editLabel}>이름</label>
          <input className={styles.editInput} value={editF.name} onChange={e => setEditF({ ...editF, name: e.target.value })} />
        </div>
        <div className={styles.editGroup}>
          <label className={styles.editLabel}>연락처</label>
          <input className={styles.editInput} value={editF.phone} onChange={e => setEditF({ ...editF, phone: e.target.value })} />
        </div>
        <div className={styles.editGroup}>
          <label className={styles.editLabel}>인원</label>
          <input className={styles.editInput} type="number" min="1" max="6" value={editF.count} onChange={e => setEditF({ ...editF, count: parseInt(e.target.value) || 1 })} />
        </div>
        <div className={styles.editGroup}>
          <label className={styles.editLabel}>결제</label>
          <div className={styles.payBtnRow}>
            <button className={`${styles.payBtn} ${editF.payment === 'transfer' ? styles.payBtnActive : ''}`} onClick={() => setEditF({ ...editF, payment: 'transfer' })}>사전예약</button>
            <button className={`${styles.payBtn} ${editF.payment === 'card' ? styles.payBtnActive : ''}`} onClick={() => setEditF({ ...editF, payment: 'card' })}>카드</button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className={styles.okBtn} onClick={onSave}>저장</button>
          <button className={styles.cancelBtn} onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
