import { redisClient } from '@loaders/redis.loader';
import { CrudDao } from '@daos/dao.interface';
import { parseWithDates } from '@utils/redis-json.utils';

export abstract class DaoRedisBase<T extends { id: any }> implements CrudDao<T> {

    abstract get Prefix(): string;
    abstract get TTL(): number;

    GetRedisKey(entity: T): string;
    GetRedisKey(id: T["id"]): string;
    GetRedisKey(x: any): string {
        return typeof x === 'string' ? `${this.Prefix}_${x}` : `${this.Prefix}_${x.id}`
    }

    private parseEntity(json: string): T {
        return parseWithDates<T>(json);
    }

    //  Create & Update
    public async save(entity: T): Promise<T> {
        try {
            if (!entity.id) {
                return Promise.reject(new Error("Entity must have a valid id."));
            }
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
                if (!entity.id) {
                    return Promise.reject(new Error("Each entity must have a valid id."));
                }
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

    public async existsById(id: T["id"]): Promise<boolean> {
        try {
            return await redisClient.exists(this.GetRedisKey(id)) === 1;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: T["id"]): Promise<T | undefined | null> {
        try {
            //  getEx not working.., use multi instead.
            const multi = redisClient.multi();
            multi.get(this.GetRedisKey(id));
            multi.expire(this.GetRedisKey(id), this.TTL);
            const response = (await multi.exec())[0];

            if (response) {
                return this.parseEntity(response.toString());
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

    public async findAllById(ids: Iterable<T["id"]>): Promise<Iterable<T>> {
        try {
            const keys = Array.from(ids).map<string>(id => this.GetRedisKey(id));
            const values = await redisClient.mGet(keys) as string[];
            const entities: T[] = [];
            for (const value of values) {
                if (value) {
                    entities.push(this.parseEntity(value));
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

    public async deleteById(id: T["id"]): Promise<void> {
        try {
            await redisClient.del(this.GetRedisKey(id));
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAll(entities?: Iterable<T>): Promise<void> {
        try {
            if (entities) {
                const ids = Array.from(entities).map<T["id"]>(entity => entity.id);
                await this.deleteAllById(ids);
            } else {
                await redisClient.deleteAll(`${this.Prefix}*`);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<T["id"]>): Promise<void> {
        try {
            const keys = Array.from(ids).map<string>(id => this.GetRedisKey(id));
            await redisClient.del(keys);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  성능이... 매우 나쁨.. 고민 필요..
    public async findByField<K extends keyof T>(field: K, value: T[K]): Promise<T | undefined | null> {
        try {
            const entities = await this.findAll();
            const entity = Array.from(entities).find(entity => entity[field] === value);
            return entity;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
