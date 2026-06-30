import { createClient } from '@/lib/supabase/client';

/**
 * Downscales an image in the browser (max edge 1600px, JPEG q0.85) before
 * uploading to the public "media" bucket, so big phone photos don't blow the
 * storage budget. Returns the public URL to store on the record.
 */
async function downscale(file: File, maxEdge = 1600): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);

  return new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b ?? file), 'image/jpeg', 0.85),
  );
}

export async function uploadImage(file: File): Promise<string> {
  const blob = await downscale(file);
  const sb = createClient();
  const rand = Math.random().toString(36).slice(2, 9);
  const path = `uploads/${Date.now()}-${rand}.jpg`;

  const { error } = await sb.storage
    .from('media')
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false });
  if (error) throw error;

  return sb.storage.from('media').getPublicUrl(path).data.publicUrl;
}
