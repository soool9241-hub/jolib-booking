'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, EDGE_FUNCTION_URL, SUPABASE_ANON_KEY } from '@/lib/supabase';
import { MAX_PERSONS, PT, PC, ADMIN_PW, BOOKING_OPEN, SNAPSHOT, PRE_BOOKED } from '@/lib/constants';
import { childrenToColumns, columnsToChildren } from '@/utils/helpers';

import IntroStep from './steps/IntroStep';
import DateStep from './steps/DateStep';
import TimeStep from './steps/TimeStep';
import FormStep from './steps/FormStep';
import ConfirmStep from './steps/ConfirmStep';
import AdminPanel from './admin/AdminPanel';
import ProgressBar from './ui/ProgressBar';
import PasswordModal from './ui/PasswordModal';
import Footer from './ui/Footer';

export default function BookingApp() {
  const [step, setStep] = useState(0);
  const [selDate, setSelDate] = useState(null);
  const [selTime, setSelTime] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', count: 1, payment: 'transfer', children: [{ name: '', gender: '', age: '' }] });
  const [bookings, setBookings] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  // Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editF, setEditF] = useState({});

  const loadData = useCallback(async () => {
    const [bRes, blRes] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('blocked_slots').select('*'),
    ]);
    // 모든 프로젝트의 예약을 담는다. 날짜 키가 프로젝트마다 달라서 고객 화면은 날짜로 구분되고,
    // 관리자 화면은 선택한 프로젝트 날짜로 거른다
    if (bRes.data) setBookings(bRes.data);
    if (blRes.data) setBlocked(blRes.data);
    setLoading(false);
  }, []);

  // 마감된 프로젝트는 snapshot으로 보여주므로 첫 화면에서 DB를 읽지 않는다 (관리자 로그인 시에는 읽음)
  useEffect(() => { if (BOOKING_OPEN) loadData(); else setLoading(false); }, [loadData]);

  // 폰에서 링크를 다시 열거나 앱으로 돌아오면 예전 화면이 그대로 복원되므로, 그때마다 최신 예약을 다시 읽는다
  useEffect(() => {
    if (!BOOKING_OPEN && !isAdmin) return;
    const refresh = () => { if (document.visibilityState === 'visible') loadData(); };
    const onShow = (e) => { if (e.persisted) loadData(); };
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', onShow);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', onShow);
    };
  }, [loadData, isAdmin]);

  // Provide exit callback for AdminPanel
  useEffect(() => {
    window.__exitAdmin = () => setIsAdmin(false);
    return () => { delete window.__exitAdmin; };
  }, []);

  const getBooked = (d, t) => (PRE_BOOKED[d]?.[t] || 0) + bookings.filter(b => b.date === d && b.time === t).reduce((s, b) => s + (b.count || 1), 0);
  // 고객 화면용: 마감된 프로젝트는 당시 최종 예약 인원(snapshot)을 쓴다
  const getShown = (d, t) => BOOKING_OPEN ? getBooked(d, t) : (SNAPSHOT[d]?.[t] || 0);
  const isBlk = (d, t) => blocked.some(b => b.date === d && b.time === t);
  const getRem = (d, t) => !BOOKING_OPEN ? 0 : isBlk(d, t) ? 0 : MAX_PERSONS - getBooked(d, t);

  // Booking submission
  const handleReserve = async () => {
    if (!BOOKING_OPEN || !form.name || !form.phone) return;
    const rem = getRem(selDate.key, selTime);
    if (form.count > rem) { alert('잔여 인원이 ' + rem + '명입니다.'); return; }
    setSubmitting(true);
    const up = form.payment === 'transfer' ? PT : PC;
    const tp = up * form.count;
    const { data, error } = await supabase.from('bookings').insert({
      name: form.name, phone: form.phone, count: form.count,
      payment: form.payment, date: selDate.key, time: selTime,
      total_price: tp, status: '입금대기', ...childrenToColumns(form.children),
    }).select().single();

    if (error) { alert('예약 실패: ' + error.message); setSubmitting(false); return; }
    setLastBooking(data);

    let smsOk = false;
    try {
      const smsRes = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY },
        body: JSON.stringify({ booking: data }),
      });
      smsOk = smsRes.ok;
    } catch (e) { console.log('SMS error:', e); }
    setSmsSent(smsOk);

    await loadData();
    setStep(4);
    setSubmitting(false);
  };

  // Admin actions
  const admLogin = () => {
    if (pw === ADMIN_PW) { setIsAdmin(true); setShowPw(false); setPw(''); setPwErr(false); loadData(); }
    else setPwErr(true);
  };
  const admCancel = async (b) => {
    if (!confirm(b.name + '님 예약 취소?')) return;
    // 지워진 행을 돌려받아서 실제로 취소됐는지 확인한다 (실패해도 조용히 넘어가지 않게)
    const { data, error } = await supabase.from('bookings').delete().eq('id', b.id).select('id');
    await loadData();
    if (error) alert('취소 실패: ' + error.message + '\n인터넷 연결을 확인하고 다시 시도해주세요.');
    else if (!data?.length) alert('이미 취소된 예약이에요. 화면을 새로 불러왔어요.');
    else alert(b.name + '님 예약을 취소했어요.');
  };
  const toggleStatus = async (b) => {
    const next = b.status === '입금대기' ? '입금완료' : '입금대기';
    const { error } = await supabase.from('bookings').update({ status: next }).eq('id', b.id);
    if (error) alert('변경 실패: ' + error.message);
    await loadData();
  };
  const startEdit = (b) => { setEditing(b); setEditF({ name: b.name, phone: b.phone, count: b.count, payment: b.payment, source: b.source || '' }); };
  const saveEdit = async () => {
    if (!editing) return;
    const up = editF.payment === 'transfer' ? PT : PC;
    const { error } = await supabase.from('bookings').update({
      name: editF.name, phone: editF.phone, count: editF.count,
      payment: editF.payment, total_price: up * editF.count, source: editF.source || null,
    }).eq('id', editing.id);
    if (error) { alert('수정 실패: ' + error.message); return; }
    await loadData(); setEditing(null);
  };
  const toggleBlk = async (d, t) => {
    if (isBlk(d, t)) { await supabase.from('blocked_slots').delete().eq('date', d).eq('time', t); }
    else { await supabase.from('blocked_slots').insert({ date: d, time: t }); }
    await loadData();
  };
  const admReset = async (project) => {
    if (!confirm('⚠️ ' + project.name + '의 모든 예약+차단 초기화?')) return;
    // 다른 프로젝트 기록은 남기고 선택한 프로젝트 날짜만 지운다
    const keys = project.dates.map(d => d.key);
    await supabase.from('bookings').delete().in('date', keys);
    await supabase.from('blocked_slots').delete().in('date', keys);
    await loadData();
  };

  const maxC = selDate && selTime ? getRem(selDate.key, selTime) : 6;

  if (loading) return null;

  // Admin panel
  if (isAdmin) {
    return (
      <AdminPanel
        bookings={bookings}
        blocked={blocked}
        loadData={loadData}
        isBlk={isBlk}
        getBooked={getBooked}
        toggleBlk={toggleBlk}
        toggleStatus={toggleStatus}
        startEdit={startEdit}
        admCancel={admCancel}
        admReset={admReset}
        editing={editing}
        editF={editF}
        setEditF={setEditF}
        saveEdit={saveEdit}
        setEditing={setEditing}
      />
    );
  }

  // Main app
  return (
    <div className="container">
      {showPw && (
        <PasswordModal
          pw={pw}
          setPw={setPw}
          pwErr={pwErr}
          setPwErr={setPwErr}
          onLogin={admLogin}
          onClose={() => { setShowPw(false); setPw(''); setPwErr(false); }}
        />
      )}

      {step === 0 && (
        <IntroStep
          onStart={() => setStep(1)}
          onAdminClick={() => setShowPw(true)}
        />
      )}

      {step > 0 && step < 4 && (
        <ProgressBar
          step={step}
          onBack={() => {
            if (step === 3) setForm({ ...form, count: 1 });
            setStep(Math.max(0, step - 1));
          }}
        />
      )}

      {step === 1 && (
        <DateStep
          getShown={getShown}
          onSelect={(d) => { setSelDate(d); setStep(2); }}
        />
      )}

      {step === 2 && selDate && (
        <TimeStep
          selDate={selDate}
          isBlk={isBlk}
          getRem={getRem}
          getShown={getShown}
          onSelect={(sl) => {
            setSelTime(sl);
            setForm({ ...form, count: 1, children: [{ name: '', gender: '', age: '' }] });
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <FormStep
          selDate={selDate}
          selTime={selTime}
          form={form}
          setForm={setForm}
          maxC={maxC}
          submitting={submitting}
          onReserve={handleReserve}
        />
      )}

      {step === 4 && (
        <ConfirmStep
          selDate={selDate}
          selTime={selTime}
          form={form}
          smsSent={smsSent}
        />
      )}

      <Footer />
    </div>
  );
}
