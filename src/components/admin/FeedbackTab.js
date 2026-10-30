'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MediaViewer from '../ui/MediaViewer';
import s from '../styles/AdminPanel.module.css';

const publicUrl = (path) => supabase.storage.from('reviews').getPublicUrl(path).data.publicUrl;

// 아이별 소감을 읽기 쉽게 모아 보는 탭 (사진·영상 원본·zip은 인증샷 탭)
export default function FeedbackTab({ project }) {
  const [rows, setRows] = useState(null);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState(null); // 전체 화면으로 볼 사진 번호
  const [broken, setBroken] = useState(() => new Set()); // 지워진 파일은 숨긴다

  useEffect(() => {
    setRows(null);
    supabase.from('reviews').select('*').eq('project_id', project.id).order('created_at', { ascending: false })
      .then(({ data }) => setRows(data || []));
  }, [project.id]);

  if (!rows) return <div className={s.empty}>불러오는 중...</div>;

  const families = new Set(rows.map(r => r.submission_id || r.photo_path || r.id)).size;
  const mediaOf = (r) => (r.media?.length ? r.media : (r.photo_path ? [{ path: r.photo_path, type: 'image' }] : []))
    .filter(m => !broken.has(m.path));

  // 탭 전체 사진·영상을 한 줄로 모아서 옆으로 넘겨 본다 (같이 올린 아이들은 같은 파일이라 한 번만)
  const gallery = [];
  const galleryIdx = {};
  rows.forEach(r => mediaOf(r).forEach(m => {
    if (m.path in galleryIdx) return;
    const names = rows.filter(x => (x.submission_id || x.photo_path) === (r.submission_id || r.photo_path)).map(x => x.child_name);
    const at = new Date(r.created_at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    galleryIdx[m.path] = gallery.length;
    gallery.push({ src: publicUrl(m.path), type: m.type, caption: `${names.join(', ')} · ${at}` });
  }));
  const markBroken = (path) => setBroken(b => new Set(b).add(path));

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
      {view !== null && gallery.length > 0 && (
        <MediaViewer items={gallery} start={Math.min(view, gallery.length - 1)} onClose={() => setView(null)} />
      )}
      <div className={s.preNote}>💬 후기 {rows.length}개 · {families}가족</div>
      {rows.length > 0 && (
        <button className={s.refreshBtn} onClick={copyAll}>
          {copied ? '✅ 복사했어요' : '📋 후기 전체 복사 (홍보글용)'}
        </button>
      )}
      {rows.length === 0 && <div className={s.empty}>아직 올라온 후기가 없습니다</div>}
      {rows.map(r => {
        const media = mediaOf(r);
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
                  <button type="button" key={m.path} className={s.fbThumb} onClick={() => setView(galleryIdx[m.path])} aria-label="크게 보기">
                    {m.type === 'video'
                      ? <><video src={publicUrl(m.path)} muted playsInline preload="metadata" /><span>▶</span></>
                      : <img src={publicUrl(m.path)} alt="후기 사진" loading="lazy" onError={() => markBroken(m.path)} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
