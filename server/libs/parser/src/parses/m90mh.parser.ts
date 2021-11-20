import BaseParser, { ParserConfig } from "./base.parser";
import * as cheerio from "cheerio";
import Utils from "utils/utils";
import { ParseComicRet, ParseSeasonRet } from "../parser.result";

export default class M90MHParser extends BaseParser {
	/**解析的漫画页下一页延时时间（毫秒,防被禁） */
	private seasonNextPageDelay: number = 50;
	constructor() {
		super();
	}

	/**获取配置 */
	public static getConfig(): ParserConfig {
		let config = new ParserConfig();
		config.name = "90漫画";
		config.keys.push("m.90mh.com");
		return config;
	}

	/**解析漫画信息（包括集信息） */
	async parseComic(url): Promise<ParseComicRet> {
		const res = await Utils.getUrl(url);
		let ret = new ParseComicRet();
		ret.srcUrl = url;

		if (typeof res !== "string") {
			ret.error();
			return ret;
		}
		let $ = cheerio.load(res, { decodeEntities: false });
		let $content = $(".comic-view");
		let $author = $content
			.children()
			.children(".pic")
			.children()
			.eq(5);
		/**预览 */
		ret.cover = $content
			.children()
			.children(".pic")
			.children()
			.children()
			.attr("src");
		/**名称 */
		ret.name = $content
			.children()
			.children(".title")
			.html();
		/**作者 */
		ret.author = $author
			.children()
			.next()
			.children()
			.html();
		/**类型 */
		ret.tag = $author
			.next()
			.children()
			.next()
			.html();
		/**更新时间 */
		ret.lastUpdateAt = $author
			.next()
			.next()
			.next()
			.children()
			.next()
			.html();

		//分集列表
		let typemap = {
			单行本列表: "book",
			番外列表: "other",
			连载列表: "normal"
		};
		$(".section4 .comic-chapters").each((idx, ele) => {
			let $element = $(ele);
			let typename = $element
				.children()
				.children()
				.html();
			let type = typemap[typename];
			if (type) {
				$element.find(".list ul li a").each((idx, ele) => {
					let $season = $(ele);
					let season = new ParseSeasonRet();
					season.name = $season.children().html();
					season.srcUrl = $season.attr("href");
					season.sidx = idx;
					season.type = type;
					ret.seasons.push(season);
				});
			}
		});
		return ret;
	}

	/**解析一集 */
	async parseSeason(url): Promise<ParseSeasonRet> {
		const $this = this;
		let ret = new ParseSeasonRet();
		let url_id;
		try {
			url_id = url.match(/\/([^ \/]*?).html/)[1];
		} catch (err) {
			return ret.error("解析地址有误");
		}
		let n_url_id = url_id; //还原到第一页
		let idx = url_id.indexOf("-");
		if (idx > 0) {
			n_url_id = url_id.substring(0, idx);
			url = url.replace(`/${url_id}.html`, `/${n_url_id}.html`);
		}
		ret.srcUrl = url;

		const res = await Utils.getUrl(url);
		if (typeof res === "string") {
			try {
				let $ = cheerio.load(res, { decodeEntities: false });
				let $introduct = $(".Introduct_Sub");
				ret.comicUrl = $introduct
					.next()
					.children()
					.children()
					.children()
					.attr("href");

				let curPage = parseInt($(".curPage").html());
				let totalPage = parseInt(
					$(".curPage")
						.next()
						.html()
				);
				let $img = $("#chapter-image");
				let imgurl = $img
					.children()
					.children()
					.attr("src");
				ret.images.push(imgurl);
				for (let i = curPage + 1; i <= totalPage; i++) {
					await Utils.delay($this.seasonNextPageDelay); //延时
					ret.images.push(
						await $this.getPageImageUrl(url.replace(`/${url_id}.html`, `/${url_id + "-" + i}.html`))
					);
				}
			} catch (err) {
				console.log(`百年漫画解析页地址的通道失败 url=${url}`);
				ret.error();
			}
		} else {
			ret.error();
		}
		return ret;
	}

	//获取一页的图片链接
	async getPageImageUrl(page_url) {
		let imgurl = "";
		const res = await Utils.getUrl(page_url);
		if (typeof res === "string") {
			try {
				let $ = cheerio.load(res, { decodeEntities: false });
				imgurl = $("#chapter-image")
					.children()
					.children()
					.attr("src");
			} catch (err) {}
		}
		return imgurl;
	}

	/**搜索漫画 */
	async search(content: string): Promise<ParseComicRet[]> {
		let url = "http://m.90mh.com/search/?keywords=" + encodeURI(content);

		const res = await Utils.getUrl({
			url: url,
			headers: {
				accept: "*/*"
			}
		});
		let ret: ParseComicRet[] = [];
		if (typeof res !== "string") return ret;
		let $ = cheerio.load(res, { decodeEntities: false });
		$("div#update_list .UpdateList .itemBox").each((idx, ele) => {
			let result = new ParseComicRet();

			let $element = $(ele);
			let $img_link = $element.children().children();
			result.srcUrl = $img_link.attr("href");

			result.cover = $img_link.children().attr("src");
			let $title = $element.children(".itemTxt").children(".title");
			result.name = $title.text();
			result.author = $title.next().text();
			result.tag = $title
				.next()
				.next()
				.children()
				.text();
			if (result.tag) result.tag = result.tag.split("|")[0];
			result.lastUpdateAt = $title
				.next()
				.next()
				.next()
				.children()
				.text();
			ret.push(result);
		});
		return ret;
	}
}
