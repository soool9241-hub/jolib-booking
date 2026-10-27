'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import s from '../styles/Slider.module.css';

// 폰에서는 손가락으로 넘기고, PC(마우스)에서는 ◀ ▶ 버튼과 점으로 넘긴다
export default function Slider({ images, alt }) {
  const track = useRef(null);
  const [idx, setIdx] = useState(0);
  const many = images.length > 1;

  const go = (i) => {
    const el = track.current;
    if (!el) return;
    const n = (i + images.length) % images.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
    setIdx(n);
  };

  const onScroll = () => {
    const el = track.current;
    if (el) setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className={s.wrap}>
      <div ref={track} className={s.track} onScroll={many ? onScroll : undefined}>
        {images.map((src, i) => (
          <div key={src} className={s.slide}>
            <div className={s.box}>
              <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="(max-width: 480px) 90vw, 400px"
                style={{ objectFit: 'cover' }} />
            </div>
          </div>
        ))}
      </div>

      {many && (
        <>
          <button type="button" className={`${s.arrow} ${s.prev}`} onClick={() => go(idx - 1)} aria-label="이전 사진">‹</button>
          <button type="button" className={`${s.arrow} ${s.next}`} onClick={() => go(idx + 1)} aria-label="다음 사진">›</button>
          <div className={s.dots}>
            {images.map((_, i) => (
              <button key={i} type="button" className={`${s.dot} ${i === idx ? s.dotOn : ''}`}
                onClick={() => go(i)} aria-label={`${i + 1}번째 사진`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
