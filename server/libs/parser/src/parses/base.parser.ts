import { ParseComicRet, ParseSeasonRet } from "../parser.result";

export class ParserConfig {
	/**解析器名称 */
	name: string = "";
	/**解析器键值*/
	keys: Array<string> = [];

	addKey(key) {
		if (this.keys.indexOf(key) < 0) this.keys.push(key);
	}

	delKey(key) {
		let idx = this.keys.indexOf(key);
		if (idx >= 0) this.keys.splice(idx, 1);
	}

	/**是否通过键值测试 */
	testKey(key: string): boolean {
		for (let i = 0; i < this.keys.length; i++) {
			if (key.indexOf(this.keys[i]) >= 0) {
				return true;
			}
		}
		return false;
	}
	/**是否通过名称测试 */
	testName(name: string) {
		return this.name === name;
	}
}

export default class BaseParser {
	constructor() {}

	/**获取配置 */
	public static getConfig(): ParserConfig {
		return new ParserConfig();
	}

	/**解析漫画信息（包括集信息） */
	async parseComic(url): Promise<ParseComicRet> {
		return new ParseComicRet();
	}
	/**解析一集 */
	async parseSeason(url): Promise<ParseSeasonRet> {
		return new ParseSeasonRet();
	}
	/** 搜索漫画*/
	async search(content: string): Promise<ParseComicRet[]> {
		return [];
	}

	mas() {}
}
