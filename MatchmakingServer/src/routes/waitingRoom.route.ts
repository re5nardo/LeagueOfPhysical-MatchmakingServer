import { Router } from 'express';
import WaitingRoomController from '@controllers/waitingRoom.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class WaitingRoomRoute implements Routes {
    public path = '/waitingroom';
    public router = Router();
    public waitingRoomController = new WaitingRoomController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.waitingRoomController.getWaitingRoomById);
    }
}

export default WaitingRoomRoute;
