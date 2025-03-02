import { PageLayout } from "@/components/page-layout"
import { CardWithTitle } from "@/components/ui/card-with-title"
import { Award, Trophy, Star, Zap, Heart } from "lucide-react"

export const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first check-in",
    icon: <Award className="h-6 w-6 text-green-500" />,
    unlocked: true,
    date: "2023-10-01",
  },
  {
    id: 2,
    title: "Week Warrior",
    description: "Complete 7 consecutive daily check-ins",
    icon: <Trophy className="h-6 w-6 text-amber-500" />,
    unlocked: true,
    date: "2023-10-07",
  },
  {
    id: 3,
    title: "Mindfulness Master",
    description: "Complete 30 daily check-ins",
    icon: <Star className="h-6 w-6 text-purple-500" />,
    unlocked: true,
    date: "2023-10-30",
  },
  {
    id: 4,
    title: "Reflection Guru",
    description: "Write 10 journal entries",
    icon: <Zap className="h-6 w-6 text-blue-500" />,
    unlocked: false,
    date: null,
  },
  {
    id: 5,
    title: "Self-Care Champion",
    description: "Report 5 consecutive days of positive mood",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    unlocked: false,
    date: null,
  },
]

export default function AchievementsPage() {
  return (
    <PageLayout>
      <CardWithTitle title="Your Achievements">
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-4 rounded-lg p-3 transition-colors ${
                !achievement.unlocked && "opacity-60"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>
              {achievement.unlocked && achievement.date &&(
                <div className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</div>
              )}
            </div>
          ))}
        </div>
      </CardWithTitle>
    </PageLayout>
  )
}

