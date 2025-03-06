import { CardWithTitle } from '@/components/ui/card-with-title';
import { BonsaiTree } from '@/components/bonsai-tree';
import { AchievementsList } from '@/components/achievements-list';
import { MoodHistory } from '@/components/mood-history';
import { PageLayout } from '@/components/page-layout';

export default function Home() {
  return (
    <PageLayout>
      <div className="grid gap-8 md:grid-cols-2">
        <section className="flex flex-col items-center justify-center">
          <div className="h-[300px] w-full max-w-md md:h-[400px]">
            <BonsaiTree />
          </div>
        </section>
        <section className="space-y-6">
          <CardWithTitle title="Your Progress">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'Current Streak',
                  value: '7 days',
                  bgColor: 'bg-purple-100',
                  textColor: 'text-purple-700',
                },
                {
                  label: 'Check-ins',
                  value: '32',
                  bgColor: 'bg-blue-100',
                  textColor: 'text-blue-700',
                },
                {
                  label: 'Achievements',
                  value: '8',
                  bgColor: 'bg-amber-100',
                  textColor: 'text-amber-700',
                },
              ].map((item, index) => (
                <div key={index} className={`rounded-lg ${item.bgColor} p-4 text-center`}>
                  <p className={`text-sm ${item.textColor}`}>{item.label}</p>
                  <p className={`text-3xl font-bold ${item.textColor}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </CardWithTitle>
          <MoodHistory />
          <AchievementsList />
        </section>
      </div>
    </PageLayout>
  );
}
