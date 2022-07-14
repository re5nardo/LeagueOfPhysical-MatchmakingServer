import { NextFunction, Request, Response } from 'express';
import MatchmakingService from '@services/matchmaking.service';
import { RequestMatchmakingDto } from '@dtos/matchmaking.dto';

class MatchmakingController {
    private matchmakingService = new MatchmakingService();

    public requestMatchmaking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const requestMatchmakingDto: RequestMatchmakingDto = req.body;
            const response = await this.matchmakingService.requestMatchmaking(requestMatchmakingDto);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };

    public cancelMatchmaking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ticketId: string = req.params.ticketId;
            const response = await this.matchmakingService.cancelMatchmaking(ticketId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}

export default MatchmakingController;
