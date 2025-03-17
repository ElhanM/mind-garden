'use client';
import { Badge } from '@/components/ui/badge';

interface DailyCheckIn {
  id: number;
  userId: number;
  mood: 'great' | 'good' | 'okay' | 'down' | 'bad';
  stressLevel: number;
  journalEntry: string | null;
  createdAt: Date;
  checkInDate: Date;
}

export function DailyCheckInsList({ checkIns }: { checkIns: DailyCheckIn[] }) {
  if (checkIns.length === 0) {
    return <div className="text-center py-6 text-gray-500">No check-ins recorded yet.</div>;
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {checkIns.map((checkIn) => (
        <div key={checkIn.id} className="border rounded-lg p-4 bg-white">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <MoodEmoji mood={checkIn.mood} />
              <div>
                <p className="font-medium capitalize">{checkIn.mood}</p>
                <p className="text-xs text-gray-500">
                  {/* Convert UTC to local date string */}
                  {checkIn.checkInDate.toLocaleDateString()}
                </p>
              </div>
            </div>
            <StressBadge level={checkIn.stressLevel} />
          </div>

          {checkIn.journalEntry ? (
            <div className="mt-3">
              <p className="text-sm text-gray-700">{checkIn.journalEntry}</p>
              <p className="text-xs text-gray-500 mt-2">
                {/* Convert UTC to local time string */}
                Recorded at {checkIn.createdAt.toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic mt-2">No journal entry</p>
          )}
        </div>
      ))}
    </div>
  );
}

function MoodEmoji({ mood }: { mood: 'great' | 'good' | 'okay' | 'down' | 'bad' }) {
  const emoji: { [key in DailyCheckIn['mood']]: string } = {
    great: '😁',
    good: '🙂',
    okay: '😐',
    down: '😔',
    bad: '😞',
  };

  const moodEmoji = emoji[mood] || '❓';

  const bgColor =
    {
      great: 'bg-green-100',
      good: 'bg-blue-100',
      okay: 'bg-yellow-100',
      down: 'bg-orange-100',
      bad: 'bg-red-100',
    }[mood] || 'bg-gray-100';

  return (
    <div className={`${bgColor} h-8 w-8 rounded-full flex items-center justify-center text-lg`}>
      {moodEmoji}
    </div>
  );
}

function StressBadge({ level }: { level: number }) {
  let color = 'bg-green-100 text-green-800';

  if (level > 7) {
    color = 'bg-red-100 text-red-800';
  } else if (level > 5) {
    color = 'bg-orange-100 text-orange-800';
  } else if (level > 3) {
    color = 'bg-yellow-100 text-yellow-800';
  }

  return (
    <Badge className={color} variant="outline">
      Stress: {level}/10
    </Badge>
  );
}
