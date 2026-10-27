'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CURRENT } from '@/projects';
import s from '../styles/ReviewModal.module.css';

const MAX_FILES = 10;
const MAX_VIDEO_MB = 100;

// 휴대폰 사진(수 MB)을 긴 변 1600px JPEG로 줄여서 올린다
async function shrinkImage(file) {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
}

const rid = () => Math.random().toString(36).slice(2, 8);

export default function ReviewModal({ invite, onClose }) {
  // 사진·영상 여러 개: { file, url, type: 'image' | 'video' }
  const [media, setMedia] = useState([]);
  // 아이마다 이름·소감을 따로 받는다
  const [children, setChildren] = useState([{ name: '', comment: '' }]);
  const [sending, setSending] = useState('');
  const [done, setDone] = useState(false);

  const valid = media.length > 0 && children.every(c => c.name.trim() && c.comment.trim());

  const setCount = (n) => {
    const next = children.slice(0, n);
    while (next.length < n) next.push({ name: '', comment: '' });
    setChildren(next);
  };
  const setChild = (i, key, value) => {
    const next = [...children];
    next[i] = { ...next[i], [key]: value };
    setChildren(next);
  };

  const addFiles = (list) => {
    const added = [];
    for (const f of Array.from(list || [])) {
      const isVideo = f.type.startsWith('video/');
      if (!isVideo && !f.type.startsWith('image/')) continue;
      if (isVideo && f.size > MAX_VIDEO_MB * 1024 * 1024) {
        alert(`영상은 ${MAX_VIDEO_MB}MB까지 올릴 수 있어요. 더 짧은 영상을 골라주세요.`);
        continue;
      }
      added.push({ file: f, url: URL.createObjectURL(f), type: isVideo ? 'video' : 'image' });
    }
    setMedia(m => [...m, ...added].slice(0, MAX_FILES));
  };
  const removeMedia = (i) => setMedia(m => m.filter((_, j) => j !== i));

  const submit = async () => {
    if (!valid || sending) return;
    const submissionId = `${Date.now()}-${rid()}`;
    try {
      const uploaded = [];
      for (let i = 0; i < media.length; i++) {
        setSending(`올리는 중... (${i + 1}/${media.length})`);
        const m = media[i];
        let body = m.file;
        let ext = (m.file.name.split('.').pop() || 'bin').toLowerCase();
        let contentType = m.file.type;
        if (m.type === 'image') {
          try { body = await shrinkImage(m.file); ext = 'jpg'; contentType = 'image/jpeg'; } catch (e) { /* 변환 실패 시 원본 */ }
        }
        const path = `${CURRENT.id}/${submissionId}/${i + 1}-${rid()}.${ext}`;
        const up = await supabase.storage.from('reviews').upload(path, body, { contentType });
        if (up.error) throw up.error;
        uploaded.push({ path, type: m.type });
      }

      setSending('저장하는 중...');
      // 아이 1명 = 1행, 같은 submission_id·사진·영상으로 묶인다
      const firstImage = uploaded.find(u => u.type === 'image');
      const { error } = await supabase.from('reviews').insert(children.map(c => ({
        project_id: CURRENT.id,
        submission_id: submissionId,
        child_name: c.name.trim(),
        kids_count: children.length,
        comment: c.comment.trim(),
        photo_path: (firstImage || uploaded[0]).path,
        media: uploaded,
      })));
      if (error) throw error;
      setDone(true);
      // 저장이 끝나면 바로 당근 프로필로 이동해서 쿠폰을 받게 한다
      setTimeout(() => { window.location.href = invite.url; }, 1200);
    } catch (e) {
      alert('업로드에 실패했어요. 잠시 후 다시 시도해주세요.\n(' + (e.message || e) + ')');
    }
    setSending('');
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.box} onClick={e => e.stopPropagation()}>
        <button className={s.close} onClick={onClose} aria-label="닫기">✕</button>

        {done ? (
          <div className={s.doneWrap}>
            <div style={{ fontSize: 56 }}>🎉</div>
            <h3 className={s.title}>업로드 완료!</h3>
            <p className={s.sub}>당근으로 이동해요. 체험 쿠폰을 받아주세요!</p>
            <a href={invite.url} className={s.submit}>
              🥕 바로 이동하기
            </a>
          </div>
        ) : (
          <>
            <h3 className={s.title}>🎁 대형 조립공간 DAY{'\n'}VIP 초대권 이벤트</h3>
            <p className={s.sub}>오늘 체험한 사진·영상과 소감을 남겨주시면{'\n'}대형 조립공간 만들기 DAY 초대권을 드려요!</p>

            {media.length > 0 && (
              <div className={s.mediaGrid}>
                {media.map((m, i) => (
                  <div key={m.url} className={s.mediaItem}>
                    {m.type === 'video'
                      ? <video src={m.url} muted playsInline className={s.mediaThumb} />
                      : <img src={m.url} alt={`올릴 사진 ${i + 1}`} className={s.mediaThumb} />}
                    {m.type === 'video' && <span className={s.videoTag}>▶ 영상</span>}
                    <button type="button" className={s.mediaRemove} onClick={() => removeMedia(i)} aria-label="빼기">✕</button>
                  </div>
                ))}
              </div>
            )}

            {media.length < MAX_FILES && (
              <label className={media.length ? s.photoAddMore : s.photoPick}>
                <span className={s.photoEmpty}>
                  {media.length ? '+ 사진·영상 더 올리기' : <>📸🎬<br />오늘 체험한 사진·영상 올리기</>}
                </span>
                <input type="file" accept="image/*,video/*" multiple hidden
                  onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
              </label>
            )}
            <div className={s.hint}>사진·영상 합쳐서 최대 {MAX_FILES}개, 영상은 1개당 {MAX_VIDEO_MB}MB까지</div>

            <div className={s.field}>
              <label className={s.label}>체험한 아이 수</label>
              <div className={s.kidsPick}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <button key={n} type="button" className={`${s.kidsBtn} ${children.length === n ? s.kidsBtnOn : ''}`}
                    onClick={() => setCount(n)}>{n}명</button>
                ))}
              </div>
            </div>

            {children.map((c, i) => (
              <div key={i} className={s.childCard}>
                <div className={s.childNum}>아이 {i + 1}</div>
                <input className={s.input} value={c.name} onChange={e => setChild(i, 'name', e.target.value)}
                  placeholder="아이 이름" />
                <textarea className={s.textarea} rows={2} value={c.comment} onChange={e => setChild(i, 'comment', e.target.value)}
                  placeholder="오늘 비밀기지 만들기 어땠나요?" style={{ marginTop: 8 }} />
              </div>
            ))}

            <button className={s.submit} disabled={!valid || !!sending} onClick={submit}>
              {sending || '🎁 VIP 대형 조립공간 체험 초대권 받기'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
