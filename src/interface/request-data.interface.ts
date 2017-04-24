



 interface RequestDataInterface {
    url: string;
    status: HttpCodeEnum;
    requestTime: number;
    method: HttpMethodType;
    params: ArgumentInterceptor;
    response: string;
}