import { Module, Global } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/auth.jwt.strategy";
import { LocalStrategy } from "./strategy/auth.local.strategy";
import AppDF from "../app.define";

@Global()
@Module({
	imports: [
		JwtModule.register({
			secret: AppDF.JWT_SECRECT
		})
	],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	controllers: [AuthController],
	exports: [JwtModule, AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
