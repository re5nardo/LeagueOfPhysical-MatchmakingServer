import { Location, LocationDetail } from "@interfaces/user.location.interface";

export interface User {
    id: string;
    nickname: string;
    masterExp: number;
    friendlyRating: number;
    rankRating: number;
    goldCoin: number;
    gem: number;
    location: Location;
    locationDetail: LocationDetail;
}
