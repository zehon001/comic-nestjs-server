import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { Http2ServerRequest } from "http2";

@Injectable()
export class JwtAuthBearerGuard extends AuthGuard("jwt") {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest() as Http2ServerRequest;
		//允许空
		if (!request.headers.authorization) return true;
		else return super.canActivate(context);
	}
}
