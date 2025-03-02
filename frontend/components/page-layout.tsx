import type { ReactNode } from 'react';
import { PageContainer } from './page-container';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return <PageContainer className="py-8">{children}</PageContainer>;
}
