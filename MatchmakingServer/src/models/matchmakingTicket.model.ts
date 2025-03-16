import { model, Schema, Document } from 'mongoose';
import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { MatchType } from '@interfaces/match.interface';

const matchmakingTicketSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    creator: String,
    matchType: {
        type: Number,
        enum: MatchType,
    },
    subGameId: String,
    mapId: String,
    rating: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const matchmakingTicketModel = model<MatchmakingTicket & Document>('MatchmakingTicket', matchmakingTicketSchema);

export default matchmakingTicketModel;
