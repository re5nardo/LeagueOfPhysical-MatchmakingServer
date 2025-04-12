import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { GameMode } from '@interfaces/enums';
import { v4 } from 'uuid';

export class MatchmakingTicketFactory {
    public static create(properties?: Partial<MatchmakingTicket>): MatchmakingTicket {
        return { ...MatchmakingTicketFactory.createDefault(), ...properties };
    }

    private static createDefault(): MatchmakingTicket {
        return {
            id: v4(),
            creator: '',
            matchType: GameMode.Normal,
            subGameId: '',
            mapId: '',
            rating: 1000,
            createdAt: new Date(),
        };
    }
}
