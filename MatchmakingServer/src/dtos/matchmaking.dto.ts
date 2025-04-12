import { IsNumber, IsString, IsEnum, IsObject } from 'class-validator';
import { GameMode } from '@interfaces/enums';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class RequestMatchmakingDto {
    @IsString()
    public userId: string;

    @IsEnum(GameMode)
    public matchType: GameMode;

    @IsString()
    public subGameId: string;

    @IsString()
    public mapId: string;
}

export class RequestMatchmakingResponseDto implements ResponseBase {
    public code: number;
    public ticketId?: string;
}

export class CancelMatchmakingResponseDto implements ResponseBase {
    public code: number;
}
