import { CURRENT, DEFAULT_INTRO } from '@/projects';

export const DATES = CURRENT.dates;
export const SLOT_MINUTES = CURRENT.slotMinutes || 20;
export const MAX_PERSONS = CURRENT.maxPersons;
export const PT = CURRENT.priceTransfer; // transfer price
export const PC = CURRENT.priceCard; // card price
export const BANK = CURRENT.bank;
export const BOOKING_OPEN = CURRENT.status === 'open';
export const SNAPSHOT = CURRENT.snapshot || {};
export const PRE_BOOKED = CURRENT.preBooked || {}; // DB 밖에서 받은 예약 (구글폼 등)
export const INTRO = BOOKING_OPEN ? CURRENT.intro : DEFAULT_INTRO;
export const INVITE = BOOKING_OPEN ? CURRENT.invite : null; // 상세페이지 맨 아래·완료 화면 링크
export const ADMIN_PW = '9241';
