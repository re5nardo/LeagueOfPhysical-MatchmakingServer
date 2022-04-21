import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR } = process.env;
export const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
export const { CACHE_HOST, CACHE_PORT } = process.env;
