import { MatchmakingTicketDao } from '@daos/matchmakingTicket.dao.interface';
import { MatchmakingTicket } from "@interfaces/matchmakingTicket.interface";
import matchmakingTicketModel from '@models/matchmakingTicket.model';

export class MatchmakingTicketDaoMongooseImpl implements MatchmakingTicketDao {
    //  Create & Update
    public async save(matchmakingTicket: MatchmakingTicket): Promise<MatchmakingTicket> {
        try {
            return await matchmakingTicketModel.findOneAndUpdate({ id: matchmakingTicket.id }, matchmakingTicket, { new: true, upsert: true }).lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async saveAll(matchmakingTickets: Iterable<MatchmakingTicket>): Promise<void> {
        try {
            const writes: object[] = [];
            for (const matchmakingTicket of matchmakingTickets) {
                writes.push({
                    updateOne: {
                        filter: { id: matchmakingTicket.id },
                        update: matchmakingTicket,
                        upsert: true,
                    }
                });
            }
            await matchmakingTicketModel.bulkWrite(writes);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  Read
    public async count(): Promise<number> {
        try {
            return await matchmakingTicketModel.countDocuments({});
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: string): Promise<boolean> {
        try {
            return await matchmakingTicketModel.exists({ id: id }) !== null;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findById(id: string): Promise<MatchmakingTicket | undefined | null> {
        try {
            return await matchmakingTicketModel.findOne({ id: id }).lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAll(): Promise<Iterable<MatchmakingTicket>> {
        try {
            return await matchmakingTicketModel.find().lean();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllById(ids: Iterable<string>): Promise<Iterable<MatchmakingTicket>> {
        try {
            return await matchmakingTicketModel.find({ id: { $in: ids } }).lean();
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
            await matchmakingTicketModel.deleteOne({ id: id });
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
                await matchmakingTicketModel.deleteMany({});
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllById(ids: Iterable<string>): Promise<void> {
        try {
            await matchmakingTicketModel.deleteMany({ id: { $in: ids } });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
