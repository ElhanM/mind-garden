'use client';
import { usePathname } from 'next/navigation';

import NavContent from './nav-content';

export function Navbar() {
  const pathname = usePathname();

  // Don't render the navbar on the home page
  if (pathname === '/') {
    return null;
  }

  return <NavContent />;
}
