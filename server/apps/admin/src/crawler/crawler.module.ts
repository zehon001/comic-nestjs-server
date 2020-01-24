import { Module } from "@nestjs/common";
import { CrawlerController } from "./crawler.controller";
import { ParserModule, ParserService } from "@app/parser";

@Module({
	imports: [ParserModule],
	controllers: [CrawlerController],
	providers: [ParserService]
})
export class CrawlerModule {}
