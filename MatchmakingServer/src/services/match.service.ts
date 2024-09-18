
import { MatchRepository } from '@repositories/match.repository';
import { Match } from '@interfaces/match.interface'
import { CreateMatchDto } from '@dtos/match.dto';
import { MatchMapper } from '@mappers/match.mapper';

class MatchService {

    private matchRepository = new MatchRepository();

    public async createMatch(createMatchDto: CreateMatchDto): Promise<Match> {
        try {
            return await this.matchRepository.save(MatchMapper.CreateMatchDto.toEntity(createMatchDto));
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default MatchService;
