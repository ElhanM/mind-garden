import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

type MoodType = 'great' | 'good' | 'okay' | 'down' | 'bad';

@Entity('daily_check_ins')
export class DailyCheckIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({
    type: 'varchar',
    length: 20,
    enum: ['great', 'good', 'okay', 'down', 'bad'],
  })
  mood: MoodType;

  @Column({ name: 'stress_level' })
  stressLevel: number;

  @Column({ name: 'journal_entry', nullable: true })
  journalEntry: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'check_in_date', type: 'date', default: () => 'CURRENT_DATE' })
  checkInDate: Date;
}
