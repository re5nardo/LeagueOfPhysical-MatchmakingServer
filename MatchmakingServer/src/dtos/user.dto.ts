import { IsNumber, IsString, IsEnum, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Location, LocationDetail } from '@interfaces/user.location.interface';
import { User } from '@interfaces/user.interface';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class UpdateUserLocationDto {
    @IsArray()
    //@ValidateNested({ each: true })
    //@Type(() => UserLocationDto)
    public userLocations: UserLocationDto[] = [];
}

export class UserLocationDto {
    @IsString()
    public userId: string;

    @IsEnum(Location)
    public location: Location;

    @IsObject()
    public locationDetail: LocationDetail;
}

export class UserResponseDto {
    public id: string;
    public nickname: string;
    public masterExp: number;
    public friendlyRating: number;
    public rankRating: number;
    public goldCoin: number;
    public gem: number;
    public location: Location;
    public locationDetail: LocationDetail;

    private constructor(user: User) {
        this.id = user.id;
        this.nickname = user.nickname;
        this.masterExp = user.masterExp;
        this.friendlyRating = user.friendlyRating;
        this.rankRating = user.rankRating;
        this.goldCoin = user.goldCoin;
        this.gem = user.gem;
        this.location = user.location;
        this.locationDetail = user.locationDetail;
    }

    public static from(user: User): UserResponseDto {
        return new UserResponseDto(user);
    }
}

export class GetUserResponseDto implements ResponseBase {
    public code: number;
    public user?: UserResponseDto;
}

export class FindAllUsersResponseDto implements ResponseBase {
    public code: number;
    public users?: UserResponseDto[];
}

export class UpdateUserLocationResponseDto implements ResponseBase {
    public code: number;
    public users?: UserResponseDto[];
}
