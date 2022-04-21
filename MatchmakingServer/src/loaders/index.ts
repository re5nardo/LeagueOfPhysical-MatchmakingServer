import * as mongooseLoader from '@loaders/mongoose.loader';
import * as redisLoader from '@loaders/redis.loader';
import { logger } from '@utils/logger';

export default async () => {
    try {
        await mongooseLoader.load();
        logger.info('✌️ DB loaded and connected!');
        
        await redisLoader.load();
        logger.info('✌️ Cache loaded and connected!');
    } catch (error) {
        return Promise.reject(error);
    }
};
