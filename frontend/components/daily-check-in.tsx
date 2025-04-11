'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
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
import { Spinner } from './ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Calendar,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  SendHorizonal,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTodayCheckIn, submitCheckIn } from '../app/api-client/check-in';
import type { CheckInFormData } from '../validation/check-in-schema';
import { checkInSchema } from '../validation/check-in-schema';
import errorCatch from '@/app/api-client/error-message';
import compareDatesWithoutTimestamp from '@/validation/compare-dates-without-timestamp';

export function DailyCheckIn() {
  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const email = session?.user.email ?? '';
  let hasCheckedInToday = false;

  // Query to check if user already checked in today
  const {
    data: todayCheckIn,
    isLoading: checkInLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['todayCheckIn'],
    queryFn: () => (email ? fetchTodayCheckIn(email) : Promise.resolve(null)),
    enabled: !!email, // Only fetch if userId exists
  });

  //same structure as the onError.
  if (isError) {
    const errorMessage = errorCatch(error);

    toast({
      title: 'Error!',
      description: errorMessage,
      variant: 'destructive',
    });
  }

  todayCheckIn
    ? (hasCheckedInToday = compareDatesWithoutTimestamp(todayCheckIn?.createdAt))
    : (hasCheckedInToday = false);

  // Form setup with validation
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckInFormData>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      mood: undefined,
      stressLevel: 3,
      journalEntry: '',
    },
  });

  // Mutation for submitting check-in
  const checkInMutation = useMutation({
    mutationFn: (formData: CheckInFormData) => {
      if (!email) throw new Error('User email is required');
      return submitCheckIn(formData, email);
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Check-in submitted successfully.',
        variant: 'default',
      });

      // Invalidate today's check-in query
      queryClient.invalidateQueries({ queryKey: ['todayCheckIn'] });

      // Invalidate streaks calendar query (forces it to fetch fresh data)
      queryClient.invalidateQueries({ queryKey: ['checkIns', email] });

      setOpen(false); // Close the dialog immediately
      reset(); // Reset the form
      setSubmitting(false);
    },
    onError: (error: unknown) => {
      const errorMessage = errorCatch(error);

      toast({
        title: 'Nope!',
        description: errorMessage,
        variant: 'destructive',
      });

      setSubmitting(false);
    },
  });

  // Handle form submission
  const onSubmit = (data: CheckInFormData) => {
    if (!email) {
      toast({
        title: 'No user email found!',
        description: 'Please try again.',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    checkInMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          disabled={!email || checkInLoading || hasCheckedInToday} // Disable if userId is null or data is loading
        >
          {checkInLoading || !email ? (
            <>
              <Spinner className="text-gray-50 mr-2 h-4 w-4" />
              Daily Check-in
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Daily Check-in
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {!isSubmitted && (
          <>
            <DialogHeader>
              <DialogTitle>Daily Mental Health Check-in</DialogTitle>
              <DialogDescription>
                Take a moment to reflect on your mental state today. This helps your bonsai grow!
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="mood">How are you feeling today?</Label>
                  <Controller
                    name="mood"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger id="mood">
                            <SelectValue placeholder="Select your mood" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="great">
                              <div className="flex items-center">
                                Great <Sun className="ml-2 h-4 w-4 text-yellow-500" />
                              </div>
                            </SelectItem>
                            <SelectItem value="good">
                              <div className="flex items-center">
                                Good <CloudSun className="ml-2 h-4 w-4 text-yellow-400" />
                              </div>
                            </SelectItem>
                            <SelectItem value="okay">
                              <div className="flex items-center">
                                Okay <Cloud className="ml-2 h-4 w-4 text-gray-400" />
                              </div>
                            </SelectItem>
                            <SelectItem value="down">
                              <div className="flex items-center">
                                Down <CloudRain className="ml-2 h-4 w-4 text-blue-400" />
                              </div>
                            </SelectItem>
                            <SelectItem value="bad">
                              <div className="flex items-center">
                                Bad <CloudLightning className="ml-2 h-4 w-4 text-purple-500" />
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.mood && (
                          <p className="text-sm text-red-500 mt-1">{errors.mood.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Stress Level (1-5)</Label>
                  <Controller
                    name="stressLevel"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Slider
                          max={5}
                          min={1}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                          value={[field.value]}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Very Low (1)</span>
                          <span>Very High (5)</span>
                        </div>
                        {errors.stressLevel && (
                          <p className="text-sm text-red-500 mt-1">{errors.stressLevel.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="journalEntry">Journal Entry (Optional)</Label>
                  <Controller
                    name="journalEntry"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="journalEntry"
                        placeholder="Write your thoughts here..."
                      />
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner className="text-gray-50 mr-2 h-4 w-4" /> Check-in
                    </>
                  ) : (
                    <>
                      <SendHorizonal className="h-4 w-4 mr-2" />
                      Check-in
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
