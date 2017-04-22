import { HttpCodeEnum } from "../enum/http-code.enum";
import { HttpMethodEnum } from "../enum/http-method.enum";
import { ArgumentAcceptTypes } from "../type/argument-accept.type";

export interface RequestDataInterface {
    url: string;
    status: HttpCodeEnum;
    requestTime: number;
    method: HttpMethodEnum;
    params: ArgumentAcceptTypes;
    response: string;
}