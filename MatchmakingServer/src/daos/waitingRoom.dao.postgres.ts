import { WaitingRoom } from "@interfaces/waitingRoom.interface";
import { PrismaClient } from "@prisma/client";
import { DaoPostgresBase } from "@daos/dao.postgres.base";
import { prismaClient } from '@loaders/postgres.loader';

export class WaitingRoomDaoPostgres extends DaoPostgresBase<WaitingRoom, PrismaClient["waitingRoom"]> {
    constructor() {
        super(prismaClient, prismaClient.waitingRoom);
    }
}
