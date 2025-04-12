import { IsNumber, IsString, IsEnum, IsArray } from 'class-validator';
import { GameMode } from '@interfaces/enums';
import { WaitingRoomStatus } from '@interfaces/waitingRoom.interface';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class CreateWaitingRoomDto {
    @IsEnum(GameMode)
    public matchType: GameMode;

    @IsString()
    public subGameId: string;

    @IsString()
    public mapId: string;

    @IsNumber()
    public targetRating: number;

    @IsNumber()
    public maxWaitingTime: number;

    @IsNumber()
    public minPlayerCount: number;

    @IsNumber()
    public maxPlayerCount: number;

    public constructor(matchType: GameMode, subGameId: string, mapId: string, targetRating: number, maxWaitingTime: number, minPlayerCount: number, maxPlayerCount: number) {
        this.matchType = matchType;
        this.subGameId = subGameId;
        this.mapId = mapId;
        this.targetRating = targetRating;
        this.maxWaitingTime = maxWaitingTime;
        this.minPlayerCount = minPlayerCount;
        this.maxPlayerCount = maxPlayerCount;
    }
}

export class WaitingRoomResponseDto {
    public id: string;
    public matchType: GameMode;
    public subGameId: string;
    public mapId: string;
    public targetRating: number;
    public matchmakingTicketList: string[];
    public maxWaitingTime: number;
    public minPlayerCount: number;
    public maxPlayerCount: number;
    public status: WaitingRoomStatus;
}

export class GetWaitingRoomResponseDto implements ResponseBase {
    public code: number;
    public waitingRoom?: WaitingRoomResponseDto;
}
