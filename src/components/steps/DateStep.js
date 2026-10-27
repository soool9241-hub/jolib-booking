import { DATES, MAX_PERSONS, BOOKING_OPEN } from '@/lib/constants';
import { genSlots } from '@/utils/helpers';
import s from '../styles/DateStep.module.css';

export default function DateStep({ getShown, onSelect }) {
  return (
    <div className={s.wrapper}>
      <h2 className={s.title}>{BOOKING_OPEN ? '날짜를 선택해주세요' : '예약 현황'}</h2>
      {!BOOKING_OPEN && (
        <div className={s.closedNotice}>
          🔒 예약이 마감되었습니다{'\n'}날짜를 누르면 시간대별 최종 예약 현황을 볼 수 있어요
        </div>
      )}
      <div className={s.grid}>
        {DATES.map(d => {
          const slots = genSlots(d.startHour, d.endHour);
          const ts = slots.length * MAX_PERSONS;
          const booked = slots.reduce((sum, sl) => sum + getShown(d.key, sl), 0);
          const pct = Math.min(100, Math.round(booked / ts * 100));
          return (
            <button key={d.key} className={s.dateCard} onClick={() => onSelect(d)}>
              <div className={s.dayLabel}>Day {d.day}</div>
              <div className={s.dateLabel}>{d.label}</div>
              <div className={s.timeRange}>{slots[0]} ~ {slots.at(-1)} · {slots.length}타임</div>
              <div className={s.barBg}><div className={s.barFill} style={{ width: pct + '%' }} /></div>
              {BOOKING_OPEN
                ? <div className={s.remaining}>잔여 {ts - booked}/{ts}명</div>
                : <div className={s.closedLabel}>예약 마감 · {booked}명 참여</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
