import { ResponseBase } from '@interfaces/responseBase.interface';

export class UserResponseDto {
    public id: string;
    public username: string;
    public email: string;
}

export class GetUserResponseDto implements ResponseBase {
    public code: number;
    public user?: UserResponseDto;
}

export class FindAllUsersResponseDto implements ResponseBase {
    public code: number;
    public users?: UserResponseDto[];
}
