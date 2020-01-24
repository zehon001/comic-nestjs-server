import { Controller, Logger, Get, Post, Body, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ParserService } from "@app/parser";
import MyLogger from "apps/MyLogger";
import { CrawlerSearchDto } from "./crawler.dto";

@Controller("crawler")
@ApiTags("漫画爬虫")
export class CrawlerController {
	private logger: MyLogger;
	constructor(private readonly parserService: ParserService) {
		this.logger = new MyLogger("CrawlerController");
	}

	@Post("search")
	@ApiOperation({ summary: "搜索漫画" })
	async search(@Body() searchDto: CrawlerSearchDto) {
		return await this.parserService.search(searchDto.content, searchDto.useParser);
	}

	@Get("parsecomic")
	@ApiOperation({ summary: "解析漫画" })
	async parseComic(@Query("id") id: string) {
		return await this.parserService.parseComic(id);
	}

	@Get("parseseason")
	@ApiOperation({ summary: "解析一集" })
	async parseSeason(@Query("id") id: string) {
		return await this.parserService.parseSeason(id);
	}
}
