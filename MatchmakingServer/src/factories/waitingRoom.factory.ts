import { WaitingRoom, WaitingRoomStatus } from '@interfaces/waitingRoom.interface';
import { GameMode } from '@interfaces/enums';
import { v4 } from 'uuid';

export class WaitingRoomFactory {
    public static create(properties?: Partial<WaitingRoom>): WaitingRoom {
        return { ...WaitingRoomFactory.createDefault(), ...properties };
    }

    private static createDefault(): WaitingRoom {
        return {
            id: v4(),
            matchType: GameMode.Normal,
            subGameId: '',
            mapId: '',
            targetRating: 1000,
            createdAt: new Date(),
            matchmakingTicketList: [],
            maxWaitingTime: 500,
            minPlayerCount: 2,
            maxPlayerCount: 8,
            status: WaitingRoomStatus.None,
        };
    }
}
