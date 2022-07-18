import { IsNumber, IsString, IsEnum, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Location, LocationDetail } from '@interfaces/user.location.interface';
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
