import { CreateMatchmakingTicketDto, MatchmakingTicketResponseDto } from '@dtos/matchmakingTicket.dto';
import { MatchmakingTicketFactory } from '@factories/matchmakingTicket.factory';
import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';

export class MatchmakingTicketMapper {
    static CreateMatchmakingTicketDto = class {
        public static toEntity(createMatchmakingTicketDto: CreateMatchmakingTicketDto): MatchmakingTicket {
            return MatchmakingTicketFactory.create({
                id: createMatchmakingTicketDto.id,
                creator: createMatchmakingTicketDto.creator,
                matchType: createMatchmakingTicketDto.matchType,
                subGameId: createMatchmakingTicketDto.subGameId,
                mapId: createMatchmakingTicketDto.mapId,
                rating: createMatchmakingTicketDto.rating
            });
        }
    };

    public static toMatchmakingTicketResponseDto(matchmakingTicket: MatchmakingTicket): MatchmakingTicketResponseDto {
        return {
            id: matchmakingTicket.id,
            creator: matchmakingTicket.creator,
            matchType: matchmakingTicket.matchType,
            subGameId: matchmakingTicket.subGameId,
            mapId: matchmakingTicket.mapId,
            rating: matchmakingTicket.rating
        };
    }
}
