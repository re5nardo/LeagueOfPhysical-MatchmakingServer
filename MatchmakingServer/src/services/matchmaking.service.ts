
import { RequestMatchmakingDto, RequestMatchmakingResponseDto, CancelMatchmakingResponseDto } from '@dtos/matchmaking.dto';
import { MatchType } from '@interfaces/match.interface';
import MatchmakingTicketService from '@services/matchmakingTicket.service';
import WaitingRoomService from '@services/waitingRoom.service';
import UserService from '@services/user.service';
import UserLocationService from '@services/user-location.service';
import UserStatsService from '@services/user-stats.service';
import { Location, WaitingRoomLocationDetail } from '@interfaces/user-location.interface';
import { ResponseCode } from '@interfaces/responseCode.interface';
import { UpdateUserLocationDto } from '@dtos/user-location.dto';
import { GameMode } from '@interfaces/user-stats.interface';

class MatchmakingService {

    private matchmakingTicketService: MatchmakingTicketService = new MatchmakingTicketService();
    private waitingRoomService: WaitingRoomService = new WaitingRoomService();
    private userService: UserService = new UserService();
    private userLocationService: UserLocationService = new UserLocationService();
    private userStatsService: UserStatsService = new UserStatsService();

    public async requestMatchmaking(requestMatchmakingDto: RequestMatchmakingDto): Promise<RequestMatchmakingResponseDto> {
        try {
            const getUserResponseDto = await this.userService.findUserById(requestMatchmakingDto.userId);
            const user = getUserResponseDto.user;
            if (!user) {
                return {
                    code: ResponseCode.USER_NOT_EXIST,
                };
            }

            if (await this.validateToMatchmaking(user.id) !== true) {
                return {
                    code: ResponseCode.INVALID_TO_MATCH_MAKING,
                };
            }

            const gameMode = requestMatchmakingDto.matchType === MatchType.Rank ? GameMode.Ranked : GameMode.Normal;
            const getUserStatsResponse = await this.userStatsService.findUserStatsById(user.id, gameMode);
            if (getUserStatsResponse.code !== ResponseCode.SUCCESS) {
                return {
                    code: getUserStatsResponse.code,
                };
            } else if (!getUserStatsResponse.userStats) {
                return {
                    code: ResponseCode.USER_STATS_NOT_EXIST,
                };
            }

            const targetRating = getUserStatsResponse.userStats.eloRating;

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
                    location: Location.WaitingRoom,
                    waitingRoomId: waitingRoom.id,
                    matchmakingTicketId: matchmakingTicket.id
                };

                const updateUserLocationDto: UpdateUserLocationDto = {
                    userLocations: [{
                        userId: requestMatchmakingDto.userId,
                        location: Location.WaitingRoom,
                        locationDetail: waitingRoomLocationDetail
                    }]
                };

                await this.userLocationService.updateUserLocation(updateUserLocationDto);

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
                        location: Location.None,
                        locationDetail: {
                            location: Location.None,
                        }
                    }]
                };

                await this.userLocationService.updateUserLocation(updateUserLocationDto);

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
                    code: ResponseCode.USER_NOT_EXIST,
                };
            }

            const userLocationDto = await this.userLocationService.getOrCreateUserLocationById(matchmakingTicket.creator);
            const userLocation = userLocationDto.userLocation;
            if (!userLocation) {
                return {
                    code: ResponseCode.USER_LOCATION_NOT_EXIST
                };
            }

            //  check state (if already in game or inWaiting)
            switch (+userLocation.location) {
                case Location.None:
                    return {
                        code: ResponseCode.NOT_MATCH_MAKING_STATE
                    };
                case Location.GameRoom:
                    return {
                        code: ResponseCode.ALREADY_IN_GAME
                    };
            }

            const waitingRoomLocationDetail = userLocation.locationDetail as WaitingRoomLocationDetail;

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
                    location: Location.None,
                    locationDetail: {
                        location: Location.None,
                    }
                }]
            };

            await this.userLocationService.updateUserLocation(updateUserLocationDto);

            return {
                code: ResponseCode.SUCCESS
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private async validateToMatchmaking(userId: string): Promise<boolean> {
        try {
            const userLocationDto = await this.userLocationService.getOrCreateUserLocationById(userId);
            const userLocation = userLocationDto.userLocation;
            if (!userLocation) {
                return false;
            }

            switch (+userLocation.location) {
                case Location.WaitingRoom:
                case Location.GameRoom:
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
