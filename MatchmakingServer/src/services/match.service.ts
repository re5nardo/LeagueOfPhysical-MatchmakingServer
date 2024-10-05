
import { MatchRepository } from '@repositories/match.repository';
import { Match } from '@interfaces/match.interface'
import { CreateMatchDto, GetMatchResponseDto } from '@dtos/match.dto';
import { MatchMapper } from '@mappers/match.mapper'
import { ResponseCode } from '@interfaces/responseCode.interface';

class MatchService {

    private matchRepository = new MatchRepository();

    public async createMatch(createMatchDto: CreateMatchDto): Promise<Match> {
        try {
            return await this.matchRepository.save(MatchMapper.CreateMatchDto.toEntity(createMatchDto));
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findMatchById(id: string): Promise<GetMatchResponseDto> {
        try {
            const match = await this.matchRepository.findById(id);
            if (!match) {
                return {
                    code: ResponseCode.MATCH_NOT_EXIST
                };
            }
            return {
                code: ResponseCode.SUCCESS,
                match: MatchMapper.toMatchResponseDto(match),
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default MatchService;
