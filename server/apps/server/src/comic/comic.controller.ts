import { Controller, Post, Body, Query, Get, Inject, UseGuards, Request } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ComicSearchDto } from "./comic.dto";
import { ComicService } from "./comic.service";
import { JwtAuthBearerGuard } from "../auth/JwtAuthBearerGuard";
import { UserService } from "../user/user.service";

@Controller("comic")
@ApiTags("漫画接口")
export class ComicController {
	constructor(
		@Inject(ComicService) private readonly comicService: ComicService,
		@Inject(UserService) private readonly userService: UserService
	) {}

	@UseGuards(JwtAuthBearerGuard)
	@Get("parsernames")
	@ApiOperation({ summary: "获取解析器名称" })
	@ApiBearerAuth()
	async parserNames() {
		const ret = await this.comicService.getParserNames();
		return ret;
	}

	@UseGuards(JwtAuthBearerGuard)
	@Post("search")
	@ApiOperation({ summary: "搜索漫画" })
	@ApiBearerAuth()
	async search(@Body() searchDto: ComicSearchDto, @Request() req) {
		// if (req.user) console.log("存在用户", req.user);
		return await this.comicService.search(searchDto);
	}

	@UseGuards(JwtAuthBearerGuard)
	@Get("parsecomic")
	@ApiOperation({ summary: "解析漫画" })
	@ApiBearerAuth()
	async parseComic(@Query("id") id: string, @Request() req) {
		const ret = await this.comicService.parseComic(id);
		ret["user"] = req.user; //带上用户信息 保持历史记录和收藏最新
		return ret;
	}

	@UseGuards(JwtAuthBearerGuard)
	@Get("parseseason")
	@ApiOperation({ summary: "解析一集" })
	@ApiBearerAuth()
	async parseSeason(@Query("id") id: string, @Request() req) {
		const ret = await this.comicService.parseSeason(id);
		if (!ret.err) await this.userService.historySeason(req.user, id);
		// ret["user"] = req.user;
		return ret;
	}
}
