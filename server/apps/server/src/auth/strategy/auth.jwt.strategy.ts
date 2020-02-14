import { Strategy, StrategyOptions, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import AppDF from "../../app.define";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(protected readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true, //永远有效
			secretOrKey: AppDF.JWT_SECRECT
		} as StrategyOptions);
	}

	async validate(id: string): Promise<any> {
		return this.authService.validateUserById(id);
	}
}
