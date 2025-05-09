import { GetStartedButton } from '@/components/get-started';
import { Heart, Smile, Sun, ArrowRight, TrendingUp, Compass, Sparkles } from 'lucide-react';
import React from 'react';

export default function Root() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-blue-50 p-4 md:p-8">
      <main className="w-full max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-6">
            Welcome to MindGarden
          </h1>
          {/* Text without container as requested */}
          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            MindGarden is a friendly companion app designed to make your day better and help you
            find connections in ways you never expected. Whether you&apos;re facing life challenges,
            job problems, or simply can&apos;t find a way forward, MindGarden is here to guide you.
          </p>
        </div>

        {/* Steps Section - Horizontal layout as requested */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
            {[
              {
                bgColor: 'bg-purple-600',
                icon: <TrendingUp className="h-8 w-8 mb-3" />,
                title: 'BOOST YOUR CONFIDENCE',
                description: 'Build self-esteem and inner strength',
                textColor: 'text-purple-100',
              },
              {
                bgColor: 'bg-indigo-600',
                icon: <Compass className="h-8 w-8 mb-3" />,
                title: 'GO FORWARD',
                description: 'Navigate life with purpose and direction',
                textColor: 'text-indigo-100',
              },
              {
                bgColor: 'bg-blue-500',
                icon: <Sparkles className="h-8 w-8 mb-3" />,
                title: 'ENJOY LIFE',
                description: 'Experience joy and fulfillment every day',
                textColor: 'text-blue-100',
              },
            ].map((step, index, arr) => (
              <React.Fragment key={step.title}>
                <div
                  className={`${step.bgColor} text-white p-5 rounded-lg shadow-md flex-1 max-w-xs text-center transform transition-transform hover:scale-105`}
                >
                  <div className="flex flex-col items-center">
                    {step.icon}
                    <h2 className="text-xl font-bold tracking-wide mb-2 w-[90vw]">{step.title}</h2>
                    <p className={`${step.textColor} text-sm`}>{step.description}</p>
                  </div>
                </div>
                {index < arr.length - 1 && (
                  <ArrowRight className="hidden md:block text-purple-600" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column - Features */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-purple-800 mb-4">
              How MindGarden Helps You
            </h3>
            {[
              {
                bgColor: 'bg-purple-100',
                Icon: Heart,
                iconColor: 'text-purple-700',
                title: 'Self Care',
                description:
                  'Prioritize your mental wellbeing with guided practices and daily reflections that help you stay centered.',
              },
              {
                bgColor: 'bg-blue-100',
                Icon: Smile,
                iconColor: 'text-blue-700',
                title: 'Emotional Balance',
                description:
                  "Develop resilience and navigate life's challenges with confidence and inner strength.",
              },
              {
                bgColor: 'bg-yellow-100',
                Icon: Sun,
                iconColor: 'text-yellow-600',
                title: 'Daily Positivity',
                description:
                  'Start each day with positive affirmations and mindful practices to boost your mood and outlook.',
              },
            ].map(({ bgColor, Icon, iconColor, title, description }) => (
              <div
                key={title}
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start">
                  <div className={`${bgColor} p-3 rounded-full mr-4`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Get Started Card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-lg">
              <h3 className="mb-6 text-center text-2xl font-bold text-purple-700">
                What are you waiting for?
              </h3>
              <p className="mb-8 text-center text-gray-600 leading-relaxed">
                Nurture your mental wellness journey with daily reflections and mindfulness
                practices. Join thousands who have transformed their lives.
              </p>
              <GetStartedButton />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
