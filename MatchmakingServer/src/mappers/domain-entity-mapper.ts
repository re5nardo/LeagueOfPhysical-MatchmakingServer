
export interface DomainEntityMapper<TDomain, TEntity> {
    toDomain(entity: TEntity): TDomain;
    toEntity(domain: TDomain): TEntity;

    toDomains(entities: Iterable<TEntity>): Iterable<TDomain>;
    toEntities(domains: Iterable<TDomain>): Iterable<TEntity>;

    getEntityFieldName<K extends keyof TDomain>(field: K): string;
    toEntityValue<K extends keyof TDomain>(field: K, value: TDomain[K]): any;
}
