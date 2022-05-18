import { WaitingRoom } from '@interfaces/waitingRoom.interface';
import { GenericCacheCrudRepository } from '@repositories/genericCacheCrud.repository';
import { WaitingRoomDaoRedisImpl } from '@daos/waitingRoom.dao.redis';
import { WaitingRoomDaoMongooseImpl } from '@daos/waitingRoom.dao.mongoose';

export class WaitingRoomRepository extends GenericCacheCrudRepository<WaitingRoom, string> {
    constructor() {
        super(new WaitingRoomDaoMongooseImpl(), new WaitingRoomDaoRedisImpl());
    }
}
