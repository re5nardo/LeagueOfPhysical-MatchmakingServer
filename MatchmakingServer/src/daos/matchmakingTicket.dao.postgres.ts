import { MatchmakingTicket } from "@interfaces/matchmakingTicket.interface";
import { PrismaClient } from "@prisma/client";
import { DaoPostgresBase } from "@daos/dao.postgres.base";
import { prismaClient } from '@loaders/postgres.loader';

export class MatchmakingTicketDaoPostgres extends DaoPostgresBase<MatchmakingTicket, PrismaClient["matchmakingTicket"]> {
    constructor() {
        super(prismaClient, prismaClient.matchmakingTicket);
    }
}
