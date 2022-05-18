import { UserDao } from '@daos/user.dao.interface';
import { User } from "@interfaces/user.interface";
import { redisClient } from '@loaders/redis.loader';

const TTL: number = 5 * 60;  //  sec
const USER_PREFIX: string = 'USER_PREFIX_';

export class UserDaoRedisImpl implements UserDao {
    //  Create & Update
    public async save(user: User): Promise<User> {
        try {
            return await redisClient.save(`${USER_PREFIX}${user.id}`, TTL, user);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(users: Iterable<User>): Promise<void> {
        try {
            //  redis.mSet doesn't support ttl option. use multi instead.
            const multi = redisClient.multi();
            for (let user of users) {
                multi.save(`${USER_PREFIX}${user.id}`, TTL, user);
            }
            await multi.exec();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Read
    public async count(): Promise<number> {
        try {
            return await redisClient.count(`${USER_PREFIX}*`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: string): Promise<boolean> {
        try {
            return await redisClient.exists(`${USER_PREFIX}${id}`) === 1;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: string): Promise<User | undefined | null> {
        try {
            //  getEx not working.., use multi instead.
            const multi = redisClient.multi();
            multi.get(`${USER_PREFIX}${id}`);
            multi.expire(`${USER_PREFIX}${id}`, TTL);
            const response = (await multi.exec())[0];

            if (response) {
                return JSON.parse(response.toString());
            } else {
                return null;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAll(): Promise<Iterable<User>> {
        try {
            const users = await redisClient.findAll(`${USER_PREFIX}*`) as User[];

            const multi = redisClient.multi();
            for (let user of users) {
                multi.expire(`${USER_PREFIX}${user.id}`, TTL);
            }
            await multi.exec();

            return users;       
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllById(ids: Iterable<string>): Promise<Iterable<User>> {
        try {
            const keys = Array.from(ids).map<string>(id => `${USER_PREFIX}${id}`);
            const values = await redisClient.mGet(keys) as string[];
            const users: User[] = [];
            for (const value of values) {
                if (value) {
                    users.push(JSON.parse(value) as User);
                }
            }

            const multi = redisClient.multi();
            for (let user of users) {
                multi.expire(`${USER_PREFIX}${user.id}`, TTL);
            }
            
            await multi.exec();

            return users;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Delete
    public async delete(user: User): Promise<void> {
        try {
            await this.deleteById(user.id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteById(id: string): Promise<void> {
        try {
            await redisClient.del(`${USER_PREFIX}${id}`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAll(users?: Iterable<User>): Promise<void> {
        try {
            if (users) {
                const ids = Array.from(users).map<string>(user => user.id);
                await this.deleteAllById(ids);
            } else {
                await redisClient.deleteAll(`${USER_PREFIX}*`);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<string>): Promise<void> {
        try {
            const keys = Array.from(ids).map<string>(id => `${USER_PREFIX}${id}`);
            await redisClient.del(keys);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
