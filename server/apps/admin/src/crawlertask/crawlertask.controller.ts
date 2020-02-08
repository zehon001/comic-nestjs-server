import { Controller, Inject, Get, Query, Post, Delete, Put, Param, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CrawlertaskService } from "./crawlertask.service";
import { CrawtaskCreateDto, CrawtaskModifyDto, CrawtaskFindQuery } from "./crawlertask.dto";
import AppDF from "../app.define";

@Controller("crawlertask")
@ApiTags("爬虫任务列表")
export class CrawlertaskController {
	constructor(@Inject(CrawlertaskService) private readonly crawlertaskService: CrawlertaskService) {
		// console.log(this.crawlertaskService);
	}
	@Get("option")
	option() {
		return AppDF.WebOption.crawlertask_list;
	}
	@Get("retry/:id")
	@ApiOperation({ summary: "重试任务" })
	async retry(@Param("id") id: string) {
		return await this.crawlertaskService.retry(id);
	}

	@Post()
	@ApiOperation({ summary: "增加任务" })
	async create(@Body() data: CrawtaskCreateDto) {
		return await this.crawlertaskService.create(data);
	}
	@Delete(":id")
	@ApiOperation({ summary: "删除任务" })
	async remove(@Param("id") id: string) {
		// console.log(id);
		return await this.crawlertaskService.remove(id);
	}

	@Put(":id")
	@ApiOperation({ summary: "修改任务" })
	async modify(@Param("id") id: string, @Body() data: CrawtaskModifyDto) {
		return await this.crawlertaskService.modify(id, data);
	}
	@Get(":id")
	@ApiOperation({ summary: "查询任务" })
	async findOne(@Param("id") id: string) {
		return await this.crawlertaskService.findOne(id);
	}

	@Get()
	@ApiOperation({ summary: "查询所有任务" })
	async find(@Query() query: CrawtaskFindQuery) {
		// console.log(query);
		return await this.crawlertaskService.find(query.page, query.limit);
	}
}
