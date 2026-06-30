'use client';

import { useEffect, useRef, useState } from 'react';
import type { Postcard } from '@/lib/types';

const DURATION = 5200;

/** Postcard filmstrip — autoplay, manual nav, thumbnails. Data-driven. */
export default function Filmstrip({ postcards }: { postcards: Postcard[] }) {
  const slides = postcards;
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const inViewRef = useRef(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Reset the timer whenever the active slide changes
  useEffect(() => {
    startRef.current = performance.now();
    if (progressRef.current) progressRef.current.style.width = '0%';
  }, [idx]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const tick = (t: number) => {
      if (playing && inViewRef.current) {
        const pct = Math.min(1, (t - startRef.current) / DURATION);
        if (progressRef.current) progressRef.current.style.width = `${pct * 100}%`;
        if (pct >= 1) setIdx((i) => (i + 1) % slides.length);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, slides.length]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (inViewRef.current = e.isIntersecting)),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (slides.length === 0) return null;
  const go = (n: number) => setIdx((n + slides.length) % slides.length);

  return (
    <div className="filmstrip reveal" id="filmstrip" ref={stageRef}>
      <div className="filmstrip-stage">
        {slides.map((s, i) => (
          <div className={`filmstrip-slide${i === idx ? ' active' : ''}`} key={s.id} data-idx={i}>
            <img src={s.image} alt={`${s.destination} — ${s.title}`} />
            <div className="filmstrip-caption">
              <div className="destination">{s.destination}</div>
              <div className="title">{s.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="filmstrip-controls">
        <div className="filmstrip-counter">
          <span className="current">{String(idx + 1).padStart(2, '0')}</span>{' '}
          <span>/ {String(slides.length).padStart(2, '0')}</span>
        </div>
        <div className="filmstrip-progress">
          <div className="filmstrip-progress-bar" ref={progressRef} />
        </div>
        <div className="filmstrip-nav">
          <button aria-label="Previous" onClick={() => go(idx - 1)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)}>
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <rect x="3" y="2" width="3" height="10" rx="1" />
                <rect x="8" y="2" width="3" height="10" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M3 2l9 5-9 5z" />
              </svg>
            )}
          </button>
          <button aria-label="Next" onClick={() => go(idx + 1)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="filmstrip-thumbs">
        {slides.map((s, i) => (
          <button
            className={`filmstrip-thumb${i === idx ? ' active' : ''}`}
            key={s.id}
            onClick={() => go(i)}
            aria-label={`View ${s.destination}`}
          >
            <img src={s.image} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
