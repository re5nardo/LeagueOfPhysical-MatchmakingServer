import { REDIS_HOST, REDIS_PORT } from '@config';

export const redisConnection = {
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    options: {
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
        //useFindAndModify: false,
    },
};
