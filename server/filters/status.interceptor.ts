import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { StatusException } from "./status.exception";

@Injectable()
export class StatusInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data: any) => {
				return {
					data,
					code: 0,
					message: "请求成功"
				};
			})
		);
	}
}
