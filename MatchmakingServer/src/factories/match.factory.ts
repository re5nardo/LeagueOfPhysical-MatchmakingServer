import { Match } from '@interfaces/match.interface';
import { GameMode } from '@interfaces/enums';
import { v4 } from 'uuid';

export class MatchFactory {
    public static create(properties?: Partial<Match>): Match {
        return { ...MatchFactory.createDefault(), ...properties };
    }

    private static createDefault(): Match {
        return {
            id: v4(),
            matchType: GameMode.Normal,
            subGameId: '',
            mapId: '',
            targetRating: 1000,
            createdAt: new Date(),
            playerList: [],
        };
    }
}
