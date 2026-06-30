'use client';

import { useRef, useState } from 'react';
import { uploadImage } from '@/lib/studio/upload';

interface Props {
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageDrop({ value, onChange, label = 'Photo' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function handle(file?: File | null) {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch {
      setErr('That upload didn’t work — please try another photo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="s-field">
      <label>{label}</label>
      <div
        className={`s-drop${value ? ' has-image' : ''}${busy ? ' busy' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handle(e.dataTransfer.files?.[0]);
        }}
        role="button"
        tabIndex={0}
      >
        {value ? (
          <>
            <img src={value} alt="" />
            <span className="change">{busy ? 'Uploading…' : 'Change photo'}</span>
          </>
        ) : busy ? (
          <span className="spin" />
        ) : (
          <span>
            Drop a photo here or <b>browse</b>
            <br />
            <small>JPG or PNG — automatically optimized</small>
          </span>
        )}
      </div>
      {err ? <span className="help" style={{ color: '#b3261e' }}>{err}</span> : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handle(e.target.files?.[0])}
      />
    </div>
  );
}
