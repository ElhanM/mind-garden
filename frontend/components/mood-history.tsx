import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Cloud, CloudSun, CloudRain, CloudLightning } from "lucide-react"

export function MoodHistory() {
  // In a real app, these would be fetched from an API
  const moodHistory = [
    { date: "2023-10-25", mood: "great", stressLevel: 1 },
    { date: "2023-10-24", mood: "good", stressLevel: 2 },
    { date: "2023-10-23", mood: "okay", stressLevel: 3 },
    { date: "2023-10-22", mood: "down", stressLevel: 4 },
    { date: "2023-10-21", mood: "good", stressLevel: 2 },
    { date: "2023-10-20", mood: "great", stressLevel: 1 },
    { date: "2023-10-19", mood: "okay", stressLevel: 3 },
  ]

  const getMoodIcon = (mood) => {
    switch (mood) {
      case "great":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "good":
        return <CloudSun className="h-6 w-6 text-yellow-400" />
      case "okay":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "down":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      case "bad":
        return <CloudLightning className="h-6 w-6 text-purple-600" />
      default:
        return <Cloud className="h-6 w-6 text-gray-500" />
    }
  }

  const getStressColor = (level) => {
    switch (level) {
      case 1:
        return "bg-green-100/40"
      case 2:
        return "bg-green-200/40"
      case 3:
        return "bg-yellow-100/40"
      case 4:
        return "bg-orange-100/40"
      case 5:
        return "bg-red-100/40"
      default:
        return "bg-gray-100/40"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-purple-700">Your Mood History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {moodHistory.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`mb-2 flex h-14 w-14 items-center justify-center rounded-full ${getStressColor(day.stressLevel)} shadow-md`}
              >
                {getMoodIcon(day.mood)}
              </div>
              <span className="text-xs text-gray-500">
                {new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

