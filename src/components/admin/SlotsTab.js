import { useState } from 'react';
import { genSlots, columnsToChildren } from '@/utils/helpers';
import s from '../styles/AdminPanel.module.css';

export default function SlotsTab({ project, bookings, admDate, setAdmDate, isBlk, getBooked, toggleBlk }) {
  const { dates: DATES, maxPersons: MAX_PERSONS, slotMinutes } = project;
  // 시간을 누르면 그 시간 예약자 목록을 펼친다
  const [open, setOpen] = useState(null);

  return (
    <>
      <div className={s.dateBtns}>
        {DATES.map(d => (
          <button
            key={d.key}
            className={`${s.dateBtn} ${admDate.key === d.key ? s.dateBtnActive : ''}`}
            onClick={() => { setAdmDate(d); setOpen(null); }}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className={s.legend}>
        <span>🟢 가능</span><span>🔴 차단</span><span>🟡 예약있음</span>
      </div>
      <div className={s.slotHint}>시간을 누르면 예약자 명단이 보여요</div>

      <div className={s.slotList}>
        {genSlots(admDate.startHour, admDate.endHour, slotMinutes).map(sl => {
          const blk = isBlk(admDate.key, sl);
          const bk = getBooked(admDate.key, sl);
          const rm = blk ? 0 : MAX_PERSONS - bk;
          const list = bookings.filter(b => b.date === admDate.key && b.time === sl);
          const isOpen = open === sl;
          let bg = '#f0faf0', br = '#c8e6c9', st = rm + '명 가능';
          if (blk) { bg = '#ffebee'; br = '#ef9a9a'; st = '차단됨'; }
          else if (bk > 0) { bg = '#fffde7'; br = '#fff9c4'; st = bk + '명 예약 / ' + rm + '명 남음'; }
          if (blk && bk > 0) st = '차단됨 · ' + bk + '명 예약';
          return (
            <div key={sl} className={s.slotWrap} style={{ background: bg, border: '2px solid ' + br }}>
              <div className={s.slotRow} onClick={() => setOpen(isOpen ? null : sl)} style={{ cursor: 'pointer' }}>
                <div>
                  <div className={s.slotTime}>{sl} <span className={s.slotArrow}>{isOpen ? '▲' : '▼'}</span></div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: blk ? '#e53935' : bk > 0 ? '#f57f17' : '#4caf50' }}>
                    {st}{list.length > 0 && ` · ${list.length}가족`}
                  </div>
                </div>
                <button className={s.slotToggle} style={{ background: blk ? '#4caf50' : '#e53935' }}
                  onClick={e => { e.stopPropagation(); toggleBlk(admDate.key, sl); }}>
                  {blk ? '🔓 해제' : '🔒 차단'}
                </button>
              </div>

              {isOpen && (
                <div className={s.slotDetail}>
                  {list.length === 0 && <div className={s.slotEmpty}>이 시간 예약자가 없어요</div>}
                  {list.map(b => {
                    const ch = columnsToChildren(b);
                    const paid = b.status === '입금완료';
                    return (
                      <div key={b.id} className={s.slotPerson}>
                        <div className={s.slotPersonTop}>
                          <span style={{ fontWeight: 800 }}>{b.name} <span style={{ fontWeight: 500, color: '#888' }}>· 아이 {b.count || 1}명</span></span>
                          <span className={s.slotPay} style={{ background: paid ? '#e8f5e9' : '#fff3e0', color: paid ? '#2e7d32' : '#e65100' }}>
                            {paid ? '입금완료' : '입금대기'}
                          </span>
                        </div>
                        {b.phone && <a href={`tel:${b.phone}`} className={s.slotPhone}>📞 {b.phone}</a>}
                        {ch.length > 0 && (
                          <div className={s.slotKids}>
                            {ch.map((c, j) => (
                              <span key={j} className={s.childTag} style={{
                                background: c.gender === '남' ? '#E3F2FD' : '#FCE4EC',
                                color: c.gender === '남' ? '#1565C0' : '#C2185B',
                              }}>
                                {c.name}{c.age && ` (${c.age}세)`}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
