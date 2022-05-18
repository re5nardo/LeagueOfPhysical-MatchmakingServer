import { IsNumber, IsString, IsEnum, IsArray } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';
import { WaitingRoomStatus, WaitingRoom } from '@interfaces/waitingRoom.interface';
import { WaitingRoomFactory } from '@factories/waitingRoom.factory';

export class WaitingRoomCreateDto {
    @IsString()
    public id: string;

    @IsEnum(MatchType)
    public matchType: MatchType;

    @IsString()
    public subGameId: string;

    @IsString()
    public mapId: string;

    @IsNumber()
    public targetRating: number;

    @IsArray()
    public waitingPlayerList: string[];

    @IsArray()
    public matchmakingTicketList: string[];

    @IsNumber()
    public maxWaitngTime: number;

    @IsNumber()
    public minPlayerCount: number;

    @IsNumber()
    public maxPlayerCount: number;

    @IsEnum(WaitingRoomStatus)
    public status: WaitingRoomStatus;
    
    public toEntity(): WaitingRoom {
        return WaitingRoomFactory.create({
            id: this.id,
            matchType: this.matchType,
            subGameId: this.subGameId,
            mapId: this.mapId,
            targetRating: this.targetRating,
            waitingPlayerList: this.waitingPlayerList,
            matchmakingTicketList: this.matchmakingTicketList,
            maxWaitngTime: this.maxWaitngTime,
            minPlayerCount: this.minPlayerCount,
            maxPlayerCount: this.maxPlayerCount,
            status: this.status,
        });
    }
}
