import { IsNumber, IsString, IsEnum, IsArray } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';
import { WaitingRoomStatus } from '@interfaces/waitingRoom.interface';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class CreateWaitingRoomDto {
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
}

export class GetWaitingRoomResponseDto implements ResponseBase {
    public code: number;
    public waitingRoom?: WaitingRoomResponseDto;
}
