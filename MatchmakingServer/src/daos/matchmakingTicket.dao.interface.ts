import { CrudDao } from '@daos/dao.interface';
import { MatchmakingTicket } from "@interfaces/matchmakingTicket.interface";

export interface MatchmakingTicketDao extends CrudDao<MatchmakingTicket, string> {
    //  Create & Update
    save(matchmakingTicket: MatchmakingTicket): Promise<MatchmakingTicket>;
    saveAll(matchmakingTickets: Iterable<MatchmakingTicket>): Promise<void>;

    //  Read
    count(): Promise<number>;
    existsById(id: string): Promise<boolean>;
    findById(id: string): Promise<MatchmakingTicket | undefined | null>;
    findAll(): Promise<Iterable<MatchmakingTicket>>;
    findAllById(ids: Iterable<string>): Promise<Iterable<MatchmakingTicket>>;

    //  Delete
    delete(matchmakingTicket: MatchmakingTicket): Promise<void>;
    deleteById(id: string): Promise<void>;
    deleteAll(): Promise<void>;
    deleteAll(matchmakingTickets: Iterable<MatchmakingTicket>): Promise<void>;
    deleteAllById(ids: Iterable<string>): Promise<void>;
}
