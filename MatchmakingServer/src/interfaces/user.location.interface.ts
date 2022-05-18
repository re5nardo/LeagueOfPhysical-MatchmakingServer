
export enum Location {
    Unknown = 0,
    InGameRoom = 1,
    InWaitingRoom = 2,
}

export class LocationDetail {
    location: Location;
}

export class GameRoomLocationDetail extends LocationDetail {
    gameRoomId: string;
}

export class WaitingRoomLocationDetail extends LocationDetail {
    waitingRoomId: string;
    //matchmakingTicketId: string;
}
