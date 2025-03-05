'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast, useToast } from '@/hooks/use-toast';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Define the schema for form validation
const checkInSchema = z.object({
  mood: z.enum(['great', 'good', 'okay', 'down', 'bad'], {
    required_error: 'Please select your mood',
  }),
  stressLevel: z
    .number()
    .min(1, 'Stress level must be at least 1')
    .max(5, 'Stress level must be at most 5'),
  journalEntry: z.string().optional(),
});

type CheckInFormData = z.infer<typeof checkInSchema>;

// Create axios instance with interceptor to add user email to every request
const api = axios.create();

// Function to check if user has already checked in today
const fetchTodayCheckIn = async (userId: number | null) => {
  if (!userId) return null; // Avoid making the request if no userId

  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/check-ins`, {
      headers: {
        'user-id': userId, // Make sure userId is sent here
      },
    });
    console.log('API Response:', response.data);

    return response.data.data;
  } catch (error) {
    // If 404, it means no check-in for today, which is fine
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Function to submit a new check-in
const submitCheckIn = async (data: CheckInFormData & { userId: number }) => {
  console.log('Making API request with data:', data);

  try {
    const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/check-ins`, data);
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export function DailyCheckIn() {
  const [open, setOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Set up axios interceptor to add user email to every request
  api.interceptors.request.use((config) => {
    if (session?.user?.email) {
      config.headers = config.headers || {};
      config.headers['user-email'] = session.user.email;
    }
    return config;
  });

  useEffect(() => {
    const fetchUserId = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: { 'user-email': session.user.email },
        });

        console.log('Fetched user ID:', response.data.userId);
        setUserId(response.data.userId);
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
      }
    };

    fetchUserId();
  }, [session]);

  // Query to check if user already checked in today
  const { data: todayCheckIn, isLoading: checkInLoading } = useQuery({
    queryKey: ['todayCheckIn', userId],
    queryFn: () => fetchTodayCheckIn(userId as number | null),
    enabled: !!userId, // Only run if userId exists
    retry: false,
  });

  const hasCheckedInToday = !!todayCheckIn;

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
    mutationFn: submitCheckIn,
    onSuccess: () => {
      console.log('Check-in submitted successfully');
      toast({
        title: 'Success!',
        description: 'Check-in submitted successfully.',
        variant: 'default',
      });
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['todayCheckIn'] });

      setTimeout(() => {
        setIsSubmitted(false);
        setOpen(false);
        reset();
      }, 2000);
    },
    onError: (error) => {
      console.error('Error submitting check-in:', error);
      toast({
        title: 'Nope!',
        description: 'An error occured.',
        variant: 'destructive',
      });
    },
  });

  const testSuccessToast = () => {
    toast({
      title: 'Success!',
      description: 'Check-in submitted successfully.',
      variant: 'default',
    });
  };

  //hndle form submission
  const onSubmit = (data: CheckInFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Session data:', session);

    if (!userId) {
      console.error('No user ID found');
      return;
    }

    console.log('Submitting check-in with userId:', userId);
    //add the userId to  data
    checkInMutation.mutate({ ...data, userId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          disabled={!userId || checkInLoading || hasCheckedInToday} // Disable if userId is null or data is loading
        >
          <Calendar className="mr-2 h-4 w-4" />
          {hasCheckedInToday ? 'Already Checked In Today' : 'Daily Check-in'}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="mt-2 text-lg font-semibold text-gray-700">Check-in submitted!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
