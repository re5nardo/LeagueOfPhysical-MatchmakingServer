import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { MatchType } from '@interfaces/match.interface';
import { MatchmakingTicket as MatchmakingTicketEntity } from '@prisma/client';
import * as Entity from '@prisma/client';
import { DomainEntityMapper } from '@mappers/domain.entity.mapper'

export class MatchmakingTicketMapper implements DomainEntityMapper<MatchmakingTicket, MatchmakingTicketEntity> {
    public toDomain(entity: MatchmakingTicketEntity): MatchmakingTicket {
        return {
            id: entity.id,
            creator: entity.creator,
            matchType: MatchType[entity.matchType as keyof typeof MatchType],
            subGameId: entity.subGameId,
            mapId: entity.mapId,
            rating: entity.rating,
            createdAt: entity.createdAt,
        };
    }
    
    public toEntity(domain: MatchmakingTicket): MatchmakingTicketEntity {
        return {
            id: domain.id,
            creator: domain.creator,
            matchType: MatchType[domain.matchType] as Entity.MatchType,
            subGameId: domain.subGameId,
            mapId: domain.mapId,
            rating: domain.rating,
            createdAt: new Date(domain.createdAt),
        };
    }

    public toDomains(entities: Iterable<MatchmakingTicketEntity>): Iterable<MatchmakingTicket> {
        return Array.from(entities, (entity) => this.toDomain(entity));
    }

    public toEntities(domains: Iterable<MatchmakingTicket>): Iterable<MatchmakingTicketEntity> {
        return Array.from(domains, (domain) => this.toEntity(domain));
    }

    public getEntityFieldName<K extends keyof MatchmakingTicket>(field: K): string {
        switch (field) {
            case 'id':
                return 'id';
            case 'creator':
                return 'creator';
            case 'matchType':
                return 'matchType';
            case 'subGameId':
                return 'subGameId';
            case 'mapId':
                return 'mapId';
            case 'rating':
                return 'rating';
            case 'createdAt':
                return 'createdAt';
            default:
                throw new Error(`Invalid field: ${field}`);
        }
    }

    public toEntityValue<K extends keyof MatchmakingTicket>(field: K, value: MatchmakingTicket[K]): any {
        return value;
    }
}
