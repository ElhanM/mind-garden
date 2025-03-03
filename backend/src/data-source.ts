import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { DailyCheckIn } from './entities/DailyCheckIn';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_HOST) {
  throw new Error('DATABASE_HOST is not defined');
}
if (!process.env.DATABASE_PORT) {
  throw new Error('DATABASE_PORT is not defined');
}
if (!process.env.DATABASE_USER) {
  throw new Error('DATABASE_USER is not defined');
}
if (!process.env.DATABASE_PASSWORD) {
  throw new Error('DATABASE_PASSWORD is not defined');
}
if (!process.env.DATABASE_NAME) {
  throw new Error('DATABASE_NAME is not defined');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false, // Set to false for production
  logging: process.env.NODE_ENV !== 'production',
  entities: [User, DailyCheckIn],
  migrations: [],
  subscribers: [],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
