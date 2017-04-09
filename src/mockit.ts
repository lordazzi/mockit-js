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

        public static getInstance(config?: Config) {
            if (!this.instance) {
                this.instance = new MockitJs(config);
            }

            return this.instance;
        }

        private constructor(config?: Config) {

        }
    }

    export abstract class Config {
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

    type ArgumentObjectAcceptTypes = File | Blob | XMLDocument | Object | Array<any> | string | number | boolean | String | Number | Boolean;

    enum ArgumentObjectType {
        FILE,
        BLOB,
        XML,
        JSON,
        PRIMITIVE,
        NULL
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
