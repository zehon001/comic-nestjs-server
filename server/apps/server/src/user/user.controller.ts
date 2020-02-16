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
		return await this.userService.findUser(req.user._id);
	}

	@UseGuards(AuthGuard("jwt"))
	@Get("cancelstarcomic")
	@ApiOperation({ summary: "取消收藏漫画" })
	@ApiBearerAuth()
	async cancelStarComic(@Query("id") id: string, @Request() req) {
		await this.userService.cancelStarComic(req.user, id);
		return await this.userService.findUser(req.user._id);
	}

	@UseGuards(AuthGuard("jwt"))
	@Get("seasonhistory")
	@ApiOperation({ summary: "查询漫画历史记录" })
	@ApiBearerAuth()
	async seasonHistory(@Request() req) {
		return await this.userService.getSeasonHistory(req.user);
	}

	@UseGuards(AuthGuard("jwt"))
	@Get("stars")
	@ApiOperation({ summary: "查询漫画收藏列表" })
	@ApiBearerAuth()
	async stars(@Request() req) {
		return await this.userService.getStars(req.user);
	}
}
