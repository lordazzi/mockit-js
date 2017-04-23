import { ArgumentInterceptor } from './../interceptor/argument.interceptor';
import { HttpCodeEnum } from "../enum/http-code.enum";
import { HttpMethodType } from "../type/http-method.type";

export interface RequestDataInterface {
    url: string;
    status: HttpCodeEnum;
    requestTime: number;
    method: HttpMethodType;
    params: ArgumentInterceptor;
    response: string;
}