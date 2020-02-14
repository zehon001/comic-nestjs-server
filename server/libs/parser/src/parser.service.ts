import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Comic } from "@lib/db/models/comic.model";
import { ModelType, DocumentType } from "@typegoose/typegoose/lib/types";
import M99770Parser from "./parses/m99770.parser";
import { Season } from "@lib/db/models/season.model";
import { ParseComicRet, ParseSeasonRet, ParseComicSVCRet, ParseSeasonSVCRet } from "./parser.result";
import { StatusException } from "filters/status.exception";

@Injectable()
export class ParserService {
	constructor(
		@InjectModel(Comic) private readonly comicModel: ModelType<Comic>,
		@InjectModel(Season) private readonly seaonModel: ModelType<Season>
	) {}

	/**解析漫画页 返回漫画地址等信息 TODO: 添加更新判断,已经解析过的,还没到漫画章节更新时不需要再解析 */
	async parseComic(id): Promise<ParseComicSVCRet> {
		//正常id类型（数据库已经有数据模型）
		if (id.indexOf("/") < 0) {
			return await this.parseComicById(id);
		} else {
			//网址类型（数据库可能没有数据模型）
			return await this.parseComicByUrl(id);
		}
	}
	/**根据id解析漫画页 */
	async parseComicById(id: string): Promise<ParseComicSVCRet> {
		const comic = await this.comicModel.findById(String(id));
		let ret = new ParseComicSVCRet();

		if (!comic) {
			return ret.error("漫画不存在");
		}

		ret.comic = comic;
		// console.log(comic.seasons);//现在是虚拟字段

		//还未超过最大缓存时间（因为漫画会更新，不能永久缓存解析结果）
		if (comic.lastParseAt && Date.now() - comic.lastParseAt.getTime() < 24 * 3600000) {
			await comic.populate("seasons").execPopulate();
			// console.log("读取漫画缓存");
			return ret;
		}

		// console.log("重新解析漫画");
		//否则重新解析
		const { seasons } = await new M99770Parser().parseComic(comic.srcUrl);
		// console.log(seasons);
		try {
			if (seasons.length > 0) {
				comic.seasons = [];
				for (let i = 0; i < seasons.length; i++) {
					//数据模型指定
					const md_season = (await this.convertSeasonToModel(comic, seasons[i] as any)) as DocumentType<
						Season
					>;
					comic.seasons.push(md_season);
				}
				comic.lastParseAt = new Date();
				await comic.save();
				// console.log(comic);
				// await (comic as DocumentType<Comic>).save();
			}
		} catch (err) {
			Logger.error(err.toString(), "", "解析出错");
			ret.error();
		}
		return ret;
	}
	/**根据url解析漫画页 */
	async parseComicByUrl(url: string): Promise<ParseComicSVCRet> {
		//网址类型（数据库可能没有数据模型）
		let comic: any = await new M99770Parser().parseComic(url);
		let ret = new ParseComicSVCRet();

		if (comic.err) {
			ret.error();
			// ret.comic = comic;
			return ret;
		}

		const seasons = comic.seasons as any[]; //备份集信息
		comic.seasons = []; //清空集信息

		const md_comic = await this.convertComicToModel(comic);
		try {
			if (seasons.length > 0) {
				md_comic.seasons = [];
				for (let i = 0; i < seasons.length; i++) {
					//数据模型指定
					const md_season = (await this.convertSeasonToModel(md_comic, seasons[i])) as DocumentType<Season>;
					md_comic.seasons.push(md_season);
				}
				comic.lastParseAt = new Date();
				await comic.save();
				// await (comic as DocumentType<Comic>).save();
			}
			ret.comic = md_comic;
		} catch (err) {
			Logger.error(err.toString(), "", "解析出错");
			ret.error();
			// comic.err = true;
		}
		return ret;
	}

	/**解析漫画的一集的所有图片 */
	async parseSeason(id): Promise<ParseSeasonSVCRet> {
		//正常id类型（数据库已经有数据模型）
		if (id.indexOf("/") < 0) {
			return await this.parseSeasonById(id);
		} else {
			//网址类型（数据库可能没有数据模型）
			return await this.parseSeasonByUrl(id);
		}
	}
	/**根据id解析一集图片页 */
	async parseSeasonById(id: string): Promise<ParseSeasonSVCRet> {
		let ret = new ParseSeasonSVCRet();
		try {
			const model = await this.seaonModel.findById(String(id));
			if (!model) return ret.error("当前集不存在");
			if (model.images.length <= 0) {
				//还没解析过
				const { err, images } = await new M99770Parser().parseSeason(model.srcUrl);
				if (err) return ret.error("解析集失败");
				if (images.length > 0) {
					//保存地址
					images.map(img => {
						return model.images.push(img);
					});
					await model.save();
				}
			}
			ret.season = model;
		} catch (err) {
			Logger.error(err.toString(), "", "解析一集出错");
			ret.error("解析出错");
		}
		return ret;
	}
	/**根据url解析一集图片页 */
	async parseSeasonByUrl(url: string): Promise<ParseSeasonSVCRet> {
		let model = await this.seaonModel.findOne({ srcUrl: url });
		let ret = new ParseSeasonSVCRet();
		//存在当前集并且已经解析过
		if (model && model.images.length > 0) {
			await model.populate("comic").execPopulate();
			ret.season = model;
			return ret;
		}

		const { err, images, comicUrl } = await new M99770Parser().parseSeason(url);
		if (err) return ret.error("解析集失败");

		//不存在当前集 解析
		if (!model && comicUrl) await this.parseComicByUrl(comicUrl);

		//再查找一次当前集
		model = await this.seaonModel.findOne({ srcUrl: url });
		if (!model) return ret.error("漫画信息不存在");
		if (model.images.length <= 0) {
			//保存地址
			images.map(img => {
				return model.images.push(img);
			});
			await model.save();
		}
		ret.season = model;

		return ret;
	}

	/**搜索漫画 */
	async search(content: string, useParse?: string): Promise<Comic[]> {
		const list = await new M99770Parser().search(content);
		const ret: Comic[] = [];
		for (let i = 0; i < list.length; i++) {
			ret.push(await this.convertComicToModel(list[i]));
		}
		return ret;
	}

	/**转换漫画到数据模型（解析结果更新到数据库） */
	async convertComicToModel(
		comic: DocumentType<Comic> | ParseComicRet,
		update?: boolean
	): Promise<DocumentType<Comic>> {
		if (comic instanceof ParseComicRet) {
			const lastUpdateAt = comic.lastUpdateAt;
			let model = update
				? await this.comicModel.findOneAndUpdate({ srcUrl: comic.srcUrl }, comic)
				: await this.comicModel.findOne({ srcUrl: comic.srcUrl });

			if (!model) {
				try {
					model = await this.comicModel.create(comic); //防止高并发同时创建模型导致唯一索引报错
				} catch (err) {
					model = await this.comicModel.findOne({ srcUrl: comic.srcUrl });
				}
			}
			let toupdate = false;
			if (model.tag === "未指定" && comic.tag !== "未指定") {
				if (comic.tag) {
					model.tag = comic.tag;
					toupdate = true;
				}
			}
			if (model.lastUpdateAt != lastUpdateAt) {
				model.lastUpdateAt = lastUpdateAt;
				toupdate = true;
			}
			if (toupdate) await model.save();

			return model;
		} else {
			return comic;
		}
	}

	/**转换集到数据模型（解析结果更新到数据库） */
	async convertSeasonToModel(
		comic: DocumentType<Comic>,
		season: DocumentType<Season> | ParseSeasonRet,
		update?: boolean
	): Promise<DocumentType<Season>> {
		if (season instanceof ParseSeasonRet) {
			if (!comic) throw new StatusException("漫画集转换失败");
			else {
				let model = update
					? await this.seaonModel.findOneAndUpdate({ srcUrl: season.srcUrl }, season)
					: await this.seaonModel.findOne({ srcUrl: season.srcUrl });
				if (!model) {
					try {
						if (!season.images) season.images = [];
						model = await this.seaonModel.create(season); //防止高并发同时创建模型导致唯一索引报错
						model.comic = comic.id; //关联漫画
						await model.save();
					} catch (err) {
						Logger.error(err, "", "创建集失败");
						model = await this.seaonModel.findOne({ srcUrl: season.srcUrl });
					}
				}
				return model;
			}
		} else {
			return season;
		}
	}
}
