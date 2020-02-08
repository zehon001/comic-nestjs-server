import { Module } from "@nestjs/common";
import { CrawlerController } from "./crawler.controller";
import { ParserModule, ParserService } from "@app/parser";
import { BullModule } from "@nestjs/bull";

@Module({
	imports: [
		BullModule.registerQueue({
			name: "parse",
			redis: {
				host: "localhost",
				port: 6379
			}
		}),
		ParserModule
	],
	controllers: [CrawlerController],
	providers: [ParserService]
})
export class CrawlerModule {}
