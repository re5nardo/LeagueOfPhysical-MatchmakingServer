import { Router } from 'express';
import MatchController from '@controllers/match.controller'
import { Routes } from '@interfaces/routes.interface';

class MatchRoute implements Routes {
    public path = '/match';
    public router = Router();
    public matchController = new MatchController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.matchController.getMatchById);
    }
}

export default MatchRoute;
