import { Module } from "@nestjs/common";
import { ComicController } from "./comic.controller";
import { ComicService } from "./comic.service";
import { ParserService, ParserModule } from "@app/parser";

@Module({
	imports: [ParserModule],
	controllers: [ComicController],
	providers: [ParserService, ComicService]
})
export class ComicModule {}
