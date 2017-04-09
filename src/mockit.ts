declare namespace window {
    export class XMLHttpRequest { }
    export class FormData { }
}

export namespace MockitJs {

    /**
     * Backup of the original xhr prototype and formdata original
     */
    const XMLHttpRequest = window.XMLHttpRequest;
    const FormData = window.FormData;

    /**
     * @author Ricardo Azzi Silva <ricardoazzi91@hotmail.com>
     * @version  v3.0.0
     * @class MockitJs
     *
     * The lib main class
     */
    export class MockitJs {
        private static instance;

        public static getInstance() {
            if (!this.instance) {
                this.instance = new MockitJs();
            }

            return this.instance;
        }

        private constructor() {

        }
    }

    /**
     * Interface for classes that will save the mock data
     */
    interface IO {

    }

    /**
     * Controls the storage data 
     */
    class StorageIO implements IO {

    }

    class StreamIO implements IO {

    }

    enum ArgumentObjectType {
        
    }

    /**
     * @class MockitJs.ArgumentObject
     *
     * Represent every argument that can be send to the server,
     * including the http headers
     */
    class ArgumentObject {

        private type: ArgumentObjectType = null;

        public constructor(params: File | Blob | XMLDocument | Object | Array<any> | string | number | boolean | String | Number | Boolean) {
            if (params instanceof File || params instanceof Blob)
                throw "MockitJs lib does not support mock of files neither blob objects.";

            // isXml = me.isXml(params);
            // isValidJson = me.isValidJson(params);
            // isMockedFormData = me.isMockedFormData(params);
            // isNull = me.isNull(params);
            // isLiteral = me.isLiteral(params);

            // if (!isXml && !isValidJson && !isMockedFormData && !isNull && !isLiteral)
            //     throw "o sistema não suporta dados diferentes dos tipos: string, number, boolean, xml, json, formdata e null";

        }

        public isXml(): boolean {

        }

        public isValidJson(): boolean {

        }

        public isMockedFormData(): boolean {

        }

        public isNull(): boolean {

        }

        public isLiteral(): boolean {

        }

        public setRequestHeader() {

        }

        public toString(): string {

        }
    }

    class FormDataReader {

    }

    class XMLHttpRequestSpier {

    }

    class XMLHttpRequestInterceptor {

    }
}
