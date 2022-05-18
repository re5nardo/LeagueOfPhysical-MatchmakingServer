import { CrudDao } from '@daos/dao.interface';
import { WaitingRoom } from "@interfaces/waitingRoom.interface";

export interface WaitingRoomDao extends CrudDao<WaitingRoom, string> {
    //  Create & Update
    save(waitingRoom: WaitingRoom): Promise<WaitingRoom>;
    saveAll(waitingRooms: Iterable<WaitingRoom>): Promise<void>;

    //  Read
    count(): Promise<number>;
    existsById(id: string): Promise<boolean>;
    findById(id: string): Promise<WaitingRoom | undefined | null>;
    findAll(): Promise<Iterable<WaitingRoom>>;
    findAllById(ids: Iterable<string>): Promise<Iterable<WaitingRoom>>;

    //  Delete
    delete(waitingRoom: WaitingRoom): Promise<void>;
    deleteById(id: string): Promise<void>;
    deleteAll(): Promise<void>;
    deleteAll(waitingRooms: Iterable<WaitingRoom>): Promise<void>;
    deleteAllById(ids: Iterable<string>): Promise<void>;
}
