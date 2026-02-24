'use client';

import { useState } from 'react';
import { DATES } from '@/lib/constants';
import OverviewTab from './OverviewTab';
import BookingsTab from './BookingsTab';
import SlotsTab from './SlotsTab';
import EditModal from './EditModal';
import s from '../styles/AdminPanel.module.css';

export default function AdminPanel({
  bookings, blocked, loadData, isBlk, getBooked, toggleBlk,
  toggleStatus, startEdit, admCancel, admReset,
  editing, editF, setEditF, saveEdit, setEditing,
}) {
  const [admTab, setAdmTab] = useState('overview');
  const [bkTab, setBkTab] = useState('pending');
  const [admDate, setAdmDate] = useState(DATES[0]);
  const [isAdmin, setIsAdmin] = useState(true);

  const totBooked = bookings.reduce((sum, b) => sum + (b.count || 1), 0);
  const totRev = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

  const tabs = [
    { k: 'overview', l: '📊 현황' },
    { k: 'bookings', l: '📋 예약' },
    { k: 'slots', l: '🔒 시간' },
  ];

  return (
    <div className="container">
      <div className={s.bar}>
        <button onClick={() => { setIsAdmin(false); window.__exitAdmin?.(); }} className={s.backBtn}>← 나가기</button>
        <span className={s.barTitle}>관리자 모드</span>
        <span>🔐</span>
      </div>
      <div className={s.tabs}>
        {tabs.map(t => (
          <button
            key={t.k}
            className={`${s.tab} ${admTab === t.k ? s.tabActive : ''}`}
            onClick={() => { setAdmTab(t.k); loadData(); }}
          >
            {t.l}
          </button>
        ))}
      </div>
      <div className={s.content}>
        {editing && (
          <EditModal
            editing={editing}
            editF={editF}
            setEditF={setEditF}
            onSave={saveEdit}
            onClose={() => setEditing(null)}
          />
        )}

        {admTab === 'overview' && (
          <OverviewTab
            bookings={bookings}
            blocked={blocked}
            totBooked={totBooked}
            totRev={totRev}
            isBlk={isBlk}
            loadData={loadData}
            admReset={admReset}
          />
        )}

        {admTab === 'bookings' && (
          <BookingsTab
            bookings={bookings}
            bkTab={bkTab}
            setBkTab={setBkTab}
            toggleStatus={toggleStatus}
            startEdit={startEdit}
            admCancel={admCancel}
            loadData={loadData}
          />
        )}

        {admTab === 'slots' && (
          <SlotsTab
            admDate={admDate}
            setAdmDate={setAdmDate}
            isBlk={isBlk}
            getBooked={getBooked}
            toggleBlk={toggleBlk}
          />
        )}
      </div>
    </div>
  );
}
