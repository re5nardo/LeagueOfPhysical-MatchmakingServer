import { Match, MatchType } from '@interfaces/match.interface';
import { v4 } from 'uuid';

export class MatchFactory {
    public static create(properties?: Partial<Match>): Match {
        return { ...MatchFactory.createDefault(), ...properties };
    }

    private static createDefault(): Match {
        return {
            id: v4(),
            matchType: MatchType.Friendly,
            subGameId: '',
            mapId: '',
            targetRating: 1000,
            createdAt: Date.now(),
            playerList: [],
        };
    }
}
