import { WaitingRoom, WaitingRoomStatus } from '@interfaces/waitingRoom.interface';
import { MatchType } from '@interfaces/match.interface';

export class WaitingRoomFactory {
    public static create(properties?: Partial<WaitingRoom>): WaitingRoom {
        return { ...WaitingRoomFactory.createDefault(), ...properties };
    }

    private static createDefault(): WaitingRoom {
        return {
            id: '',
            matchType: MatchType.Friendly,
            subGameId: '',
            mapId: '',
            targetRating: 1000,
            createdAt: Date.now(),
            waitingPlayerList: [],
            matchmakingTicketList: [],
            maxWaitngTime: 500,
            minPlayerCount: 2,
            maxPlayerCount: 8,
            status: WaitingRoomStatus.None,
        };
    }
}
