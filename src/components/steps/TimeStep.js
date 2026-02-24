import { genSlots } from '@/utils/helpers';
import s from '../styles/TimeStep.module.css';

export default function TimeStep({ selDate, isBlk, getRem, onSelect }) {
  return (
    <div className={s.wrapper}>
      <h2 className={s.title}>{selDate.label} 시간 선택</h2>
      <div className={s.grid}>
        {genSlots(selDate.startHour, selDate.endHour).map(sl => {
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
