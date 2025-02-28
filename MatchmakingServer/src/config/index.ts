import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.${process.env.SPECIFIC_ENV || 'local'}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR } = process.env;
export const { MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE } = process.env;
export const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;
export const { REDIS_HOST, REDIS_PORT } = process.env;
export const { LOBBY_SERVER_HOST, LOBBY_SERVER_PORT } = process.env;
export const { ROOM_SERVER_HOST, ROOM_SERVER_PORT } = process.env;