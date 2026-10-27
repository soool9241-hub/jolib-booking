'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CURRENT } from '@/projects';
import s from '../styles/ReviewModal.module.css';

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

export default function ReviewModal({ invite, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [childName, setChildName] = useState('');
  const [kids, setKids] = useState(1);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const valid = file && childName.trim() && kids > 0 && comment.trim();

  const pickFile = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async () => {
    if (!valid || sending) return;
    setSending(true);
    try {
      let blob = file;
      try { blob = await shrinkImage(file); } catch (e) { /* 변환 실패 시 원본 업로드 */ }
      const path = `${CURRENT.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const up = await supabase.storage.from('reviews').upload(path, blob, { contentType: 'image/jpeg' });
      if (up.error) throw up.error;
      const { error } = await supabase.from('reviews').insert({
        project_id: CURRENT.id,
        child_name: childName.trim(),
        kids_count: kids,
        comment: comment.trim(),
        photo_path: path,
      });
      if (error) throw error;
      setDone(true);
    } catch (e) {
      alert('업로드에 실패했어요. 잠시 후 다시 시도해주세요.\n(' + (e.message || e) + ')');
    }
    setSending(false);
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.box} onClick={e => e.stopPropagation()}>
        <button className={s.close} onClick={onClose} aria-label="닫기">✕</button>

        {done ? (
          <div className={s.doneWrap}>
            <div style={{ fontSize: 56 }}>🎉</div>
            <h3 className={s.title}>인증샷 업로드 완료!</h3>
            <p className={s.sub}>당근 프로필에서 체험 쿠폰을 받아주세요</p>
            <a href={invite.url} target="_blank" rel="noopener noreferrer" className={s.submit}>
              🥕 당근에서 쿠폰 받기
            </a>
          </div>
        ) : (
          <>
            <h3 className={s.title}>🎁 VIP 초대권 받기</h3>
            <p className={s.sub}>오늘 체험한 사진과 소감을 남겨주시면{'\n'}대형 조립공간 만들기 DAY 초대권을 드려요!</p>

            <label className={s.photoPick}>
              {preview
                ? <img src={preview} alt="업로드할 사진" className={s.photoPreview} />
                : <span className={s.photoEmpty}>📸<br />오늘 체험한 사진 올리기</span>}
              <input type="file" accept="image/*" hidden onChange={e => pickFile(e.target.files?.[0])} />
            </label>

            <div className={s.row}>
              <div className={s.field} style={{ flex: 2 }}>
                <label className={s.label}>아이 이름</label>
                <input className={s.input} value={childName} onChange={e => setChildName(e.target.value)} placeholder="예: 김민수, 김민지" />
              </div>
              <div className={s.field} style={{ flex: 1 }}>
                <label className={s.label}>아이 명수</label>
                <div className={s.counter}>
                  <button type="button" onClick={() => setKids(Math.max(1, kids - 1))}>−</button>
                  <span>{kids}명</span>
                  <button type="button" onClick={() => setKids(Math.min(20, kids + 1))}>+</button>
                </div>
              </div>
            </div>

            <div className={s.field}>
              <label className={s.label}>체험 소감</label>
              <textarea className={s.textarea} rows={3} value={comment} onChange={e => setComment(e.target.value)}
                placeholder="오늘 비밀기지 만들기 어땠나요?" />
            </div>

            <button className={s.submit} disabled={!valid || sending} onClick={submit}>
              {sending ? '올리는 중...' : '업로드하고 쿠폰 받기 →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
