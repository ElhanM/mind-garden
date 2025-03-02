'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  CheckCircle,
  Calendar,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
} from 'lucide-react';

export function DailyCheckIn() {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState<string>('');
  const [stressLevel, setStressLevel] = useState<number[]>([3]);
  const [journal, setJournal] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // In a real app, this would send data to an API
    console.log({ mood, stressLevel: stressLevel[0], journal });
    setIsSubmitted(true);

    // Reset form after 2 seconds and close dialog
    setTimeout(() => {
      setIsSubmitted(false);
      setOpen(false);
      setMood('');
      setStressLevel([3]);
      setJournal('');
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Calendar className="mr-2 h-4 w-4" />
          Daily Check-in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle>Daily Mental Health Check-in</DialogTitle>
              <DialogDescription>
                Take a moment to reflect on your mental state today. This helps your bonsai grow!
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="mood">How are you feeling today?</Label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger id="mood">
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="great">
                      <div className="flex items-center">
                        Sunny <Sun className="ml-2 h-4 w-4 text-yellow-500" />
                      </div>
                    </SelectItem>
                    <SelectItem value="good">
                      <div className="flex items-center">
                        Partly Sunny <CloudSun className="ml-2 h-4 w-4 text-yellow-400" />
                      </div>
                    </SelectItem>
                    <SelectItem value="okay">
                      <div className="flex items-center">
                        Cloudy <Cloud className="ml-2 h-4 w-4 text-gray-400" />
                      </div>
                    </SelectItem>
                    <SelectItem value="down">
                      <div className="flex items-center">
                        Rainy <CloudRain className="ml-2 h-4 w-4 text-blue-400" />
                      </div>
                    </SelectItem>
                    <SelectItem value="bad">
                      <div className="flex items-center">
                        Stormy <CloudLightning className="ml-2 h-4 w-4 text-purple-500" />
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Stress Level (1-5)</Label>
                <Slider
                  value={stressLevel}
                  onValueChange={setStressLevel}
                  max={5}
                  min={1}
                  step={1}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                  <span>Very High</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="journal">Journal Entry (Optional)</Label>
                <Textarea
                  id="journal"
                  placeholder="Write your thoughts here..."
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>
                Submit Check-in
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="mb-4 h-16 w-16 text-purple-500" />
            <h3 className="text-xl font-semibold text-purple-700">Check-in Complete!</h3>
            <p className="mt-2 text-center text-gray-600">
              Your bonsai tree has been nourished by your reflection.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
