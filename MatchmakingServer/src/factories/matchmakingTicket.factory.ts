import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { MatchType } from '@interfaces/match.interface';

export class MatchmakingTicketFactory {
    public static create(properties?: Partial<MatchmakingTicket>): MatchmakingTicket {
        return { ...MatchmakingTicketFactory.createDefault(), ...properties };
    }

    private static createDefault(): MatchmakingTicket {
        return {
            id: '',
            creator: '',
            matchType: MatchType.Friendly,
            subGameId: '',
            mapId: '',
            rating: 1000,
            createdAt: Date.now(),
        };
    }
}
