import { IOInterface } from './../interface/io.interface';

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
}