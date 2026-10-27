import { PT, PC, BANK, INVITE } from '@/lib/constants';
import { fmt } from '@/utils/helpers';
import s from '../styles/ConfirmStep.module.css';

export default function ConfirmStep({ selDate, selTime, form, smsSent }) {
  const up = form.payment === 'transfer' ? PT : PC;
  const tp = up * form.count;

  return (
    <div className={s.wrapper}>
      <div className={s.icon}>📩</div>
      <h2 className={s.title}>사전예약 완료!</h2>

      <div className={s.notice}>
        <div style={{ fontSize: 22, flexShrink: 0 }}>💡</div>
        <div className={s.noticeText}>
          {form.payment === 'transfer'
            ? <>아래 계좌로 입금해주시면 예약이 <strong>최종 확정</strong>됩니다.{'\n'}안내 문자를 확인해주세요!</>
            : <>현장에서 카드결제 시 예약이 <strong>최종 확정</strong>됩니다.{'\n'}안내 문자를 확인해주세요!</>
          }
        </div>
      </div>

      <div className={s.card}>
        <div className={s.row}><span className={s.rowLabel}>📅 날짜</span><span className={s.rowValue}>{selDate.label}</span></div>
        <div className={s.divider} />
        <div className={s.row}><span className={s.rowLabel}>⏰ 시간</span><span className={s.rowValue}>{selTime}</span></div>
        <div className={s.divider} />
        <div className={s.row}><span className={s.rowLabel}>👤 예약자</span><span className={s.rowValue}>{form.name}</span></div>
        <div className={s.divider} />
        <div className={s.row}><span className={s.rowLabel}>👥 인원</span><span className={s.rowValue}>{form.count}명</span></div>
        <div className={s.childTags}>
          {form.children.map((c, j) => (
            <span key={j} className={s.childTag} style={{
              background: c.gender === '남' ? '#E3F2FD' : '#FCE4EC',
              color: c.gender === '남' ? '#1565C0' : '#C2185B',
            }}>
              {c.name} ({c.gender}, {c.age}세)
            </span>
          ))}
        </div>
        <div className={s.divider} />
        <div className={s.row}><span className={s.rowLabel}>💰 금액</span><span className={s.rowValue}>{fmt(tp)}</span></div>
        <div style={{ textAlign: 'right', fontSize: 12, color: '#999', paddingTop: 4 }}>1인 {fmt(up)} × {form.count}명</div>
      </div>

      {form.payment === 'transfer' && (
        <div className={s.bankBox}>
          <div className={s.bankTitle} style={{ color: '#F57F17' }}>🏦 입금 계좌 안내 (입금 시 예약 확정!)</div>
          <div className={s.bankAccount}>{BANK}</div>
          <div style={{ fontSize: 14, color: '#333', marginBottom: 4 }}>입금 금액: <strong>{fmt(tp)}</strong></div>
          <div style={{ fontSize: 12, color: '#999' }}>예약자명으로 입금해주세요</div>
        </div>
      )}

      {form.payment === 'card' && (
        <div className={`${s.bankBox} ${s.bankBoxCard}`}>
          <div className={s.bankTitle} style={{ color: '#E65100' }}>💳 현장 카드결제 안내</div>
          <div style={{ fontSize: 14, color: '#333', marginBottom: 4 }}>결제 금액: <strong>{fmt(tp)}</strong></div>
          <div style={{ fontSize: 12, color: '#999' }}>현장 도착 후 카드결제 시 예약이 확정됩니다</div>
        </div>
      )}

      <div className={s.smsStatus}>
        {smsSent ? (
          <div className={s.smsSent}>
            <span className={s.smsCheck}>✓</span> 안내 문자가 발송되었습니다
          </div>
        ) : (
          <div className={s.smsPending}>
            <div className={s.smsSpinner} /> 문자 발송 중...
          </div>
        )}
      </div>

      {INVITE && !INVITE.review && (
        <a href={INVITE.url} target="_blank" rel="noopener noreferrer" className={s.inviteBtn}>
          {INVITE.label}
        </a>
      )}
    </div>
  );
}
