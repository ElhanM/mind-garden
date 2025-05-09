import { Menu } from 'lucide-react';
import Link from 'next/link';

import { DailyCheckIn } from '@/components/daily-check-in';
import { PageContainer } from '@/components/page-container';
import { SignOutButton } from '@/components/sign-out';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import * as React from 'react';

const navItems = [
  { href: '/home', label: 'Home' },
  { href: '/chat', label: 'AI Assistant' },
  { href: '/profile', label: 'Profile' },
  { href: '/achievements', label: 'Achievements' },
];

const NavContent = () => {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <PageContainer>
        <div className="flex h-16 items-center justify-between">
          <Link href="/home">
            <span className="flex flex-row text-xl font-bold text-purple-700">
              <Image src="/Logo.png" width={32} height={32} alt="Logo" className="mr-2" />
              MindGarden
            </span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <DailyCheckIn />
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  size="sm"
                  className={pathname === item.href ? 'bg-purple-100 text-purple-700' : ''}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <SignOutButton />
          </nav>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-6">
                <DailyCheckIn />
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                    <Button
                      variant={pathname === item.href ? 'default' : 'ghost'}
                      size="sm"
                      className={pathname === item.href ? 'bg-purple-100 text-purple-700' : ''}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <SignOutButton />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
    </header>
  );
};

export default NavContent;
