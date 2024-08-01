'use client';
import { ReactNode } from 'react';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-white">
        <main className="mx-auto lg:px-120 px-24 max-w-1440 z-1 min-h-screen h-auto footer-background">
          {children}
        </main>
        <Toaster
          toastOptions={{
            style: {
              whiteSpace: 'nowrap',
              maxWidth: 'none',
            },
          }}
        />
      </body>
    </html>
  );
}
