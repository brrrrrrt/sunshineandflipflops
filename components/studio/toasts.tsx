'use client';

import { useCallback, useState } from 'react';

export interface Toast {
  id: number;
  kind: 'ok' | 'err';
  text: string;
}

let counter = 0;

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((kind: 'ok' | 'err', text: string) => {
    const id = ++counter;
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return {
    toasts,
    ok: (t: string) => push('ok', t),
    err: (t: string) => push('err', t),
  };
}

export function ToastList({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="s-toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`s-toast ${t.kind}`}>
          {t.kind === 'ok' ? '✓' : '!'} {t.text}
        </div>
      ))}
    </div>
  );
}
