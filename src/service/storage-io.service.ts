import { Main } from './../main';
import { ValidMockFileService } from './valid-mock-file.service';
import { MockFileInterface } from './../interface/mock-file.interface';
import { ArgumentInterceptor } from './../interceptor/argument.interceptor';
import { RequestDataInterface } from './../interface/request-data.interface';
import { IOInterface } from './../interface/io.interface';
import { HttpMethodType } from "../type/http-method.type";
import { MockResponseType } from "../type/mock-response.type";
import { HttpCodeEnum } from "../enum/http-code.enum";

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

    public declareFileOpen(filename: string, content: string): void {
        const validator: ValidMockFileService = ValidMockFileService.getInstance();
        const error: Object | Error = validator.validFileContent(content);

        localStorage.mockitjs_filecontent = content;
        localStorage.mockitjs_filename = name;
    }

    public feedOpenedFile(requestData: RequestDataInterface): void {
        if (!requestData.url) { throw "Impossível registrar um mock sem a url de envio da requisição."; }
        if (!requestData.status && requestData.status !== 0) { throw "Impossível registrar um mock sem o status de resposta"; }
        if (!requestData.requestTime) { requestData.requestTime = 0; }
        if (!requestData.method) { requestData.method = 'GET'; }
        if (!requestData.params) { requestData.params = new ArgumentInterceptor(null); }
        if (!requestData.response) { requestData.response = ''; }

        //	método da requisição http sempre em uppercase
        requestData.method = <HttpMethodType>String(requestData.method).toUpperCase();

        //	local onde deveria estar o arquivo está vazio?
        //	O método clear coloca um objeto
        if (!localStorage.mockitjs_filecontent)
            this.createNewFile();

        //	lê o conteúdo do arquivo aberto
        var mock = JSON.parse(localStorage.mockitjs_filecontent);
        var content = mock.content;

        ///
        if (!content[requestData.url])
            content[requestData.url] = {};

        if (!content[requestData.url][requestData.method])
            content[requestData.url][requestData.method] = {};

        //	alterando o arquivo
        content[requestData.url][requestData.method][String(requestData.params)] = {
            status: requestData.status,
            requestTime: requestData.requestTime,
            response: requestData.response
        };

        //	salvando o arquivo
        localStorage.mockitjs_filecontent = JSON.stringify(content);
    }

    public readFile(url: string, method: HttpMethodType, param: ArgumentInterceptor): MockResponseType {
        method = <HttpMethodType>String(method).toUpperCase();
        param = param || new ArgumentInterceptor(null);

        var vazio: MockResponseType = {

            status: HttpCodeEnum.OK,

            requestTime: 0,

            response: null

        };

        var mock = JSON.parse(localStorage.mockitjs_filecontent);
        var data = mock.content;
        data = mock[url] || {};
        data = data[method] || {};

        //	verificando se existe algo dentro da url[metodo]
        if (!data) {
            console.warn(`Tentando ler informações de uma url/método que nunca foram mocados! ${url} sobre ${method}`);
            return vazio;
        }

        //	se não existir nada mocado nesta posição,
        //	então retorna o conteúdo da primeir posição
        if (!data[String(param)]) {
            for (var key in data) {
                data = data[key];
                break;
            }
        } else {
            data = data[String(param)];
        }

        //	se não encontrar nada, retorna um json vazio
        return data || vazio;
    }

    public getFile(): MockFileInterface {
        const file: MockFileInterface = {
            fileName: localStorage.mockitjs_filename,
            content: localStorage.mockitjs_filecontent
        };

        return file;
    }

    public createNewFile(): MockFileInterface {
        const main = Main.getInstance();

        var emptyFile = {

            mockerVersion: main.version,

            fileVersion: (new Date).getTime(),

            readConfigs: {

            },

            configs: {

                cacheVarName: main.config.cacheVarName,

                syncronizeApp: main.config.syncronizeApp,

                ignoreRequestHeaders: main.config.ignoreRequestHeaders

            },

            content: {

            }
        };

        localStorage.mockitjs_filename = '';
        localStorage.mockitjs_filecontent = JSON.stringify(emptyFile);

        return this.getFile();
    }

    public hasFile(): boolean {
        return (
			localStorage.mockitjs_filecontent != '{}' &&
			localStorage.mockitjs_filecontent != '' &&
			localStorage.mockitjs_filecontent != undefined
		);
    }

    public setFileVersion(): string {
        var json = JSON.parse(localStorage.mockitjs_filecontent);
		json.fileVersion = (new Date).getTime();
		localStorage.mockitjs_filecontent = JSON.stringify(json);
		return json.fileVersion;
    }

    public getFileVersion(): string {
        var json = JSON.parse(localStorage.mockitjs_filecontent);
		return String(new Date(json.fileVersion));
    }
}
