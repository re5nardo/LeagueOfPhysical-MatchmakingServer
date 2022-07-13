
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { WaitingRoomCreateDto } from '@dtos/waitingRoom.dto';
import { CreateRoomDto } from '@dtos/room.dto';
import { UpdateUserLocationDto, UserLocationDto } from '@dtos/user.dto';
import { WaitingRoomRepository } from '@repositories/waitingRoom.repository';
import { WaitingRoom } from '@interfaces/waitingRoom.interface';
import MatchmakingTicketService from '@services/matchmakingTicket.service';
import { MasterData, MasterDataType } from '@loaders/masterdata.loader';
import { ResponseCode } from '@interfaces/responseCode.interface';
import { WaitingRoomUpdater } from '@src/updater/waitingRoomUpdater';
import RoomService from '@services/room.service';
import UserService from '@services/user.service';
import { Location, GameRoomLocationDetail } from '@interfaces/user.location.interface';

class WaitingRoomService {

    private waitingRoomRepository = new WaitingRoomRepository();
    private matchmakingTicketService = new MatchmakingTicketService();
    private roomService = new RoomService();
    private userService = new UserService();

    public async leaveWaitingRoom(waitingRoomId: string, matchmakingTicketId: string): Promise</*MatchmakingTicketResponseDto*/boolean> {
        try {
            const waitingRoom = await this.waitingRoomRepository.findById(waitingRoomId);
            if (!waitingRoom) {
                return false;
            }

            if (!waitingRoom.matchmakingTicketList.includes(matchmakingTicketId)) {
                return false;
            }

            const index = waitingRoom.matchmakingTicketList.indexOf(matchmakingTicketId);
            waitingRoom.matchmakingTicketList.splice(index, 1);
            
            if (waitingRoom.matchmakingTicketList.length == 0) {
                await this.waitingRoomRepository.delete(waitingRoom);
            } else {
                await this.waitingRoomRepository.save(waitingRoom);
            }

            return true;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllWaitingRooms(): Promise<WaitingRoom[]> {
        try {
            return await this.waitingRoomRepository.findAll() as WaitingRoom[];
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findAllWaitingRoomsById(ids: Iterable<string>): Promise<WaitingRoom[]> {
        try {
            return await this.waitingRoomRepository.findAllById(ids) as WaitingRoom[];
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async findWaitingRoomById(id: string): Promise<WaitingRoom | undefined> {
        try {
            const findWaitingRoom = await this.waitingRoomRepository.findById(id);
            if (!findWaitingRoom) {
                return undefined;
            }
            return findWaitingRoom;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async createWaitingRoom(waitingRoomCreateDto: WaitingRoomCreateDto): Promise<WaitingRoom> {
        try {
            if (isEmpty(waitingRoomCreateDto)) {
                throw new HttpException(400, 'waitingRoomCreateDto is empty');
            }
            const waitingRoom = await this.waitingRoomRepository.save(waitingRoomCreateDto.toEntity());
            const waitingRoomUpdater = new WaitingRoomUpdater(waitingRoom.id);
            return waitingRoom;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteWaitingRoom(waitingRoom: WaitingRoom): Promise<void> {
        try {
            return await this.waitingRoomRepository.delete(waitingRoom);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteWaitingRoomById(id: string): Promise<void> {
        try {
            return await this.waitingRoomRepository.deleteById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async createWaitingRooms(waitingRoomCreateDtos: WaitingRoomCreateDto[]): Promise<void> {
        try {
            const waitingRooms: WaitingRoom[] = [];
            for (const waitingRoomCreateDto of waitingRoomCreateDtos) {
                waitingRooms.push(waitingRoomCreateDto.toEntity());
            }
            return await this.waitingRoomRepository.saveAll(waitingRooms);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async count(): Promise<number> {
        try {
            return await this.waitingRoomRepository.count();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async existsById(id: string): Promise<boolean> {
        try {
            return await this.waitingRoomRepository.existsById(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllWaitingRooms(waitingRooms?: Iterable<WaitingRoom>): Promise<void> {
        try {
            if (waitingRooms) {
                return await this.waitingRoomRepository.deleteAll(waitingRooms);
            } else {
                return await this.waitingRoomRepository.deleteAll();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async deleteAllWaitingRoomsById(ids: Iterable<string>): Promise<void> {
        try {
            return await this.waitingRoomRepository.deleteAllById(ids);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async joinOrCreateWaitingRoom(matchmakingTicketId: string): Promise<WaitingRoom | undefined> {
        try {
            const matchmakingTicket = await this.matchmakingTicketService.findMatchmakingTicketById(matchmakingTicketId);
            if (matchmakingTicket === undefined) {
                return undefined;
            }

            //  findSuitableWaitingRoom
            const subGameData = MasterData.get(MasterDataType.SubGameData)?.get(matchmakingTicket.subGameId);

            let waitingRoom: WaitingRoom;
            const waitingRooms = await this.waitingRoomRepository.findAll() as WaitingRoom[];
            if (waitingRooms && waitingRooms.length > 0) {
                waitingRoom = waitingRooms[0];
            } else {
                waitingRoom = await this.createWaitingRoom(new WaitingRoomCreateDto(
                    matchmakingTicket.matchType,
                    matchmakingTicket.subGameId,
                    matchmakingTicket.mapId,
                    matchmakingTicket.rating,
                    5,  //  ?
                    subGameData.MinPlayerCount,
                    subGameData.MaxPlayerCount
                ));
            }

            if (waitingRoom.matchmakingTicketList.includes(matchmakingTicketId) === false) {
                waitingRoom.matchmakingTicketList.push(matchmakingTicketId);
            }

            return await this.waitingRoomRepository.save(waitingRoom);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //  간섭 발생하지 않게 Transaction 처리 해야 할 듯한디
    public async updateWaitingRoom(waitingRoomId: string): Promise<void> {
        try {

            //  여러 번 호출 될 때 skip 처리?? 또는 대기 처리?? 스킵처리가 속 편할 것도 같은데..

            const waitingRoom = await this.waitingRoomRepository.findById(waitingRoomId);
            if (waitingRoom) {
                const elapsedTime = (Date.now() - waitingRoom.createdAt) / 1000;

                const matchmakingTickets = await this.matchmakingTicketService.findAllMatchmakingTicketsById(waitingRoom.matchmakingTicketList);
                const waitingPlayerIds: string[] = [];
                matchmakingTickets?.forEach(matchmakingTicket => {
                    waitingPlayerIds.push(matchmakingTicket.creator);
                });

                //  최소 인원 충족 여부가 가장 중요
                if (waitingPlayerIds.length < waitingRoom.minPlayerCount) {
                    return;
                }

                //  풀 인원이면 또는 최대 대기시간 넘으면 무조건 ㄱㄱ
                if (waitingPlayerIds.length >= waitingRoom.maxPlayerCount
                    || waitingRoom.maxWaitngTime <= elapsedTime) {

                    const roomCreateDto: CreateRoomDto = {
                        matchType: waitingRoom.matchType,
                        subGameId: waitingRoom.subGameId,
                        mapId: waitingRoom.mapId,
                        targetRating: waitingRoom.targetRating,
                        exptectedPlayerList: waitingPlayerIds
                    };

                    const createRoomResponseDto = await this.roomService.createRoom(roomCreateDto);
                    if (createRoomResponseDto.code === ResponseCode.SUCCESS && createRoomResponseDto.room !== undefined) {

                        const matchmakingTicketList = await this.matchmakingTicketService.findAllMatchmakingTicketsById(waitingRoom.matchmakingTicketList);
                        const waitingPlayerIds: string[] = [];
                        matchmakingTicketList?.forEach(matchmakingTicket => {
                            waitingPlayerIds.push(matchmakingTicket.creator);
                        });

                        //  remove matchmakingTicketList
                        await this.matchmakingTicketService.deleteAllMatchmakingTickets(matchmakingTicketList);

                        //  update user locations
                        const updateUserLocationDto = new UpdateUserLocationDto();
                        const findAllUsersDto = await this.userService.findAllUsersById(waitingPlayerIds);
                        const roomId = createRoomResponseDto.room.id;

                        findAllUsersDto.users?.forEach(user => {
                            const userLocationDto = new UserLocationDto();
                            userLocationDto.userId = user.id,
                            userLocationDto.location = Location.InGameRoom,
                            userLocationDto.locationDetail = new GameRoomLocationDetail(Location.InGameRoom, roomId);
                            updateUserLocationDto.userLocations.push(userLocationDto);
                        });

                        const response = await this.userService.updateUserLocation(updateUserLocationDto);

                        //remove waitingRoom
                        await this.waitingRoomRepository.deleteById(waitingRoom.id);
                    }
                }
            } else {

            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    //         const index = findIndexLowerRatingWaitingRoom(roomList, matchmakingTicket.rating);

    //         try {
    //             await waitingRoom.alive();
    //             roomList.splice(index + 1, 0, waitingRoom);
    //         } catch (error) {
    //             console.error(error);
    //             removeWaitingRoom(waitingRoom.waitingRoomId);
    //             return false;
    //         }
    //     }

    //     try {
    //         userMatchState.state = 'inWaitingRoom';
    //         userMatchState.stateValue = waitingRoom.waitingRoomId;
    //         userMatchState.matchmakingTicketId = matchmakingTicket.ticketId;
    //         await userMatchState.save();
    //         waitingRoom.waitingPlayerList.push(userMatchState.userId);
    //         return true;
    //     } catch (error) {
    //         console.error(error);
    //         return false;
    //     }

    //     return false;
    // }
    // }
}

export default WaitingRoomService;

// module.exports = class WaitingRoom {
//     constructor() {
//         this. = 'waitingPlayers';   //  waitingPlayers, waitingGameRoom, ...

//         this.timerId = setInterval(this.alive.bind(this), 7 * 1000);
//     }

//     isFull() {
//         return this.waitingPlayerList.length === this.maxPlayerCount;
//     }

//     clear() {
//         clearInterval(this.timerId);
//     }

//     async alive() {
//         await global.redis.setexAsync(util.format(waitingRoomKeyFormat, this.waitingRoomId), 10, Date.now());
//     }
// }
