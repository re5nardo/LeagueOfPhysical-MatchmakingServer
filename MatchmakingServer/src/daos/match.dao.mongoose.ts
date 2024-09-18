import { Match } from "@interfaces/match.interface";
import matchModel from '@models/match.model';
import { DaoMongooseBase } from '@daos/dao.mongoose.base';
import { Model } from 'mongoose';

export class MatchDaoMongoose extends DaoMongooseBase<Match> {
    get mongooseModel(): Model<Match> {
        return matchModel as Model<Match>;
    }
}
