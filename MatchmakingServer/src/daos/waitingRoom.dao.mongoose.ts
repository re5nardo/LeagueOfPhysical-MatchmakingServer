import { WaitingRoom } from "@interfaces/waitingRoom.interface";
import waitingRoomModel from '@models/waitingRoom.model';
import { DaoMongooseBase } from '@daos/dao.mongoose.base';
import { Model } from 'mongoose';

export class WaitingRoomDaoMongoose extends DaoMongooseBase<WaitingRoom> {
    get mongooseModel(): Model<WaitingRoom> {
        return waitingRoomModel as Model<WaitingRoom>;
    }
}
