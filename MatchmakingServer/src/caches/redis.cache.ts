import { redisClient } from '@loaders/redis.loader';
import { parseWithDates } from '@utils/redis-json.utils';

export class RedisCache {
    public static async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        try {
            const data = JSON.stringify(value);
            const options = ttl ? { EX: ttl } : undefined;
            await redisClient.set(key, data, options);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public static async get<T>(key: string): Promise<T | null> {
        try {
            const data = await redisClient.get(key);
            if (!data) {
                return null;
            }
            return parseWithDates<T>(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public static async delete(key: string): Promise<void> {
        try {
            await redisClient.del(key);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public static async exists(key: string): Promise<boolean> {
        try {
            return (await redisClient.exists(key)) === 1;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
