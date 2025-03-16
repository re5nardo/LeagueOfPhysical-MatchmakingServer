import { WaitingRoom as WaitingRoomEntity } from '@prisma/client';
import { DaoRedisBase } from '@daos/dao.redis.base';

const TTL: number = 5;  //  sec
const WAITING_ROOM_PREFIX: string = 'WAITING_ROOM_PREFIX';

export class WaitingRoomDaoRedis extends DaoRedisBase<WaitingRoomEntity> {

    get Prefix() : string {
        return WAITING_ROOM_PREFIX;
    }

    get TTL() : number {
        return TTL;
    }
}
