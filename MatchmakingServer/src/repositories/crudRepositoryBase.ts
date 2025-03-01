import { CrudRepository } from '@repositories/crudRepository.interface';
import { CrudDao } from '@daos/dao.interface';

export class CrudRepositoryBase<T extends { id: any }> implements CrudRepository<T> {

    protected dao: CrudDao<T>;

    constructor(dao: CrudDao<T>) {
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

    public async existsById(id: T["id"]): Promise<boolean> {
        try {
            return await this.dao.existsById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: T["id"]): Promise<T | undefined | null> {
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

    public async findAllById(ids: Iterable<T["id"]>): Promise<Iterable<T>> {
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

    public async deleteById(id: T["id"]): Promise<void> {
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

    public async deleteAllById(ids: Iterable<T["id"]>): Promise<void> {
        try {
            await this.dao.deleteAllById(ids);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findByField<K extends keyof T>(field: K, value: T[K]): Promise<T | undefined | null> {
        try {
            return await this.dao.findByField(field, value);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
