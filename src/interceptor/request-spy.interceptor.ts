import { ArgumentInterceptor } from './argument.interceptor';
import { HttpReadyStateEnum } from "../enum/http-ready-state.enum";
import { MockitJs, Main } from './../main';
import { ArgumentAcceptType } from "../type/argument-accept.type";
import { HttpCodeEnum } from "../enum/http-code.enum";

export class RequestSpyInterceptor extends MockitJs.NativeRequest {

    private headers: { [header: string]: string };

    private data: ArgumentInterceptor;

    private timeWhenSend: number;

    private method: string;

    public status: HttpCodeEnum;

    public constructor() {
        super();

        this.addEventListener("readystatechange", () => {
            if (this.readyState == HttpReadyStateEnum.DONE) {

                const cacheVarName: string = Main.getInstance().config.cacheVarName;

                //	tirando o parâmetro adicional para remoção de cache
                var url = this.responseURL;
                if (cacheVarName) {
                    var reg: RegExp = new RegExp('(' + cacheVarName + '=).+(&|$)');
                    url = url.replace(reg, '');
                    url = url.replace(/[?]$/, '');
                }

                //	salvando requisição
                Main.getInstance().IO.feedOpenedFile({
                    url: url,
                    method: this.method,
                    params: String(this.data),
                    response: this.responseText,
                    status: this.status,
                    requestTime: ((new Date).getTime() - this.timeWhenSend)
                });
            }
        }, false);
    }

    /**
	 * @method send
	 * 
	 * Sobrescreve o método {@link MockitJs.XMLHttpRequest#send send}
	 * de {@link MockitJs.XMLHttpRequest XMLHttpRequest}
	 * para ler os parâmetros que são enviados para o servidor
	 *
	 * @param {String} data
	 * Dados enviados para o servidor
	 */
    public send(data: ArgumentAcceptType) {
        this.timeWhenSend = (new Date).getTime();
        this.data = new ArgumentInterceptor(data);
        for (var key in this.headers)
            this.data.setRequestHeader(key, this.headers[key]);

        return super.send(data);
    };

	/**
	 * @method setRequestHeader 
	 *
	 * Sobrescreve o método {@link MockitJs.XMLHttpRequest#setRequestHeader setRequestHeader}
	 * de {@link MockitJs.XMLHttpRequest XMLHttpRequest} para ler todos os headers
	 * que forem enviados para o servidor
	 */
    public setRequestHeader(name: string, value: string) {
        this.headers[name] = value;
        return super.setRequestHeader(name, value);
    };

    /**
     * @method open
     * 
     * Sobrescreve o método {@link MockitJs.XMLHttpRequest#send open}
     * de {@link MockitJs.XMLHttpRequest XMLHttpRequest}
     * para ler o método que a requisição irá utilizar
     */
    public open(method: string, url: string, async?: boolean, user?: string, password?: string) {
        this.method = method;
        return super.open(String(method), url, async, user, password);
    }
}