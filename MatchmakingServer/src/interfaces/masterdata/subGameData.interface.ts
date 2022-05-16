
export enum AvailableMatchType {
    Friendly = 0,
    Rank = 1,
}

export interface SubGameData {
    SubGameId: string;
    MinPlayerCount: number;
    MaxPlayerCount: number;
    AvailableMatchType: AvailableMatchType[];
}
