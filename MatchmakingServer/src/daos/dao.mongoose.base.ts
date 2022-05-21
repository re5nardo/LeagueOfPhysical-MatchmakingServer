import { Model } from 'mongoose';
import { CrudDao } from '@daos/dao.interface';

interface Entity {
    id: string;
}

export abstract class DaoMongooseBase<T extends Entity> implements CrudDao<T, string> {

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
            const writes: object[] = [];
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

    public async existsById(id: string): Promise<boolean> {
        try {
            return await this.mongooseModel.exists({ id: id }) !== null;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: string): Promise<T | undefined | null> {
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

    public async findAllById(ids: Iterable<string>): Promise<Iterable<T>> {
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

    public async deleteById(id: string): Promise<void> {
        try {
            await this.mongooseModel.deleteOne({ id: id });
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
                await this.mongooseModel.deleteMany({});
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<string>): Promise<void> {
        try {
            await this.mongooseModel.deleteMany({ id: { $in: ids } });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
