import { fmt, columnsToChildren } from '@/utils/helpers';
import s from '../styles/AdminPanel.module.css';

export default function BookingsTab({ bookings, bkTab, setBkTab, toggleStatus, startEdit, admCancel, loadData }) {
  const pending = bookings.filter(b => b.status !== '입금완료');
  const confirmed = bookings.filter(b => b.status === '입금완료');

  const renderCard = (b, i, isPending) => (
    <div key={b.id} className={s.bCard} style={{ borderLeft: `4px solid ${isPending ? '#FF6B35' : '#4caf50'}` }}>
      <div className={s.bTop}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: isPending ? '#FF6B35' : '#4caf50', marginRight: 8 }}>#{i + 1}</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{b.date} {b.time}</span>
        </div>
        <div className={s.bPayBadge} style={{
          background: b.payment === 'transfer' ? '#e8f5e9' : '#fff3e0',
          color: b.payment === 'transfer' ? '#2e7d32' : '#e65100',
        }}>
          {b.payment === 'transfer' ? '사전예약' : '카드'} {fmt(b.total_price)}
        </div>
      </div>
      <div className={s.bBody}>
        <div style={{ fontWeight: 700 }}>{b.name} <span style={{ fontWeight: 400, color: '#888' }}>({b.count}명)</span></div>
        <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{b.phone}</div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
          결제: <span style={{ fontWeight: 600, color: b.payment === 'transfer' ? '#2e7d32' : '#e65100' }}>
            {b.payment === 'transfer' ? '사전예약(이체)' : '현장카드'}
          </span>
        </div>
        {(() => {
          const ch = columnsToChildren(b);
          return ch.length > 0 && (
            <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ch.map((c, j) => (
                <span key={j} className={s.childTag} style={{
                  background: c.gender === '남' ? '#E3F2FD' : '#FCE4EC',
                  color: c.gender === '남' ? '#1565C0' : '#C2185B',
                }}>
                  {c.name} ({c.gender}, {c.age}세)
                </span>
              ))}
            </div>
          );
        })()}
      </div>
      <div className={s.bActions}>
        <button className={s.bEditBtn} style={{ color: isPending ? '#4caf50' : '#FF6B35' }} onClick={() => toggleStatus(b)}>
          {isPending ? '✅ 입금완료' : '⏳ 입금대기로'}
        </button>
        <button className={s.bEditBtn} onClick={() => startEdit(b)}>✏️ 수정</button>
        <button className={s.bDelBtn} onClick={() => admCancel(b)}>🗑️ 취소</button>
      </div>
    </div>
  );

  return (
    <>
      <div className={s.subTabs}>
        <button className={s.subTab} style={{ background: bkTab === 'pending' ? '#FF6B35' : '#fff', color: bkTab === 'pending' ? '#fff' : '#999' }} onClick={() => setBkTab('pending')}>
          ⏳ 입금대기 ({pending.length})
        </button>
        <button className={s.subTab} style={{ background: bkTab === 'confirmed' ? '#4caf50' : '#fff', color: bkTab === 'confirmed' ? '#fff' : '#999' }} onClick={() => setBkTab('confirmed')}>
          ✅ 입금완료 ({confirmed.length})
        </button>
      </div>

      <button className={s.refreshBtn} onClick={loadData}>🔄 새로고침</button>

      {bkTab === 'pending' && (
        <>
          {pending.length === 0 && <div className={s.empty}>입금대기 예약이 없습니다</div>}
          {pending.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((b, i) => renderCard(b, i, true))}
        </>
      )}

      {bkTab === 'confirmed' && (
        <>
          {confirmed.length === 0 && <div className={s.empty}>입금완료 예약이 없습니다</div>}
          {confirmed.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((b, i) => renderCard(b, i, false))}
        </>
      )}
    </>
  );
}
