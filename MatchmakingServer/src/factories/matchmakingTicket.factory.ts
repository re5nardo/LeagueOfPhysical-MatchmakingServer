import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { MatchType } from '@interfaces/match.interface';
import { v4 } from 'uuid';

export class MatchmakingTicketFactory {
    public static create(properties?: Partial<MatchmakingTicket>): MatchmakingTicket {
        return { ...MatchmakingTicketFactory.createDefault(), ...properties };
    }

    private static createDefault(): MatchmakingTicket {
        return {
            id: v4(),
            creator: '',
            matchType: MatchType.Friendly,
            subGameId: '',
            mapId: '',
            rating: 1000,
            createdAt: new Date(),
        };
    }
}
