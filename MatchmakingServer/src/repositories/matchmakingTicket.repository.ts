import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { GenericCacheCrudRepository } from '@repositories/genericCacheCrud.repository';
import { MatchmakingTicketDaoRedisImpl } from '@daos/matchmakingTicket.dao.redis';
import { MatchmakingTicketDaoMongooseImpl } from '@daos/matchmakingTicket.dao.mongoose';

export class MatchmakingTicketRepository extends GenericCacheCrudRepository<MatchmakingTicket, string> {
    constructor() {
        super(new MatchmakingTicketDaoMongooseImpl(), new MatchmakingTicketDaoRedisImpl());
    }
}
