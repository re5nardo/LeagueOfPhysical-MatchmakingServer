import { MatchType } from '@interfaces/match.interface';

export interface MatchmakingTicket {
    id: string;
    creator: string;
    matchType: MatchType;
    subGameId: string;
    mapId: string;
    rating: number;
    createdAt: number;
}
