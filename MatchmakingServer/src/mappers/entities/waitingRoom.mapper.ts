import { WaitingRoom, WaitingRoomStatus } from '@interfaces/waitingRoom.interface';
import { MatchType } from '@interfaces/match.interface';
import { WaitingRoom as WaitingRoomEntity } from '@prisma/client';
import * as Entity from '@prisma/client';
import { DomainEntityMapper } from '@mappers/domain.entity.mapper'

export class WaitingRoomMapper implements DomainEntityMapper<WaitingRoom, WaitingRoomEntity> {
    public toDomain(entity: WaitingRoomEntity): WaitingRoom {
        return {
            id: entity.id,
            matchType: MatchType[entity.matchType as keyof typeof MatchType],
            subGameId: entity.subGameId,
            mapId: entity.mapId,
            targetRating: entity.targetRating,
            createdAt: entity.createdAt,
            matchmakingTicketList: entity.matchmakingTicketList,
            maxWaitingTime: entity.maxWaitingTime,
            minPlayerCount: entity.minPlayerCount,
            maxPlayerCount: entity.maxPlayerCount,
            status: WaitingRoomStatus[entity.status as keyof typeof WaitingRoomStatus],
        };
    }
    
    public toEntity(domain: WaitingRoom): WaitingRoomEntity {
        return {
            id: domain.id,
            matchType: MatchType[domain.matchType] as Entity.MatchType,
            subGameId: domain.subGameId,
            mapId: domain.mapId,
            targetRating: domain.targetRating,
            createdAt: new Date(domain.createdAt),
            matchmakingTicketList: domain.matchmakingTicketList,
            maxWaitingTime: domain.maxWaitingTime,
            minPlayerCount: domain.minPlayerCount,
            maxPlayerCount: domain.maxPlayerCount,
            status: WaitingRoomStatus[domain.status] as Entity.WaitingRoomStatus,
        };
    }

    public toDomains(entities: Iterable<WaitingRoomEntity>): Iterable<WaitingRoom> {
        return Array.from(entities, (entity) => this.toDomain(entity));
    }

    public toEntities(domains: Iterable<WaitingRoom>): Iterable<WaitingRoomEntity> {
        return Array.from(domains, (domain) => this.toEntity(domain));
    }

    public getEntityFieldName<K extends keyof WaitingRoom>(field: K): string {
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
            case 'matchmakingTicketList':
                return 'matchmakingTicketList';
            case 'maxWaitingTime':
                return 'maxWaitingTime';
            case 'minPlayerCount':
                return 'minPlayerCount';
            case 'maxPlayerCount':
                return 'maxPlayerCount';
            case 'status':
                return 'status';
            default:
                throw new Error(`Invalid field: ${field}`);
        }
    }

    public toEntityValue<K extends keyof WaitingRoom>(field: K, value: WaitingRoom[K]): any {
        return value;
    }
}
