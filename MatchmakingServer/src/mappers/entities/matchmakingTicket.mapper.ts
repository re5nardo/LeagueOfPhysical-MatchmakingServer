import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { GameMode } from '@interfaces/enums';
import { MatchmakingTicket as MatchmakingTicketEntity } from '@prisma/client';
import * as Entity from '@prisma/client';
import { DomainEntityMapper } from '@mappers/domain.entity.mapper'

export class MatchmakingTicketMapper implements DomainEntityMapper<MatchmakingTicket, MatchmakingTicketEntity> {
    public toDomain(entity: MatchmakingTicketEntity): MatchmakingTicket {
        return {
            id: entity.id,
            creator: entity.creator,
            matchType: GameMode[entity.matchType as keyof typeof GameMode],
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
            matchType: GameMode[domain.matchType] as Entity.GameMode,
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
            default: return field;
        }
    }

    public toEntityValue<K extends keyof MatchmakingTicket>(field: K, value: MatchmakingTicket[K]): any {
        switch (field) {
            default: return value;
        }
    }
}
