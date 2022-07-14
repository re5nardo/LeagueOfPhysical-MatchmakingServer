import { Router } from 'express';
import MatchmakingController from '@controllers/matchmaking.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { RequestMatchmakingDto } from '@dtos/matchmaking.dto';

class MatchmakingRoute implements Routes {
    public path = '/matchmaking';
    public router = Router();
    public matchmakingController = new MatchmakingController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, validationMiddleware(RequestMatchmakingDto, 'body'), this.matchmakingController.requestMatchmaking);
        this.router.delete(`${this.path}/:ticketId`, this.matchmakingController.cancelMatchmaking);
    }
}

export default MatchmakingRoute;
