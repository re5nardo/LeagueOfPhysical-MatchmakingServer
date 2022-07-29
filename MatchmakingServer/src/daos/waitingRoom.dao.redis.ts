import { WaitingRoom } from "@interfaces/waitingRoom.interface";
import { DaoRedisBase } from '@daos/dao.redis.base';

const TTL: number = 5;  //  sec
const WAITING_ROOM_PREFIX: string = 'WAITING_ROOM_PREFIX';

export class WaitingRoomDaoRedis extends DaoRedisBase<WaitingRoom> {

    get Prefix() : string {
        return WAITING_ROOM_PREFIX;
    }

    get TTL() : number {
        return TTL;
    }
}
