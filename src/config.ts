export namespace MockitJs {
    export class Config {
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
        public ignoreRequestHeaders: Array<string> | Boolean = [
            'Accept-Encoding', 'Accept-Language',
            'Host', 'Referer', 'User-Agent'
        ];
    }
}