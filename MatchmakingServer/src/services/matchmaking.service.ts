
import { RequestMatchmakingDto, RequestMatchmakingResponseDto, CancelMatchmakingResponseDto } from '@dtos/matchmaking.dto';
import { MatchType } from '@interfaces/match.interface';
import MatchmakingTicketService from '@services/matchmakingTicket.service';
import WaitingRoomService from '@services/waitingRoom.service';
import UserService from '@services/user.service';
import { Location, WaitingRoomLocationDetail } from '@interfaces/user.location.interface';
import { User } from '@interfaces/user.interface';
import { ResponseCode } from '@interfaces/responseCode.interface';
import { UpdateUserLocationDto } from '@dtos/user.dto';

class MatchmakingService {

    private matchmakingTicketService: MatchmakingTicketService = new MatchmakingTicketService();
    private waitingRoomService: WaitingRoomService = new WaitingRoomService();
    private userService: UserService = new UserService();

    public async requestMatchmaking(requestMatchmakingDto: RequestMatchmakingDto): Promise<RequestMatchmakingResponseDto> {
        try {
            const getUserResponseDto = await this.userService.findUserById(requestMatchmakingDto.userId);
            const user = getUserResponseDto.user;
            if (!user) {
                return {
                    code: ResponseCode.USER_NOT_EXIST,
                };
            }

            if (this.validateToMatchmaking(user) !== true) {
                return {
                    code: ResponseCode.INVALID_TO_MATCH_MAKING,
                };
            }

            const targetRating = requestMatchmakingDto.matchType === MatchType.Rank ? user.rankRating : user.friendlyRating;

            //  트랜잭션으로 묶어서 처리해야 할 것 같은데...
            //  흠...

            //  issue matchmakingTicket
            const matchmakingTicket = await this.matchmakingTicketService.issueMatchmakingTicket(
                requestMatchmakingDto.userId,
                requestMatchmakingDto.matchType,
                requestMatchmakingDto.subGameId,
                requestMatchmakingDto.mapId,
                targetRating
            );

            const waitingRoom = await this.waitingRoomService.joinOrCreateWaitingRoom(matchmakingTicket.id);
            if (waitingRoom) {

                //  update userMatchState
                const waitingRoomLocationDetail: WaitingRoomLocationDetail = {
                    location: Location.InWaitingRoom,
                    waitingRoomId: waitingRoom.id,
                    matchmakingTicketId: matchmakingTicket.id
                };

                const updateUserLocationDto: UpdateUserLocationDto = {
                    userLocations: [{
                        userId: requestMatchmakingDto.userId,
                        location: Location.InWaitingRoom,
                        locationDetail: waitingRoomLocationDetail
                    }]
                };

                await this.userService.updateUserLocation(updateUserLocationDto);

                return {
                    code: ResponseCode.SUCCESS,
                    ticketId: matchmakingTicket.id
                };
            } else {

                await this.matchmakingTicketService.deleteMatchmakingTicket(matchmakingTicket); //  자동 소멸? (ttl 10분?)

                //  update userMatchState
                const updateUserLocationDto: UpdateUserLocationDto = {
                    userLocations: [{
                        userId: requestMatchmakingDto.userId,
                        location: Location.Unknown,
                        locationDetail: {
                            location: Location.Unknown,
                        }
                    }]
                };

                await this.userService.updateUserLocation(updateUserLocationDto);

                return {
                    code: ResponseCode.UNKNOWN_ERROR,
                };
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async cancelMatchmaking(ticketId: string): Promise<CancelMatchmakingResponseDto> {
        try {
            const matchmakingTicket = await this.matchmakingTicketService.findMatchmakingTicketById(ticketId);
            if (!matchmakingTicket) {
                return {
                    code: ResponseCode.MATCH_MAKING_TICKET_NOT_EXIST
                };
            }

            const getUserResponseDto = await this.userService.findUserById(matchmakingTicket.creator);
            const user = getUserResponseDto.user;
            if (!user) {
                return {
                    code: ResponseCode.USER_NOT_EXIST
                };
            }

            //  check state (if already in game or inWaiting)
            switch (+user.location) {
                case Location.Unknown:
                    return {
                        code: ResponseCode.NOT_MATCH_MAKING_STATE
                    };
                case Location.InGameRoom:
                    return {
                        code: ResponseCode.ALREADY_IN_GAME
                    };
            }

            const waitingRoomLocationDetail = user.locationDetail as WaitingRoomLocationDetail;

            const result = await this.waitingRoomService.leaveWaitingRoom(waitingRoomLocationDetail.waitingRoomId, waitingRoomLocationDetail.matchmakingTicketId);
            if (result === false) {
                return {
                    code: ResponseCode.FAIL_TO_LEAVE_WAITING_ROOM
                };
            }
            const ticket = await this.matchmakingTicketService.deleteMatchmakingTicketById(ticketId);

            //  update userMatchState
            const updateUserLocationDto: UpdateUserLocationDto = {
                userLocations: [{
                    userId: user.id,
                    location: Location.Unknown,
                    locationDetail: {
                        location: Location.Unknown,
                    }
                }]
            };

            await this.userService.updateUserLocation(updateUserLocationDto);

            return {
                code: ResponseCode.SUCCESS
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private validateToMatchmaking(user: User): boolean {
        try {
            switch (+user.location) {
                case Location.InWaitingRoom:
                case Location.InGameRoom:
                    return false;
                default:
                    return true;
            }
        } catch (error) {
            return false;
        }
    }
}

export default MatchmakingService;
