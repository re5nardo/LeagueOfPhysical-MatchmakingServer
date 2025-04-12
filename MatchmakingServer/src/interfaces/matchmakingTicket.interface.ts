import { GameMode } from '@interfaces/enums';

export interface MatchmakingTicket {
    id: string;
    creator: string;
    matchType: GameMode;
    subGameId: string;
    mapId: string;
    rating: number;
    createdAt: Date;
}
