import { GameMode } from '@interfaces/enums';

export enum WaitingRoomStatus {
    None = 0,
}

export interface WaitingRoom {
    id: string;
    matchType: GameMode;
    subGameId: string;
    mapId: string;
    targetRating: number;
    createdAt: Date;
    matchmakingTicketList: string[];
    maxWaitingTime: number;
    minPlayerCount: number;
    maxPlayerCount: number;
    status: WaitingRoomStatus;
};
