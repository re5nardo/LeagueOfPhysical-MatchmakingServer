import LobbyServerService from '@services/httpServices/lobbyServer.service';
import { UpdateUserLocationDto, UpdateUserLocationResponseDto, GetUserLocationResponseDto } from '@dtos/user-location.dto';

class UserLocationService {

    private lobbyServerService = new LobbyServerService();

    public async getOrCreateUserLocationById(userId: string): Promise<GetUserLocationResponseDto> {
        try {
            return await this.lobbyServerService.getOrCreateUserLocationById(userId);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    
    public async updateUserLocation(updateUserLocationDto: UpdateUserLocationDto): Promise<UpdateUserLocationResponseDto> {
        try {
            return await this.lobbyServerService.updateUserLocation(updateUserLocationDto);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default UserLocationService;
