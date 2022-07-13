import App from '@src/app';
import IndexRoute from '@routes/index.route';
import MatchmakingRoute from '@routes/matchmaking.route';
import WaitingRoomRoute from '@routes/waitingRoom.route';
import MatchmakingTicketRoute from '@routes/matchmakingTicket.route';
import validateEnv from '@utils/validateEnv';
import { logger } from '@utils/logger';
import loader from '@loaders/index';

(async () => {
    try {
        validateEnv();

        await loader();

        const app = new App([new IndexRoute(), new MatchmakingRoute(), new WaitingRoomRoute(), new MatchmakingTicketRoute()]);

        app.listen();
    } catch (error) {
        logger.error(`main error. error: ${error}`);
    }
})();
