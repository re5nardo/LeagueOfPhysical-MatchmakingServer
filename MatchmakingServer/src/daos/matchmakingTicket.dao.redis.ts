import { MatchmakingTicketDao } from '@daos/matchmakingTicket.dao.interface';
import { MatchmakingTicket } from "@interfaces/matchmakingTicket.interface";
import { redisClient } from '@loaders/redis.loader';

const TTL: number = 5 * 60;  //  sec
const MATCHMAKING_TICKET_PREFIX: string = 'MATCHMAKING_TICKET_PREFIX_';

export class MatchmakingTicketDaoRedisImpl implements MatchmakingTicketDao {
    //  Create & Update
    public async save(matchmakingTicket: MatchmakingTicket): Promise<MatchmakingTicket> {
        try {
            return await redisClient.save(`${MATCHMAKING_TICKET_PREFIX}${matchmakingTicket.id}`, TTL, matchmakingTicket);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(matchmakingTickets: Iterable<MatchmakingTicket>): Promise<void> {
        try {
            //  redis.mSet doesn't support ttl option. use multi instead.
            const multi = redisClient.multi();
            for (let matchmakingTicket of matchmakingTickets) {
                multi.save(`${MATCHMAKING_TICKET_PREFIX}${matchmakingTicket.id}`, TTL, matchmakingTicket);
            }
            await multi.exec();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Read
    public async count(): Promise<number> {
        try {
            return await redisClient.count(`${MATCHMAKING_TICKET_PREFIX}*`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: string): Promise<boolean> {
        try {
            return await redisClient.exists(`${MATCHMAKING_TICKET_PREFIX}${id}`) === 1;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: string): Promise<MatchmakingTicket | undefined | null> {
        try {
            //  getEx not working.., use multi instead.
            const multi = redisClient.multi();
            multi.get(`${MATCHMAKING_TICKET_PREFIX}${id}`);
            multi.expire(`${MATCHMAKING_TICKET_PREFIX}${id}`, TTL);
            const response = (await multi.exec())[0];

            if (response) {
                return JSON.parse(response.toString());
            } else {
                return null;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAll(): Promise<Iterable<MatchmakingTicket>> {
        try {
            const matchmakingTickets = await redisClient.findAll(`${MATCHMAKING_TICKET_PREFIX}*`) as MatchmakingTicket[];

            const multi = redisClient.multi();
            for (let matchmakingTicket of matchmakingTickets) {
                multi.expire(`${MATCHMAKING_TICKET_PREFIX}${matchmakingTicket.id}`, TTL);
            }
            await multi.exec();

            return matchmakingTickets;       
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllById(ids: Iterable<string>): Promise<Iterable<MatchmakingTicket>> {
        try {
            const keys = Array.from(ids).map<string>(id => `${MATCHMAKING_TICKET_PREFIX}${id}`);
            const values = await redisClient.mGet(keys) as string[];
            const matchmakingTickets: MatchmakingTicket[] = [];
            for (const value of values) {
                if (value) {
                    matchmakingTickets.push(JSON.parse(value) as MatchmakingTicket);
                }
            }

            const multi = redisClient.multi();
            for (let matchmakingTicket of matchmakingTickets) {
                multi.expire(`${MATCHMAKING_TICKET_PREFIX}${matchmakingTicket.id}`, TTL);
            }
            
            await multi.exec();

            return matchmakingTickets;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Delete
    public async delete(matchmakingTicket: MatchmakingTicket): Promise<void> {
        try {
            await this.deleteById(matchmakingTicket.id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteById(id: string): Promise<void> {
        try {
            await redisClient.del(`${MATCHMAKING_TICKET_PREFIX}${id}`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAll(matchmakingTickets?: Iterable<MatchmakingTicket>): Promise<void> {
        try {
            if (matchmakingTickets) {
                const ids = Array.from(matchmakingTickets).map<string>(matchmakingTicket => matchmakingTicket.id);
                await this.deleteAllById(ids);
            } else {
                await redisClient.deleteAll(`${MATCHMAKING_TICKET_PREFIX}*`);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<string>): Promise<void> {
        try {
            const keys = Array.from(ids).map<string>(id => `${MATCHMAKING_TICKET_PREFIX}${id}`);
            await redisClient.del(keys);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
