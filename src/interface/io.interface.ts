






/**
 * Interface for classes that will save the mock data
 */
 interface IOInterface {

    /**
     * Método responsável por definir o arquivo como aberto
     * 
     * @param  {String} name
     * Nome do arquivo que será definido como aberto
     */
    declareFileOpen(filename: string, content?: string): void;

    /**
	 * @method feedOpenedFile
	 * 
	 * Alimenta o arquivo aberto com mais informações de mock
	 *
	 * @param {RequestDataInterface} requestData
	 * Parâmetros necessários para salvar uma entrada e saída no mock
	 * 
	 * @param  {String} requestData.url
	 * Url para qual a requisição http foi direcionada
	 *
	 * @param {Number} requestData.status
	 * Código que representa quando o status que o servidor respondeu
	 * a requisição enviada
	 *
	 * @param {Number} requestData.requestTime
	 * Quanto tempo a requisição demorou para ser executada
	 *
	 * @param {String} [requestData.method="GET"]
	 * Método http que a requisição foi chamada (GET, POST, PUT, DELETE, OPTIONS)
	 * 
	 * @param {String} [requestData.params="null"]
	 * Parâmetro que estão sendo enviados para o servidor
	 */
    feedOpenedFile(requestData: RequestDataInterface): void;

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
     * @param  {HttpMethodType} method
     * Método http da requisição
     * 
     * @param  {ArgumentObject} [params]
     * Dados que foram enviados para o servidor
     */
    readFile(url: string, method: HttpMethodType, param: ArgumentInterceptor): MockResponseType;

    getFile(): MockFileInterface;

    hasFile(): boolean;

    createNewFile(): MockFileInterface;

    setFileVersion(): string;

    getFileVersion(): string;

    generateFileName(): string;
}