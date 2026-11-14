import { neon } from "@neondatabase/serverless";
import "dotenv/config";

import { drizzle } from 'drizzle-orm/neon-http';

export default drizzle({ client: neon(import.meta.env.DATABASE_URL || process.env.DATABASE_URL!) });