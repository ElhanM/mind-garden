import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Chat } from './Chat';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'emailVerified', nullable: true })
  emailVerified: Date;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];
}
