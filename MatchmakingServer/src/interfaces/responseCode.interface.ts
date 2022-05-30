
export class ResponseCode {
    
    public static readonly SUCCESS = 0;

    //#region Match
    public static readonly INVALID_TO_MATCHMAKING = 10000;
    public static readonly ALREADY_IN_GAME = 10001;
    //#endregion

    //#region User
    public static readonly USER_NOT_EXIST = 30000;
    //#endregion

    public static readonly UNKNOWN_ERROR = 5000000;
}
