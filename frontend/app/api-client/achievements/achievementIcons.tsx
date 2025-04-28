import { Star, Trophy, Target, PenTool, Smile } from 'lucide-react';

export enum AchievementIcon {
  FirstCheckIn = 1,
  SevenDayStreak = 2,
  ConsistencyChampion = 3,
  JournalVirtuoso = 4,
  MoodBoosterPro = 5,
}

export const achievementIcons = {
  [AchievementIcon.FirstCheckIn]: <Star className="h-5 w-5 text-yellow-500" />,
  [AchievementIcon.SevenDayStreak]: <Target className="h-5 w-5 text-blue-500" />,
  [AchievementIcon.ConsistencyChampion]: <Trophy className="h-5 w-5 text-green-500" />,
  [AchievementIcon.JournalVirtuoso]: <PenTool className="h-5 w-5 text-purple-500" />,
  [AchievementIcon.MoodBoosterPro]: <Smile className="h-5 w-5 text-pink-500" />,
};
