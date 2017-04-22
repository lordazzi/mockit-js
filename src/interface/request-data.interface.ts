import { HttpCodeEnum } from "../enum/http-code.enum";
import { HttpMethodEnum } from "../enum/http-method.enum";
import { ArgumentObjectAcceptTypes } from "../type/argument-object-accept.type";

export interface RequestDataInterface {
    url: string;
    status: HttpCodeEnum;
    requestTime: number;
    method: HttpMethodEnum;
    params: ArgumentObjectAcceptTypes;
    response: string;
}