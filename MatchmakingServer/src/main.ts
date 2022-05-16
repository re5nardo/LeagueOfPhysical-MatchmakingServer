import App from '@src/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import { logger } from '@utils/logger';
import loader from '@loaders/index';

(async () => {
    try {
        validateEnv();

        await loader();

        const app = new App([new IndexRoute()]);

        app.listen();

      } catch (error) {
          logger.error(`main error. error: ${error}`);
      }
})();
