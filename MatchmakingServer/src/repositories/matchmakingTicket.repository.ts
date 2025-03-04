import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { CacheCrudRepository } from '@repositories/cacheCrudRepository';
import { MatchmakingTicketDaoPostgres } from '@daos/matchmakingTicket.dao.postgres';
import { MatchmakingTicketDaoRedis } from '@daos/matchmakingTicket.dao.redis';

export class MatchmakingTicketRepository extends CacheCrudRepository<MatchmakingTicket> {
    constructor() {
        super(new MatchmakingTicketDaoPostgres(), new MatchmakingTicketDaoRedis());
    }
}
