import { IsNumber, IsString, IsEnum, IsArray, IsOptional } from 'class-validator';
import { ResponseBase } from '@interfaces/responseBase.interface';
import { RoomStatus } from '@interfaces/room.interface';

export class CreateRoomDto {
    @IsString()
    public matchId: string;
}

export class RoomResponseDto {
    public id: string;
    public matchId: string;
    public status: RoomStatus;
    public ip: string;
    public port: number;
}

export class CreateRoomResponseDto implements ResponseBase {
    public code: number;
    public room?: RoomResponseDto;
}
