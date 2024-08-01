'use client';
import { ReactNode } from 'react';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-white">
        <div className="relative min-h-screen h-auto footer-background">
          <main className="mx-auto lg:px-120 px-24 max-w-1440 h-full z-1">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
