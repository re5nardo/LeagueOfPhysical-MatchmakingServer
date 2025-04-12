import { ResponseBase } from '@interfaces/responseBase.interface';
import { GameMode } from '@interfaces/enums';

export class UserStatsResponseDto {
    public userId: string;
    public gameMode: GameMode;
    public gamesPlayed: number;
    public wins: number;
    public losses: number;
    public draws: number;
    public eloRating: number;
    public tier: string;
}

export class GetUserStatsResponseDto implements ResponseBase {
    public code: number;
    public userStats?: UserStatsResponseDto;
}
