import { MatchmakingTicketCreateDto } from '@dtos/matchmakingTicket.dto';
import { HttpException } from '@exceptions/HttpException';
import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { isEmpty } from '@utils/util';
import { MatchmakingTicketRepository } from '@repositories/matchmakingTicket.repository';
import { MatchType } from '@interfaces/match.interface';
import { MatchmakingTicketFactory } from '@factories/matchmakingTicket.factory';

class MatchmakingTicketService {
    
    private matchmakingTicketRepository = new MatchmakingTicketRepository();

    public async findAllMatchmakingTickets(): Promise<MatchmakingTicket[]> {
        try {
            return await this.matchmakingTicketRepository.findAll() as MatchmakingTicket[];
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllMatchmakingTicketsById(ids: Iterable<string>): Promise<MatchmakingTicket[]> {
        try {
            return await this.matchmakingTicketRepository.findAllById(ids) as MatchmakingTicket[];
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findMatchmakingTicketById(id: string): Promise<MatchmakingTicket | undefined> {
        try {
            if (isEmpty(id)) {
                return undefined;
            }

            const findMatchmakingTicket = await this.matchmakingTicketRepository.findById(id);
            if (!findMatchmakingTicket) {
                return undefined;
            }
            return findMatchmakingTicket;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async createMatchmakingTicket(matchmakingTicketCreateDto: MatchmakingTicketCreateDto): Promise<MatchmakingTicket> {
        try {
            if (isEmpty(matchmakingTicketCreateDto)) {
                throw new HttpException(400, 'matchmakingTicketCreateDto is empty');
            }
            return await this.matchmakingTicketRepository.save(matchmakingTicketCreateDto.toEntity());
        } catch (error) {
            return Promise.reject(error);
        }
    }
    
    public async issueMatchmakingTicket(userId: string, matchType: MatchType, subGameId: string, mapId: string, rating: number): Promise<MatchmakingTicket> {
        try {
            const matchmakingTicket = MatchmakingTicketFactory.create({
                creator: userId,
                matchType: matchType,
                subGameId: subGameId,
                mapId: mapId,
                rating: rating,
            });
            return await this.matchmakingTicketRepository.save(matchmakingTicket);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteMatchmakingTicket(matchmakingTicket: MatchmakingTicket): Promise<void> {
        try {
            return await this.matchmakingTicketRepository.delete(matchmakingTicket);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteMatchmakingTicketById(id: string): Promise<void> {
        try {
            return await this.matchmakingTicketRepository.deleteById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async createMatchmakingTickets(matchmakingTicketCreateDtos: MatchmakingTicketCreateDto[]): Promise<void> {
        try {
            const matchmakingTickets: MatchmakingTicket[] = [];
            for (const matchmakingTicketCreateDto of matchmakingTicketCreateDtos) {
                matchmakingTickets.push(matchmakingTicketCreateDto.toEntity());
            }
            return await this.matchmakingTicketRepository.saveAll(matchmakingTickets);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async count(): Promise<number> {
        try {
            return await this.matchmakingTicketRepository.count();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: string): Promise<boolean> {
        try {
            return await this.matchmakingTicketRepository.existsById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllMatchmakingTickets(matchmakingTickets?: Iterable<MatchmakingTicket>): Promise<void> {
        try {
            if (matchmakingTickets) {
                return await this.matchmakingTicketRepository.deleteAll(matchmakingTickets);
            } else {
                return await this.matchmakingTicketRepository.deleteAll();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllMatchmakingTicketsById(ids: Iterable<string>): Promise<void> {
        try {
            return await this.matchmakingTicketRepository.deleteAllById(ids);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default MatchmakingTicketService;
