import { CrudRepository } from '@repositories/crudRepository.interface';
import { CrudDao } from '@daos/dao.interface';
import { DomainEntityMapper } from '@mappers/domain.entity.mapper'

export class CrudRepositoryBase<TDomain extends { id: any }, TEntity extends { id: any }> implements CrudRepository<TDomain, TEntity> {

    protected dao: CrudDao<TEntity>;
    protected mapper: DomainEntityMapper<TDomain, TEntity>;

    constructor(dao: CrudDao<TEntity>, mapper: DomainEntityMapper<TDomain, TEntity>) {
        this.dao = dao;
        this.mapper = mapper;
    }

    //  Create & Update
    public async save(domain: TDomain): Promise<TDomain> {
        try {
            const entity = this.mapper.toEntity(domain);
            const savedEntity = await this.dao.save(entity);
            return this.mapper.toDomain(savedEntity);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(domains: Iterable<TDomain>): Promise<void> {
        try {
            const entities = this.mapper.toEntities(domains);
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
            const entity = await this.dao.findById(id);
            return entity ? this.mapper.toDomain(entity) : null;
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
            const entities = await this.dao.findAllById(ids);
            return this.mapper.toDomains(entities);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Delete
    public async delete(domain: TDomain): Promise<void> {
        try {
            const entity = this.mapper.toEntity(domain);
            await this.dao.delete(entity);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteById(id: TDomain["id"]): Promise<void> {
        try {
            await this.dao.deleteById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAll(domains?: Iterable<TDomain>): Promise<void> {
        try {
            if (domains) {
                const entities = this.mapper.toEntities(domains);
                await this.dao.deleteAll(entities);
            } else {
                await this.dao.deleteAll();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<TDomain["id"]>): Promise<void> {
        try {
            await this.dao.deleteAllById(ids);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findByField<K extends keyof TDomain>(field: K, value: TDomain[K]): Promise<TDomain | undefined | null> {
        try {
            const entityField = this.mapper.getEntityFieldName(field) as keyof TEntity;
            const entityValue = this.mapper.toEntityValue(field, value);
            const entity = await this.dao.findByField(entityField, entityValue);
            return entity ? this.mapper.toDomain(entity) : null;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findWhere<K extends keyof TDomain>(
        conditions: [K, TDomain[K]][],
    ): Promise<TDomain | undefined | null> {
        try {
            const entityConditions: [keyof TEntity, any][] = conditions.map(([field, value]) => {
                const entityField = this.mapper.getEntityFieldName(field) as keyof TEntity;
                const entityValue = this.mapper.toEntityValue(field, value);
                return [entityField, entityValue];
            });
    
            const entity = await this.dao.findWhere(entityConditions);
            return entity ? this.mapper.toDomain(entity) : null;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
