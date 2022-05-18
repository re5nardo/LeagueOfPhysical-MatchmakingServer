import { UserDao } from '@daos/user.dao.interface';
import { User } from "@interfaces/user.interface";
import userModel from '@models/user.model';

export class UserDaoMongooseImpl implements UserDao {
    //  Create & Update
    public async save(user: User): Promise<User> {
        try {
            return await userModel.findOneAndUpdate({ id: user.id }, user, { new: true, upsert: true }).lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(users: Iterable<User>): Promise<void> {
        try {
            const writes: object[] = [];
            for (const user of users) {
                writes.push({
                    updateOne: {
                        filter: { id: user.id },
                        update: user,
                        upsert: true,
                    }
                });
            }
            await userModel.bulkWrite(writes);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Read
    public async count(): Promise<number> {
        try {
            return await userModel.countDocuments({});
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: string): Promise<boolean> {
        try {
            return await userModel.exists({ id: id }) !== null;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: string): Promise<User | undefined | null> {
        try {
            return await userModel.findOne({ id: id }).lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAll(): Promise<Iterable<User>> {
        try {
            return await userModel.find().lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllById(ids: Iterable<string>): Promise<Iterable<User>> {
        try {
            return await userModel.find({ id: { $in: ids } }).lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Delete
    public async delete(user: User): Promise<void> {
        try {
            await this.deleteById(user.id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteById(id: string): Promise<void> {
        try {
            await userModel.deleteOne({ id: id });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAll(users?: Iterable<User>): Promise<void> {
        try {
            if (users) {
                const ids = Array.from(users).map<string>(user => user.id);
                await this.deleteAllById(ids);
            } else {
                await userModel.deleteMany({});
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<string>): Promise<void> {
        try {
            await userModel.deleteMany({ id: { $in: ids } });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
