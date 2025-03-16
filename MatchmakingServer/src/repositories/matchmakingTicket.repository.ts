import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { MatchmakingTicket as MatchmakingTicketEntity } from '@prisma/client';
import { CacheCrudRepository } from '@repositories/cacheCrudRepository';
import { MatchmakingTicketDaoPostgres } from '@daos/matchmakingTicket.dao.postgres';
import { MatchmakingTicketDaoRedis } from '@daos/matchmakingTicket.dao.redis';
import { MatchmakingTicketMapper } from '@mappers/entities/matchmakingTicket.mapper'

export class MatchmakingTicketRepository extends CacheCrudRepository<MatchmakingTicket, MatchmakingTicketEntity> {
    constructor() {
        super(new MatchmakingTicketDaoPostgres(), new MatchmakingTicketDaoRedis(), new MatchmakingTicketMapper());
    }
}
