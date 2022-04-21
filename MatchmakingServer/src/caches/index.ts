import { CACHE_HOST, CACHE_PORT } from '@config';

export const cacheConnection = {
    url: `redis://${CACHE_HOST}:${CACHE_PORT}`,
    options: {
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
        //useFindAndModify: false,
    },
};
