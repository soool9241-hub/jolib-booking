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

// children 배열 → DB 개별 컬럼 (children1~children6) 변환
// 형식: "이름/성별/나이"
export function childrenToColumns(children) {
  const cols = {};
  for (let i = 0; i < 6; i++) {
    const c = children[i];
    cols[`children${i + 1}`] = c && c.name ? `${c.name}/${c.gender}/${c.age}` : null;
  }
  return cols;
}

// DB 개별 컬럼 → children 배열 변환
export function columnsToChildren(booking) {
  const arr = [];
  for (let i = 1; i <= 6; i++) {
    const val = booking[`children${i}`];
    if (val) {
      const [name, gender, age] = val.split('/');
      arr.push({ name: name || '', gender: gender || '', age: age || '' });
    }
  }
  return arr;
}
