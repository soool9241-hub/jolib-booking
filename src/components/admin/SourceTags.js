import { splitSources, SOURCE_COLORS } from '@/utils/helpers';
import s from '../styles/AdminPanel.module.css';

// 예약 유입경로 배지 (당근·메타·포스터…)
export default function SourceTags({ source }) {
  const tags = splitSources(source);
  if (!tags.length) return null;
  return (
    <span className={s.srcTags}>
      {tags.map(t => (
        <span key={t} className={s.srcTag} style={{ background: SOURCE_COLORS[t] || '#999' }}>{t}</span>
      ))}
    </span>
  );
}
