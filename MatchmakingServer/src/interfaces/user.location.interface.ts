
export enum Location {
    Unknown = 0,
    InWaitingRoom = 1,
    InGameRoom = 2,
}

export class LocationDetail {
    location: Location;
}

export class GameRoomLocationDetail extends LocationDetail {
    gameRoomId: string;

    public constructor(location: Location, gameRoomId: string) {
        super();

        this.location = location;
        this.gameRoomId = gameRoomId;
    }
}

export class WaitingRoomLocationDetail extends LocationDetail {
    waitingRoomId: string;
    matchmakingTicketId: string;        //  ?? 왜 있어야 되더라?
}
