import { PageLayout } from '@/components/page-layout';
import { CardWithTitle } from '@/components/ui/card-with-title';
import { userAchievements } from '@/hooks/userAchievments';

export default function AchievementsPage() {
  const { achievements } = userAchievements();
  return (
    <PageLayout>
      <CardWithTitle title="Your Achievements">
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-4 rounded-lg p-3 transition-colors ${
                !achievement.unlocked && 'opacity-60'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>
              {achievement.unlocked && achievement.date && (
                <div className="text-xs text-gray-500">
                  {new Date(achievement.date).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardWithTitle>
    </PageLayout>
  );
}
