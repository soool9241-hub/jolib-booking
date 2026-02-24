import { MAX_PERSONS, PT, PC } from '@/lib/constants';
import { fmt, fmtPhone } from '@/utils/helpers';
import s from '../styles/FormStep.module.css';

export default function FormStep({ selDate, selTime, form, setForm, maxC, submitting, onReserve }) {
  const up = form.payment === 'transfer' ? PT : PC;
  const tp = up * form.count;
  const valid = form.name && form.phone && form.children.every(c => c.name && c.gender && c.age);

  return (
    <div className={s.wrapper}>
      <h2 className={s.title}>예약 정보 입력</h2>

      <div className={s.tags}>
        <span className={s.tag}>{selDate.label}</span>
        <span className={s.tag}>{selTime}</span>
        <span className={`${s.tag} ${s.tagGreen}`}>잔여 {maxC}명</span>
      </div>

      <div className={s.formGroup}>
        <label className={s.label}>예약자 이름</label>
        <input className={s.input} placeholder="이름을 입력해주세요" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      </div>

      <div className={s.formGroup}>
        <label className={s.label}>연락처</label>
        <input className={s.input} placeholder="010-0000-0000" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: fmtPhone(e.target.value) })} />
      </div>

      <div className={s.formGroup}>
        <label className={s.label}>참여 인원 <span className={s.labelSub}>(타임당 최대 {MAX_PERSONS}명)</span></label>
        <div className={s.countRow}>
          <button className={s.countBtn} onClick={() => {
            const nc = Math.max(1, form.count - 1);
            const ch = [...form.children]; while (ch.length > nc) ch.pop();
            setForm({ ...form, count: nc, children: ch });
          }}>−</button>
          <span className={s.countValue}>{form.count}명</span>
          <button className={s.countBtn} onClick={() => {
            const nc = Math.min(maxC, form.count + 1);
            const ch = [...form.children]; while (ch.length < nc) ch.push({ name: '', gender: '', age: '' });
            setForm({ ...form, count: nc, children: ch });
          }}>+</button>
        </div>
        {form.count >= maxC && <div className={s.countWarn}>⚠️ 이 타임의 최대 잔여 인원입니다</div>}
      </div>

      <div className={s.formGroup}>
        <label className={s.label}>체험 아이 정보</label>
        <div className={s.childrenList}>
          {form.children.map((c, i) => (
            <div key={i} className={s.childCard}>
              <div className={s.childNum}>아이 {i + 1}</div>
              <div className={s.childRow}>
                <span className={s.childLabel}>이름</span>
                <input className={s.childInput} placeholder="아이 이름" value={c.name} onChange={e => {
                  const ch = [...form.children]; ch[i] = { ...ch[i], name: e.target.value }; setForm({ ...form, children: ch });
                }} />
              </div>
              <div className={s.childRow}>
                <span className={s.childLabelLine}>성별</span>
                <button
                  className={s.genderBtn}
                  style={c.gender === '남' ? { border: '2px solid #2196F3', background: '#E3F2FD', color: '#1565C0' } : {}}
                  onClick={() => { const ch = [...form.children]; ch[i] = { ...ch[i], gender: '남' }; setForm({ ...form, children: ch }); }}
                >남자</button>
                <button
                  className={s.genderBtn}
                  style={c.gender === '여' ? { border: '2px solid #E91E63', background: '#FCE4EC', color: '#C2185B' } : {}}
                  onClick={() => { const ch = [...form.children]; ch[i] = { ...ch[i], gender: '여' }; setForm({ ...form, children: ch }); }}
                >여자</button>
              </div>
              <div className={s.childRow}>
                <span className={s.childLabel}>나이</span>
                <input className={s.childInput} type="number" min="1" max="15" placeholder="나이 입력" value={c.age} onChange={e => {
                  const ch = [...form.children]; ch[i] = { ...ch[i], age: e.target.value }; setForm({ ...form, children: ch });
                }} />
                <span className={s.ageSuffix}>세</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={s.formGroup}>
        <label className={s.label}>결제 방식</label>
        <div className={s.payGrid}>
          <button
            className={`${s.payCard} ${form.payment === 'transfer' ? s.payCardActiveGreen : ''}`}
            onClick={() => setForm({ ...form, payment: 'transfer' })}
            style={{ position: 'relative' }}
          >
            <div className={s.recBadge}>추천</div>
            <div style={{ fontSize: 28, marginBottom: 6 }}>💰</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>사전예약</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>1인 {fmt(PT)}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#e53935', marginTop: 4 }}>1,000원 할인</div>
          </button>
          <button
            className={`${s.payCard} ${form.payment === 'card' ? s.payCardActiveOrange : ''}`}
            style={{ opacity: form.payment === 'card' ? 0.8 : 0.45 }}
            onClick={() => setForm({ ...form, payment: 'card' })}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>💳</div>
            <div style={{ fontSize: 13, color: '#aaa', marginBottom: 4 }}>현장 카드결제</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#aaa' }}>1인 {fmt(PC)}</div>
          </button>
        </div>
      </div>

      <div className={s.priceSum}>
        <div className={s.priceLine}>
          <span style={{ fontSize: 13, color: '#888' }}>1인 {fmt(up)} × {form.count}명</span>
        </div>
        <div className={s.priceTotal}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>총 결제 금액</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#FF6B35' }}>{fmt(tp)}</span>
        </div>
      </div>

      <button
        className={s.submitBtn}
        style={{ opacity: valid ? 1 : 0.5 }}
        disabled={!valid || submitting}
        onClick={onReserve}
      >
        {submitting ? '처리 중...' : '사전예약하고 할인받기 →'}
      </button>
    </div>
  );
}
