import { Router } from 'express';
import MatchmakingTicketController from '@controllers/matchmakingTicket.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class MatchmakingTicketRoute implements Routes {
    public path = '/matchmaking-ticket';
    public router = Router();
    public matchmakingTicketController = new MatchmakingTicketController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.matchmakingTicketController.getMatchmakingTicketById);
    }
}

export default MatchmakingTicketRoute;
