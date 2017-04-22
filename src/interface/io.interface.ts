import { MockFileInterface } from './mock-file.interface';
import { HttpMethodEnum } from "../enum/http-method.enum";
/**
 * Interface for classes that will save the mock data
 */
export interface IOInterface {

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

    getFile(): MockFileInterface;

    createNewFile(): MockFileInterface;

    setFileVersion(): string;

    getFileVersion(): string;
}