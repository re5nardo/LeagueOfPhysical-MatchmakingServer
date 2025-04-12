import { model, Schema, Document } from 'mongoose';
import { WaitingRoom, WaitingRoomStatus } from '@interfaces/waitingRoom.interface';
import { GameMode } from '@interfaces/enums';

const waitingRoomSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    matchType: {
        type: Number,
        enum: GameMode,
    },
    subGameId: String,
    mapId: String,
    targetRating: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    matchmakingTicketList: [String],
    maxWaitingTime: Number,
    minPlayerCount: Number,
    maxPlayerCount: Number,
    status: {
        type: Number,
        enum: WaitingRoomStatus,
    },
});

const waitingRoomModel = model<WaitingRoom & Document>('WaitingRoom', waitingRoomSchema);

export default waitingRoomModel;
