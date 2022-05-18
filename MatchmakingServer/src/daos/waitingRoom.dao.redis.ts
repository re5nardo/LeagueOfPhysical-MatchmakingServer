import { WaitingRoomDao } from '@daos/waitingRoom.dao.interface';
import { WaitingRoom } from "@interfaces/waitingRoom.interface";
import { redisClient } from '@loaders/redis.loader';

const TTL: number = 5 * 60;  //  sec
const WAITING_ROOM_PREFIX: string = 'WAITING_ROOM_PREFIX_';

export class WaitingRoomDaoRedisImpl implements WaitingRoomDao {
    //  Create & Update
    public async save(waitingRoom: WaitingRoom): Promise<WaitingRoom> {
        try {
            return await redisClient.save(`${WAITING_ROOM_PREFIX}${waitingRoom.id}`, TTL, waitingRoom);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(waitingRooms: Iterable<WaitingRoom>): Promise<void> {
        try {
            //  redis.mSet doesn't support ttl option. use multi instead.
            const multi = redisClient.multi();
            for (let waitingRoom of waitingRooms) {
                multi.save(`${WAITING_ROOM_PREFIX}${waitingRoom.id}`, TTL, waitingRoom);
            }
            await multi.exec();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Read
    public async count(): Promise<number> {
        try {
            return await redisClient.count(`${WAITING_ROOM_PREFIX}*`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: string): Promise<boolean> {
        try {
            return await redisClient.exists(`${WAITING_ROOM_PREFIX}${id}`) === 1;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: string): Promise<WaitingRoom | undefined | null> {
        try {
            //  getEx not working.., use multi instead.
            const multi = redisClient.multi();
            multi.get(`${WAITING_ROOM_PREFIX}${id}`);
            multi.expire(`${WAITING_ROOM_PREFIX}${id}`, TTL);
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

    public async findAll(): Promise<Iterable<WaitingRoom>> {
        try {
            const waitingRooms = await redisClient.findAll(`${WAITING_ROOM_PREFIX}*`) as WaitingRoom[];

            const multi = redisClient.multi();
            for (let waitingRoom of waitingRooms) {
                multi.expire(`${WAITING_ROOM_PREFIX}${waitingRoom.id}`, TTL);
            }
            await multi.exec();

            return waitingRooms;       
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllById(ids: Iterable<string>): Promise<Iterable<WaitingRoom>> {
        try {
            const keys = Array.from(ids).map<string>(id => `${WAITING_ROOM_PREFIX}${id}`);
            const values = await redisClient.mGet(keys) as string[];
            const waitingRooms: WaitingRoom[] = [];
            for (const value of values) {
                if (value) {
                    waitingRooms.push(JSON.parse(value) as WaitingRoom);
                }
            }

            const multi = redisClient.multi();
            for (let waitingRoom of waitingRooms) {
                multi.expire(`${WAITING_ROOM_PREFIX}${waitingRoom.id}`, TTL);
            }
            
            await multi.exec();

            return waitingRooms;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Delete
    public async delete(waitingRoom: WaitingRoom): Promise<void> {
        try {
            await this.deleteById(waitingRoom.id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteById(id: string): Promise<void> {
        try {
            await redisClient.del(`${WAITING_ROOM_PREFIX}${id}`);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAll(waitingRooms?: Iterable<WaitingRoom>): Promise<void> {
        try {
            if (waitingRooms) {
                const ids = Array.from(waitingRooms).map<string>(waitingRoom => waitingRoom.id);
                await this.deleteAllById(ids);
            } else {
                await redisClient.deleteAll(`${WAITING_ROOM_PREFIX}*`);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<string>): Promise<void> {
        try {
            const keys = Array.from(ids).map<string>(id => `${WAITING_ROOM_PREFIX}${id}`);
            await redisClient.del(keys);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
