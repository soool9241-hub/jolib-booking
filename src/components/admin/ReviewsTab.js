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

  // 아이 1명 = 1행. 한 번에 올린 아이들은 같은 사진(photo_path)으로 묶는다
  const groups = [];
  const byPhoto = {};
  rows.forEach(r => {
    const key = r.photo_path || 'row-' + r.id;
    if (!byPhoto[key]) { byPhoto[key] = { key, photo: r.photo_path, at: r.created_at, kids: [] }; groups.push(byPhoto[key]); }
    byPhoto[key].kids.push(r);
  });

  return (
    <>
      <div className={s.preNote}>📸 인증샷 {groups.length}건 · 아이 {rows.length}명</div>
      {groups.length === 0 && <div className={s.empty}>아직 올라온 인증샷이 없습니다</div>}
      {groups.map(g => {
        const url = g.photo ? supabase.storage.from('reviews').getPublicUrl(g.photo).data.publicUrl : null;
        return (
          <div key={g.key} className={s.bCard}>
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer">
                <img src={url} alt="인증샷" style={{ width: '100%', borderRadius: 10, marginBottom: 10 }} />
              </a>
            )}
            {g.kids.map(k => (
              <div key={k.id} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{k.child_name}</div>
                <div style={{ fontSize: 14, color: '#444', whiteSpace: 'pre-line' }}>{k.comment}</div>
              </div>
            ))}
            <div style={{ fontSize: 12, color: '#aaa' }}>아이 {g.kids.length}명 · {new Date(g.at).toLocaleString('ko-KR')}</div>
          </div>
        );
      })}
    </>
  );
}
