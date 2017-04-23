import { MockitJs, Main } from './../main';
import { HttpReadyStateEnum } from "../enum/http-ready-state.enum";
import { HttpCodeEnum } from "../enum/http-code.enum";

export class FakeRequestInterceptor extends MockitJs.NativeRequest {
    private async = true;
    private method = 'GET';
    private headers: { [header: string]: string } = {};
    private events: { [event: string]: Array<Function> } = {};

    public DONE = 4;
    public LOADING = 3;
    public HEADERS_RECEIVED = 2;
    public OPENED = 1;
    public UNSENT = 0;

    public readyState: HttpReadyStateEnum = HttpReadyStateEnum.UNSENT;
    public status: HttpCodeEnum = HttpCodeEnum.NO_CONNECTION;

    private settedMimeType: string = 'text/plain';
    public responseType: string = '';
    public statusText: string = '';
    public responseXML: string = '';
    public responseURL: string = '';
    public withCredentials = false;
    public timeout = 0;

    public response = '';
    public responseText = '';

    public set onabort(value: Function) {
        this.addEventListener('abort', value);
    }

    public get onabort(): Function {
        return () => {
            this.fireEvent('abort', [this]);
        };
    }

    public set onerror(value: Function) {
        this.addEventListener('error', value);
    }

    public get onerror(): Function {
        return () => {
            this.fireEvent('error', [this]);
        };
    }

    public set onload(value: Function) {
        this.addEventListener('load', value);
    }

    public get onload(): Function {
        return () => {
            this.fireEvent('load', [this]);
        };
    }

    public set onloadend(value: Function) {
        this.addEventListener('loadend', value);
    }

    public get onloadend(): Function {
        return () => {
            this.fireEvent('loadend', [this]);
        };
    }

    public set onloadstart(value: Function) {
        this.addEventListener('loadstart', value);
    }

    public get onloadstart(): Function {
        return () => {
            this.fireEvent('loadstart', [this]);
        };
    }

    public set onprogress(value: Function) {
        this.addEventListener('progress', value);
    }

    public get onprogress(): Function {
        return () => {
            this.fireEvent('progress', [this]);
        };
    }

    public set ontimeout(value: Function) {
        this.addEventListener('timeout', value);
    }

    public get ontimeout(): Function {
        return () => {
            this.fireEvent('timeout', [this]);
        };
    }

    public set onreadystatechange(value: Function) {
        this.addEventListener('readystatechange', value);
    }

    public get onreadystatechange() {
        return () => {
            this.fireEvent('readystatechange', [this]);
        };
    }

    public set upload(value: Function) {
        this.addEventListener('readystatechange', value);
    }

    //  TODO: abortar requisição
    public abort() {

    }

    public overrideMimeType(mime: string) {
        this.settedMimeType = mime;
    }

    private fireEvent(eventName: string, args: Array<any>): void {
        if (this.events[eventName] instanceof Array) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                var callable = this.events[eventName][i];
                if (Object(callable) instanceof Function)
                    callable();
            }
        }
    };

    public setRequestHeader(header: string, value: string) {
        this.headers[header] = value;
        return value;
    };

    public getAllResponseHeaders(): string {
        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = this.settedMimeType;
        }

        var str = '';
        for (var head in this.headers) {
            str += head + ':' + this.headers[head] + ';\n';
        }

        return str;
    };

    public getResponseHeader(header: string): string {
        return this.headers[header] || '';
    };

    public open(method: string, url: string, async?: boolean, user?: string, password?: string) {
        this.async = async;
        this.method = method;
        this.responseURL = url;
    };

    public addEventListener(eventName: string, call: Function) {
        if (!this.events[eventName])
            this.events[eventName] = [];

        this.events[eventName].push(call);
    };

    public send(params) {
        var me = this;

        var sending() {
            if (!Main.getInstance().isNetworkConnectable()) {
                me.readyState = HttpReadyStateEnum.DONE;
                me.status = HttpCodeEnum.NO_CONNECTION;
                me.response = "";
                me.responseText = "";
            } else {
                me.response = data.response;
                me.responseText = data.response;
                me.readyState = HttpReadyStateEnum.DONE;
                me.status = data.status;
            }

            var mainResponseCode = Math.floor(me.status / 100);
            if (me.status === 0 || mainResponseCode === 4 || mainResponseCode === 5)
                me.onerror();

            me.onreadystatechange(me);
        };

        var data = MockitJs.IO.readFile(me.responseURL, method, new MockitJs.ArgumentObject(params));

        // tratar de forma adequada o objeto de argumentos
        if (async || MockitJs.syncronizeApp) {
            sending();
        } else if (MockitJs.turnAllRequestTimesIntoZero) {
            setTimeout(function () {
                sending();
            }, 0);
        } else {
            setTimeout(function () {
                sending();
            }, data.requestTime);
        }
    };
}