import { IsNumber, IsString, IsEnum, IsArray } from 'class-validator';
import { MatchType } from '@interfaces/match.interface';

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
