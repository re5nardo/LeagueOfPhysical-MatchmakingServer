import { MatchType } from "@interfaces/match.interface";

export enum WaitingRoomStatus {
    None = 0,
}

export interface WaitingRoom {
    id: string;
    matchType: MatchType;
    subGameId: string;
    mapId: string;
    targetRating: number;
    createdAt: number;
    matchmakingTicketList: string[];
    maxWaitngTime: number;
    minPlayerCount: number;
    maxPlayerCount: number;
    status: WaitingRoomStatus;
};
