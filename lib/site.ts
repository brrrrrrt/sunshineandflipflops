/**
 * Single source of truth for public business info shown on the marketing
 * site. This is public content (it renders for every visitor), not secrets.
 * The booking URL is sourced from env so it can be rotated without a code
 * change and stays out of the committed repo.
 */
export const SITE = {
  name: 'Sunshine & Flip Flops',
  owner: 'Mary Augustine',
  phone: '(267) 639-0405',
  phoneHref: 'tel:+12676390405',
  email: 'maryaugustine@sunshineandflipflops.net',
  legal: {
    californiaSot: 'California SOT #2158353-50',
    floridaSot: 'Florida SOT Ref. #ST44927',
    affiliate: 'Authorized Cornerstone Affiliate',
  },
  // Google Calendar appointment scheduling link — supplied via env.
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? '',
} as const;
