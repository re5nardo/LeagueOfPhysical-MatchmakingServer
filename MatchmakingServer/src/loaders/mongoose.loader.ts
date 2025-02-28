
import mongoose, { Mongoose } from 'mongoose';
import { NODE_ENV } from '@config';
import { mongodbConnection } from '@databases/mongodb';

export async function load(): Promise<Mongoose> {
    try {
        if (NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        return await mongoose.connect(mongodbConnection.url, mongodbConnection.options);
    } catch (error) {
        return Promise.reject(error);
    }
};
