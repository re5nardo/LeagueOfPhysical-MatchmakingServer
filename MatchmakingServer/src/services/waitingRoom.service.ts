
import { CreateWaitingRoomDto } from '@dtos/waitingRoom.dto';
import { CreateRoomDto } from '@dtos/room.dto';
import { UpdateUserLocationDto, UserLocationDto } from '@dtos/user-location.dto';
import { WaitingRoomRepository } from '@repositories/waitingRoom.repository';
import { WaitingRoom } from '@interfaces/waitingRoom.interface';
import MatchmakingTicketService from '@services/matchmakingTicket.service';
import { MasterData, MasterDataType } from '@loaders/masterdata.loader';
import { ResponseCode } from '@interfaces/responseCode.interface';
import { WaitingRoomUpdater } from '@src/updater/waitingRoomUpdater';
import RoomService from '@services/room.service';
import UserLocationService from '@services/user-location.service';
import { Location, GameRoomLocationDetail } from '@interfaces/user-location.interface';
import { WaitingRoomMapper } from '@mappers/waitingRoom.mapper';
import MatchService from '@services/match.service';
import { CreateMatchDto } from '@src/dtos/match.dto';

class WaitingRoomService {

    private waitingRoomRepository = new WaitingRoomRepository();
    private matchmakingTicketService = new MatchmakingTicketService();
    private roomService = new RoomService();
    private userLocationService = new UserLocationService();
    private matchService = new MatchService();

    public async leaveWaitingRoom(waitingRoomId: string, matchmakingTicketId: string): Promise</*MatchmakingTicketResponseDto*/boolean> {
        try {
            const waitingRoom = await this.waitingRoomRepository.findById(waitingRoomId);
            if (!waitingRoom) {
                return false;
            }

            const matchmakingTicket = await this.matchmakingTicketService.findMatchmakingTicketById(matchmakingTicketId);
            if (!matchmakingTicket) {
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

    public async createWaitingRoom(createWaitingRoomDto: CreateWaitingRoomDto): Promise<WaitingRoom> {
        try {
            const waitingRoom = await this.waitingRoomRepository.save(WaitingRoomMapper.CreateWaitingRoomDto.toEntity(createWaitingRoomDto));
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

    public async createWaitingRooms(createWaitingRoomDtos: CreateWaitingRoomDto[]): Promise<void> {
        try {
            const waitingRooms: WaitingRoom[] = [];
            for (const createWaitingRoomDto of createWaitingRoomDtos) {
                waitingRooms.push(WaitingRoomMapper.CreateWaitingRoomDto.toEntity(createWaitingRoomDto));
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

            //  find suitable WaitingRoom
            let waitingRoom: WaitingRoom | undefined;
            const waitingRooms = await this.waitingRoomRepository.findAll() as WaitingRoom[];
            if (waitingRooms && waitingRooms.length > 0) {
                const ratingRange = 200;
                for (const candidate of waitingRooms) {
                    const waitingPlayerIds: string[] = [];
                    const matchmakingTickets = await this.matchmakingTicketService.findAllMatchmakingTicketsById(candidate.matchmakingTicketList);
                    matchmakingTickets?.forEach(matchmakingTicket => {
                        waitingPlayerIds.push(matchmakingTicket.creator);
                    });
                    const isFull = waitingPlayerIds.length >= candidate.maxPlayerCount;
                    if (Math.abs(candidate.targetRating - matchmakingTicket.rating) <= ratingRange && isFull === false) {
                        waitingRoom = candidate;
                        break;
                    }
                }
                
                if (!waitingRoom) {
                    waitingRooms.sort((x: WaitingRoom, y: WaitingRoom): number => {
                        return x.targetRating - y.targetRating;
                    });
                    waitingRoom = waitingRooms.find(x => x.targetRating <= matchmakingTicket.rating);
                }
            }
            
            if (waitingRoom === undefined) {
                const subGameData = MasterData.get(MasterDataType.SubGameData)?.get(matchmakingTicket.subGameId);
                waitingRoom = await this.createWaitingRoom(new CreateWaitingRoomDto(
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
    //  updateWaitingRoom 처리 중에 다시 updateWaitingRoom 호출되지 않는 구조이긴한데.. 더 근본적으로 막을 수 있는.. 방법이..
    public async updateWaitingRoom(waitingRoomId: string): Promise<boolean> {
        try {
            const waitingRoom = await this.waitingRoomRepository.findById(waitingRoomId);
            if (!waitingRoom) {
                console.log(`No waitingRoom to update. waitingRoomId: ${waitingRoomId}`);
                return false;
            }

            const matchmakingTickets = await this.matchmakingTicketService.findAllMatchmakingTicketsById(waitingRoom.matchmakingTicketList);
            const waitingPlayerIds: string[] = [];
            matchmakingTickets?.forEach(matchmakingTicket => {
                waitingPlayerIds.push(matchmakingTicket.creator);
            });

            //  최소 인원 충족 여부가 가장 중요
            if (waitingPlayerIds.length < waitingRoom.minPlayerCount) {
                return true;
            }

            const elapsedTime = (Date.now() - waitingRoom.createdAt) / 1000;

            //  풀 인원이면 또는 최대 대기시간 넘으면 무조건 ㄱㄱ
            if (waitingPlayerIds.length >= waitingRoom.maxPlayerCount
                || elapsedTime >= waitingRoom.maxWaitingTime) {
                
                //  create match
                const createMatchDto: CreateMatchDto = {
                    matchType: waitingRoom.matchType,
                    subGameId: waitingRoom.subGameId,
                    mapId: waitingRoom.mapId,
                    targetRating: waitingRoom.targetRating,
                    playerList: waitingPlayerIds,
                };

                const match = await this.matchService.createMatch(createMatchDto);

                const createRoomDto: CreateRoomDto = {
                    matchId: match.id,
                };

                const createRoomResponseDto = await this.roomService.createRoom(createRoomDto);
                if (createRoomResponseDto.code === ResponseCode.SUCCESS && createRoomResponseDto.room !== undefined) {
                    //  remove matchmakingTicketList
                    await this.matchmakingTicketService.deleteAllMatchmakingTicketsById(waitingRoom.matchmakingTicketList);

                    //  update user locations
                    const updateUserLocationDto = new UpdateUserLocationDto();
                    const roomId = createRoomResponseDto.room.id;

                    waitingPlayerIds.forEach(waitingPlayerId => {
                        const userLocationDto: UserLocationDto = {
                            userId: waitingPlayerId,
                            location: Location.GameRoom,
                            locationDetail: new GameRoomLocationDetail(Location.GameRoom, roomId),
                        };
                        updateUserLocationDto.userLocations.push(userLocationDto);
                    });

                    const response = await this.userLocationService.updateUserLocation(updateUserLocationDto);

                    //remove waitingRoom
                    await this.waitingRoomRepository.deleteById(waitingRoom.id);
                }
            }
            return true;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default WaitingRoomService;
