'use client';

import { useEffect, useState, useRef } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { isSameDay, addMonths } from 'date-fns';
import { Flame } from 'lucide-react';
import { fetchCheckInsHistory } from '@/app/api-client/check-in';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export function StreaksCalendar() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const [streakDays, setStreakDays] = useState<Date[]>([]);
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  // Determine if we have enough space for two months
  // We need at least 600px for comfortable viewing of two months
  const hasSpaceForTwoMonths = containerWidth >= 600;

  // Number of months to display based on available space
  const monthsToShow = hasSpaceForTwoMonths ? 2 : 1;

  // Measure container width on mount and resize
  useEffect(() => {
    // Ensure the container element exists before measuring
    if (!containerRef.current) return;

    // Function to update the container width
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Measure the initial width on mount
    updateWidth();

    // Update on resize
    // Create a ResizeObserver to track container size changes
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    // Cleanup function: Stop observing on unmount
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []); // Runs only once when component mounts

  const { data: checkIns, isLoading } = useQuery({
    queryKey: ['checkIns', email],
    queryFn: () => (email ? fetchCheckInsHistory(email) : Promise.resolve([])),
    enabled: !!email,
  });

  useEffect(() => {
    if (!checkIns) return;

    const mapCheckInsToStreakDays = (checkIns: any[]): Date[] => {
      return checkIns.map((checkIn) => new Date(checkIn.createdAt));
    };

    setStreakDays(mapCheckInsToStreakDays(checkIns));
  }, [checkIns]);

  // Custom handler for month change
  const handleMonthChange = (newMonth: Date) => {
    console.log('Month changed to:', newMonth);
    setDisplayMonth(newMonth);
  };

  if (isLoading) {
    return (
      <div ref={containerRef} className="w-full flex justify-center">
        <div className={`flex ${hasSpaceForTwoMonths ? 'flex-row space-x-6' : ''}`}>
          {/* First month skeleton */}
          <div className="w-[240px]">
            {/* Month header */}
            <div className="flex justify-center mb-4 pt-3">
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Calendar grid - simplified representation */}
            <div className="space-y-3">
              {/* Weekday headers */}
              <div className="flex justify-between px-1">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={`h-${i}`} className="h-4 w-4" />
                ))}
              </div>

              {/* Calendar rows - just showing the shape */}
              {[...Array(6)].map((_, row) => (
                <div key={`r-${row}`} className="flex justify-between px-1">
                  {[...Array(7)].map((_, col) => (
                    <Skeleton key={`c-${row}-${col}`} className="h-6 w-6 rounded-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Second month skeleton (only shown if there's enough space) */}
          {hasSpaceForTwoMonths && (
            <div className="w-[240px]">
              {/* Month header */}
              <div className="flex justify-center mb-4 pt-3">
                <Skeleton className="h-6 w-32" />
              </div>

              {/* Calendar grid - simplified representation */}
              <div className="space-y-3">
                {/* Weekday headers */}
                <div className="flex justify-between px-1">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={`h2-${i}`} className="h-4 w-4" />
                  ))}
                </div>

                {/* Calendar rows - just showing the shape */}
                {[...Array(6)].map((_, row) => (
                  <div key={`r2-${row}`} className="flex justify-between px-1">
                    {[...Array(7)].map((_, col) => (
                      <Skeleton key={`c2-${row}-${col}`} className="h-6 w-6 rounded-full" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full">
      <div className="w-full flex justify-center">
        <Calendar
          mode="single"
          month={displayMonth}
          onMonthChange={handleMonthChange}
          components={{
            DayContent: ({ date }) => {
              const isStreakDay = streakDays.some((streakDate) => isSameDay(date, streakDate));
              const isToday = isSameDay(date, today);

              return (
                <div className="relative flex h-9 w-9 items-center justify-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
                      isToday
                        ? 'bg-purple-500 text-white font-medium ring-2 ring-purple-200'
                        : isStreakDay
                          ? 'bg-orange-100'
                          : ''
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  {isStreakDay && !isToday && (
                    <Flame className="absolute -top-1 -right-1 h-4 w-4 z-50 text-orange-500" />
                  )}
                  {isStreakDay && isToday && (
                    <div className="absolute -top-1 -right-1 z-50 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                    </div>
                  )}
                </div>
              );
            },
          }}
          disabled={[
            { after: today }, // Disable future dates
          ]}
          fromMonth={new Date(2023, 0, 1)} // Limit how far back users can navigate
          toMonth={addMonths(today, 3)} // Allow navigation to 3 months in the future
          numberOfMonths={monthsToShow} // Dynamic based on container width
          className="mx-auto" // Center the calendar
          classNames={{
            months:
              monthsToShow === 1
                ? 'flex justify-center'
                : 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 justify-center',
            month: 'space-y-4',
            caption: 'flex justify-center pt-1 relative items-center',
            caption_label: 'text-sm font-medium',
            nav: 'space-x-1 flex items-center',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
            row: 'flex w-full mt-2',
            cell: 'h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100',
            day_range_end: 'day-range-end',
            day_selected:
              'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
            day_today: '', // We're handling today styling in the DayContent component
            day_outside: 'day-outside text-muted-foreground opacity-50',
            day_disabled: 'text-muted-foreground opacity-50',
            day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
            day_hidden: 'invisible',
          }}
        />
      </div>
    </div>
  );
}
