import { CrudRepository } from '@repositories/crudRepository.interface';
import { CrudDao } from '@daos/dao.interface';

export class CrudRepositoryBase<T, ID> implements CrudRepository<T, ID> {

    private dao: CrudDao<T, ID>;

    constructor(dao: CrudDao<T, ID>) {
        this.dao = dao;
    }

    //  Create & Update
    public async save(entity: T): Promise<T> {
        try {
            return await this.dao.save(entity);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(entities: Iterable<T>): Promise<void> {
        try {
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
            return await this.dao.findById(id);
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
            return await this.dao.findAllById(ids);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Delete
    public async delete(entity: T): Promise<void> {
        try {
            await this.dao.delete(entity);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteById(id: ID): Promise<void> {
        try {
            await this.dao.deleteById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAll(entities?: Iterable<T>): Promise<void> {
        try {
            if (entities) {
                await this.dao.deleteAll(entities);
            } else {
                await this.dao.deleteAll();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<ID>): Promise<void> {
        try {
            await this.dao.deleteAllById(ids);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
