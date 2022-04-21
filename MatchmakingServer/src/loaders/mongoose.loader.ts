
import mongoose, { Mongoose } from 'mongoose';
import { NODE_ENV } from '@config';
import { dbConnection } from '@databases/index';

export async function load(): Promise<Mongoose> {
    try {
        if (NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        return await mongoose.connect(dbConnection.url, dbConnection.options);
    } catch (error) {
        return Promise.reject(error);
    }
};
