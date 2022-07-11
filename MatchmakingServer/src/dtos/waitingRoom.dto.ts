import { IsNumber, IsString, IsEnum, IsArray } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';
import { WaitingRoomStatus, WaitingRoom } from '@interfaces/waitingRoom.interface';
import { WaitingRoomFactory } from '@factories/waitingRoom.factory';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class WaitingRoomCreateDto {
    @IsEnum(MatchType)
    public matchType: MatchType;

    @IsString()
    public subGameId: string;

    @IsString()
    public mapId: string;

    @IsNumber()
    public targetRating: number;

    @IsNumber()
    public maxWaitngTime: number;

    @IsNumber()
    public minPlayerCount: number;

    @IsNumber()
    public maxPlayerCount: number;

    public constructor(matchType: MatchType, subGameId: string, mapId: string, targetRating: number, maxWaitngTime: number, minPlayerCount: number, maxPlayerCount: number) {
        this.matchType = matchType;
        this.subGameId = subGameId;
        this.mapId = mapId;
        this.targetRating = targetRating;
        this.maxWaitngTime = maxWaitngTime;
        this.minPlayerCount = minPlayerCount;
        this.maxPlayerCount = maxPlayerCount;
    }

    public toEntity(): WaitingRoom {
        return WaitingRoomFactory.create({
            matchType: this.matchType,
            subGameId: this.subGameId,
            mapId: this.mapId,
            targetRating: this.targetRating,
            maxWaitngTime: this.maxWaitngTime,
            minPlayerCount: this.minPlayerCount,
            maxPlayerCount: this.maxPlayerCount
        });
    }
}

export class WaitingRoomResponseDto {
    public id: string;
    public matchType: MatchType;
    public subGameId: string;
    public mapId: string;
    public targetRating: number;
    public matchmakingTicketList: string[];
    public maxWaitngTime: number;
    public minPlayerCount: number;
    public maxPlayerCount: number;
    public status: WaitingRoomStatus;

    private constructor(waitingRoom: WaitingRoom) {
        this.id = waitingRoom.id;
        this.matchType = waitingRoom.matchType;
        this.subGameId = waitingRoom.subGameId;
        this.mapId = waitingRoom.mapId;
        this.targetRating = waitingRoom.targetRating;
        this.matchmakingTicketList = waitingRoom.matchmakingTicketList;
        this.maxWaitngTime = waitingRoom.maxWaitngTime;
        this.minPlayerCount = waitingRoom.minPlayerCount;
        this.maxPlayerCount = waitingRoom.maxPlayerCount;
        this.status = waitingRoom.status;
    }

    public static from(waitingRoom: WaitingRoom): WaitingRoomResponseDto {
        return new WaitingRoomResponseDto(waitingRoom);
    }
}

export class GetWaitingRoomResponseDto implements ResponseBase {
    public code: number;
    public waitingRoom?: WaitingRoomResponseDto;
}
