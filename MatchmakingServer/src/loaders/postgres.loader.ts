import { PrismaClient } from '@prisma/client';
import { postgresConnection } from '@databases/postgres';

export const prismaClient = new PrismaClient({
    datasources: {
        db: {
            url: postgresConnection.url
        }
    }
});

export async function load(): Promise<PrismaClient> {
    try {
        //  It is not necessary to call $connect() thanks to the
        //  lazy connect behavior: The PrismaClient instance connects lazily when the first request is made to the API ($connect() is called for you under the hood).
        //  PrismaClient automatically disconnects when the Node.js process ends.
        return prismaClient;
    } catch (error) {
        return Promise.reject(error);
    }
};
