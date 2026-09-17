import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { UiProvider } from '@/components/ui-provider';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'Akolá',
  description: 'Encontre lugares onde você é bem-vindo.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={geist.variable}><UiProvider>{children}</UiProvider></body>
    </html>
  );
}
