import { WaitingRoom } from "@interfaces/waitingRoom.interface";
import { CreateWaitingRoomDto, WaitingRoomResponseDto } from "@dtos/waitingRoom.dto";
import { WaitingRoomFactory } from '@factories/waitingRoom.factory';

export class WaitingRoomMapper {
    static CreateWaitingRoomDto = class {
        public static toEntity(createWaitingRoomDto: CreateWaitingRoomDto): WaitingRoom {
            return WaitingRoomFactory.create({
                matchType: createWaitingRoomDto.matchType,
                subGameId: createWaitingRoomDto.subGameId,
                mapId: createWaitingRoomDto.mapId,
                targetRating: createWaitingRoomDto.targetRating,
                maxWaitngTime: createWaitingRoomDto.maxWaitngTime,
                minPlayerCount: createWaitingRoomDto.minPlayerCount,
                maxPlayerCount: createWaitingRoomDto.maxPlayerCount
            });
        }
    };

    public static toWaitingRoomResponseDto(waitingRoom: WaitingRoom): WaitingRoomResponseDto {
        return {
            id: waitingRoom.id,
            matchType: waitingRoom.matchType,
            subGameId: waitingRoom.subGameId,
            mapId: waitingRoom.mapId,
            targetRating: waitingRoom.targetRating,
            matchmakingTicketList: waitingRoom.matchmakingTicketList,
            maxWaitngTime: waitingRoom.maxWaitngTime,
            minPlayerCount: waitingRoom.minPlayerCount,
            maxPlayerCount: waitingRoom.maxPlayerCount,
            status: waitingRoom.status
        };
    }
}
