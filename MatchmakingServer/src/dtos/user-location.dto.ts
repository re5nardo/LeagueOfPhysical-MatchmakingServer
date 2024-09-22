import { IsNumber, IsString, IsEnum, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Location, LocationDetail } from '@interfaces/user-location.interface';
import { ResponseBase } from '@interfaces/responseBase.interface';

export class UpdateUserLocationDto {
    @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => UserLocationDto)
    public userLocations: UserLocationDto[] = [];
}

export class UserLocationDto {
    public userId: string;
    public location: Location;
    public locationDetail: LocationDetail;
}

export class UserLocationResponseDto {
    public userId: string;
    public location: Location;
    public locationDetail: LocationDetail;
    public timestamp: number;
}

export class GetUserLocationResponseDto implements ResponseBase {
    public code: number;
    public userLocation?: UserLocationResponseDto;
}

export class UpdateUserLocationResponseDto implements ResponseBase {
    public code: number;
    public userLocations?: UserLocationResponseDto[];
}
