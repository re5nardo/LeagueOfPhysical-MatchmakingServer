import { PrismaClient, WaitingRoom as WaitingRoomEntity } from '@prisma/client';
import { DaoPostgresBase } from "@daos/dao.postgres.base";
import { prismaClient } from '@loaders/postgres.loader';

export class WaitingRoomDaoPostgres extends DaoPostgresBase<WaitingRoomEntity, PrismaClient["waitingRoom"]> {
    constructor() {
        super(prismaClient, prismaClient.waitingRoom);
    }
}
