import { MatchType } from "@interfaces/match.interface";

export enum WaitingRoomStatus {
    None = 0,
}

export class WaitingRoom {
    public id: string;
    public matchType: MatchType;
    public subGameId: string;
    public mapId: string;
    public targetRating: number;
    public createdAt: number;
    public waitingPlayerList: string[];
    public matchmakingTicketList: string[];
    public maxWaitngTime: number;
    public minPlayerCount: number;
    public maxPlayerCount: number;
    public status: WaitingRoomStatus;
};
