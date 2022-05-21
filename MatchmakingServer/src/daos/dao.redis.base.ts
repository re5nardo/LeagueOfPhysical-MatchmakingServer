import { redisClient } from '@loaders/redis.loader';
import { CrudDao } from '@daos/dao.interface';

interface Entity {
    id: string;
}

export abstract class DaoRedisBase<T extends Entity> implements CrudDao<T, string> {

    abstract get Prefix(): string;
    abstract get TTL(): number;

    GetRedisKey(entity: Entity): string;
    GetRedisKey(id: string): string;
    GetRedisKey(x: any): string {
        return typeof x === 'string' ? `${this.Prefix}_${x}` : `${this.Prefix}_${x.id}`
    }

    //  Create & Update
    public async save(entity: T): Promise<T> {
        try {
            return await redisClient.save(this.GetRedisKey(entity), this.TTL, entity);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(entities: Iterable<T>): Promise<void> {
        try {
            //  redis.mSet doesn't support ttl option. use multi instead.
            const multi = redisClient.multi();
            for (let entity of entities) {
                multi.save(this.GetRedisKey(entity), this.TTL, entity);
            }
            await multi.exec();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Read
    public async count(): Promise<number> {
        try {
            return await redisClient.count(`${this.Prefix}*`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: string): Promise<boolean> {
        try {
            return await redisClient.exists(this.GetRedisKey(id)) === 1;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: string): Promise<T | undefined | null> {
        try {
            //  getEx not working.., use multi instead.
            const multi = redisClient.multi();
            multi.get(this.GetRedisKey(id));
            multi.expire(this.GetRedisKey(id), this.TTL);
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

    public async findAll(): Promise<Iterable<T>> {
        try {
            const entities = await redisClient.findAll(`${this.Prefix}*`) as T[];

            const multi = redisClient.multi();
            for (let entity of entities) {
                multi.expire(this.GetRedisKey(entity), this.TTL);
            }
            await multi.exec();

            return entities;       
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllById(ids: Iterable<string>): Promise<Iterable<T>> {
        try {
            const keys = Array.from(ids).map<string>(id => this.GetRedisKey(id));
            const values = await redisClient.mGet(keys) as string[];
            const entities: T[] = [];
            for (const value of values) {
                if (value) {
                    entities.push(JSON.parse(value) as T);
                }
            }

            const multi = redisClient.multi();
            for (let entity of entities) {
                multi.expire(this.GetRedisKey(entity), this.TTL);
            }
            await multi.exec();

            return entities;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Delete
    public async delete(entity: T): Promise<void> {
        try {
            await this.deleteById(entity.id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteById(id: string): Promise<void> {
        try {
            await redisClient.del(this.GetRedisKey(id));
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAll(entities?: Iterable<T>): Promise<void> {
        try {
            if (entities) {
                const ids = Array.from(entities).map<string>(entity => entity.id);
                await this.deleteAllById(ids);
            } else {
                await redisClient.deleteAll(`${this.Prefix}*`);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<string>): Promise<void> {
        try {
            const keys = Array.from(ids).map<string>(id => this.GetRedisKey(id));
            await redisClient.del(keys);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
