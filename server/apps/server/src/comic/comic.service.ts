import { Injectable, Inject } from "@nestjs/common";
import { ParserService } from "@app/parser";
import MyLogger from "utils/MyLogger";
import { ComicSearchDto } from "./comic.dto";

@Injectable()
export class ComicService {
	private logger: MyLogger;
	constructor(
		@Inject(ParserService) private readonly parserService: ParserService
	) // @Inject(ComicService) private readonly comicService: ComicService
	{
		this.logger = new MyLogger("ComicService");
	}

	async search(searchDto: ComicSearchDto) {
		return (await this.parserService.search(searchDto.content, searchDto.useParser)).map(d => {
			if (d.seasons) d.seasons = undefined;
			return d;
		});
	}

	async parseComic(id: string) {
		return await this.parserService.parseComic(id);
	}

	async parseSeason(id: string) {
		return await this.parserService.parseSeason(id);
	}
}
