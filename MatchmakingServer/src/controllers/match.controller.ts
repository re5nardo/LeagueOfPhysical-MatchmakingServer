import { NextFunction, Request, Response } from 'express';
import MatchService from '@services/match.service';

class MatchController {
    private matchService = new MatchService();

    public getMatchById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const matchId: string = req.params.id;
            const response = await this.matchService.findMatchById(matchId);
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    };
}

export default MatchController;
