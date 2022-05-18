import { model, Schema, Document } from 'mongoose';
import { WaitingRoom, WaitingRoomStatus } from '@interfaces/waitingRoom.interface';
import { MatchType } from '@interfaces/match.interface';

const waitingRoomSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    matchType: {
        type: String,
        enum: MatchType,
    },
    subGameId: String,
    mapId: String,
    targetRating: Number,
    createdAt: Number,
    waitingPlayerList: [String],
    matchmakingTicketList: [String],
    maxWaitngTime: Number,
    minPlayerCount: Number,
    maxPlayerCount: Number,
    status: {
        type: String,
        enum: WaitingRoomStatus,
    },
});

const waitingRoomModel = model<WaitingRoom & Document>('WaitingRoom', waitingRoomSchema);

export default waitingRoomModel;
