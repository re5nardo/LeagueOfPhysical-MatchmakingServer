import { Match } from "@interfaces/match.interface";
import { PrismaClient } from "@prisma/client";
import { DaoPostgresBase } from "@daos/dao.postgres.base";
import { prismaClient } from '@loaders/postgres.loader';

export class MatchDaoPostgres extends DaoPostgresBase<Match, PrismaClient["match"]> {
    constructor() {
        super(prismaClient, prismaClient.match);
    }
}
