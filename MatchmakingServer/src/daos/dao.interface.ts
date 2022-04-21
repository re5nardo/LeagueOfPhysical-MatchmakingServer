
interface Dao<T,ID> {

}

export interface CrudDao<T,ID> extends Dao<T,ID> {
    //  Create & Update
    save(entity: T): Promise<T>;
    saveAll(entities: Iterable<T>): Promise<void>;

    //  Read
    count(): Promise<number>;
    existsById(id: ID): Promise<boolean>;
    findById(id: ID): Promise<T | undefined | null>;
    findAll(): Promise<Iterable<T>>;
    findAllById(ids: Iterable<ID>): Promise<Iterable<T>>;

    //  Delete
    delete(entity: T): Promise<void>;
    deleteById(id: ID): Promise<void>;
    deleteAll(): Promise<void>;
    deleteAll(entities: Iterable<T>): Promise<void>;
    deleteAllById(ids: Iterable<ID>): Promise<void>;
}
