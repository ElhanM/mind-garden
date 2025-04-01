import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-purple-200/60 border border-purple-200/30',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
