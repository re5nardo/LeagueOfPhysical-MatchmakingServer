import { IsNumber, IsString, IsEnum } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';
import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { MatchmakingTicketFactory } from '@factories/matchmakingTicket.factory';

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
