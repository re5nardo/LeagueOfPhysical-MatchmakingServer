import { CrudRepository } from '@repositories/crudRepository.interface';
import { CrudDao } from '@daos/dao.interface';

export class CacheCrudRepository<T extends { id: any }> implements CrudRepository<T> {

    private dao: CrudDao<T>;
    private cacheDao: CrudDao<T>;

    constructor(dao: CrudDao<T>, cacheDao: CrudDao<T>) {
        this.dao = dao;
        this.cacheDao = cacheDao;
    }

    //  Create & Update
    public async save(entity: T): Promise<T> {
        try {
            await this.cacheDao.delete(entity);   //  invalidate cache
            return await this.dao.save(entity);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(entities: Iterable<T>): Promise<void> {
        try {
            await this.cacheDao.deleteAll(entities);   //  invalidate cache
            await this.dao.saveAll(entities);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Read
    public async count(): Promise<number> {
        try {
            return await this.dao.count();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: T["id"]): Promise<boolean> {
        try {
            return await this.dao.existsById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: T["id"]): Promise<T | undefined | null> {
        try {
            if (await this.cacheDao.existsById(id)) {
                return await this.cacheDao.findById(id);
            } else {
                const entity = await this.dao.findById(id);
                if (entity) {
                    await this.cacheDao.save(entity);
                } else {
                    await this.cacheDao.deleteById(id);
                }
                return entity;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAll(): Promise<Iterable<T>> {
        try {
            return await this.dao.findAll();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllById(ids: Iterable<T["id"]>): Promise<Iterable<T>> {
        try {
            const cachedEntities = await this.cacheDao.findAllById(ids);
            const idsToGet = new Set(ids);
            for (const cachedEntity of cachedEntities) {
                idsToGet.delete(cachedEntity.id);
            }

            const entities = await this.dao.findAllById(Array.from(idsToGet));
            await this.cacheDao.saveAll(entities);

            return [...cachedEntities, ...entities];
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Delete
    public async delete(entity: T): Promise<void> {
        try {
            await this.cacheDao.delete(entity);
            await this.dao.delete(entity);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteById(id: T["id"]): Promise<void> {
        try {
            await this.cacheDao.deleteById(id);
            await this.dao.deleteById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAll(entities?: Iterable<T>): Promise<void> {
        try {
            if (entities) {
                await this.cacheDao.deleteAll(entities);
                await this.dao.deleteAll(entities);
            } else {
                await this.cacheDao.deleteAll();
                await this.dao.deleteAll();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<T["id"]>): Promise<void> {
        try {
            await this.cacheDao.deleteAllById(ids);
            await this.dao.deleteAllById(ids);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    
    public async findByField<K extends keyof T>(field: K, value: T[K]): Promise<T | undefined | null> {
        try {
            const cachedEntity = await this.cacheDao.findByField(field, value);
            if (cachedEntity) {
                return cachedEntity;
            } else {
                const entity = await this.dao.findByField(field, value);
                if (entity) {
                    await this.cacheDao.save(entity);
                }
                return entity;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
