import { Menu } from 'lucide-react';
import Link from 'next/link';

import { DailyCheckIn } from '@/components/daily-check-in';
import { PageContainer } from '@/components/page-container';
import { SignOutButton } from '@/components/sign-out';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type Props = {}

const navItems = [
  { href: '/chat', label: 'AI Assistant' },
  { href: '/profile', label: 'Profile' },
  { href: '/achievements', label: 'Achievements' },
];


const NavContent = (props: Props) => {
  return (
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
            <SignOutButton />
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
                <SignOutButton />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </PageContainer>
    </header>
  )
}

export default NavContent