import { Updatable } from '@interfaces/updatable.interface';
import { Updater } from '@src/updater/updater';
import WaitingRoomService from '@services/waitingRoom.service';

export class WaitingRoomUpdater implements Updatable {

    private waitingRoomId: string;
    private waitingRoomService = new WaitingRoomService();

    public constructor(waitingRoomId: string) {
        this.waitingRoomId = waitingRoomId;
        Updater.Register(this);
    }

    public update(delta: number): void {
        this.updateAsync(delta);
    }

    private async updateAsync(delta: number): Promise<void> {
        try {
            Updater.Unregister(this);
            const result = await this.waitingRoomService.updateWaitingRoom(this.waitingRoomId);
            if (result) {
                Updater.Register(this);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
