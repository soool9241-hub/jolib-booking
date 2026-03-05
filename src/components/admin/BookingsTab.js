import * as XLSX from 'xlsx';
import { fmt, columnsToChildren } from '@/utils/helpers';
import s from '../styles/AdminPanel.module.css';

function downloadExcel(bookings) {
  const rows = bookings.map((b, i) => {
    const ch = columnsToChildren(b);
    const childrenStr = ch.map(c => `${c.name}(${c.gender},${c.age}세)`).join(' / ');
    return {
      '번호': i + 1,
      '날짜': b.date,
      '시간': b.time,
      '이름': b.name,
      '전화번호': b.phone,
      '인원': b.count,
      '결제방식': b.payment === 'transfer' ? '사전예약(이체)' : '현장카드',
      '금액': b.total_price,
      '상태': b.status,
      '아이정보': childrenStr,
    };
  });
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [
    { wch: 5 }, { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 15 },
    { wch: 5 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 30 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '예약목록');
  XLSX.writeFile(wb, `예약자리스트_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

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

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button className={s.refreshBtn} style={{ flex: 1, margin: 0 }} onClick={loadData}>🔄 새로고침</button>
        <button className={s.refreshBtn} style={{ flex: 1, margin: 0, background: '#2e7d32', color: '#fff' }} onClick={() => downloadExcel(bookings)}>📥 엑셀 다운로드</button>
      </div>

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
