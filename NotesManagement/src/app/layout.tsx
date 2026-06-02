import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/app/providers';

export const metadata: Metadata = {
  title: 'Notes Management System',
  description: 'A production-grade notes management system built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
