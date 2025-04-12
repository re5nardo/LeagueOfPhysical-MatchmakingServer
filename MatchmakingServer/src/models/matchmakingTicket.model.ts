import { model, Schema, Document } from 'mongoose';
import { MatchmakingTicket } from '@interfaces/matchmakingTicket.interface';
import { GameMode } from '@interfaces/enums';

const matchmakingTicketSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    creator: String,
    matchType: {
        type: Number,
        enum: GameMode,
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
