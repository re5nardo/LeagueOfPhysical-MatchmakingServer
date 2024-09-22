import axios from 'axios';
import { LOBBY_SERVER_HOST, LOBBY_SERVER_PORT } from '@config';
import HttpService from '@services/httpServices/httpService';
import { FindAllUsersResponseDto, GetUserResponseDto } from '@dtos/user.dto';
import { UpdateUserLocationDto, UpdateUserLocationResponseDto, GetUserLocationResponseDto }from '@dtos/user-location.dto';

class LobbyServerService extends HttpService {
    constructor() {
        if (!LOBBY_SERVER_HOST || !LOBBY_SERVER_PORT) {
            throw new Error(`LOBBY_SERVER_HOST: ${LOBBY_SERVER_HOST}, LOBBY_SERVER_PORT: ${LOBBY_SERVER_PORT}`);
        }
        super(LOBBY_SERVER_HOST, Number(LOBBY_SERVER_PORT));
    }

    public async findUserById(id: string): Promise<GetUserResponseDto> {
        try {
            const url = `http://${this.host}:${this.port}/user/${id}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllUsersById(ids: string[]): Promise<FindAllUsersResponseDto> {
        try {
            const params = {
                params: {
                    ids: ids
                }
            };
            const url = `http://${this.host}:${this.port}/user/findAll`;
            const response = await axios.get(url, params);
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async updateUserLocation(updateUserLocationDto: UpdateUserLocationDto): Promise<UpdateUserLocationResponseDto> {
        try {
            const url = `http://${this.host}:${this.port}/user/location`;
            const response = await axios.put(url, updateUserLocationDto);
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getOrCreateUserLocationById(userId: string): Promise<GetUserLocationResponseDto> {
        try {
            const url = `http://${this.host}:${this.port}/user/${userId}/location`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default LobbyServerService;
