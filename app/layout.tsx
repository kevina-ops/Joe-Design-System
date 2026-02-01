import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Joe Design System',
  description: 'Joe Coffee\'s Design System - Token-driven React component library',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
