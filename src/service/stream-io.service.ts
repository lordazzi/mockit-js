import { MockFileInterface } from './../interface/mock-file.interface';
import { ArgumentInterceptor } from './../interceptor/argument.interceptor';
import { RequestDataInterface } from './../interface/request-data.interface';
import { IOInterface } from './../interface/io.interface';
import { HttpMethodType } from "../type/http-method.type";
import { MockResponseType } from "../type/mock-response.type";

export class StreamIOService implements IOInterface {
    private static instance: StreamIOService;

    public static getInstance(): StreamIOService {
        if (this.instance == null) {
            this.instance = new StreamIOService();
        }

        return this.instance;
    }

    private constructor() {

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