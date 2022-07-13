import { NextFunction, Request, Response } from 'express';
import MatchmakingTicketService from '@services/matchmakingTicket.service';
import { MatchmakingTicketResponseDto, GetMatchmakingTicketResponseDto } from '@dtos/matchmakingTicket.dto';
import { ResponseCode } from '@interfaces/responseCode.interface';

class MatchmakingTicketController {
    private matchmakingTicketService = new MatchmakingTicketService();

    public getMatchmakingTicketById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const matchmakingTicketId: string = req.params.id;
            const findOne = await this.matchmakingTicketService.findMatchmakingTicketById(matchmakingTicketId);

            if (findOne) {
                const response: GetMatchmakingTicketResponseDto = {
                    code: ResponseCode.SUCCESS,
                    matchmakingTicket: MatchmakingTicketResponseDto.from(findOne)
                }
                res.status(200).json(response);
            } else {
                const response: GetMatchmakingTicketResponseDto = {
                    code: ResponseCode.WAITING_ROOM_NOT_EXIST
                }
                res.status(200).json(response);
            }
        } catch (error) {
            next(error);
        }
    };
}

export default MatchmakingTicketController;
