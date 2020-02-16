import { Injectable, Inject } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { User } from "@lib/db/models/user.model";
import { ModelType, DocumentType } from "@typegoose/typegoose/lib/types";
import { Season } from "@lib/db/models/season.model";
import { Comic } from "@lib/db/models/comic.model";

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User) private readonly userModel: ModelType<User>,
		@InjectModel(Season) private readonly seasonModel: ModelType<Season>,
		@InjectModel(Comic) private readonly comicModel: ModelType<Comic>
	) {}

	async findUser(uid: string) {
		return await this.userModel.findById(uid);
	}
	/**集保存到历史记录 */
	async historySeason(user: DocumentType<User>, sid: string) {
		if (user) {
			// console.log("保存到历史记录");
			const season = await this.seasonModel.findById(sid);
			if (season) {
				await user.populate("seasonhistory").execPopulate();
				await season.populate("comic").execPopulate();
				if (!user.seasonhistory) user.seasonhistory = [];
				const idx = user.seasonhistory.findIndex((v: DocumentType<Season>) => {
					return String(v.comic) == String((season.comic as DocumentType<Comic>)._id);
				});
				if (idx >= 0) {
					//该漫画已经浏览过 覆盖集信息
					user.seasonhistory.splice(idx, 1, season);
				} else {
					//最大保留10条记录
					if (user.seasonhistory.length >= 10) user.seasonhistory.shift();
					user.seasonhistory.push(season);
				}

				await user.save();

				// await user.depopulate("seasonhistory");
				// await season.depopulate("comic");
			}
		}
	}

	/**收藏漫画 */
	async starComic(user: DocumentType<User>, cid: string) {
		if (user) {
			const comic = await this.comicModel.findById(cid);
			if (comic) {
				await user.populate("stars").execPopulate();
				if (!user.stars) user.stars = [];
				const idx = user.stars.findIndex((v: DocumentType<Comic>) => {
					return v._id == cid;
				});
				if (idx < 0) {
					//没有收藏过
					user.stars.push(comic);
					await user.save();
				}
				// await user.depopulate("stars");
			}
		}
	}
	/**取消收藏漫画 */
	async cancelStarComic(user: DocumentType<User>, cid: string) {
		if (user && user.stars) {
			const idx = user.stars.findIndex((v: DocumentType<Comic>) => {
				return v._id == cid;
			});
			if (idx >= 0) {
				user.stars.splice(idx, 1);
				await user.save();
			}
		}
	}

	/**获取用户历史记录 */
	async getSeasonHistory(user: DocumentType<User>) {
		await user.populate("seasonhistory").execPopulate();
		const seasons = user.seasonhistory as DocumentType<Season>[];
		let season: DocumentType<Season>;
		for (let i = 0; i < seasons.length; i++) {
			season = seasons[i];
			await season.populate("comic").execPopulate();
			if (season.images) season.images.length = 0; //减少字节传输
		}
		return user.seasonhistory as DocumentType<Season>[];
	}

	/**获取用户收藏列表 */
	async getStars(user: DocumentType<User>) {
		await user.populate("stars").execPopulate();
		return user.stars as DocumentType<Comic>[];
	}
}
