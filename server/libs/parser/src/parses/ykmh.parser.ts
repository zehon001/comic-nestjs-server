import BaseParser, { ParserConfig } from "./base.parser";
import * as cheerio from "cheerio";
import Utils from "utils/utils";
import { ParseComicRet, ParseSeasonRet } from "../parser.result";

export default class YkmhParser extends BaseParser {
	constructor() {
		super();
	}

	/**获取配置 */
	public static getConfig(): ParserConfig {
		let config = new ParserConfig();
		config.name = "优酷漫画";
		config.keys.push("wap.ykmh.com");
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
		let $Cover = $("#Cover");
		/**预览 */
		ret.cover = $Cover
			.children()
			.attr("src");
		let $content = $Cover.next();

		/**作者 */
		ret.author = $content
			.children()
			.children()
			.next()
			.html();
		/**名称 */
		ret.name = $("#comicName").html();
		
		let $tag = $content.children().next()
		
		/**类型 */
		ret.tag = $tag
			.children()
			.next()
			.html();
		// /**更新时间 */
		ret.lastUpdateAt = $content
			.children()
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
		$("#list_block .comic-chapters").each((idx, ele) => {
			let $element = $(ele);
			let typename = $element
				.children()
				.children()
				.children()
				.next()
				.html();
			let type = typemap[typename];
			if (type) {
				let $list = $element.find(".chapter-body div mip-showmore ul li a");
				let len = $list.length;

				$element.find(".chapter-body div mip-showmore ul li a").each((idx, ele) => {
					let $season = $(ele);
					let season = new ParseSeasonRet();
					season.name = $season.children().html();
					season.srcUrl = "http://wap.ykmh.com"+$season.attr("href");
					season.sidx = len - idx - 1;
					season.type = type;
					ret.seasons.push(season);
				});
				ret.seasons = ret.seasons.reverse();
			}
		});
		//console.log(ret);

		return ret;
	}
	
	/**解析一集 */
	async parseSeason(url): Promise<ParseSeasonRet> {
		const res = await Utils.getUrl(url);
		let ret = new ParseSeasonRet();
		ret.srcUrl = url;

		//获取漫画链接域名 跟m90mh一个源
		const configRes = await Utils.getUrl("http://wap.ykmh.com/js/config.js");
		var domain = "http://js.tingliu.cc";
		try{
			var m = (configRes as string).match(/var SinConf(.*?)\(\);/)[0];
			var SinConf = Utils.evalVariable(m, "SinConf");
			var hosts = SinConf.resHost[0];
			if(typeof hosts.domain==='string'){domain=hosts.domain;}else{var l=hosts.domain.length;var i=Math.floor(Math.random()*l);domain=hosts.domain[i];}
		}catch(err){
			console.log(err)
		}
		
		if (typeof res === "string") {
			try {
				let $ = cheerio.load(res);

				var m = res.match(/var comicUrl(.*?);/)[0];
				ret.comicUrl = Utils.evalVariable(m, "comicUrl");
				//console.log("comicUrl:" + ret.comicUrl);
				var m = res.match(/var chapterImages(.*?);/)[0];
				var imgs = Utils.evalVariable(m, "chapterImages");
				imgs.map((img, idx) => {
					ret.images.push(domain + img);
				});
			} catch (err) {
				console.log(err)
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
		let url = "http://wap.ykmh.com/search/?keywords="+encodeURI(content);

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

	async getServer(): Promise<string>{
		const res = await Utils.getUrl(
			{
				url: "https://www.bnmanhua.com/static/manhua/comic.js",
				headers: {
					accept: "*/*"
				}
			}
		);
		if (typeof res !== "string") return "";

		try{
			 var m = res.match(/var z_yurl(.*?);/)[0];
			 return Utils.evalVariable(m, "z_yurl");

		}catch(err){
			return ""
		}
	}
}
