import { createClient, defineScript } from 'redis';
import { cacheConnection } from '@caches/index';

export const redisClient = createClient({
    url: cacheConnection.url,
    scripts: {
        save: defineScript({
            NUMBER_OF_KEYS: 1,
            SCRIPT:
                'redis.pcall("SETEX", KEYS[1], ARGV[1], ARGV[2]);' +
                'return redis.pcall("GET", KEYS[1]);',
            transformArguments(key: string, ttl: number, value: any): Array<string> {
                return [key, ttl.toString(), JSON.stringify(value)];
            },
            transformReply(reply: string): any {
                return JSON.parse(reply);
            }
        }),
        count: defineScript({
            NUMBER_OF_KEYS: 0,
            SCRIPT:
                'return #redis.pcall("KEYS", ARGV[1]);',
            transformArguments(pattern: string): Array<string> {
                return [pattern];
            },
            transformReply(reply: number): number {
                return reply;
            }
        }),
        findAll: defineScript({
            NUMBER_OF_KEYS: 0,
            SCRIPT:
                'local keys = redis.pcall("KEYS", ARGV[1]);' +
                'return redis.pcall("MGET", unpack(keys));',
            transformArguments(pattern: string): Array<string> {
                return [pattern];
            },
            transformReply(values: string[]): object[] {
                const objects: object[] = [];
                for (const value of values) {
                    if (value) {
                        objects.push(JSON.parse(value));
                    }
                }
                return objects;
            }
        }),
        deleteAll: defineScript({
            NUMBER_OF_KEYS: 0,
            SCRIPT:
                'local keys = redis.pcall("KEYS", ARGV[1]);' +
                'return redis.pcall("DEL", unpack(keys));',
            transformArguments(pattern: string): Array<string> {
                return [pattern];
            },
            transformReply(reply: any): any {
                return reply;
            }
        }),
    }
});

export async function load(): Promise<void> {
    try {
        redisClient.on('error', (err) => console.log('Redis Client Error', err));
        return await redisClient.connect();
    } catch (error) {
        return Promise.reject(error);
    }
};
