import { FormDataInterceptor } from './form-data.interceptor';
import { Main } from './../main';
import { ArgumentTypeEnum } from "../enum/argument-type.enum";
import { ArgumentAcceptType } from "../type/argument-accept.type";

/**
 * @class ArgumentInterceptor
 *
 * Represent every argument that can be send to the server,
 * including the http headers
 */
export class ArgumentInterceptor {

    private type: ArgumentTypeEnum = null;

    private headers: { [header: string]: string };

    private requestParams: ArgumentAcceptType;

    public constructor(params: ArgumentAcceptType) {
        if (params instanceof File || params instanceof Blob)
            throw "MockitJs lib does not support mock of files neither blob objects.";

        const isXml = this.isXml(params);
        const isValidJson = this.isValidJson(params);
        const isMockedFormData = this.isMockedFormData(params);
        const isNull = this.isNull(params);
        const isLiteral = this.isLiteral(params);

        if (!isXml && !isValidJson && !isMockedFormData && !isNull && !isLiteral)
            throw "unsupported data type given, MockitJs lib support only: string, number, boolean, xml, json and formdata";
    }

    public isXml(param: ArgumentAcceptType): boolean {
        if (param instanceof XMLDocument) {
            this.type = ArgumentTypeEnum.XML;
            return true;
        }

        return false;
    }

    public isValidJson(param: ArgumentAcceptType): boolean {
        if (param && (param.constructor === Object || param.constructor === Array)) {
            try {
                JSON.stringify(param);
                this.type = ArgumentTypeEnum.JSON;
                return true;
            } catch (e) {
                return false;
            }
        } else {
            return false;
        }
    }

    public isMockedFormData(param: ArgumentAcceptType): boolean {
        if (param instanceof FormDataInterceptor) {
            this.type = ArgumentTypeEnum.FORM;
            return true;
        }

        return false;
    }

    public isNull(param: ArgumentAcceptType): boolean {
        if (param == null) {
            this.type = ArgumentTypeEnum.NULL;
            return true;
        }

        return false;
    }

    public isLiteral(param: any): boolean {
        if (
            Object(param) instanceof String ||
            Object(param) instanceof Number ||
            Object(param) instanceof Boolean
        ) {
            this.type = ArgumentTypeEnum.NULL;
            return true;
        }

        return false;
    }

    public setRequestHeader(name: string, value: string) {
        name = String(name).toLowerCase();
        value = String(value);
        const mockitJs = Main.getInstance();

        if (mockitJs.config.ignoreRequestHeaders === true)
            return;

        for (var i = 0; i < (<Array<string>>mockitJs.config.ignoreRequestHeaders).length; i++)
            if ((<Array<string>>mockitJs.config.ignoreRequestHeaders)[i].toLowerCase() == name)
                return;

        this.headers[name] = value;
    }

    public toString(): string {
        let asString: {
            type: ArgumentTypeEnum,
            data: string | number | boolean,
            headers: { [header: string]: string }
        };
        asString = { type: this.type, data: null, headers: {} };

        switch (this.type) {
            case ArgumentTypeEnum.JSON:
                asString.data = JSON.stringify(this.requestParams);
                break;
            case ArgumentTypeEnum.FORM:
                asString.data = String(this.requestParams);
                break;
            case ArgumentTypeEnum.XML:
                asString.data = (new XMLSerializer).serializeToString(<XMLDocument>this.requestParams);
                break;
            case ArgumentTypeEnum.PRIMITIVE:
                asString.data = <string | number | boolean>this.requestParams;
                break;
        }

        asString.headers = this.headers;
        return JSON.stringify(asString);
    }
}