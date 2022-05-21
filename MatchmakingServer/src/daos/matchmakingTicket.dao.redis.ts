import { MatchmakingTicket } from "@interfaces/matchmakingTicket.interface";
import { DaoRedisBase } from '@daos/dao.redis.base';

const TTL: number = 5 * 60;  //  sec
const MATCHMAKING_TICKET_PREFIX: string = 'MATCHMAKING_TICKET_PREFIX';

export class MatchmakingTicketDaoRedis extends DaoRedisBase<MatchmakingTicket> {

    get Prefix() : string {
        return MATCHMAKING_TICKET_PREFIX;
    }

    get TTL() : number {
        return TTL;
    }
}
