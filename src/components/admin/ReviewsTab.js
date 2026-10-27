'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { supabase } from '@/lib/supabase';
import s from '../styles/AdminPanel.module.css';

const publicUrl = (path) => supabase.storage.from('reviews').getPublicUrl(path).data.publicUrl;

// 아이 1명 = 1행. 한 번에 올린 아이들은 submission_id로 묶는다 (예전 데이터는 photo_path)
function groupRows(rows) {
  const groups = [];
  const byKey = {};
  rows.forEach(r => {
    const key = r.submission_id || r.photo_path || 'row-' + r.id;
    if (!byKey[key]) {
      const media = r.media?.length ? r.media : (r.photo_path ? [{ path: r.photo_path, type: 'image' }] : []);
      byKey[key] = { key, at: r.created_at, media, kids: [] };
      groups.push(byKey[key]);
    }
    byKey[key].kids.push(r);
  });
  return groups;
}

const safe = (t) => String(t).replace(/[\\/:*?"<>|]/g, '').slice(0, 30);

export default function ReviewsTab({ project }) {
  const [rows, setRows] = useState(null);
  const [zipping, setZipping] = useState('');

  useEffect(() => {
    setRows(null);
    supabase.from('reviews').select('*').eq('project_id', project.id).order('created_at', { ascending: true })
      .then(({ data }) => setRows(data || []));
  }, [project.id]);

  if (!rows) return <div className={s.empty}>불러오는 중...</div>;

  const groups = groupRows(rows);

  // 엑셀(이름·소감) + 사진·영상 파일을 zip 하나로 받는다
  const downloadAll = async () => {
    if (!groups.length || zipping) return;
    try {
      const zip = new JSZip();
      const sheet = [];
      const total = groups.reduce((n, g) => n + g.media.length, 0);
      let done = 0;
      for (let gi = 0; gi < groups.length; gi++) {
        const g = groups[gi];
        const folder = `${String(gi + 1).padStart(3, '0')}_${safe(g.kids.map(k => k.child_name).join(','))}`;
        const files = [];
        for (let mi = 0; mi < g.media.length; mi++) {
          const m = g.media[mi];
          setZipping(`파일 받는 중... (${++done}/${total})`);
          const res = await fetch(publicUrl(m.path));
          if (!res.ok) continue; // 지워진 파일은 건너뛴다
          const name = `${mi + 1}.${m.path.split('.').pop()}`;
          zip.file(`${folder}/${name}`, await res.blob());
          files.push(name);
        }
        g.kids.forEach(k => sheet.push({
          '번호': gi + 1,
          '올린 시각': new Date(g.at).toLocaleString('ko-KR'),
          '아이 이름': k.child_name,
          '소감': k.comment,
          '함께한 아이 수': g.kids.length,
          '폴더': folder,
          '파일': files.join(', '),
        }));
      }
      const ws = XLSX.utils.json_to_sheet(sheet);
      ws['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 10 }, { wch: 40 }, { wch: 8 }, { wch: 24 }, { wch: 20 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '인증샷');
      zip.file('인증샷_목록.xlsx', XLSX.write(wb, { type: 'array', bookType: 'xlsx' }));

      setZipping('압축하는 중...');
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `인증샷_${project.name}_${new Date().toLocaleDateString('sv-SE')}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    } catch (e) {
      alert('다운로드 실패: ' + (e.message || e));
    }
    setZipping('');
  };

  return (
    <>
      <div className={s.preNote}>📸 인증샷 {groups.length}건 · 아이 {rows.length}명</div>
      <button className={s.refreshBtn} onClick={downloadAll} disabled={!groups.length || !!zipping}>
        {zipping || '📦 전체 다운로드 (엑셀 + 사진·영상 zip)'}
      </button>
      {groups.length === 0 && <div className={s.empty}>아직 올라온 인증샷이 없습니다</div>}
      {[...groups].reverse().map(g => (
        <div key={g.key} className={s.bCard}>
          {g.media.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: g.media.length > 1 ? '1fr 1fr' : '1fr', gap: 6, marginBottom: 10 }}>
              {g.media.map(m => (
                m.type === 'video'
                  ? <video key={m.path} src={publicUrl(m.path)} controls playsInline preload="metadata" style={{ width: '100%', borderRadius: 10 }} />
                  : <a key={m.path} href={publicUrl(m.path)} target="_blank" rel="noopener noreferrer">
                      <img src={publicUrl(m.path)} alt="인증샷" style={{ width: '100%', borderRadius: 10, display: 'block' }} />
                    </a>
              ))}
            </div>
          )}
          {g.kids.map(k => (
            <div key={k.id} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{k.child_name}</div>
              <div style={{ fontSize: 14, color: '#444', whiteSpace: 'pre-line' }}>{k.comment}</div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: '#aaa' }}>아이 {g.kids.length}명 · 사진·영상 {g.media.length}개 · {new Date(g.at).toLocaleString('ko-KR')}</div>
        </div>
      ))}
    </>
  );
}
