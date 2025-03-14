import { CrudRepository } from '@repositories/crudRepository.interface';
import { CrudDao } from '@daos/dao.interface';
import { DomainEntityMapper } from '@mappers/domain-entity-mapper'

export class CacheCrudRepository<TDomain extends { id: any }, TEntity extends { id: any }> implements CrudRepository<TDomain, TEntity> {

    protected dao: CrudDao<TEntity>;
    protected cacheDao: CrudDao<TEntity>;
    protected mapper: DomainEntityMapper<TDomain, TEntity>;

    constructor(dao: CrudDao<TEntity>, cacheDao: CrudDao<TEntity>, mapper: DomainEntityMapper<TDomain, TEntity>) {
        this.dao = dao;
        this.cacheDao = cacheDao;
        this.mapper = mapper;
    }

    //  Create & Update
    public async save(domain: TDomain): Promise<TDomain> {
        try {
            const entity = this.mapper.toEntity(domain);
            await this.cacheDao.delete(entity);   //  invalidate cache

            const savedEntity = await this.dao.save(entity);
            return this.mapper.toDomain(savedEntity);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(domains: Iterable<TDomain>): Promise<void> {
        try {
            const entities = this.mapper.toEntities(domains);
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

    public async existsById(id: TDomain["id"]): Promise<boolean> {
        try {
            return await this.dao.existsById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: TDomain["id"]): Promise<TDomain | undefined | null> {
        try {
            const entity = await this.cacheDao.findById(id);
            if (entity) {
                return this.mapper.toDomain(entity);
            } else {
                const entity = await this.dao.findById(id);
                if (entity) {
                    await this.cacheDao.save(entity);
                } else {
                    await this.cacheDao.deleteById(id);
                }
                return entity ? this.mapper.toDomain(entity) : null;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAll(): Promise<Iterable<TDomain>> {
        try {
            const entities = await this.dao.findAll();
            return this.mapper.toDomains(entities);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllById(ids: Iterable<TDomain["id"]>): Promise<Iterable<TDomain>> {
        try {
            const cachedEntities = await this.cacheDao.findAllById(ids);
            const idsToGet = new Set(ids);
            for (const cachedEntity of cachedEntities) {
                idsToGet.delete(cachedEntity.id);
            }

            const entities = await this.dao.findAllById(Array.from(idsToGet));
            await this.cacheDao.saveAll(entities);

            const allEntities = [...cachedEntities, ...entities];
            return this.mapper.toDomains(allEntities);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Delete
    public async delete(domain: TDomain): Promise<void> {
        try {
            const entity = this.mapper.toEntity(domain);
            await this.cacheDao.delete(entity);
            await this.dao.delete(entity);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteById(id: TDomain["id"]): Promise<void> {
        try {
            await this.cacheDao.deleteById(id);
            await this.dao.deleteById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAll(domains?: Iterable<TDomain>): Promise<void> {
        try {
            const entities = domains ? this.mapper.toEntities(domains) : null;
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

    public async deleteAllById(ids: Iterable<TDomain["id"]>): Promise<void> {
        try {
            await this.cacheDao.deleteAllById(ids);
            await this.dao.deleteAllById(ids);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    
    public async findByField<K extends keyof TDomain>(field: K, value: TDomain[K]): Promise<TDomain | undefined | null> {
        try {
            const entityField = this.mapper.getEntityFieldName(field) as keyof TEntity;
            const entityValue = this.mapper.toEntityValue(field, value);
            const cachedEntity = await this.cacheDao.findByField(entityField, entityValue);
            if (cachedEntity) {
                return this.mapper.toDomain(cachedEntity);
            } else {
                const entity = await this.dao.findByField(entityField, entityValue);
                if (entity) {
                    await this.cacheDao.save(entity);
                }
                return entity ? this.mapper.toDomain(entity) : null;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
