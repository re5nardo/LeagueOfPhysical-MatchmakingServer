import { User } from "@interfaces/user.interface";
import userModel from '@models/user.model';
import { DaoMongooseBase } from '@daos/dao.mongoose.base';
import { Model } from 'mongoose';

export class UserDaoMongoose extends DaoMongooseBase<User> {
    get mongooseModel(): Model<User> {
        return userModel as Model<User>;
    }
}
