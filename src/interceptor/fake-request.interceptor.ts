






 class FakeRequestInterceptor extends MockitJs.NativeRequest {
    private async = true;
    private method: HttpMethodType = 'GET';
    private headers: { [header: string]: string } = {};
    private events: { [event: string]: Array<EventListenerOrEventListenerObject> } = {};

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
    public responseXML: Document = null;
    public responseURL: string = '';
    public withCredentials = false;
    public timeout = 0;
    public upload: XMLHttpRequestUpload = null;

    public response = '';
    public responseText = '';

    public set onabort(value: HttpEventFunctionType) {
        this.addEventListener('abort', value);
    }

    public get onabort(): HttpEventFunctionType {
        return () => {
            this.fireEvent('abort', [this]);
        };
    }

    public set onerror(value: HttpEventFunctionType) {
        this.addEventListener('error', value);
    }

    public get onerror(): HttpEventFunctionType {
        return () => {
            this.fireEvent('error', [this]);
        };
    }

    public set onload(value: HttpEventFunctionType) {
        this.addEventListener('load', value);
    }

    public get onload(): HttpEventFunctionType {
        return () => {
            this.fireEvent('load', [this]);
        };
    }

    public set onloadend(value: HttpEventFunctionType) {
        this.addEventListener('loadend', value);
    }

    public get onloadend(): HttpEventFunctionType {
        return () => {
            this.fireEvent('loadend', [this]);
        };
    }

    public set onloadstart(value: HttpEventFunctionType) {
        this.addEventListener('loadstart', value);
    }

    public get onloadstart(): HttpEventFunctionType {
        return () => {
            this.fireEvent('loadstart', [this]);
        };
    }

    public set onprogress(value: HttpEventFunctionType) {
        this.addEventListener('progress', value);
    }

    public get onprogress(): HttpEventFunctionType {
        return () => {
            this.fireEvent('progress', [this]);
        };
    }

    public set ontimeout(value: HttpEventFunctionType) {
        this.addEventListener('timeout', value);
    }

    public get ontimeout(): HttpEventFunctionType {
        return () => {
            this.fireEvent('timeout', [this]);
        };
    }

    public set onreadystatechange(value: HttpEventFunctionType) {
        this.addEventListener('readystatechange', value);
    }

    public get onreadystatechange() {
        return () => {
            this.fireEvent('readystatechange', [this]);
        };
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
                    (<Function> callable)(); // TODO: garantir o funcionamento natural
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

    public open(method: HttpMethodType, url: string, async?: boolean, user?: string, password?: string) {
        this.async = async;
        this.method = method;
        this.responseURL = url;
    };

    public addEventListener(eventName: string, call: EventListenerOrEventListenerObject, useCapture?: boolean) {
        if (!this.events[eventName])
            this.events[eventName] = [];

        this.events[eventName].push(call);
    };

    public send(params: ArgumentAcceptType) {
        const main = Main.getInstance();
        var data = main.IO.readFile(this.responseURL, this.method, new ArgumentInterceptor(params));

        const sending = () => {
            if (!main.isNetworkConnectable()) {
                this.readyState = HttpReadyStateEnum.DONE;
                this.status = HttpCodeEnum.NO_CONNECTION;
                this.response = "";
                this.responseText = "";
            } else {
                this.response = data.response;
                this.responseText = data.response;
                this.readyState = HttpReadyStateEnum.DONE;
                this.status = data.status;
            }

            var mainResponseCode = Math.floor(this.status / 100);
            if (this.status === 0 || mainResponseCode === 4 || mainResponseCode === 5)
                (<Function>this.onerror)();

            (<Function>this.onreadystatechange)();
        };

        // tratar de forma adequada o objeto de argumentos
        if (this.async || main.config.syncronizeApp) {
            sending();
        } else if (main.config.turnAllRequestTimesIntoZero) {
            setTimeout(() => {
                sending();
            }, 0);
        } else {
            setTimeout(() => {
                sending();
            }, data.requestTime);
        }
    };
}