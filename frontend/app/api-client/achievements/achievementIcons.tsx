import { Star, Trophy, Target, PenTool, Smile } from 'lucide-react';

export const achievementIcons: { [key: number]: JSX.Element } = {
  1: <Star className="h-5 w-5 text-yellow-500" />,
  2: <Target className="h-5 w-5 text-blue-500" />,
  3: <Trophy className="h-5 w-5 text-green-500" />,
  4: <PenTool className="h-5 w-5 text-purple-500" />,
  5: <Smile className="h-5 w-5 text-pink-500" />,
};
