







 class StreamIOService extends IOService implements IOInterface {
    private static instance: StreamIOService;

    public static getInstance(): StreamIOService {
        if (this.instance == null) {
            this.instance = new StreamIOService();
        }

        return this.instance;
    }

    private constructor() {
        super();
    }

    public declareFileOpen(filename: string): Error | boolean {
        return null;
    }

    public feedOpenedFile(requestData: RequestDataInterface): void {

    }

    public readFile(url: string, method: HttpMethodType, param: ArgumentInterceptor): MockResponseType {
        return null;
    }

    public hasFile(): boolean {
        return null;
    }

    public getFile(): MockFileInterface {
        return null;
    }

    public createNewFile(): MockFileInterface {
        return null;
    }

    public setFileVersion(): string {
        return null;
    }

    public getFileVersion(): string {
        return null;
    }

}