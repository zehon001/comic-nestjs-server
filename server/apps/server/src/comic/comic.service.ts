import { Injectable, Inject } from "@nestjs/common";
import { ParserService } from "@app/parser";
import MyLogger from "utils/MyLogger";
import { ComicSearchDto } from "./comic.dto";
import { InjectModel } from "nestjs-typegoose";
import { Season } from "@lib/db/models/season.model";
import { ModelType, DocumentType } from "@typegoose/typegoose/lib/types";

@Injectable()
export class ComicService {
	private logger: MyLogger;
	constructor(
		@Inject(ParserService) private readonly parserService: ParserService, // @Inject(ComicService) private readonly comicService: ComicService
		@InjectModel(Season) private readonly seasonModel: ModelType<Season>
	) {
		this.logger = new MyLogger("ComicService");
	}

	async getParserNames(): Promise<string[]> {
		return this.parserService.getParserNames();
	}

	async search(searchDto: ComicSearchDto) {
		return await this.parserService.search(searchDto.content, searchDto.useParser);
	}

	async parseComic(id: string) {
		const ret = await this.parserService.parseComic(id);
		//移除所有漫画地址
		if (!ret.err) {
			if (ret.comic.seasons)
				ret.comic.seasons.map((s: DocumentType<Season>) => {
					if (s.images) s.images.length = 0;
				});
		}
		return ret;
	}

	async parseSeason(id: string) {
		const ret = await this.parserService.parseSeason(id);
		const season = ret.season;
		if (season) {
			//下一集
			const next = await this.seasonModel.findOne({
				comic: season.comic,
				sidx: season.sidx + 1,
				type: season.type
			});
			//上一集
			const pre = await this.seasonModel.findOne({
				comic: season.comic,
				sidx: season.sidx - 1,
				type: season.type
			});
			if (next) ret["next"] = next.id;
			if (pre) ret["pre"] = pre.id;
		}
		return ret;
	}
}
