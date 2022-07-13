import { NextFunction, Request, Response } from 'express';
import MatchmakingService from '@services/matchmaking.service';
import { MatchmakingRequestDto, MatchmakingResponseDto, CancelMatchmakingResponseDto } from '@dtos/matchmaking.dto';

class MatchmakingController {
    private matchmakingService = new MatchmakingService();

    public requestMatchmaking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const matchmakingRequestDto: MatchmakingRequestDto = req.body;
            const { code, ticketId } = await this.matchmakingService.requestMatchmaking(matchmakingRequestDto);
            const response: MatchmakingResponseDto = {
                code: code,
                ticketId: ticketId || ''
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public cancelMatchmaking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ticketId: string = req.params.ticketId;
            const code = await this.matchmakingService.cancelMatchmaking(ticketId);
            const response: CancelMatchmakingResponseDto = {
                code: code
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}

export default MatchmakingController;
