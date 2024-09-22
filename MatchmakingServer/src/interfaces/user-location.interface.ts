
export interface UserLocation {
    id: string;
    location: Location;
    locationDetail: LocationDetail;
    timestamp: number;
}

export enum Location {
    None = 0,
    WaitingRoom = 1,
    GameRoom = 2,
}

export class LocationDetail {
    location: Location;

    public constructor(location: Location) {
        this.location = location;
    }
}

export class GameRoomLocationDetail extends LocationDetail {
    gameRoomId: string;

    public constructor(location: Location, gameRoomId: string) {
        super(location);

        this.gameRoomId = gameRoomId;
    }
}

export class WaitingRoomLocationDetail extends LocationDetail {
    waitingRoomId: string;
    matchmakingTicketId: string;

    public constructor(location: Location, waitingRoomId: string, matchmakingTicketId: string) {
        super(location);

        this.waitingRoomId = waitingRoomId;
        this.matchmakingTicketId = matchmakingTicketId;
    }
}
