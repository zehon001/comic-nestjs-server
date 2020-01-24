import BaseParser from "./base.parser";
import * as cheerio from "cheerio";
import Utils from "utils/utils";
// global.tempEvalM99770 = {};

export default class M99770Parser extends BaseParser {
	private servers: [];
	constructor() {
		super();
		this.servers = [];
	}

	/**解析漫画信息（包括集信息） */
	async parseComic(url) {
		const res = await Utils.getUrl(url);
		let ret = {
			cover: "",
			name: "",
			tag: "",
			author: "",
			srcUrl: url,
			lastUpdateAt: "",
			seasons: [] //必须要有 防止为空
		};
		if (typeof res !== "string") return ret;

		let $ = cheerio.load(res);

		let infoParent = $(".cTitle")
			.parent()
			.parent();

		let t = $(".cTitle").text();
		if (t.indexOf(" ") >= 0) {
			let m = t.match(/\S(.*?)(?=\n)/);
			if (m) ret.name = m[0];
		} else {
			ret.name = t;
		}
		ret.name = Utils.t2s(ret.name);
		//作者
		let $author = infoParent.next();
		ret.author = $author
			.children()
			.next()
			.children()
			.text();
		/**更新时间 */
		let $lastUpdateAt = $author
			.next()
			.next()
			.next()
			.next();
		let matchUpdateAt = $lastUpdateAt
			.children()
			.next()
			.text()
			.match(/\d(.*?)$/);
		ret.lastUpdateAt = matchUpdateAt ? matchUpdateAt[0] : "";
		/**类型 */
		ret.tag = "未指定";

		ret.cover = $(".cDefaultImg")
			.children()
			.attr("src");
		// console.log(ret.cover);

		$("div#subBookListAct div a").each((idx, element) => {
			const $element = $(element);
			ret.seasons.push({
				name: $element.text(),
				srcUrl: $element.attr("href"),
				sidx: idx,
				type: "normal"
			});
		});
		$("div#subBookListPs div a").each((idx, element) => {
			const $element = $(element);
			ret.seasons.push({
				title: $element.text(),
				srcUrl: $element.attr("href"),
				sidx: idx,
				type: "other"
			});
		});

		return ret;
	}

	async parseSeason(url) {
		await this.getServers();
		const res = await Utils.getUrl(url);
		let ret = [];
		if (typeof res === "string") {
			try {
				var m = res.match(/var sFiles(.*?);/)[0];
				var sFiles = Utils.evalVariable(m, "sFiles");
				m = res.match(/var sPath(.*?);/)[0];
				var sPath = Utils.evalVariable(m, "sPath");

				let imgs = sFiles.split("|");
				sPath = parseInt(sPath);
				if (!this.servers[sPath - 1]) {
					console.log(`99770服务器不存在 sPath=${sPath - 1} servers=` + this.servers.toString());
				} else {
					let server = this.servers[sPath - 1];
					imgs.map((img, idx) => {
						ret.push(server + img);
					});
				}
			} catch (err) {
				console.log(`99770解析页地址的通道失败 url=${url}`);
			}
		}
		return ret;
	}

	/**搜索漫画 */
	async search(content: string) {
		let url = "http://99770.hhxxee.com/search/s.aspx";
		let body = "tbSTxt=" + content;
		var _$this = this;
		const res = await Utils.postUrl(
			{
				url: url,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			},
			body
		);
		let ret = [];
		if (typeof res !== "string") return ret;

		let $ = cheerio.load(res);

		let cPubBody = $(".cPubBody .cDataList .cInfoItem").each((idx, element) => {
			let result = {
				cover: "",
				name: "",
				tag: "",
				author: "",
				srcUrl: "",
				lastUpdateAt: "",
				seasons: [] //必须要有 防止为空
			};
			let $element = $(element);
			$element.children(".cListSlt").each((i, c) => {
				result.cover = $(c)
					.children("img")
					.attr("src");
			});

			$element.children(".cListTitle").each((i, c) => {
				let $url = $(c).children("a");
				result.srcUrl = $url.attr("href");
				result.name = Utils.t2s($url.text());
			});

			$element.children(".cListh1").each((i, c) => {
				$(c)
					.children("span")
					.each((i, text) => {
						const t: string = Utils.t2s($(text).text());
						if (t.indexOf("类型") >= 0) result.tag = t.replace("类型", "").replace("：", "");
						else if (t.indexOf("作者") >= 0) result.author = t.replace("作者", "").replace("：", "");
					});
			});

			$element.children(".cListh2").each((i, c) => {
				result.lastUpdateAt = Utils.t2s(
					$(c)
						.children(".cInfoTime")
						.text()
						.replace("最后更新:  于 ", "")
				);
				// result.updateTime1 = new Date(result.updateTime);
			});
			ret.push(result);
		});
		return ret;
	}

	async getServers() {
		if (this.servers.length <= 0) {
			const res = await Utils.getUrl("http://99770.hhxxee.com/script/viewhtml.js");
			if (typeof res !== "string") this.servers = [];
			else {
				try {
					var m = res.match(/var (.*?);/)[0];
					var sDS = Utils.evalVariable(m, "sDS");
					this.servers = sDS.split("|");
				} catch (err) {
					console.log(err);
					console.log("获取99770漫画服务器失败!");
					this.servers = [];
				}
			}
			return this.servers;
		}
	}
}
