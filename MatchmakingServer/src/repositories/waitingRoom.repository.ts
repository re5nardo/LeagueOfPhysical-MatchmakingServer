import { WaitingRoom } from '@interfaces/waitingRoom.interface';
import { CacheCrudRepository } from '@repositories/cacheCrud.repository';
import { WaitingRoomDaoMongoose } from '@daos/waitingRoom.dao.mongoose';
import { WaitingRoomDaoRedis } from '@daos/waitingRoom.dao.redis';

export class WaitingRoomRepository extends CacheCrudRepository<WaitingRoom, string> {
    constructor() {
        super(new WaitingRoomDaoMongoose(), new WaitingRoomDaoRedis());
    }
}
