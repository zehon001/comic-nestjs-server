import { Controller, Logger, Get, Post, Body, Param, Query, UseFilters, UseInterceptors } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ParserService } from "@app/parser";
import MyLogger from "utils/MyLogger";
import { CrawlerSearchDto } from "./crawler.dto";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Controller("crawler")
@ApiTags("漫画爬虫测试")
export class CrawlerController {
	private logger: MyLogger;
	constructor(private readonly parserService: ParserService, @InjectQueue("parse") private readonly queue: Queue) {
		this.logger = new MyLogger("CrawlerController");
	}

	// @UseFilters(StatusFilter)
	// @UseInterceptors(StatusInterceptor)
	@Post("search")
	@ApiOperation({ summary: "搜索漫画" })
	async search(@Body() searchDto: CrawlerSearchDto) {
		return (await this.parserService.search(searchDto.content, searchDto.useParser)).map(d => {
			if (d.seasons) d.seasons = undefined;
			return d;
		});
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
