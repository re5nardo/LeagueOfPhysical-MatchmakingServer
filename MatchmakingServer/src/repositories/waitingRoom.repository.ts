import { WaitingRoom } from '@interfaces/waitingRoom.interface';
import { CrudRepositoryBase } from '@repositories/crudRepositoryBase';
import { WaitingRoomDaoRedis } from '@daos/waitingRoom.dao.redis';

export class WaitingRoomRepository extends CrudRepositoryBase<WaitingRoom, string> {
    constructor() {
        super(new WaitingRoomDaoRedis());
    }
}
