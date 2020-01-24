import * as fs from "fs";
import { Logger } from "@nestjs/common";
var md5 = require("md5");

/**缓存管理器 */
export default class CacheManager {
	private cachePath: string;
	private type: string;
	private defVaildTime: number;
	constructor(type: string, defVaildTime?: number) {
		if (!fs.existsSync("./cache")) fs.mkdirSync("./cache");
		this.cachePath = "./cache/" + type + "/";
		if (!fs.existsSync(this.cachePath)) fs.mkdirSync(this.cachePath);
		this.type = type;
		this.defVaildTime = defVaildTime || 60 * 60 * 24 * 1000; //默认一天
	}

	/**获取缓存 */
	get(key: string, vaildTime?: number) {
		const _this = this;
		return new Promise(function(resolve, reject) {
			vaildTime = vaildTime || _this.defVaildTime;
			let name = md5(_this.type + key) + ".json";
			fs.readFile(_this.cachePath + name, "utf-8", (err, res) => {
				let c = null;
				if (!err && res) {
					c = JSON.parse(res);
					if (Date.now() - c.updateTime > vaildTime) c = null;
					else {
						c = c.data;
					}
				}
				resolve(c);
			});
		});
	}
	/**保存缓存 */
	set(key, data) {
		if (!fs.existsSync(this.cachePath)) {
			fs.mkdirSync(this.cachePath);
		}
		let name = md5(this.type + key) + ".json";
		fs.writeFile(
			this.cachePath + name,
			JSON.stringify({ data, updateTime: Date.now() }),
			err => {
				err && Logger.log(err);
			}
		);
	}
}
