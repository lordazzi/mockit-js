import { IOInterface } from './../interface/io.interface';

/**
 * Controls the storage data 
 */
export class StorageIOService implements IOInterface {

    private static instance: StorageIOService;

    public static getInstance(): StorageIOService {
        if (this.instance == null) {
            this.instance = new StorageIOService();
        }

        return this.instance;
    }

    private constructor() {

    }

    public setFileContent(content: string) {

    }
}