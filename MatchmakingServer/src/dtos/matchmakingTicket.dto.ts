import { IsNumber, IsString, IsEnum } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class CreateMatchmakingTicketDto {
    @IsString()
    public id: string;

    @IsString()
    public creator: string;

    @IsEnum(MatchType)
    public matchType: MatchType;

    @IsString()
    public subGameId: string;

    @IsString()
    public mapId: string;

    @IsNumber()
    public rating: number;
}

export class MatchmakingTicketResponseDto {
    public id: string;
    public creator: string;
    public matchType: MatchType;
    public subGameId: string;
    public mapId: string;
    public rating: number;
}

export class GetMatchmakingTicketResponseDto implements ResponseBase {
    public code: number;
    public matchmakingTicket?: MatchmakingTicketResponseDto;
}
