import { DATES, MAX_PERSONS } from '@/lib/constants';
import { genSlots, fmt } from '@/utils/helpers';
import s from '../styles/AdminPanel.module.css';

export default function OverviewTab({ bookings, blocked, totBooked, totRev, isBlk, loadData, admReset }) {
  // 예약율
  const totalSlots = DATES.reduce((sum, d) => sum + genSlots(d.startHour, d.endHour).length, 0);
  const totalCapacity = totalSlots * MAX_PERSONS;
  const bookingRate = totalCapacity ? Math.round(totBooked / totalCapacity * 100) : 0;
  const gaugeAngle = bookingRate * 1.8;

  // 입금현황
  const confirmed = bookings.filter(b => b.status === '입금완료');
  const pending = bookings.filter(b => b.status !== '입금완료');
  const confirmRate = bookings.length ? Math.round(confirmed.length / bookings.length * 100) : 0;
  const confirmedRev = confirmed.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const pendingRev = pending.reduce((sum, b) => sum + (b.total_price || 0), 0);

  // 결제방식
  const transferCount = bookings.filter(b => b.payment === 'transfer').length;
  const cardCount = bookings.filter(b => b.payment === 'card').length;
  const payTotal = transferCount + cardCount;
  const transferPct = payTotal ? Math.round(transferCount / payTotal * 100) : 0;
  const cardPct = payTotal ? 100 - transferPct : 0;

  // 인기시간대
  const timeMap = {};
  bookings.forEach(b => { timeMap[b.time] = (timeMap[b.time] || 0) + (b.count || 1); });
  const top3 = Object.entries(timeMap).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <>
      {/* 기존 statGrid 4개 */}
      <div className={s.statGrid}>
        <div className={s.statCard}><div style={{ fontSize: 28 }}>👥</div><div className={s.statVal}>{totBooked}명</div><div className={s.statLbl}>예약 인원</div></div>
        <div className={s.statCard}><div style={{ fontSize: 28 }}>📝</div><div className={s.statVal}>{bookings.length}건</div><div className={s.statLbl}>예약 건수</div></div>
        <div className={s.statCard}><div style={{ fontSize: 28 }}>💰</div><div className={s.statVal}>{fmt(totRev)}</div><div className={s.statLbl}>예상 매출</div></div>
        <div className={s.statCard}><div style={{ fontSize: 28 }}>🚫</div><div className={s.statVal}>{blocked.length}개</div><div className={s.statLbl}>차단 타임</div></div>
      </div>

      {/* 1. 예약율 게이지 */}
      <div className={s.gaugeSection}>
        <div className={s.sectionTitle}>예약율</div>
        <div className={s.gaugeWrap}>
          <div
            className={s.gaugeTrack}
            style={{
              background: `conic-gradient(from 0.75turn, #FF6B35 ${gaugeAngle}deg, #eee ${gaugeAngle}deg 180deg, transparent 180deg)`
            }}
          >
            <div className={s.gaugeInner}>
              <div className={s.gaugeVal}>{bookingRate}%</div>
              <div className={s.gaugeSub}>{totBooked} / {totalCapacity}명</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 입금 현황 카드 */}
      <div className={s.confirmCard}>
        <div className={s.sectionTitle}>입금 현황</div>
        <div className={s.confirmRow}>
          <div className={s.confirmItem}>
            <div className={s.confirmDot} style={{ background: '#4caf50' }} />
            <div>
              <div className={s.confirmLabel}>입금완료</div>
              <div className={s.confirmVal}>{confirmed.length}건</div>
            </div>
          </div>
          <div className={s.confirmItem}>
            <div className={s.confirmDot} style={{ background: '#FF6B35' }} />
            <div>
              <div className={s.confirmLabel}>입금대기</div>
              <div className={s.confirmVal}>{pending.length}건</div>
            </div>
          </div>
          <div className={s.confirmItem}>
            <div className={s.confirmRate}>{confirmRate}%</div>
            <div className={s.confirmLabel}>완료율</div>
          </div>
        </div>
        <div className={s.confirmRevRow}>
          <div className={s.confirmRevItem}>
            <span style={{ color: '#4caf50', fontWeight: 700 }}>확정</span>
            <span className={s.confirmRevVal}>{fmt(confirmedRev)}</span>
          </div>
          <div className={s.confirmRevItem}>
            <span style={{ color: '#FF6B35', fontWeight: 700 }}>미확정</span>
            <span className={s.confirmRevVal}>{fmt(pendingRev)}</span>
          </div>
        </div>
      </div>

      {/* 3. 결제방식 비율 */}
      <div className={s.paymentCard}>
        <div className={s.sectionTitle}>결제방식 비율</div>
        <div className={s.paymentBarWrap}>
          <div className={s.paymentBarBg}>
            {payTotal > 0 && (
              <>
                <div className={s.paymentBarTransfer} style={{ width: transferPct + '%' }} />
                <div className={s.paymentBarCard} style={{ width: cardPct + '%' }} />
              </>
            )}
          </div>
        </div>
        <div className={s.paymentLegend}>
          <div className={s.paymentLegendItem}>
            <span className={s.paymentDot} style={{ background: '#4caf50' }} />
            <span>계좌이체 {transferCount}건 ({transferPct}%)</span>
          </div>
          <div className={s.paymentLegendItem}>
            <span className={s.paymentDot} style={{ background: '#FF6B35' }} />
            <span>현장카드 {cardCount}건 ({cardPct}%)</span>
          </div>
        </div>
      </div>

      {/* 4. 인기 시간대 TOP 3 */}
      <div className={s.topSlotCard}>
        <div className={s.sectionTitle}>인기 시간대 TOP 3</div>
        {top3.length > 0 ? (
          top3.map(([time, count], i) => (
            <div key={time} className={s.topSlotRow}>
              <span className={s.topSlotMedal}>{medals[i]}</span>
              <span className={s.topSlotTime}>{time}</span>
              <span className={s.topSlotCount}>{count}명</span>
            </div>
          ))
        ) : (
          <div className={s.topSlotEmpty}>예약 데이터 없음</div>
        )}
      </div>

      {/* 기존 날짜별 카드 */}
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
