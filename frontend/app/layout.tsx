import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/page-container';
import { DailyCheckIn } from '@/components/daily-check-in';
import { Flame, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MindGarden',
  description: 'Nurture your mental wellness journey',
};

const navItems = [
  { href: '/chat', label: 'AI Assistant' },
  { href: '/profile', label: 'Profile' },
  { href: '/achievements', label: 'Achievements' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 to-blue-50">
          <header className="border-b bg-white/80 backdrop-blur-sm">
            <PageContainer>
              <div className="flex h-16 items-center justify-between">
                <Link href="/">
                  <span className="text-xl font-bold text-purple-700">MindGarden</span>
                </Link>
                <nav className="hidden items-center gap-4 md:flex">
                  <DailyCheckIn />
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button variant="ghost" size="sm">
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <nav className="flex flex-col gap-4">
                      <DailyCheckIn />
                      {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button variant="ghost" size="sm">
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </PageContainer>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-white py-6">
            <PageContainer>
              <p className="text-center text-sm text-gray-500">
                MindGarden - Nurture your mental wellness journey
              </p>
            </PageContainer>
          </footer>
        </div>
      </body>
    </html>
  );
}

import './globals.css';
