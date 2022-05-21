import { CrudRepository } from '@repositories/repository.interface';
import { CrudDao } from '@daos/dao.interface';

interface Entity<ID> {
    id: ID;
}

export class CacheCrudRepository<T extends Entity<ID>, ID> implements CrudRepository<T, ID> {

    private dao: CrudDao<T, ID>;
    private cacheDao: CrudDao<T, ID>;

    constructor(dao: CrudDao<T, ID>, cacheDao: CrudDao<T, ID>) {
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

    public async existsById(id: ID): Promise<boolean> {
        try {
            return await this.dao.existsById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: ID): Promise<T | undefined | null> {
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

    public async findAllById(ids: Iterable<ID>): Promise<Iterable<T>> {
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

    public async deleteById(id: ID): Promise<void> {
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

    public async deleteAllById(ids: Iterable<ID>): Promise<void> {
        try {
            await this.cacheDao.deleteAllById(ids);
            await this.dao.deleteAllById(ids);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
