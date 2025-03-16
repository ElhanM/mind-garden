'use client';

import { useEffect, useState, useRef } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { isSameDay, addMonths } from 'date-fns';
import { Flame } from 'lucide-react';
import { fetchCheckInsHistory } from '@/app/api-client/check-in';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

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
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidth();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

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
    return <div className="flex justify-center py-4">Loading...</div>;
  }

  return (
    <div ref={containerRef} className="flex justify-center items-center w-full">
      <Calendar
        mode="single"
        month={displayMonth}
        onMonthChange={handleMonthChange}
        components={{
          DayContent: ({ date }) => {
            const isStreakDay = streakDays.some((streakDate) => isSameDay(date, streakDate));
            return (
              <div className="relative flex h-9 w-9 items-center justify-center">
                <div
                  className={
                    isStreakDay
                      ? 'flex h-7 w-7 items-center justify-center rounded-full bg-orange-100'
                      : ''
                  }
                >
                  {date.getDate()}
                </div>
                {isStreakDay && (
                  <Flame className="absolute -top-1 -right-1 h-4 w-4 z-50 text-orange-500" />
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
          day_today: 'bg-accent text-accent-foreground',
          day_outside: 'day-outside text-muted-foreground opacity-50',
          day_disabled: 'text-muted-foreground opacity-50',
          day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
        }}
      />
    </div>
  );
}
