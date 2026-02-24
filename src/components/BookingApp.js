'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, EDGE_FUNCTION_URL, SUPABASE_ANON_KEY } from '@/lib/supabase';
import { DATES, MAX_PERSONS, PT, PC, ADMIN_PW } from '@/lib/constants';
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
    if (bRes.data) setBookings(bRes.data);
    if (blRes.data) setBlocked(blRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Provide exit callback for AdminPanel
  useEffect(() => {
    window.__exitAdmin = () => setIsAdmin(false);
    return () => { delete window.__exitAdmin; };
  }, []);

  const getBooked = (d, t) => bookings.filter(b => b.date === d && b.time === t).reduce((s, b) => s + (b.count || 1), 0);
  const isBlk = (d, t) => blocked.some(b => b.date === d && b.time === t);
  const getRem = (d, t) => isBlk(d, t) ? 0 : MAX_PERSONS - getBooked(d, t);

  // Booking submission
  const handleReserve = async () => {
    if (!form.name || !form.phone) return;
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
    await supabase.from('bookings').delete().eq('id', b.id);
    await loadData();
  };
  const toggleStatus = async (b) => {
    const next = b.status === '입금대기' ? '입금완료' : '입금대기';
    await supabase.from('bookings').update({ status: next }).eq('id', b.id);
    await loadData();
  };
  const startEdit = (b) => { setEditing(b); setEditF({ name: b.name, phone: b.phone, count: b.count, payment: b.payment }); };
  const saveEdit = async () => {
    if (!editing) return;
    const up = editF.payment === 'transfer' ? PT : PC;
    await supabase.from('bookings').update({
      name: editF.name, phone: editF.phone, count: editF.count,
      payment: editF.payment, total_price: up * editF.count,
    }).eq('id', editing.id);
    await loadData(); setEditing(null);
  };
  const toggleBlk = async (d, t) => {
    if (isBlk(d, t)) { await supabase.from('blocked_slots').delete().eq('date', d).eq('time', t); }
    else { await supabase.from('blocked_slots').insert({ date: d, time: t }); }
    await loadData();
  };
  const admReset = async () => {
    if (!confirm('⚠️ 모든 예약+차단 초기화?')) return;
    await supabase.from('bookings').delete().neq('id', 0);
    await supabase.from('blocked_slots').delete().neq('id', 0);
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
          getRem={getRem}
          onSelect={(d) => { setSelDate(d); setStep(2); }}
        />
      )}

      {step === 2 && selDate && (
        <TimeStep
          selDate={selDate}
          isBlk={isBlk}
          getRem={getRem}
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
