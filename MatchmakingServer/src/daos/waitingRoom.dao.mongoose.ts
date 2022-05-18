import { WaitingRoomDao } from '@daos/waitingRoom.dao.interface';
import { WaitingRoom } from "@interfaces/waitingRoom.interface";
import waitingRoomModel from '@models/waitingRoom.model';

export class WaitingRoomDaoMongooseImpl implements WaitingRoomDao {
    //  Create & Update
    public async save(waitingRoom: WaitingRoom): Promise<WaitingRoom> {
        try {
            return await waitingRoomModel.findOneAndUpdate({ id: waitingRoom.id }, waitingRoom, { new: true, upsert: true }).lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(waitingRooms: Iterable<WaitingRoom>): Promise<void> {
        try {
            const writes: object[] = [];
            for (const waitingRoom of waitingRooms) {
                writes.push({
                    updateOne: {
                        filter: { id: waitingRoom.id },
                        update: waitingRoom,
                        upsert: true,
                    }
                });
            }
            await waitingRoomModel.bulkWrite(writes);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Read
    public async count(): Promise<number> {
        try {
            return await waitingRoomModel.countDocuments({});
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: string): Promise<boolean> {
        try {
            return await waitingRoomModel.exists({ id: id }) !== null;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: string): Promise<WaitingRoom | undefined | null> {
        try {
            return await waitingRoomModel.findOne({ id: id }).lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAll(): Promise<Iterable<WaitingRoom>> {
        try {
            return await waitingRoomModel.find().lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllById(ids: Iterable<string>): Promise<Iterable<WaitingRoom>> {
        try {
            return await waitingRoomModel.find({ id: { $in: ids } }).lean();
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
            await waitingRoomModel.deleteOne({ id: id });
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
                await waitingRoomModel.deleteMany({});
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<string>): Promise<void> {
        try {
            await waitingRoomModel.deleteMany({ id: { $in: ids } });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
