 class ValidMockFileService {
    private static instance: ValidMockFileService;

    public static getInstance(): ValidMockFileService {
        if (this.instance == null) {
            this.instance = new ValidMockFileService();
        }

        return this.instance;
    }

    private constructor() {

    }

    public validFileContent(content: string): Object {
        try {
            JSON.parse(content);
        } catch (e) {
            return e;
        }
    }
}