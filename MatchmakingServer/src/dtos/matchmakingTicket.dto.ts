import { IsNumber, IsString, IsEnum } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';
import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { MatchmakingTicketFactory } from '@factories/matchmakingTicket.factory';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class MatchmakingTicketCreateDto {
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
    
    public toEntity(): MatchmakingTicket {
        return MatchmakingTicketFactory.create({
            id: this.id,
            creator: this.creator,
            matchType: this.matchType,
            subGameId: this.subGameId,
            mapId: this.mapId,
            rating: this.rating,
        });
    }
}

export class MatchmakingTicketResponseDto {
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

    private constructor(matchmakingTicket: MatchmakingTicket) {
        this.id = matchmakingTicket.id;
        this.creator = matchmakingTicket.creator;
        this.matchType = matchmakingTicket.matchType;
        this.subGameId = matchmakingTicket.subGameId;
        this.mapId = matchmakingTicket.mapId;
        this.rating = matchmakingTicket.rating;
    }

    public static from(matchmakingTicket: MatchmakingTicket): MatchmakingTicketResponseDto {
        return new MatchmakingTicketResponseDto(matchmakingTicket);
    }
}

export class GetMatchmakingTicketResponseDto implements ResponseBase {
    public code: number;
    public matchmakingTicket?: MatchmakingTicketResponseDto;
}
