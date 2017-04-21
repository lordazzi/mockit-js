/**
 * @author Ricardo Azzi Silva <ricardoazzi91@hotmail.com>
 * @version v3.0.0
 */
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

    export class MockitJs {
        private static instance: MockitJs;

        public static getInstance(config?: Config) {
            if (!this.instance) {
                this.instance = new MockitJs(config);
            }

            return this.instance;
        }

        private constructor(public config?: Config) {
            if (this.config == null) {
                this.config = new Config();
            }
        }
    }

    class Config {
        /**
         * @property {String} cacheVarName
         *
         * Algumas aplicações enviam um parâmetro para requisições http
         * para quebrar cache de arquivo, isso atrapalha o MockitJs (:
         *
         * Se sua aplicação fizer isso, você precisa definir nesta
         * propriedade o nome do parâmetro get de remoção de cache
         */
        public cacheVarName = '_';

        /**
         * @property {Boolean} syncronizeApp
         *
         * Força toda a aplicação trabalhar de forma sincrona (pelo menos
         * ao que se refere a requisições http)
         */
        public syncronizeApp = false;

        /**
         * @property {Boolean} turnAllRequestTimesIntoZero
         *
         * Semelhante ao {#syncronizeApp} mas não deixa as requisições sincronas,
         * mas deixa elas com um tempo muito próximo a 0 milisegundos, para evitar
         * ficar esperando o tempo de cada requisição quando os testes unitários
         * forem executados
         */
        public turnAllRequestTimesIntoZero = false;

        /**
         * @property {String[]|Boolean} ignoreRequestHeaders
         *
         * Conjunto de nomes de headers de requisição que não devem ser
         * interpretados pela ferramenta de mock como um parâmetro enviado
         * para o servidor.
         *
         * Se o valor estiver com 'true' atribuido ele ignora todos os headers
         */
        public ignoreRequestHeaders: Array<string> = [
            'Accept-Encoding', 'Accept-Language',
            'Host', 'Referer', 'User-Agent'
        ];
    }

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

    enum ArgumentObjectType {
        FILE,
        BLOB,
        XML,
        JSON,
        PRIMITIVE,
        NULL
    }

    enum HttpMethodEnum {
        POST = <any> 'POST',
        GET = <any> 'GET',
        DELETE = <any> 'DELETE',
        PUT = <any> 'PUT'
    }

    interface RequestData {
        url: string;
        status: HttpCodeEnum;
        requestTime: number;
        method: HttpMethodEnum;
        params: ArgumentObjectAcceptTypes;
        response: string;
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
         * @param  {String} content
         * Conteúdo do arquivo
         * 
         * @return {Error|Boolean}
         * Se o conteúdo do arquivo conter erros, então o objeto de
         * erro é devolvido, caso contrário se retorna false
         */
        declareFileOpen(filename: string): Error | boolean;

        feedOpenedFile();
    }

    /**
     * Controls the storage data 
     */
    class StorageIO implements IO {
        public setFileContent(content: string) {

        }
    }

    class StreamIO implements IO {

    }

    /**
     * @class MockitJs.ArgumentObject
     *
     * Represent every argument that can be send to the server,
     * including the http headers
     */
    class ArgumentObject {

        private type: ArgumentObjectType = null;

        public constructor(params: ArgumentObjectAcceptTypes) {
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

        public isXml(param: ArgumentObjectAcceptTypes): boolean {
            return param instanceof XMLDocument;
        }

        public isValidJson(param: ArgumentObjectAcceptTypes): boolean {
            if (param && (param.constructor === Object || param.constructor === Array)) {
                try {
                    JSON.stringify(param);
                    return true;
                } catch (e) {
                    return false;
                }
            } else {
                return false;
            }
        }

        public isMockedFormData(param: ArgumentObjectAcceptTypes): boolean {
            return param instanceof FormDataReader;
        }

        public isNull(param: ArgumentObjectAcceptTypes): boolean {
            return (param == null);
        }

        public isLiteral(param): boolean {
            return (
                Object(param) instanceof String ||
                Object(param) instanceof Number ||
                Object(param) instanceof Boolean
            );
        }

        public setRequestHeader(name, value) {
            name = String(name).toLowerCase();
            value = String(value);

            if (MockitJs.ignoreRequestHeaders === true)
                return;

            for (var i = 0; i < MockitJs.ignoreRequestHeaders.length; i++)
                if (MockitJs.ignoreRequestHeaders[i].toLowerCase() == name)
                    return;

            headers[name] = value;
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
