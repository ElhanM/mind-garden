type CheckIn = {
  id: number;
  createdAt: string; // Or `Date` if already parsed
  mood: 'great' | 'good' | 'okay' | 'down' | 'bad';
  stressLevel: number;
  journalEntry?: string;
};
