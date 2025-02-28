import { MONGODB_HOST, MONGODB_PORT, MONGODB_DATABASE } from '@config';

export const mongodbConnection = {
    url: `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`,
    options: {
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
        //useFindAndModify: false,
    },
};
