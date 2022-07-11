import { IsNumber, IsString, IsEnum, IsObject } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class MatchmakingRequestDto {
    @IsString()
    public userId: string;

    @IsEnum(MatchType)
    public matchType: MatchType;

    @IsString()
    public subGameId: string;

    @IsString()
    public mapId: string;
}

export class MatchmakingResponseDto implements ResponseBase {
    public code: number;
    public ticketId: string;
}

export class CancelMatchmakingResponseDto implements ResponseBase {
    public code: number;
}
