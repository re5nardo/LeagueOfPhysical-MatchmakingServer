
export enum MatchType {
    Friendly = 0,
    Rank = 1,
}

export interface Match {
    id: string;
    matchType: MatchType;
    subGameId: string;
    mapId: string;
    targetRating: number;
    createdAt: Date;
    playerList: string[];
};
