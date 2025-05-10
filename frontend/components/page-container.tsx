import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`w-[100vw] overflow-hidden container mx-auto p-4 ${className}`}>{children}</div>
  );
}
