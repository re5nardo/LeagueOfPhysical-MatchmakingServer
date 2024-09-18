import { Match } from "@interfaces/match.interface";
import { CreateMatchDto } from "@dtos/match.dto";
import { MatchFactory } from '@factories/match.factory';

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
}
