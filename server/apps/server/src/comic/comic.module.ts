import { Module } from "@nestjs/common";
import { ComicController } from "./comic.controller";
import { ComicService } from "./comic.service";
import { ParserService, ParserModule } from "@app/parser";
import { UserService } from "../user/user.service";

@Module({
	imports: [ParserModule],
	controllers: [ComicController],
	providers: [ParserService, ComicService, UserService]
})
export class ComicModule {}
