import { GameMode } from '@interfaces/enums';

export interface Match {
    id: string;
    matchType: GameMode;
    subGameId: string;
    mapId: string;
    targetRating: number;
    createdAt: Date;
    playerList: string[];
};
