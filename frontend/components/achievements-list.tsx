import { Award, Trophy, Star, Zap, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AchievementsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-purple-700">Recent Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.slice(0, 3).map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-4 rounded-lg p-3 transition-colors ${
                achievement.unlocked ? 'bg-purple-50' : 'bg-gray-100 opacity-60'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <div className="text-xs text-gray-500">
                  {new Date(achievement.date).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
          <div className="text-center">
            <Button variant="link" className="text-purple-600 hover:text-purple-700">
              View All Achievements
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from '@/components/ui/button';
import { achievements } from '@/app/achievements/page';
