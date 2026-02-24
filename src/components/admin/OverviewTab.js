import { DATES } from '@/lib/constants';
import { genSlots, fmt } from '@/utils/helpers';
import s from '../styles/AdminPanel.module.css';

export default function OverviewTab({ bookings, blocked, totBooked, totRev, isBlk, loadData, admReset }) {
  return (
    <>
      <div className={s.statGrid}>
        <div className={s.statCard}><div style={{ fontSize: 28 }}>👥</div><div className={s.statVal}>{totBooked}명</div><div className={s.statLbl}>예약 인원</div></div>
        <div className={s.statCard}><div style={{ fontSize: 28 }}>📝</div><div className={s.statVal}>{bookings.length}건</div><div className={s.statLbl}>예약 건수</div></div>
        <div className={s.statCard}><div style={{ fontSize: 28 }}>💰</div><div className={s.statVal}>{fmt(totRev)}</div><div className={s.statLbl}>예상 매출</div></div>
        <div className={s.statCard}><div style={{ fontSize: 28 }}>🚫</div><div className={s.statVal}>{blocked.length}개</div><div className={s.statLbl}>차단 타임</div></div>
      </div>

      {DATES.map(d => {
        const slots = genSlots(d.startHour, d.endHour);
        const dp = bookings.filter(b => b.date === d.key).reduce((sum, b) => sum + (b.count || 1), 0);
        const db = slots.filter(sl => isBlk(d.key, sl)).length;
        const tc = slots.length * 6;
        return (
          <div key={d.key} className={s.dayCard}>
            <div className={s.dayHeader}>
              <span style={{ fontWeight: 800 }}>{d.label}</span>
              <span style={{ fontSize: 12, color: '#999' }}>{d.startHour}:00~{d.endHour}:00</span>
            </div>
            <div className={s.dayStats}><span>예약 {dp}/{tc}명</span><span>차단 {db}타임</span></div>
            <div className={s.barBg}><div className={s.barFill} style={{ width: (dp / tc * 100) + '%' }} /></div>
          </div>
        );
      })}

      <button className={s.refreshBtn} onClick={loadData}>🔄 새로고침</button>
      <button className={s.resetBtn} onClick={admReset}>⚠️ 전체 초기화</button>
    </>
  );
}
