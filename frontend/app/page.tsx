"use client"

import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Heart, Smile, Sun, ArrowRight, TrendingUp, Compass, Sparkles } from "lucide-react"

export default function Root() {
  const router = useRouter()
  const session = useSession()
  const isLoading = session.status === "loading"

  const handleAction = () => {
    if (session.status === "authenticated") {
      router.push("/home")
    } else {
      signIn("google", { callbackUrl: "/home" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-blue-50 p-4 md:p-8">
      <main className="w-full max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-6">Welcome to MindGarden</h1>
          {/* Text without container as requested */}
          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            MindGarden is a friendly companion app designed to make your day better and help you find connections in
            ways you never expected. Whether you're facing life challenges, job problems, or simply can't find a way
            forward, MindGarden is here to guide you.
          </p>
        </div>

        {/* Steps Section - Horizontal layout as requested */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
            <div className="bg-purple-600 text-white p-5 rounded-lg shadow-md flex-1 max-w-xs text-center transform transition-transform hover:scale-105">
              <div className="flex flex-col items-center">
                <TrendingUp className="h-8 w-8 mb-3" />
                <h2 className="text-xl font-bold tracking-wide mb-2">BOOST YOUR CONFIDENCE</h2>
                <p className="text-purple-100 text-sm">Build self-esteem and inner strength</p>
              </div>
            </div>
            <ArrowRight className="hidden md:block text-purple-600" />
            <div className="bg-indigo-600 text-white p-5 rounded-lg shadow-md flex-1 max-w-xs text-center transform transition-transform hover:scale-105">
              <div className="flex flex-col items-center">
                <Compass className="h-8 w-8 mb-3" />
                <h2 className="text-xl font-bold tracking-wide mb-2">GO FORWARD</h2>
                <p className="text-indigo-100 text-sm">Navigate life with purpose and direction</p>
              </div>
            </div>
            <ArrowRight className="hidden md:block text-purple-600" />
            <div className="bg-blue-500 text-white p-5 rounded-lg shadow-md flex-1 max-w-xs text-center transform transition-transform hover:scale-105">
              <div className="flex flex-col items-center">
                <Sparkles className="h-8 w-8 mb-3" />
                <h2 className="text-xl font-bold tracking-wide mb-2">ENJOY LIFE</h2>
                <p className="text-blue-100 text-sm">Experience joy and fulfillment every day</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column - Features */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-purple-800 mb-4">How MindGarden Helps You</h3>

            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Heart className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Self Care</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Prioritize your mental wellbeing with guided practices and daily reflections that help you stay
                    centered.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Smile className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Emotional Balance</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Develop resilience and navigate life's challenges with confidence and inner strength.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <Sun className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Daily Positivity</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Start each day with positive affirmations and mindful practices to boost your mood and outlook.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Get Started Card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-lg">
              <h3 className="mb-6 text-center text-2xl font-bold text-purple-700">What are you waiting for?</h3>
              <p className="mb-8 text-center text-gray-600 leading-relaxed">
                Nurture your mental wellness journey with daily reflections and mindfulness practices. Join thousands
                who have transformed their lives.
              </p>
              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleAction}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-6"
                  disabled={isLoading}
                >
                  Get Started
                </Button>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Begin your journey to a more mindful and balanced life today
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  )
}


