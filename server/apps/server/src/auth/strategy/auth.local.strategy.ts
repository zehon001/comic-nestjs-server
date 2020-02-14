import { Strategy, IStrategyOptions } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: "username",
			passwordField: "password"
		} as IStrategyOptions);
	}

	async validate(username: string, password: string): Promise<any> {
		return await this.authService.validateUser(username, password);
	}
}
