import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This project has its own lockfile; pin the tracing root to silence the
  // multi-lockfile workspace-root warning.
  outputFileTracingRoot: __dirname,
  images: {
    // Supabase Storage public bucket — remote images for blog covers / postcards.
    // Host comes from NEXT_PUBLIC_SUPABASE_URL; configured at runtime via remotePatterns below.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
