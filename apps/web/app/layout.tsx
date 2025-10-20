import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Crowdfunding on eCash (XEC)',
  description: 'Launch and support transparent campaigns powered by eCash smart contracts.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.className} min-h-screen antialiased`}>{children}</body>
    </html>
  );
}
