import { WaitingRoom } from '@interfaces/waitingRoom.interface';
import { WaitingRoom as WaitingRoomEntity } from '@prisma/client';
import { CrudRepositoryBase } from '@repositories/crudRepositoryBase';
import { WaitingRoomDaoRedis } from '@daos/waitingRoom.dao.redis';
import { WaitingRoomMapper } from '@mappers/entities/waitingRoom.mapper'

export class WaitingRoomRepository extends CrudRepositoryBase<WaitingRoom, WaitingRoomEntity> {
    constructor() {
        super(new WaitingRoomDaoRedis(), new WaitingRoomMapper());
    }
}
