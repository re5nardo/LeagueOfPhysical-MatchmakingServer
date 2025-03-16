import { MatchmakingTicket as MatchmakingTicketEntity } from '@prisma/client';
import { DaoRedisBase } from '@daos/dao.redis.base';

const TTL: number = 5 * 60;  //  sec
const MATCHMAKING_TICKET_PREFIX: string = 'MATCHMAKING_TICKET_PREFIX';

export class MatchmakingTicketDaoRedis extends DaoRedisBase<MatchmakingTicketEntity> {

    get Prefix() : string {
        return MATCHMAKING_TICKET_PREFIX;
    }

    get TTL() : number {
        return TTL;
    }
}
