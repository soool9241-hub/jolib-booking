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
      { src: '/projects/secret-base/card-2-gesture.jpg', alt: '이번엔 손짓으로 블록을 만들어볼까요?', badge: '+ 추가체험', badgeDesc: '손짓으로 가상 블록을 만드는 디지털 체험도 함께해요!' },
    ],
    info: [
      { icon: '🧒', label: '대상', value: '초등학생 1~6학년' },
      { icon: '📍', label: '장소', value: '전주 남부시장 청년몰\n2층 노란건물 계단 옆' },
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
    // 체험 순서 + 버전별 예시 슬라이드
    assembly: {
      title: '비밀기지 만들기 체험 순서!!',
      steps: [
        { label: '1', icon: '🧩', title: '미니어처 키트로 조립 방법 배우기', desc: '아이들과 함께 미니어처 조립키트를 조립하며\n끼우고 연결하는 방법을 알아봐요' },
        { label: '2', icon: '🏠', title: '실제 조각으로 나만의 조립공간 짓기', desc: '어떻게 지을지 직접 생각해 보면서\n커다란 실제 조각으로 조립공간을 만들어봐요' },
        { label: '3', icon: '✋', title: '디지털 조립공간 체험', desc: '손짓으로 가상 블록을 만들고\n움직이고 쌓아봐요' },
        { label: '4', icon: '📸', title: '인증샷 찍어서 업로드!!', desc: '완성한 비밀기지와 함께\n인증샷을 찍어 올려주세요' },
        { label: '5', icon: '🎁', title: '대형 조립공간 만들기 DAY 초대권 받기!!', desc: '인증샷을 올리면\n대형 조립공간 만들기 DAY 초대권을 드려요', highlight: true },
      ],
      examplesTitle: '비밀기지 만들기 예시',
      // 버전마다 2장씩 슬라이드
      exampleGroups: [
        { name: '종이 버전 조립공간', images: ['/projects/secret-base/example-1-crop.jpg', '/projects/secret-base/example-2.jpg'] },
        { name: '목재 버전 조립공간', images: ['/projects/secret-base/wood-1.jpg', '/projects/secret-base/wood-2.jpg'] },
        // TODO: 디지털 버전 사진 1장 더 받기
        { name: '디지털 버전 조립공간', images: ['/projects/secret-base/card-2-gesture.jpg'] },
      ],
    },
  },
  // 상세페이지 맨 아래 버튼: 인증샷·소감 폼(reviews) 작성 후 당근 프로필로 이동해 쿠폰 받기
  invite: {
    label: '🎁 대형 조립공간 체험 VIP 초대권 받기!!',
    url: 'https://www.daangn.com/kr/local-profile/45kj9mgihaxr/',
    review: true,
  },
  ogImage: '/projects/secret-base/poster.jpg',
  ogDescription: '상상 속 나만의 아지트를 만들어볼까요? 전주 남부시장 청년몰 · 10.28(수) 31(토) 11.1(일) 오후 3시~7시',

  // 구글시트 "시트3"(취합본) 기준 예약 14건(아이 20명)을 2026-10-28 Supabase bookings에 저장함 (입금 O → 입금완료)
  // 시트: https://docs.google.com/spreadsheets/d/16GuApXSyHV7yw9MGYEU9x8AgpUh1-rY0ORxyHbMxEn4
};
