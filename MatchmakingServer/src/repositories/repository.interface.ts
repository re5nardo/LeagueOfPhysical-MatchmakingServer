// T - the domain type the repository manages
// ID - the type of the id of the entity the repository manages

//  https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/Repository.html 참고
interface Repository<T,ID> {

}

//  https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html 참고
export interface CrudRepository<T,ID> extends Repository<T,ID> {
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
