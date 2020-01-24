import fetch from "node-fetch";
import CacheManager from "./CacheManager";
import { Logger } from "@nestjs/common";
// const transation = require("./transation").transation;
const transation = require("./transation.js").transation;
export default class Utils {
	static cache: CacheManager = new CacheManager("HTML_CACHE");

	static async postUrl(url, body) {
		const _this = this;
		return new Promise(async function(resolve, reject) {
			if (typeof url == "string") url = { url, encoding: null };
			body = body || {};
			if (!url.type) url.type = "text";
			let headers = {};
			if (url.encoding) headers["Content-Type"] = "text/html; charset=" + url.encoding;
			if (url.headers) {
				for (let k in url.headers) {
					headers[k] = url.headers[k];
				}
			}

			const c = await _this.cache.get("POST" + url.url + body);
			if (c) resolve(c);

			fetch(url.url, {
				method: "POST",
				headers: headers,
				body: body
			})
				.then(response => {
					if (!response.ok) {
						resolve({
							code: response.status,
							msg: response.statusText
						});
					} else {
						if (response[url.type]) return response[url.type]();
						else return response.text();
					}
				})
				.then(msg => {
					if (msg) {
						_this.cache.set("POST" + url.url + body, msg);
						resolve(msg);
					}
				})
				.catch(error => {
					Logger.error(error.toString());
					resolve();
				});
		});
	}

	static async getUrl(url) {
		const _this = this;
		return await new Promise(async function(resolve, reject) {
			if (typeof url == "string") url = { url, encoding: null };
			if (!url.type) url.type = "text";
			let headers = {};
			if (url.encoding) headers["Content-Type"] = "text/html; charset=" + url.encoding;
			const c = await _this.cache.get("GET" + url.url);
			if (c) resolve(c);
			else {
				fetch(url.url, {
					method: "GET",
					headers: headers
				})
					.then(response => {
						if (!response.ok) {
							resolve({
								code: response.status,
								msg: response.statusText
							});
						} else {
							if (response[url.type]) return response[url.type]();
							else return response.text();
						}
					})
					.then(msg => {
						if (msg) {
							_this.cache.set("GET" + url.url, msg);
							resolve(msg);
						}
					})
					.catch(error => {
						Logger.error(error.toString());
						resolve();
					});
			}
		});
	}

	/**获取url前面部分(如 http://www.baidu.com/) */
	static getUrlFront(url) {
		if (typeof url == "object") url = url.url;
		var front = url.match(/(.*?):\/\//);
		var host = url.match(/:\/\/(.*?)\//);
		if (front && url) {
			front = front[1];
			host = host[1];
			front = front + "://" + host + "/";
		} else {
			return "";
		}
		return front;
	}

	static evalVariable(exec, varName) {
		return eval(`(function(){${exec} return ${varName}})()`);
	}

	/**填充数字(不够 length 位前面补0)*/
	static PrefixInteger(num, length) {
		return (Array(length).join("0") + num).slice(-length);
	}

	/**简体转繁体 */
	static s2t(simplified) {
		if (typeof simplified != "string") simplified = "";
		return transation.s2t(simplified);
		// return simplified;
	}

	/**繁体转简体 */
	static t2s(traditional) {
		if (typeof traditional != "string") traditional = "";
		return transation.t2s(traditional);
		// return traditional;
	}
}
