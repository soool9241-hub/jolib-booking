'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import s from '../styles/MediaViewer.module.css';

// 전체 화면 사진·영상 보기: 폰은 손가락으로, PC는 마우스 드래그·‹ › 버튼·방향키로 넘긴다
// items: [{ src, type: 'image' | 'video', caption }]
export default function MediaViewer({ items, start = 0, onClose }) {
  const track = useRef(null);
  const drag = useRef(null);
  const [idx, setIdx] = useState(start);

  const go = (i, smooth = true) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(items.length - 1, i));
    el.scrollTo({ left: n * el.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    setIdx(n);
  };

  // 누른 사진부터 보여준다
  useLayoutEffect(() => { go(start, false); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(idx + 1);
      if (e.key === 'ArrowLeft') go(idx - 1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  });

  const onScroll = () => {
    const el = track.current;
    if (el && !drag.current) setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  // 마우스 드래그 (터치는 브라우저 기본 스와이프 사용)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.target.tagName === 'VIDEO') return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
    track.current.classList.add(s.dragging);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    track.current.scrollLeft = d.left - dx;
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    track.current.classList.remove(s.dragging);
    const dx = e.clientX - d.x;
    go(Math.abs(dx) > 60 ? idx + (dx < 0 ? 1 : -1) : idx);
  };

  const cur = items[idx];

  return (
    <div className={s.overlay}>
      <div className={s.top}>
        <span className={s.count}>{idx + 1} / {items.length}</span>
        <button type="button" className={s.close} onClick={onClose} aria-label="닫기">✕</button>
      </div>

      <div ref={track} className={s.track} onScroll={onScroll}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
        {items.map((m, i) => (
          <div key={m.src} className={s.slide}>
            {m.type === 'video'
              ? <video src={m.src} controls playsInline preload={Math.abs(i - idx) <= 1 ? 'metadata' : 'none'} className={s.media} />
              : <img src={m.src} alt={m.caption || `사진 ${i + 1}`} draggable={false} className={s.media}
                  loading={Math.abs(i - start) <= 1 ? 'eager' : 'lazy'} />}
          </div>
        ))}
      </div>

      {idx > 0 && <button type="button" className={`${s.arrow} ${s.prev}`} onClick={() => go(idx - 1)} aria-label="이전">‹</button>}
      {idx < items.length - 1 && <button type="button" className={`${s.arrow} ${s.next}`} onClick={() => go(idx + 1)} aria-label="다음">›</button>}

      {cur?.caption && <div className={s.caption}>{cur.caption}</div>}
    </div>
  );
}
