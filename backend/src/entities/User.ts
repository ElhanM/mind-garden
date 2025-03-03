import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
