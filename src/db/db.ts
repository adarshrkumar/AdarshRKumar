import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema.ts';

// Vercel Postgres automatically uses environment variables:
// POSTGRES_URL, POSTGRES_PRISMA_URL, etc.
// No need to import dotenv in production - Vercel handles this

// Create and export the Drizzle database instance
export const db = drizzle(sql, { schema });
