import { IsNumber, IsString, IsEnum, IsArray } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class CreateMatchDto {
    @IsEnum(MatchType)
    public matchType: MatchType;

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
    public matchType: MatchType;
    public subGameId: string;
    public mapId: string;
    public targetRating: number;
    public playerList: string[];
}

export class GetMatchResponseDto implements ResponseBase {
    public code: number;
    public match?: MatchResponseDto;
}
