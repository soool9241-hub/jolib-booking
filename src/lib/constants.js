import { CURRENT } from '@/projects';

export const DATES = CURRENT.dates;
export const MAX_PERSONS = CURRENT.maxPersons;
export const PT = CURRENT.priceTransfer; // transfer price
export const PC = CURRENT.priceCard; // card price
export const BANK = CURRENT.bank;
export const BOOKING_OPEN = CURRENT.status === 'open';
export const SNAPSHOT = CURRENT.snapshot || {};
export const ADMIN_PW = '9241';
