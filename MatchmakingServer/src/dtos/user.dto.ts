import { IsNumber, IsString, IsEnum, IsObject } from 'class-validator';
import { Location, LocationDetail } from '@interfaces/user.location.interface';
import { User } from '@interfaces/user.interface';

export class UserUpdateDto {
    @IsEnum(Location)
    public location: Location;

    @IsObject()
    public locationDetail: LocationDetail;
}

export class UserResponseDto {
    @IsString()
    public id: string;

    @IsString()
    public nickname: string;

    @IsNumber()
    public masterExp: number;

    @IsNumber()
    public friendlyRating: number;

    @IsNumber()
    public rankRating: number;

    @IsNumber()
    public goldCoin: number;

    @IsNumber()
    public gem: number;

    private constructor(user: User) {
        this.id = user.id;
        this.nickname = user.nickname;
        this.masterExp = user.masterExp;
        this.friendlyRating = user.friendlyRating;
        this.rankRating = user.rankRating;
        this.goldCoin = user.goldCoin;
        this.gem = user.gem;
    }

    public static from(user: User): UserResponseDto {
        return new UserResponseDto(user);
    }
}
