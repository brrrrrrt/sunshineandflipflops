import { SITE } from '@/lib/site';

export default function FloatCall() {
  return (
    <a href={SITE.phoneHref} className="float-call" aria-label="Call Mary">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M4 2h2.5l2 4.5-2.5 1.5c.9 2.2 2.8 4.1 5 5l1.5-2.5 4.5 2V15c0 1.1-.9 2-2 2-7.2 0-13-5.8-13-13 0-1.1.9-2 2-2z"
          stroke="#0e2257"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <span className="label">Call Mary</span>
    </a>
  );
}
