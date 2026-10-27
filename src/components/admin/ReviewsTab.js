'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import s from '../styles/AdminPanel.module.css';

export default function ReviewsTab({ project }) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    setRows(null);
    supabase.from('reviews').select('*').eq('project_id', project.id).order('created_at', { ascending: false })
      .then(({ data }) => setRows(data || []));
  }, [project.id]);

  if (!rows) return <div className={s.empty}>불러오는 중...</div>;

  const kids = rows.reduce((sum, r) => sum + (r.kids_count || 0), 0);

  return (
    <>
      <div className={s.preNote}>📸 인증샷 {rows.length}건 · 아이 {kids}명</div>
      {rows.length === 0 && <div className={s.empty}>아직 올라온 인증샷이 없습니다</div>}
      {rows.map(r => {
        const url = r.photo_path ? supabase.storage.from('reviews').getPublicUrl(r.photo_path).data.publicUrl : null;
        return (
          <div key={r.id} className={s.bCard}>
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer">
                <img src={url} alt={r.child_name} style={{ width: '100%', borderRadius: 10, marginBottom: 10 }} />
              </a>
            )}
            <div style={{ fontWeight: 800, fontSize: 16 }}>{r.child_name} <span style={{ color: '#999', fontWeight: 500 }}>({r.kids_count}명)</span></div>
            <div style={{ fontSize: 14, color: '#444', margin: '6px 0', whiteSpace: 'pre-line' }}>{r.comment}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>{new Date(r.created_at).toLocaleString('ko-KR')}</div>
          </div>
        );
      })}
    </>
  );
}
