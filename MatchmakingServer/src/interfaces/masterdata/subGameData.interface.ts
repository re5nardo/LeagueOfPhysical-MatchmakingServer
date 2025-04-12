
import { GameMode } from '@interfaces/enums';

export interface SubGameData {
    SubGameId: string;
    MinPlayerCount: number;
    MaxPlayerCount: number;
    AvailableMatchType: GameMode[];
}
