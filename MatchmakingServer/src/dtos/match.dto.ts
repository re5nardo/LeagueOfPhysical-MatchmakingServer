import { IsNumber, IsString, IsEnum, IsArray } from 'class-validator';
import { GameMode } from '@interfaces/enums';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class CreateMatchDto {
    @IsEnum(GameMode)
    public matchType: GameMode;

    @IsString()
    public subGameId: string;

    @IsString()
    public mapId: string;

    @IsNumber()
    public targetRating: number;

    @IsArray()
    @IsString({ each: true })
    public playerList: string[];
}

export class MatchResponseDto {
    public id: string;
    public matchType: GameMode;
    public subGameId: string;
    public mapId: string;
    public targetRating: number;
    public playerList: string[];
}

export class GetMatchResponseDto implements ResponseBase {
    public code: number;
    public match?: MatchResponseDto;
}
