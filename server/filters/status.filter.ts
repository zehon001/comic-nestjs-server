import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { StatusException } from "./status.exception";

@Catch(StatusException)
export class StatusFilter implements ExceptionFilter {
	catch(exception: StatusException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		const message = exception.message;

		const status = exception instanceof StatusException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const errorResponse = {
			data: {},
			message: message,
			statusCode: status
			// url: request.originalUrl // 错误的url地址
		};
		// 设置返回的状态码、请求头、发送错误信息
		response.status(status);
		response.header("Content-Type", "application/json; charset=utf-8");
		response.send(errorResponse);
	}
}
