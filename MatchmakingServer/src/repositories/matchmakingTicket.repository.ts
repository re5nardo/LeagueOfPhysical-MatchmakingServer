import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { CacheCrudRepository } from '@repositories/cacheCrudRepository';
import { MatchmakingTicketDaoMongoose } from '@daos/matchmakingTicket.dao.mongoose';
import { MatchmakingTicketDaoRedis } from '@daos/matchmakingTicket.dao.redis';

export class MatchmakingTicketRepository extends CacheCrudRepository<MatchmakingTicket, string> {
    constructor() {
        super(new MatchmakingTicketDaoMongoose(), new MatchmakingTicketDaoRedis());
    }
}
