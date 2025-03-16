import { PrismaClient, Match as MatchEntity } from '@prisma/client';
import { DaoPostgresBase } from "@daos/dao.postgres.base";
import { prismaClient } from '@loaders/postgres.loader';

export class MatchDaoPostgres extends DaoPostgresBase<MatchEntity, PrismaClient["match"]> {
    constructor() {
        super(prismaClient, prismaClient.match);
    }
}
