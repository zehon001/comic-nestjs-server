import { Controller, Post, Body, Query, Get, Inject } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ComicSearchDto } from "./comic.dto";
import { ComicService } from "./comic.service";

@Controller("comic")
@ApiTags("漫画接口")
export class ComicController {
	constructor(@Inject(ComicService) private readonly comicService: ComicService) {}
	@Post("search")
	@ApiOperation({ summary: "搜索漫画" })
	async search(@Body() searchDto: ComicSearchDto) {
		return await this.comicService.search(searchDto);
	}
	@Get("parsecomic")
	@ApiOperation({ summary: "解析漫画" })
	async parseComic(@Query("id") id: string) {
		return await this.comicService.parseComic(id);
	}
	@Get("parseseason")
	@ApiOperation({ summary: "解析一集" })
	async parseSeason(@Query("id") id: string) {
		return await this.comicService.parseSeason(id);
	}
}
