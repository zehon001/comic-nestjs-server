import BaseParser, { ParserConfig } from "./base.parser";
import * as cheerio from "cheerio";
import Utils from "utils/utils";
import { ParseComicRet, ParseSeasonRet } from "../parser.result";

export default class BaiNianParser extends BaseParser {
	constructor() {
		super();
	}

	/**获取配置 */
	public static getConfig(): ParserConfig {
		let config = new ParserConfig();
		config.name = "百年漫画";
		config.keys.push("www.bnmanhua.com");
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
		ret.cover = $(".bpic.l")
			.children()
			.attr("src");

		let $info = $(".info.l ul li");
		$info.each((idx, ele) => {
			let $ele = $(ele);
			if (idx == 0) ret.name = $ele.children("h2").html();
			else if (idx == 2)
				ret.tag = $ele
					.children("p")
					.children("a")
					.html();
			else if (idx == 3) ret.author = $ele.children("p").html();
			else if (idx == 5) ret.lastUpdateAt = $ele.children("p").html();
		});
		// console.log(ret);

		let $lis = $(".jslist01 li a");
		let len = $lis.length;
		$lis.each((idx, ele) => {
			let season = new ParseSeasonRet();
			let $ele = $(ele);
			season.name = $ele.text();
			season.srcUrl = "https://www.bnmanhua.com" + $ele.attr("href");
			season.sidx = idx;
			season.type = "normal";
			ret.seasons.push(season);
		});
		// ret.seasons.sort(function(a,b){return a.season-b.season});
		return ret;
	}

	/**解析一集 */
	async parseSeason(url): Promise<ParseSeasonRet> {
		const res = await Utils.getUrl(url);
		let ret = new ParseSeasonRet();
		ret.srcUrl = url;
		if (typeof res === "string") {
			try {
				let $ = cheerio.load(res);
				ret.comicUrl =
					"https://www.bnmanhua.com" +
					$(".mh_readtitle")
						.children("a")
						.attr("href");
				// console.log("comicUrl:" + ret.comicUrl);
				var m = res.match(/var z_yurl(.*?);/)[0];
				var z_yurl = Utils.evalVariable(m, "z_yurl");
				m = res.match(/var z_img(.*?);/)[0];
				var z_img = Utils.evalVariable(m, "z_img");

				let imgs = JSON.parse(z_img);
				imgs.map((img, idx) => {
					ret.images.push(z_yurl + img);
				});
			} catch (err) {
				console.log(`百年漫画解析页地址的通道失败 url=${url}`);
				ret.error();
			}
		} else {
			ret.error();
		}
		return ret;
	}

	/**搜索漫画 */
	async search(content: string): Promise<ParseComicRet[]> {
		let url = "https://www.bnmanhua.com/index.php?m=vod-search";
		let body = "wd=" + content;

		const res = await Utils.postUrl(
			{
				url: url,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					accept: "*/*"
				}
			},
			body
		);
		// console.log("搜索" + content);
		let ret: ParseComicRet[] = [];
		if (typeof res !== "string") return ret;

		let $ = cheerio.load(res, { decodeEntities: false });
		$("ul#list_img li a").each((idx, ele) => {
			let result = new ParseComicRet();

			let $element = $(ele);
			result.srcUrl = "https://www.bnmanhua.com" + $element.attr("href");

			let $img = $element.children("img");
			result.cover = $img.attr("data-src");
			result.name = $element.children("p").html();
			// result.lastUpdateAt = $element.children("em").html();
			ret.push(result);
		});
		return ret;
	}
}
