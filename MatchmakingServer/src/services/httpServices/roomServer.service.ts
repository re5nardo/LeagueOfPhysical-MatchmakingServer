import axios from 'axios';
import { ROOM_SERVER_HOST, ROOM_SERVER_PORT } from '@config';
import { CreateRoomDto, CreateRoomResponseDto } from '@dtos/room.dto';
import HttpService from '@services/httpServices/httpService';

class RoomServerService extends HttpService {
    constructor() {
        if (!ROOM_SERVER_HOST || !ROOM_SERVER_PORT) {
            throw new Error(`ROOM_SERVER_HOST: ${ROOM_SERVER_HOST}, ROOM_SERVER_PORT: ${ROOM_SERVER_PORT}`);
        }
        super(ROOM_SERVER_HOST, Number(ROOM_SERVER_PORT));
    }

    public async createRoom(createRoomDto: CreateRoomDto): Promise<CreateRoomResponseDto> {
        try {
            const url = `http://${this.host}:${this.port}/room`;
            const response = await axios.post(url, createRoomDto);
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default RoomServerService;
