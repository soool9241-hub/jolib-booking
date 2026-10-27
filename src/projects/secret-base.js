// 프로젝트 #2 — 조립공간_남부시장 (비밀기지 만들기 체험) (2026-10-28, 10-31, 11-01)

export const secretBase = {
  id: 'secret-base',
  name: '조립공간_남부시장',
  status: 'open', // 'open' | 'closed'

  dates: [
    { key: '10/28 (수)', label: '10/28 (수)', day: 1, startHour: 15, endHour: 20 },
    { key: '10/31 (토)', label: '10/31 (토)', day: 2, startHour: 15, endHour: 20 },
    { key: '11/1 (일)', label: '11/1 (일)', day: 3, startHour: 15, endHour: 20 },
  ],
  slotMinutes: 60, // 15:00, 16:00, 17:00, 18:00, 19:00
  maxPersons: 6,
  // TODO: 비밀기지 체험 가격 확인 필요 (달토끼집 가격을 임시로 사용)
  priceTransfer: 5000,
  priceCard: 6000,
  bank: '카카오뱅크 3333-06-4749542 임솔',

  intro: {
    tag: '🏠 조립공간 체험',
    title: '비밀기지 만들기',
    sub: '끼우고 · 쌓고 · 만드는 모듈형 조립 체험',
    icon: '🏠',
    missionTitle: '미션!',
    mission: '나만 아는 비밀 장소에\n멋진 비밀기지를 지어 주세요!',
    steps: [
      { icon: '📋', title: '체험 안내', desc: '체험 미션과 조립 방법을\n안내받아요' },
      { icon: '🤲', title: '조립 체험', desc: '나무 조각을 끼우고 쌓아서\n나만의 비밀기지를 만들어요' },
      { icon: '📸', title: '완성작 사진 촬영', desc: '내가 만든 비밀기지와 함께\n사진을 찍어요' },
    ],
    info: [
      { icon: '📅', label: '일정', value: '수 · 토 · 일' },
      { icon: '⏰', label: '운영', value: '오후 3시~7시' },
      { icon: '👧', label: '타임당', value: '최대 6명' },
    ],
    notice: '타임당 6명까지만 받아요\n미리 신청해서 예약해주세요!',
  },

  // 구글폼으로 먼저 받은 예약 (아이 1명 = 1명, 2026-10-28 시트 기준)
  // 시트: https://docs.google.com/spreadsheets/d/16GuApXSyHV7yw9MGYEU9x8AgpUh1-rY0ORxyHbMxEn4
  preBooked: {
    '10/28 (수)': { '18:00': 2 },          // 김해솔, 김해나
    '10/31 (토)': { '15:00': 1 },          // 김정윤
    '11/1 (일)': {
      '15:00': 4,                          // 김도연, 김율, 김율 동생, 권도은
      '16:00': 4,                          // 이정윤, 신은, 신예빈(3·4시 중복 체크 → 언니와 같은 4시), 조은호(4시로 변경)
    },
  },
};
