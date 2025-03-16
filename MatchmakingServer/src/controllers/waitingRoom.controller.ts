import { NextFunction, Request, Response } from 'express';
import { GetWaitingRoomResponseDto } from '@dtos/waitingRoom.dto';
import WaitingRoomService from '@services/waitingRoom.service';
import { ResponseCode } from '@interfaces/responseCode.interface';
import { WaitingRoomMapper } from '@mappers/controllers/waitingRoom.mapper';

class WaitingRoomController {
    private waitingRoomService = new WaitingRoomService();

    public getWaitingRoomById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const waitingRoomId: string = req.params.id;
            const findOne = await this.waitingRoomService.findWaitingRoomById(waitingRoomId);

            if (findOne) {
                const response: GetWaitingRoomResponseDto = {
                    code: ResponseCode.SUCCESS,
                    waitingRoom: WaitingRoomMapper.toWaitingRoomResponseDto(findOne)
                }
                res.status(200).json(response);
            } else {
                const response: GetWaitingRoomResponseDto = {
                    code: ResponseCode.WAITING_ROOM_NOT_EXIST
                }
                res.status(200).json(response);
            }
        } catch (error) {
            next(error);
        }
    };
}

export default WaitingRoomController;
