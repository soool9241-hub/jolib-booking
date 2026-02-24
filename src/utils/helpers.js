export function genSlots(sh, eh) {
  const s = [];
  for (let h = sh; h < eh; h++) {
    s.push(String(h).padStart(2, '0') + ':00');
    s.push(String(h).padStart(2, '0') + ':20');
    s.push(String(h).padStart(2, '0') + ':40');
  }
  return s;
}

export function fmt(n) {
  return n.toLocaleString() + '원';
}

export function fmtPhone(v) {
  const n = v.replace(/[^0-9]/g, '').slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 7) return n.slice(0, 3) + '-' + n.slice(3);
  return n.slice(0, 3) + '-' + n.slice(3, 7) + '-' + n.slice(7);
}
