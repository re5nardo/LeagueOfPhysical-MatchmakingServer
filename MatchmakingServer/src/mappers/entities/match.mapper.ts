import { Match, MatchType } from '@interfaces/match.interface';
import { Match as MatchEntity } from '@prisma/client';
import * as Entity from '@prisma/client';
import { DomainEntityMapper } from '@mappers/domain.entity.mapper'

export class MatchMapper implements DomainEntityMapper<Match, MatchEntity> {
    public toDomain(entity: MatchEntity): Match {
        return {
            id: entity.id,
            matchType: MatchType[entity.matchType as keyof typeof MatchType],
            subGameId: entity.subGameId,
            mapId: entity.mapId,
            targetRating: entity.targetRating,
            createdAt: entity.createdAt,
            playerList: entity.playerList,
        };
    }
    
    public toEntity(domain: Match): MatchEntity {
        return {
            id: domain.id,
            matchType: MatchType[domain.matchType] as Entity.MatchType,
            subGameId: domain.subGameId,
            mapId: domain.mapId,
            targetRating: domain.targetRating,
            createdAt: new Date(domain.createdAt),
            playerList: domain.playerList,
        };
    }

    public toDomains(entities: Iterable<MatchEntity>): Iterable<Match> {
        return Array.from(entities, (entity) => this.toDomain(entity));
    }

    public toEntities(domains: Iterable<Match>): Iterable<MatchEntity> {
        return Array.from(domains, (domain) => this.toEntity(domain));
    }

    public getEntityFieldName<K extends keyof Match>(field: K): string {
        switch (field) {
            case 'id':
                return 'id';
            case 'matchType':
                return 'matchType';
            case 'subGameId':
                return 'subGameId';
            case 'mapId':
                return 'mapId';
            case 'targetRating':
                return 'targetRating';
            case 'createdAt':
                return 'createdAt';
            case 'playerList':
                return 'playerList';
            default:
                throw new Error(`Invalid field: ${field}`);
        }
    }

    public toEntityValue<K extends keyof Match>(field: K, value: Match[K]): any {
        return value;
    }
}
