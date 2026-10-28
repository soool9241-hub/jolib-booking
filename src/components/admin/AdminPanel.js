'use client';

import { useState } from 'react';
import { PROJECTS, CURRENT } from '@/projects';
import OverviewTab from './OverviewTab';
import BookingsTab from './BookingsTab';
import SlotsTab from './SlotsTab';
import ReviewsTab from './ReviewsTab';
import FeedbackTab from './FeedbackTab';
import EditModal from './EditModal';
import s from '../styles/AdminPanel.module.css';

export default function AdminPanel({
  bookings, blocked, loadData, isBlk, getBooked, toggleBlk,
  toggleStatus, startEdit, admCancel, admReset,
  editing, editF, setEditF, saveEdit, setEditing,
}) {
  const [admTab, setAdmTab] = useState('overview');
  const [bkTab, setBkTab] = useState('pending');
  const [projId, setProjId] = useState(CURRENT.id);
  const project = PROJECTS.find(p => p.id === projId) || CURRENT;
  const [admDate, setAdmDate] = useState(project.dates[0]);
  const [isAdmin, setIsAdmin] = useState(true);

  // 같은 DB에 모든 프로젝트 예약이 있으므로 선택한 프로젝트 날짜로 거른다
  const keys = new Set(project.dates.map(d => d.key));
  const allBookings = bookings;
  bookings = allBookings.filter(b => keys.has(b.date));
  blocked = blocked.filter(b => keys.has(b.date));

  const selectProject = (id) => {
    const p = PROJECTS.find(x => x.id === id);
    setProjId(id);
    setAdmDate(p.dates[0]);
  };

  const totBooked = bookings.reduce((sum, b) => sum + (b.count || 1), 0);
  const totRev = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

  const tabs = [
    { k: 'overview', l: '📊 현황' },
    { k: 'bookings', l: '📋 예약' },
    { k: 'slots', l: '🔒 시간' },
    { k: 'feedback', l: '💬 후기' },
    { k: 'reviews', l: '📸 인증샷' },
  ];

  return (
    <div className="container">
      <div className={s.bar}>
        <button onClick={() => { setIsAdmin(false); window.__exitAdmin?.(); }} className={s.backBtn}>← 나가기</button>
        <span className={s.barTitle}>관리자 모드</span>
        <span>🔐</span>
      </div>
      <div className={s.projBar}>
        <span className={s.projLabel}>프로젝트</span>
        <select className={s.projSelect} value={projId} onChange={e => selectProject(e.target.value)}>
          {PROJECTS.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}{p.status === 'open' ? ' (진행 중)' : ' (종료)'}
            </option>
          ))}
        </select>
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
            project={project}
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
            project={project}
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
            project={project}
            admDate={admDate}
            setAdmDate={setAdmDate}
            isBlk={isBlk}
            getBooked={getBooked}
            toggleBlk={toggleBlk}
          />
        )}

        {admTab === 'feedback' && <FeedbackTab project={project} />}

        {admTab === 'reviews' && <ReviewsTab project={project} />}
      </div>
    </div>
  );
}
