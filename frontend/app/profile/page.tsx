import { CardWithTitle } from "@/components/ui/card-with-title"
import { PageLayout } from "@/components/page-layout"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { StreaksCalendar } from "@/components/streaks-calendar"
import { MoodGraph } from "@/components/mood-graph"

export default function ProfilePage() {
  return (
    <PageLayout>
      <div className="grid gap-6 md:grid-cols-2">
        <CardWithTitle title="Personal Information">
          <div className="mb-6 flex justify-center">
            <Image src="/placeholder.svg" alt="Profile Picture" width={150} height={150} className="rounded-full" />
          </div>
          <form className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" placeholder="Your Name" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="your.email@example.com" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input type="date" id="birthdate" />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardWithTitle>
        <div className="space-y-6">
          <CardWithTitle title="Your Streaks">
            <StreaksCalendar />
          </CardWithTitle>
          <CardWithTitle title="Mood History">
            <MoodGraph />
          </CardWithTitle>
        </div>
      </div>
    </PageLayout>
  )
}

