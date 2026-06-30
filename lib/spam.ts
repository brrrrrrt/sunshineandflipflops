/**
 * Heuristic detection for salesperson / spam leads, so Mary can tell a real
 * traveler from someone pitching her marketing services at a glance. Runs
 * server-side when a lead is submitted; the result is stored on the lead and
 * surfaced as a badge in the Studio inbox. She can always delete anything.
 */

const SALES_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\bseo\b|search engine optimi/i, label: 'SEO pitch' },
  { re: /rank(ing)?\s+(your|the)\s+(site|website|business)/i, label: 'ranking pitch' },
  { re: /first page of google/i, label: 'Google ranking pitch' },
  { re: /\bbacklinks?\b|link[-\s]?building/i, label: 'backlink pitch' },
  { re: /increase|boost|grow|double|explode/i, label: 'growth pitch' },
  { re: /\b(sales|traffic|revenue|leads|conversions?|roi)\b/i, label: 'sales/marketing terms' },
  { re: /digital marketing|marketing (agency|services|team)/i, label: 'marketing agency' },
  { re: /web\s?(site)?\s?(design|development|redesign)\s+(services|company|agency)/i, label: 'web-dev pitch' },
  { re: /lead generation|lead gen\b/i, label: 'lead-gen pitch' },
  { re: /social media (management|marketing|growth)/i, label: 'social-media pitch' },
  { re: /\bb2b\b|outsourc|offshore|virtual assistant/i, label: 'outsourcing pitch' },
  { re: /\bcrypto\b|investment opportunity|forex|trading bot/i, label: 'investment spam' },
  { re: /work from home|make money online|passive income/i, label: 'money scheme' },
  { re: /we (can|could|would love to) help (you|your)/i, label: 'cold-outreach phrasing' },
  { re: /guest post|sponsored (post|content)|press release/i, label: 'content pitch' },
  { re: /\bAI\b.*(tool|agent|automation)|automat(e|ion) your/i, label: 'AI-tool pitch' },
];

const LINK_RE = /(https?:\/\/|www\.)/i;

export interface SpamResult {
  flagged: boolean;
  reason: string;
}

export function detectSalesLead(input: {
  name?: string;
  email?: string;
  message?: string;
  trip_type?: string;
}): SpamResult {
  const text = `${input.name ?? ''} ${input.trip_type ?? ''} ${input.message ?? ''}`;
  const hits = SALES_PATTERNS.filter((p) => p.re.test(text));
  const labels = Array.from(new Set(hits.map((h) => h.label)));

  const message = input.message ?? '';
  const hasLink = LINK_RE.test(message);
  const isShout = message.length > 20 && message === message.toUpperCase();

  let score = labels.length;
  if (hasLink) score += 1;
  if (isShout) score += 1;

  if (score < 2) return { flagged: false, reason: '' };

  const parts: string[] = [];
  if (labels.length) parts.push(labels.slice(0, 3).join(', '));
  if (hasLink) parts.push('contains a link');
  if (isShout) parts.push('all-caps message');

  return {
    flagged: true,
    reason: `Likely sales/spam — ${parts.join('; ')}.`,
  };
}
