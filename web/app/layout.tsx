import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'ιɴѕтαɢrαм αι coɴтrol ceɴтer ѕнιwα',
  description: 'AI-assisted Instagram workspace'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" dir="ltr"><body>{children}</body></html>;
}
