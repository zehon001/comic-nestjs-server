import Vue from "vue";
import { AxiosInstance } from "axios";
import { DBComicType, DBSeasonType, DBUserType } from "./db.adapter.types";
/**数据适配器 */
export default class DBAdapter {
	public get http(): AxiosInstance {
		return Vue.prototype.$http as AxiosInstance;
	}
	public error(msg) {
		console.log(msg);
	}
	public isOK(res) {
		if (res.data.statusCode == 0) {
			return res.data.data || [];
		} else {
			this.error(res.data.message || res.statusText);
			return [];
		}
	}
	/**搜索漫画 */
	public async search(content: any, useParser?: string): Promise<DBComicType[]> {
		const res = await this.http.post("/search", {
			content,
			useParser
		});
		if (this.isOK(res)) return res.data.data || [];
		else return [];
	}

	/**获取漫画数据 */
	public async getComic(id: string): Promise<DBComicType> {
		const res = await this.http.get("/parsecomic?id=" + id);
		if (this.isOK(res)) {
			if (res.data.data.err) {
				this.error(res.data.data.msg);
				return new DBComicType();
			}
			const comic: DBComicType = res.data.data.comic || new DBComicType();
			const seasons = comic.seasons || [];
			seasons.sort(function(a, b) {
				return b.sidx - a.sidx;
			});
			comic.seasons = [];
			comic.seasons_other = [];
			comic.seasons_book = [];
			seasons.map(s => {
				switch (s.type) {
					case "normal":
						comic.seasons.push(s);
						break;
					case "other":
						comic.seasons_other.push(s);
						break;
					case "book":
						comic.seasons_book.push(s);
						break;
				}
			});
			return comic;
		} else return new DBComicType();
	}

	/**获取漫画分集数据 */
	public async getSeason(id: string): Promise<DBSeasonType> {
		const res = await this.http.get("/parseseason?id=" + id);
		if (this.isOK(res)) {
			if (res.data.data.err) {
				this.error(res.data.data.msg);
				return new DBSeasonType();
			}
			const season: DBSeasonType = res.data.data.season || new DBSeasonType();
			season.pages = season.images.length;
			season.pre = res.data.data.pre;
			season.next = res.data.data.next;
			return season;
		} else return new DBSeasonType();
	}
	/**获取用户数据 */
	public async getUserData(): Promise<DBUserType | null> {
		return null;
	}
}
