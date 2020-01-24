import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Comic } from "@lib/db/models/comic.model";
import { ModelType, DocumentType } from "@typegoose/typegoose/lib/types";
import M99770Parser from "./parses/m99770.parser";
import { Season } from "@lib/db/models/season.model";

@Injectable()
export class ParserService {
	constructor(
		@InjectModel(Comic) private readonly comicModel: ModelType<Comic>,
		@InjectModel(Season) private readonly seaonModel: ModelType<Season>
	) {}

	/**解析漫画页 返回漫画地址等信息 */
	async parseComic(id) {
		let comic: Comic;
		console.log(id);
		//正常id类型（数据库已经有数据模型）
		if (id.indexOf("/") < 0) {
			comic = await this.comicModel.findById(String(id));
			if (!comic) return { msg: "漫画不存在" };
			const { seasons } = await new M99770Parser().parseComic(comic.srcUrl);
			try {
				for (let i = 0; i < seasons.length; i++) {
					//数据模型指定
					const season = (await this.convertSeasonToModel(comic, seasons[i])) as DocumentType<Season>;
					comic.seasons[i] = season;
				}
				await (comic as DocumentType<Comic>).save();
			} catch (err) {
				Logger.error(err.toString(), "", "解析出错");
			}
		} else {
			//网址类型（数据库可能没有数据模型）
			comic = await new M99770Parser().parseComic(id);
			const seasons = comic.seasons as any[]; //备份集信息
			comic.seasons = []; //清空集信息
			comic = await this.convertComicToModel(comic);
			try {
				for (let i = 0; i < seasons.length; i++) {
					//数据模型指定
					const season = (await this.convertSeasonToModel(comic, seasons[i])) as DocumentType<Season>;
					comic.seasons[i] = season;
				}
				await (comic as DocumentType<Comic>).save();
			} catch (err) {
				Logger.error(err.toString(), "", "解析出错");
			}
		}

		return comic;
	}
	/**解析漫画的一集的所有图片 */
	async parseSeason(id) {
		try {
			const model = await this.seaonModel.findById(String(id));
			if (!model) return { msg: "当前集不存在" };
			if (model.images.length <= 0) {
				//还没解析过
				const imgs = await new M99770Parser().parseSeason(model.srcUrl);
				if (imgs.length > 0) {
					//保存地址
					imgs.map(img => {
						return model.images.push(img);
					});
					await model.save();
				}
			}
			return model;
		} catch (err) {
			Logger.error(err.toString(), "", "解析一集出错");
			return { msg: "解析出错" };
		}
	}

	/**搜索漫画 */
	async search(content: string, useParse?: string) {
		const list: Comic[] = await new M99770Parser().search(content);
		for (let i = 0; i < list.length; i++) {
			list[i] = await this.convertComicToModel(list[i]);
		}
		return list;
	}

	/**转换漫画到数据模型（解析结果更新到数据库） */
	async convertComicToModel(comic: Comic) {
		if (!comic["_id"]) {
			const lastUpdateAt = comic.lastUpdateAt;
			let model = await this.comicModel.findOne({ srcUrl: comic.srcUrl });
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
		}
		return comic as DocumentType<Comic>;
	}

	/**转换集到数据模型（解析结果更新到数据库） */
	async convertSeasonToModel(comic: Comic, season: Season) {
		if (!season["_id"] && comic) {
			let model = await this.seaonModel.findOne({ srcUrl: season.srcUrl });
			if (!model) {
				try {
					if (!season.images) season.images = [];
					model = await this.seaonModel.create(season); //防止高并发同时创建模型导致唯一索引报错
					model.comic = comic; //关联漫画
					await model.save();
				} catch (err) {
					Logger.error(err, "", "创建集失败");
					model = await this.seaonModel.findOne({ srcUrl: comic.srcUrl });
				}
			}
			return model;
		}
		return season;
	}
}
