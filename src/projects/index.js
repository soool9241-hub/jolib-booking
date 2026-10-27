import { moonRabbit } from './moon-rabbit';
import { secretBase } from './secret-base';

// 지금까지 진행한 프로젝트 목록 (최신순으로 추가)
export const PROJECTS = [secretBase, moonRabbit];

// 예약 화면에 연결된 프로젝트. 새 체험을 열 때 여기만 바꾼다.
export const CURRENT = secretBase;

// 진행 중인 체험이 없을 때(CURRENT가 closed) 소개 페이지에 쓰는 기본 문구
export const DEFAULT_INTRO = {
  tag: '🧩 조립공간',
  title: '체험 예약',
  sub: '끼우고 · 쌓고 · 만드는 모듈형 조립 체험',
  icon: '🧩',
  missionTitle: '다음 체험 준비 중',
  mission: '새로운 체험을 준비하고 있어요.\n체험이 열리면 이곳에서 예약할 수 있어요!',
  steps: [
    { icon: '📋', title: '체험 안내', desc: '체험 미션과 조립 방법을\n안내받아요' },
    { icon: '🤲', title: '조립 체험', desc: '나무 조각을 끼우고 쌓아서\n나만의 작품을 만들어요' },
    { icon: '📸', title: '완성작 사진 촬영', desc: '내가 만든 작품과 함께\n사진을 찍어요' },
  ],
  info: [],
  notice: '지금은 예약을 받고 있지 않아요\n지난 체험의 예약 현황만 볼 수 있어요',
};
