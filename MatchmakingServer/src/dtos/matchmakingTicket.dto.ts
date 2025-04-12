import { IsNumber, IsString, IsEnum } from 'class-validator';
import { GameMode } from '@interfaces/enums';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class CreateMatchmakingTicketDto {
    @IsString()
    public id: string;

    @IsString()
    public creator: string;

    @IsEnum(GameMode)
    public matchType: GameMode;

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
    public matchType: GameMode;
    public subGameId: string;
    public mapId: string;
    public rating: number;
}

export class GetMatchmakingTicketResponseDto implements ResponseBase {
    public code: number;
    public matchmakingTicket?: MatchmakingTicketResponseDto;
}
