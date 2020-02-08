import { Module } from "@nestjs/common";
import { CrawlertaskController } from "./crawlertask.controller";
import { ParserService, ParserModule } from "@app/parser";

import { BullModule } from "@nestjs/bull";
import { CrawlertaskService } from "./crawlertask.service";
import AppDF from "../app.define";

@Module({
	imports: [
		BullModule.registerQueue({
			name: AppDF.PARSE_QUEUE,
			redis: {
				host: "localhost",
				port: 6379
			},
			defaultJobOptions: {
				timeout: 1800000
			}
		}),
		ParserModule
	],
	controllers: [CrawlertaskController],
	providers: [ParserService, CrawlertaskService]
})
export class CrawlertaskModule {
	constructor() {}
}
