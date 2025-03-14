import { Repository } from '@repositories/repository.interface';

//  https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html 참고
export interface CrudRepository<TDomain extends { id: any }, TEntity extends { id: any }> extends Repository<TDomain, TEntity> {
    //  Create & Update
    save(domain: TDomain): Promise<TDomain>;
    saveAll(domains: Iterable<TDomain>): Promise<void>;

    //  Read
    count(): Promise<number>;
    existsById(id: TDomain["id"]): Promise<boolean>;
    findById(id: TDomain["id"]): Promise<TDomain | undefined | null>;
    findAll(): Promise<Iterable<TDomain>>;
    findAllById(ids: Iterable<TDomain["id"]>): Promise<Iterable<TDomain>>;

    //  Delete
    delete(domain: TDomain): Promise<void>;
    deleteById(id: TDomain["id"]): Promise<void>;
    deleteAll(): Promise<void>;
    deleteAll(domains: Iterable<TDomain>): Promise<void>;
    deleteAllById(ids: Iterable<TDomain["id"]>): Promise<void>;

    findByField<K extends keyof TDomain>(field: K, value: TDomain[K]): Promise<TDomain | undefined | null>;
}
