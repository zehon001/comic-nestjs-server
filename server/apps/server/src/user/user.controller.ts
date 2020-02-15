import { Controller, Inject, UseGuards, Get, Query, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation, ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("user")
@ApiTags("用户")
export class UserController {
	constructor(@Inject(UserService) private readonly userService: UserService) {}

	//必须登录
	@UseGuards(AuthGuard("jwt"))
	@Get("starcomic")
	@ApiOperation({ summary: "收藏漫画" })
	@ApiBearerAuth()
	async starComic(@Query("id") id: string, @Request() req) {
		await this.userService.starComic(req.user, id);
		return req.user && (await this.userService.findUser(req.user._id));
	}

	@UseGuards(AuthGuard("jwt"))
	@Get("cancelstarcomic")
	@ApiOperation({ summary: "取消收藏漫画" })
	@ApiBearerAuth()
	async cancelStarComic(@Query("id") id: string, @Request() req) {
		await this.userService.cancelStarComic(req.user, id);
		return req.user && (await this.userService.findUser(req.user._id));
	}
}
