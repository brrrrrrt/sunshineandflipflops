import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sunshine & Flip Flops | Curated Travel by Mary Augustine',
  description:
    'Care meets luxury. Personally crafted journeys to Caribbean sanctuaries, Disney resorts, all-inclusive escapes, wellness retreats and global cruises.',
};

const FONTS =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Outfit:wght@300;400;500;600;700&family=Italianno&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter+Tight:wght@400;500;600&family=Allura&family=DM+Serif+Display&family=Manrope:wght@400;500;600&family=Caveat:wght@500&display=swap';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href={FONTS} rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
