import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import PostgresAdapter from '@auth/pg-adapter';
import { Pool } from 'pg';

if (!process.env.GOOGLE_ID) {
  throw new Error('Please set GOOGLE_ID in .env');
}
if (!process.env.GOOGLE_SECRET) {
  throw new Error('Please set GOOGLE_SECRET in .env');
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not defined');
}
if (!process.env.NEXTAUTH_URL) {
  throw new Error('NEXTAUTH_URL is not defined');
}
if (!process.env.DATABASE_HOST) {
  throw new Error('DATABASE_HOST is not defined');
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

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false,
  },
});

const handler = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }