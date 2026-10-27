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
  // 아이마다 이름·소감을 따로 받는다
  const [children, setChildren] = useState([{ name: '', comment: '' }]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const valid = file && children.every(c => c.name.trim() && c.comment.trim());

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
      // 아이 1명 = 1행, 같은 사진(photo_path)으로 묶인다
      const { error } = await supabase.from('reviews').insert(children.map(c => ({
        project_id: CURRENT.id,
        child_name: c.name.trim(),
        kids_count: children.length,
        comment: c.comment.trim(),
        photo_path: path,
      })));
      if (error) throw error;
      setDone(true);
      // 저장이 끝나면 바로 당근 프로필로 이동해서 쿠폰을 받게 한다
      setTimeout(() => { window.location.href = invite.url; }, 1200);
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
            <h3 className={s.title}>업로드 완료!</h3>
            <p className={s.sub}>당근으로 이동해요. 체험 쿠폰을 받아주세요!</p>
            <a href={invite.url} className={s.submit}>
              🥕 바로 이동하기
            </a>
          </div>
        ) : (
          <>
            <h3 className={s.title}>🎁 대형 조립공간 DAY{'\n'}VIP 초대권 이벤트</h3>
            <p className={s.sub}>오늘 체험한 사진과 소감을 남겨주시면{'\n'}대형 조립공간 만들기 DAY 초대권을 드려요!</p>

            <label className={s.photoPick}>
              {preview
                ? <img src={preview} alt="업로드할 사진" className={s.photoPreview} />
                : <span className={s.photoEmpty}>📸<br />오늘 체험한 사진 올리기</span>}
              <input type="file" accept="image/*" hidden onChange={e => pickFile(e.target.files?.[0])} />
            </label>

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

            <button className={s.submit} disabled={!valid || sending} onClick={submit}>
              {sending ? '올리는 중...' : '🎁 VIP 대형 조립공간 체험 초대권 받기'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
