import { GameMode } from '@interfaces/enums';

export interface UserStats {
    id: string;
    userId: string;
    gameMode: GameMode;
    gamesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    eloRating: number;
    mmr: number;
    tier: string;
}
