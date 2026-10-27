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

  // 소개 페이지 내용은 당근 비즈프로필 '기획자 비밀기지 만들기' 게시글 기준
  // https://www.daangn.com/kr/local-profile/45kj9mgihaxr/
  intro: {
    tag: '📍 전주 남부시장 청년몰',
    title: '비밀기지 만들기',
    sub: '나만의 아늑한 비밀기지 만들기 체험',
    icon: '🏠',
    image: '/projects/secret-base/poster.jpg', // 미션 카드 메인 사진
    imageAlt: '비밀기지 만들기 체험단 모집 포스터',
    missionTitle: '내가 직접 만드는 비밀기지!',
    mission: '상상 속 나만의 아지트를 만들어볼까요?\n커다란 블록을 친구들과 함께 조립해\n몸이 들어갈 수 있는 공간을 만들고,\n손동작으로 블록을 만드는 디지털 체험도 해봐요!',
    // 당근 모집 게시글 이미지 순서
    cards: [
      { src: '/projects/secret-base/card-1-pieces.jpg', alt: '커다란 조각으로 나만의 아지트를 만들어요' },
      { src: '/projects/secret-base/card-2-gesture.jpg', alt: '이번엔 손짓으로 블록을 만들어볼까요?' },
      { src: '/projects/secret-base/card-3-info.jpg', alt: '대상 초등학생 1~6학년, 장소 전주 남부시장 청년몰, 회차별 약 50분, 참가비 5,000원 간식 제공' },
    ],
    steps: [
      { icon: '📋', title: '체험 안내', desc: '오늘의 미션과 조립 방법을\n안내받아요' },
      { icon: '🧱', title: '커다란 조각으로 아지트 만들기', desc: '네모, 세모, 동그라미 조각을\n자유롭게 끼우고 연결해요' },
      { icon: '✋', title: '손짓으로 블록 만들기', desc: '손을 오므렸다 쭉 펴면 가상 블록이 생겨요\n움직이고 쌓아보는 디지털 체험' },
      { icon: '🍪', title: '간식 & 간단한 설문', desc: '간식을 먹으며\n체험 소감을 들려주세요' },
    ],
    info: [
      { icon: '🧒', label: '대상', value: '초등학생 1~6학년' },
      { icon: '📍', label: '장소', value: '전주 남부시장 청년몰' },
      { icon: '⏱️', label: '운영', value: '회차별 약 50분' },
      { icon: '🍪', label: '참가비', value: '5,000원 (간식 제공)' },
    ],
    recommendTitle: '이런 아이에게 추천해요',
    recommend: [
      '옷장 속에 들어가거나 이불 동굴을 만들며 좁고 구석진 공간에서 노는 걸 좋아하는 아이',
      '레고나 블럭으로 뭐든 뚝딱뚝딱 만들기를 좋아하는 아이',
      '자기 몸만 한 큰 조각을 나르며 에너지 방출이 필요한 아이',
      '아이에게 새로운 놀이 경험을 해주고 싶은 부모님',
    ],
    photosTitle: '지난 체험 현장',
    photos: [
      '/projects/secret-base/photo-1.jpg',
      '/projects/secret-base/photo-2.jpg',
      '/projects/secret-base/photo-3.jpg',
      '/projects/secret-base/photo-4.jpg',
      '/projects/secret-base/photo-5.jpg',
      '/projects/secret-base/photo-6.jpg',
    ],
    notice: '정식 출시 전 진행하는 시제품 체험 테스트예요\n체험 후 간단한 설문에 함께해 주세요!',
  },
  ogImage: '/projects/secret-base/poster.jpg',
  ogDescription: '상상 속 나만의 아지트를 만들어볼까요? 전주 남부시장 청년몰 · 10.28(수) 31(토) 11.1(일) 오후 3시~7시',

  // 구글폼으로 먼저 받은 예약 8건(아이 11명)은 2026-10-28 Supabase bookings에 입금완료로 저장함
  // 시트: https://docs.google.com/spreadsheets/d/16GuApXSyHV7yw9MGYEU9x8AgpUh1-rY0ORxyHbMxEn4
};
