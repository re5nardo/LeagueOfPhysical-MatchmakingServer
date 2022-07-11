import RoomServerService from '@services/httpServices/roomServer.service';
import { CreateRoomDto, CreateRoomResponseDto } from '@dtos/room.dto';

class RoomService {

    private roomServerService = new RoomServerService();

    public async createRoom(createRoomDto: CreateRoomDto): Promise<CreateRoomResponseDto> {
        try {
            return await this.roomServerService.createRoom(createRoomDto);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default RoomService;
