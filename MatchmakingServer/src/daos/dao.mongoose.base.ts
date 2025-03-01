import { Model, FilterQuery } from 'mongoose';
import { CrudDao } from '@daos/dao.interface';
import { AnyBulkWriteOperation } from 'mongodb';

export abstract class DaoMongooseBase<T extends { id: any }> implements CrudDao<T> {

    abstract get mongooseModel(): Model<T>;

    //  Create & Update
    public async save(entity: T): Promise<T> {
        try {
            return await this.mongooseModel.findOneAndUpdate({ id: entity.id }, entity, { new: true, upsert: true }).lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(entities: Iterable<T>): Promise<void> {
        try {
            const writes: AnyBulkWriteOperation[] = [];
            for (const entity of entities) {
                writes.push({
                    updateOne: {
                        filter: { id: entity.id },
                        update: entity,
                        upsert: true,
                    }
                });
            }
            await this.mongooseModel.bulkWrite(writes);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Read
    public async count(): Promise<number> {
        try {
            return await this.mongooseModel.countDocuments({});
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: T["id"]): Promise<boolean> {
        try {
            return await this.mongooseModel.exists({ id: id }) !== null;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: T["id"]): Promise<T | undefined | null> {
        try {
            return await this.mongooseModel.findOne({ id: id }).lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAll(): Promise<Iterable<T>> {
        try {
            return await this.mongooseModel.find().lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllById(ids: Iterable<T["id"]>): Promise<Iterable<T>> {
        try {
            return await this.mongooseModel.find({ id: { $in: ids } }).lean();
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
            await this.mongooseModel.deleteOne({ id: id });
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
                await this.mongooseModel.deleteMany({});
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<T["id"]>): Promise<void> {
        try {
            await this.mongooseModel.deleteMany({ id: { $in: ids } });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findByField<K extends keyof T>(field: K, value: T[K]): Promise<T | undefined | null> {
        try {
            const filter = { [field]: value } as unknown as FilterQuery<T>;
            return await this.mongooseModel.findOne(filter).lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
