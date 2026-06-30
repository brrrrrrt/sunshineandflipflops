'use client';

import { useEffect, useRef } from 'react';
import { SITE } from '@/lib/site';

/**
 * Loads the Google Calendar appointment scheduling button into #booking-button.
 * The scheduling URL comes from NEXT_PUBLIC_BOOKING_URL (see lib/site.ts), so
 * nothing is hardcoded. If it isn't configured the section still works via the
 * phone/email CTAs above it.
 */
export default function BookCall() {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE.bookingUrl || !targetRef.current) return;
    const target = targetRef.current;

    const cssId = 'gcal-scheduling-css';
    if (!document.getElementById(cssId)) {
      const css = document.createElement('link');
      css.id = cssId;
      css.rel = 'stylesheet';
      css.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
      document.head.appendChild(css);
    }

    const load = () => {
      const w = window as unknown as {
        calendar?: { schedulingButton?: { load: (o: unknown) => void } };
      };
      if (w.calendar?.schedulingButton && target) {
        target.innerHTML = '';
        w.calendar.schedulingButton.load({
          url: SITE.bookingUrl,
          color: '#f0b220',
          label: 'Book a free call',
          target,
        });
      }
    };

    const scriptId = 'gcal-scheduling-js';
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existing) {
      load();
    } else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
      script.async = true;
      script.onload = load;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="booking-button" className="book-scheduler" ref={targetRef} />;
}
