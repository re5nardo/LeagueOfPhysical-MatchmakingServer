import { Repository } from '@repositories/repository.interface';

//  https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html 참고
export interface CrudRepository<T extends { id: any }> extends Repository<T> {
    //  Create & Update
    save(entity: T): Promise<T>;
    saveAll(entities: Iterable<T>): Promise<void>;

    //  Read
    count(): Promise<number>;
    existsById(id: T["id"]): Promise<boolean>;
    findById(id: T["id"]): Promise<T | undefined | null>;
    findAll(): Promise<Iterable<T>>;
    findAllById(ids: Iterable<T["id"]>): Promise<Iterable<T>>;

    //  Delete
    delete(entity: T): Promise<void>;
    deleteById(id: T["id"]): Promise<void>;
    deleteAll(): Promise<void>;
    deleteAll(entities: Iterable<T>): Promise<void>;
    deleteAllById(ids: Iterable<T["id"]>): Promise<void>;

    findByField<K extends keyof T>(field: K, value: T[K]): Promise<T | undefined | null>;
}
