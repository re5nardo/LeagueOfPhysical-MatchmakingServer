import { MatchmakingTicket } from "@interfaces/matchmakingTicket.interface";
import matchmakingTicketModel from '@models/matchmakingTicket.model';
import { DaoMongooseBase } from '@daos/dao.mongoose.base';
import { Model } from 'mongoose';

export class MatchmakingTicketDaoMongoose extends DaoMongooseBase<MatchmakingTicket> {
    get mongooseModel(): Model<MatchmakingTicket> {
        return matchmakingTicketModel as Model<MatchmakingTicket>;
    }
}
