import { Controller, Post, Body, Inject, Request, UseGuards, Get } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthRegisterDto, AuthLoginDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
// import { JwtAuthBearerGuard } from "./JwtAuthBearerGuard";

@Controller("auth")
@ApiTags("授权接口")
export class AuthController {
	constructor(
		@Inject(JwtService) private readonly jwtService: JwtService,
		@Inject(AuthService) private readonly authService: AuthService
	) {}
	@Post("register")
	async register(@Body() registerDto: AuthRegisterDto) {
		return await this.authService.register(registerDto);
	}

	@UseGuards(AuthGuard("local"))
	@Post("login")
	async login(@Body() loginDto: AuthLoginDto, @Request() req) {
		return {
			accessToken: this.jwtService.sign(String(req.user._id))
		};
	}
}
