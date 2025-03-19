type CheckIn = {
  id: number;
  createdAt: string; // Or `Date` if already parsed,
  checkInDate: string;
  mood: 'great' | 'good' | 'okay' | 'down' | 'bad';
  stressLevel: number;
  journalEntry?: string;
};
