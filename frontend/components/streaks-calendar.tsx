"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { addMonths, isSameDay, subDays } from "date-fns";
import { Flame } from "lucide-react";

export function StreaksCalendar() {
  const [streakDays, setStreakDays] = useState<Date[]>([]);

  useEffect(() => {
    // Generate random streak days after component mounts on client side
    const generatedStreakDays = Array.from({ length: 30 }, (_, i) => {
      const day = subDays(new Date(), i);
      return Math.random() > 0.3 ? day : null;
    }).filter(Boolean) as Date[];

    setStreakDays(generatedStreakDays);
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[0, 1].map((monthOffset) => (
        <Calendar
          key={monthOffset}
          mode="single"
          className="rounded-md border"
          month={addMonths(new Date(), monthOffset)}
          modifiers={{ streak: streakDays }}
          components={{
            DayContent: ({ date }) => (
              <div className="relative flex h-8 w-8 items-center justify-center">
                {date.getDate()}
                {streakDays.some((streakDate) =>
                  isSameDay(date, streakDate)
                ) && (
                  <Flame className="absolute -top-1 -right-1 h-4 w-4 text-orange-500" />
                )}
              </div>
            ),
          }}
        />
      ))}
    </div>
  );
}
