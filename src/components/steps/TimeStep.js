import { MAX_PERSONS, BOOKING_OPEN } from '@/lib/constants';
import { genSlots } from '@/utils/helpers';
import s from '../styles/TimeStep.module.css';

export default function TimeStep({ selDate, isBlk, getRem, getShown, onSelect }) {
  const slots = genSlots(selDate.startHour, selDate.endHour);

  if (!BOOKING_OPEN) {
    const total = slots.reduce((sum, sl) => sum + getShown(selDate.key, sl), 0);
    const fullCount = slots.filter(sl => getShown(selDate.key, sl) >= MAX_PERSONS).length;
    return (
      <div className={s.wrapper}>
        <h2 className={s.title}>{selDate.label} 예약 현황</h2>
        <div className={s.closedNotice}>
          🔒 예약이 마감되었습니다 · 총 {total}명 참여, 만석 {fullCount}타임
        </div>
        <div className={s.grid}>
          {slots.map(sl => {
            const n = getShown(selDate.key, sl);
            const full = n >= MAX_PERSONS;
            return (
              <button key={sl} className={`${s.timeSlot} ${s.closedSlot}`} disabled>
                <div className={s.timeLabel}>{sl}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: full ? '#e53935' : n > 0 ? '#FF6B35' : '#bbb' }}>
                  {full ? '만석' : n + '/' + MAX_PERSONS + '명'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={s.wrapper}>
      <h2 className={s.title}>{selDate.label} 시간 선택</h2>
      <div className={s.grid}>
        {slots.map(sl => {
          const blk = isBlk(selDate.key, sl);
          const rm = getRem(selDate.key, sl);
          const full = rm <= 0;
          return (
            <button
              key={sl}
              className={s.timeSlot}
              disabled={full}
              onClick={() => onSelect(sl)}
            >
              <div className={s.timeLabel}>{sl}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: full ? '#ccc' : rm <= 1 ? '#e53935' : '#4caf50' }}>
                {blk ? '차단' : full ? '마감' : rm + '명 남음'}
              </div>
              {rm === 1 && !full && <div className={s.urgBadge}>1자리!</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
