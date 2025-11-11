import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema.ts';
import 'dotenv/config';

// Vercel Postgres automatically uses environment variables:
// POSTGRES_URL, POSTGRES_PRISMA_URL, etc.

// Create and export the Drizzle database instance
export const db = drizzle(sql, { schema });
