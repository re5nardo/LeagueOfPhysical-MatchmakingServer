import { PrismaClient, MatchmakingTicket as MatchmakingTicketEntity } from '@prisma/client';
import { DaoPostgresBase } from "@daos/dao.postgres.base";
import { prismaClient } from '@loaders/postgres.loader';

export class MatchmakingTicketDaoPostgres extends DaoPostgresBase<MatchmakingTicketEntity, PrismaClient["matchmakingTicket"]> {
    constructor() {
        super(prismaClient, prismaClient.matchmakingTicket);
    }
}
