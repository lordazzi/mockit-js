/**
 * @author Ricardo Azzi Silva <ricardoazzi91@hotmail.com>
 * @version v3.0.0
 */


export namespace MockitJs {

    

    

    enum HttpCodeEnum {
        NO_CONNECTION = 0,
        ACCEPTED = 202,
        BAD_GATEWAY = 502,
        BAD_REQUEST = 400,
        CONFLICT = 409,
        CONTINUE = 100,
        CREATED = 201,
        EXPECTATION_FAILED = 417,
        FAILED_DEPENDENCY = 424,
        FORBIDDEN = 403,
        GATEWAY_TIMEOUT = 504,
        GONE = 410,
        HTTP_VERSION_NOT_SUPPORTED = 505,
        INSUFFICIENT_SPACE_ON_RESOURCE = 419,
        INSUFFICIENT_STORAGE = 507,
        INTERNAL_SERVER_ERROR = 500,
        LENGTH_REQUIRED = 411,
        LOCKED = 423,
        METHOD_FAILURE = 420,
        METHOD_NOT_ALLOWED = 405,
        MOVED_PERMANENTLY = 301,
        MOVED_TEMPORARILY = 302,
        MULTI_STATUS = 207,
        MULTIPLE_CHOICES = 300,
        NETWORK_AUTHENTICATION_REQUIRED = 511,
        NO_CONTENT = 204,
        NON_AUTHORITATIVE_INFORMATION = 203,
        NOT_ACCEPTABLE = 406,
        NOT_FOUND = 404,
        NOT_IMPLEMENTED = 501,
        NOT_MODIFIED = 304,
        OK = 200,
        PARTIAL_CONTENT = 206,
        PAYMENT_REQUIRED = 402,
        PERMANENT_REDIRECT = 308,
        PRECONDITION_FAILED = 412,
        PRECONDITION_REQUIRED = 428,
        PROCESSING = 102,
        PROXY_AUTHENTICATION_REQUIRED = 407,
        REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
        REQUEST_TIMEOUT = 408,
        REQUEST_TOO_LONG = 413,
        REQUEST_URI_TOO_LONG = 414,
        REQUESTED_RANGE_NOT_SATISFIABLE = 416,
        RESET_CONTENT = 205,
        SEE_OTHER = 303,
        SERVICE_UNAVAILABLE = 503,
        SWITCHING_PROTOCOLS = 101,
        TEMPORARY_REDIRECT = 307,
        TOO_MANY_REQUESTS = 429,
        UNAUTHORIZED = 401,
        UNPROCESSABLE_ENTITY = 422,
        UNSUPPORTED_MEDIA_TYPE = 415,
        USE_PROXY = 305
    }

    type ArgumentObjectAcceptTypes = File | Blob | XMLDocument | Object | Array<any> | string | number | boolean | String | Number | Boolean;

    enum ArgumentObjectTypeEnum {
        FILE,
        BLOB,
        XML,
        JSON,
        PRIMITIVE,
        NULL,
        FORM
    }

    enum HttpMethodEnum {
        POST = <any>'POST',
        GET = <any>'GET',
        DELETE = <any>'DELETE',
        PUT = <any>'PUT'
    }

    interface RequestData {
        url: string;
        status: HttpCodeEnum;
        requestTime: number;
        method: HttpMethodEnum;
        params: ArgumentObjectAcceptTypes;
        response: string;
    }

    interface MockFile {
        fileName: string;
        content: string;
    }

    /**
     * Interface for classes that will save the mock data
     */
    interface IO {

        /**
         * Método responsável por definir o arquivo como aberto
         * 
         * @param  {String} name
         * Nome do arquivo que será definido como aberto
         * 
         * @return {Error|Boolean}
         * Se o conteúdo do arquivo conter erros, então o objeto de
         * erro é devolvido, caso contrário se retorna false
         */
        declareFileOpen(filename: string): Error | boolean;

        feedOpenedFile(requestData: RequestData);

        /**
         * @method readFile
         * Retorna o conteúdo do arquivo se baseando na url, no método http
         * e nos parâmetros que foram enviados, se a url unida com o método
         * http não forem encontrados no mock, o método gera um warning, se
         * os parâmetros para aquela url não forem encontrados, ele irá retornar
         * os registros do primeiro indice dentro da chave formada pela url e
         * pelo método http.
         * 
         * @param  {string} url
         * Url da requisição http
         * 
         * @param  {HttpMethodEnum} method
         * Método http da requisição
         * 
         * @param  {ArgumentObject} [params]
         * Dados que foram enviados para o servidor
         * 
         * @return {string}
         * Dados de retorno da requisição que estão guardados no mock
         */
        readFile(url: string, method: HttpMethodEnum, param: ArgumentObject): string;

        getFile(): MockFile;

        createNewFile(): MockFile;

        setFileVersion(): string;

        getFileVersion(): string;
    }

    // /**
    //  * Controls the storage data 
    //  */
    // class StorageIO implements IO {
    //     public setFileContent(content: string) {

    //     }
    // }

    // class StreamIO implements IO {

    // }

    /**
     * @class MockitJs.ArgumentObject
     *
     * Represent every argument that can be send to the server,
     * including the http headers
     */
    class ArgumentObject {

        private type: ArgumentObjectTypeEnum = null;

        private headers: { [header: string]: string };

        private requestParams: ArgumentObjectAcceptTypes;

        public constructor(params: ArgumentObjectAcceptTypes) {
            if (params instanceof File || params instanceof Blob)
                throw "MockitJs lib does not support mock of files neither blob objects.";

            const isXml = this.isXml(params);
            const isValidJson = this.isValidJson(params);
            const isMockedFormData = this.isMockedFormData(params);
            const isNull = this.isNull(params);
            const isLiteral = this.isLiteral(params);

            if (!isXml && !isValidJson && !isMockedFormData && !isNull && !isLiteral)
                throw "o sistema não suporta dados diferentes dos tipos: string, number, boolean, xml, json, formdata e null";

        }

        public isXml(param: ArgumentObjectAcceptTypes): boolean {
            if (param instanceof XMLDocument) {
                this.type = ArgumentObjectTypeEnum.XML;
                return true;
            }

            return false;
        }

        public isValidJson(param: ArgumentObjectAcceptTypes): boolean {
            if (param && (param.constructor === Object || param.constructor === Array)) {
                try {
                    JSON.stringify(param);
                    this.type = ArgumentObjectTypeEnum.JSON;
                    return true;
                } catch (e) {
                    return false;
                }
            } else {
                return false;
            }
        }

        public isMockedFormData(param: ArgumentObjectAcceptTypes): boolean {
            if (param instanceof FormDataReader) {
                this.type = ArgumentObjectTypeEnum.FORM;
                return true;
            }

            return false;
        }

        public isNull(param: ArgumentObjectAcceptTypes): boolean {
            if (param == null) {
                this.type = ArgumentObjectTypeEnum.NULL;
                return true;
            }

            return false;
        }

        public isLiteral(param): boolean {
            if (
                Object(param) instanceof String ||
                Object(param) instanceof Number ||
                Object(param) instanceof Boolean
            ) {
                this.type = ArgumentObjectTypeEnum.NULL;
                return true;
            }

            return false;
        }

        public setRequestHeader(name, value) {
            name = String(name).toLowerCase();
            value = String(value);
            const mockitJs = MockitJs.getInstance();

            if (mockitJs.config.ignoreRequestHeaders === true)
                return;

            for (var i = 0; i < (<Array<string>>mockitJs.config.ignoreRequestHeaders).length; i++)
                if (mockitJs.config.ignoreRequestHeaders[i].toLowerCase() == name)
                    return;

            this.headers[name] = value;
        }

        public toString(): string {
            let asString: {
                type: ArgumentObjectTypeEnum,
                data: string | number | boolean,
                headers: { [header: string]: string }
            };
            asString = { type: this.type, data: null, headers: {} };

            switch (this.type) {
                case ArgumentObjectTypeEnum.JSON:
                    asString.data = JSON.stringify(this.requestParams);
                    break;
                case ArgumentObjectTypeEnum.FORM:
                    asString.data = String(this.requestParams);
                    break;
                case ArgumentObjectTypeEnum.XML:
                    asString.data = (new XMLSerializer).serializeToString(<XMLDocument>this.requestParams);
                    break;
                case ArgumentObjectTypeEnum.PRIMITIVE:
                    asString.data = <string | number | boolean>this.requestParams;
                    break;
            }

            asString.headers = this.headers;
            return JSON.stringify(asString);
        }
    }

    class FormDataReader {

    }

    class XMLHttpRequestSpier {

    }

    class XMLHttpRequestInterceptor {

    }
}
