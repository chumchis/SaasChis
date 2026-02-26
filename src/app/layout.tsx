import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SyncBridge - Sincronización Airtable ↔️ Notion',
  description: 'La forma más simple de sincronizar Airtable y Notion automáticamente. Ahorra 5+ horas semanales.',
  keywords: ['Airtable', 'Notion', 'Sync', 'Integration', 'Automation'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
