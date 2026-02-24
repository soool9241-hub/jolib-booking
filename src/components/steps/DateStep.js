import { DATES, MAX_PERSONS } from '@/lib/constants';
import { genSlots } from '@/utils/helpers';
import s from '../styles/DateStep.module.css';

export default function DateStep({ getRem, onSelect }) {
  return (
    <div className={s.wrapper}>
      <h2 className={s.title}>날짜를 선택해주세요</h2>
      <div className={s.grid}>
        {DATES.map(d => {
          const slots = genSlots(d.startHour, d.endHour);
          const tr = slots.reduce((sum, sl) => sum + getRem(d.key, sl), 0);
          const ts = slots.length * MAX_PERSONS;
          const pct = Math.round((ts - tr) / ts * 100);
          return (
            <button key={d.key} className={s.dateCard} onClick={() => onSelect(d)}>
              <div className={s.dayLabel}>Day {d.day}</div>
              <div className={s.dateLabel}>{d.label}</div>
              <div className={s.timeRange}>{d.startHour}:00 ~ {d.endHour}:00</div>
              <div className={s.barBg}><div className={s.barFill} style={{ width: pct + '%' }} /></div>
              <div className={s.remaining}>잔여 {tr}/{ts}명</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
