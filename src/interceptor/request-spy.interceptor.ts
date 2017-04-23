import { HttpReadyStateEnum } from "../enum/http-ready-state.enum";
import { MockitJs, Main } from './../main';

export class RequestSpyInterceptor extends MockitJs.NativeRequest {
    
    private headers: { [header: string]: string };

    private data: any;

    private timeWhenSend: number;

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
                MockitJs.IO.feedOpenedFile({
                    url: url,
                    method: me.method,
                    params: String(data),
                    response: me.responseText,
                    status: me.status,
                    requestTime: ((new Date).getTime() - timeWhenSend)
                });
            }
        }, false);
    }
}