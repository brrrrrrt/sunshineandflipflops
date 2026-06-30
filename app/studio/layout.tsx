import './studio.css';

export const metadata = {
  title: "Mary's Studio",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
