'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import s from '../styles/AdminPanel.module.css';

const publicUrl = (path) => supabase.storage.from('reviews').getPublicUrl(path).data.publicUrl;

// 아이별 소감을 읽기 쉽게 모아 보는 탭 (사진·영상 원본·zip은 인증샷 탭)
export default function FeedbackTab({ project }) {
  const [rows, setRows] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRows(null);
    supabase.from('reviews').select('*').eq('project_id', project.id).order('created_at', { ascending: false })
      .then(({ data }) => setRows(data || []));
  }, [project.id]);

  if (!rows) return <div className={s.empty}>불러오는 중...</div>;

  const families = new Set(rows.map(r => r.submission_id || r.photo_path || r.id)).size;

  const copyAll = async () => {
    const text = rows.map(r => `"${r.comment}" - ${r.child_name}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert('복사에 실패했어요. 길게 눌러서 직접 복사해주세요.');
    }
  };

  return (
    <>
      <div className={s.preNote}>💬 후기 {rows.length}개 · {families}가족</div>
      {rows.length > 0 && (
        <button className={s.refreshBtn} onClick={copyAll}>
          {copied ? '✅ 복사했어요' : '📋 후기 전체 복사 (홍보글용)'}
        </button>
      )}
      {rows.length === 0 && <div className={s.empty}>아직 올라온 후기가 없습니다</div>}
      {rows.map(r => {
        const media = r.media?.length ? r.media : (r.photo_path ? [{ path: r.photo_path, type: 'image' }] : []);
        return (
          <div key={r.id} className={s.fbCard}>
            <div className={s.fbComment}>“{r.comment}”</div>
            <div className={s.fbMeta}>
              <span className={s.fbName}>{r.child_name}</span>
              <span>{new Date(r.created_at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            {media.length > 0 && (
              <div className={s.fbThumbs}>
                {media.map(m => (
                  <a key={m.path} href={publicUrl(m.path)} target="_blank" rel="noopener noreferrer" className={s.fbThumb}>
                    {m.type === 'video'
                      ? <><video src={publicUrl(m.path)} muted playsInline preload="metadata" /><span>▶</span></>
                      : <img src={publicUrl(m.path)} alt="후기 사진" loading="lazy" onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
