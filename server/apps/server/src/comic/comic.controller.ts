import { Controller, Post, Body, Query, Get, Inject, UseGuards, Request } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ComicSearchDto } from "./comic.dto";
import { ComicService } from "./comic.service";
import { JwtAuthBearerGuard } from "../auth/JwtAuthBearerGuard";

@Controller("comic")
@ApiTags("漫画接口")
export class ComicController {
	constructor(@Inject(ComicService) private readonly comicService: ComicService) {}

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
		return await this.comicService.parseComic(id);
	}

	@UseGuards(JwtAuthBearerGuard)
	@Get("parseseason")
	@ApiOperation({ summary: "解析一集" })
	async parseSeason(@Query("id") id: string, @Request() req) {
		return await this.comicService.parseSeason(id);
	}
}
