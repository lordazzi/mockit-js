import { Main } from './../main';
import { ArgumentObjectTypeEnum } from "../enum/argument-object-type.enum";
import { ArgumentObjectAcceptTypes } from "../type/argument-object-accept.type";

/**
 * @class ArgumentInterceptor
 *
 * Represent every argument that can be send to the server,
 * including the http headers
 */
export class ArgumentInterceptor {

    private type: ArgumentObjectTypeEnum = null;

    private headers: { [header: string]: string };

    private requestParams: ArgumentObjectAcceptTypes;

    public constructor(params: ArgumentObjectAcceptTypes) {
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

    public isXml(param: ArgumentObjectAcceptTypes): boolean {
        if (param instanceof XMLDocument) {
            this.type = ArgumentObjectTypeEnum.XML;
            return true;
        }

        return false;
    }

    public isValidJson(param: ArgumentObjectAcceptTypes): boolean {
        if (param && (param.constructor === Object || param.constructor === Array)) {
            try {
                JSON.stringify(param);
                this.type = ArgumentObjectTypeEnum.JSON;
                return true;
            } catch (e) {
                return false;
            }
        } else {
            return false;
        }
    }

    public isMockedFormData(param: ArgumentObjectAcceptTypes): boolean {
        if (param instanceof FormDataInterceptor) {
            this.type = ArgumentObjectTypeEnum.FORM;
            return true;
        }

        return false;
    }

    public isNull(param: ArgumentObjectAcceptTypes): boolean {
        if (param == null) {
            this.type = ArgumentObjectTypeEnum.NULL;
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
            this.type = ArgumentObjectTypeEnum.NULL;
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
            type: ArgumentObjectTypeEnum,
            data: string | number | boolean,
            headers: { [header: string]: string }
        };
        asString = { type: this.type, data: null, headers: {} };

        switch (this.type) {
            case ArgumentObjectTypeEnum.JSON:
                asString.data = JSON.stringify(this.requestParams);
                break;
            case ArgumentObjectTypeEnum.FORM:
                asString.data = String(this.requestParams);
                break;
            case ArgumentObjectTypeEnum.XML:
                asString.data = (new XMLSerializer).serializeToString(<XMLDocument>this.requestParams);
                break;
            case ArgumentObjectTypeEnum.PRIMITIVE:
                asString.data = <string | number | boolean>this.requestParams;
                break;
        }

        asString.headers = this.headers;
        return JSON.stringify(asString);
    }
}