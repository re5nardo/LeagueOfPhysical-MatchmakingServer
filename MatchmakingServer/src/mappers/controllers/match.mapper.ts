import { Match } from '@interfaces/match.interface';
import { MatchFactory } from '@factories/match.factory';
import { CreateMatchDto, MatchResponseDto } from '@dtos/match.dto';

export class MatchMapper {
    static CreateMatchDto = class {
        public static toEntity(createMatchDto: CreateMatchDto): Match {
            return MatchFactory.create({
                matchType: createMatchDto.matchType,
                subGameId: createMatchDto.subGameId,
                mapId: createMatchDto.mapId,
                targetRating: createMatchDto.targetRating,
                playerList: createMatchDto.playerList,
            });
        }
    };

    public static toMatchResponseDto(match: Match): MatchResponseDto {
        return {
            id: match.id,
            matchType: match.matchType,
            subGameId: match.subGameId,
            mapId: match.mapId,
            targetRating: match.targetRating,
            playerList: match.playerList,
        };
    }
}
