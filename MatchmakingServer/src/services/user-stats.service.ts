import LobbyServerService from '@services/httpServices/lobbyServer.service';
import { GameMode } from '@interfaces/enums';
import { GetUserStatsResponseDto } from '@dtos/user-stats.dto';

class UserStatsService {

    private lobbyServerService = new LobbyServerService();

    public async findUserStatsById(userId: string, gameMode: GameMode): Promise<GetUserStatsResponseDto> {
        try {
            return await this.lobbyServerService.findUserStatsById(userId, gameMode);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default UserStatsService;
