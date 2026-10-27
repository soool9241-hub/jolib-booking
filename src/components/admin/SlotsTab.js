import { genSlots } from '@/utils/helpers';
import s from '../styles/AdminPanel.module.css';

export default function SlotsTab({ project, admDate, setAdmDate, isBlk, getBooked, toggleBlk }) {
  const { dates: DATES, maxPersons: MAX_PERSONS, slotMinutes } = project;
  return (
    <>
      <div className={s.dateBtns}>
        {DATES.map(d => (
          <button
            key={d.key}
            className={`${s.dateBtn} ${admDate.key === d.key ? s.dateBtnActive : ''}`}
            onClick={() => setAdmDate(d)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className={s.legend}>
        <span>🟢 가능</span><span>🔴 차단</span><span>🟡 예약있음</span>
      </div>

      <div className={s.slotList}>
        {genSlots(admDate.startHour, admDate.endHour, slotMinutes).map(sl => {
          const blk = isBlk(admDate.key, sl);
          const bk = getBooked(admDate.key, sl);
          const rm = blk ? 0 : MAX_PERSONS - bk;
          let bg = '#f0faf0', br = '#c8e6c9', st = rm + '명 가능';
          if (blk) { bg = '#ffebee'; br = '#ef9a9a'; st = '차단됨'; }
          else if (bk > 0) { bg = '#fffde7'; br = '#fff9c4'; st = bk + '명 예약 / ' + rm + '명 남음'; }
          return (
            <div key={sl} className={s.slotRow} style={{ background: bg, border: '2px solid ' + br }}>
              <div>
                <div className={s.slotTime}>{sl}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: blk ? '#e53935' : bk > 0 ? '#f57f17' : '#4caf50' }}>{st}</div>
              </div>
              <button className={s.slotToggle} style={{ background: blk ? '#4caf50' : '#e53935' }} onClick={() => toggleBlk(admDate.key, sl)}>
                {blk ? '🔓 해제' : '🔒 차단'}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
