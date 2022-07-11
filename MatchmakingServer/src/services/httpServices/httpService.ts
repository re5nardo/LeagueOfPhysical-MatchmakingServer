
class HttpService {

    protected host: string;
    protected port: number;

    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }
}

export default HttpService;
