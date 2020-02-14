import DBAdapter from "./db.adapter";

export default class Tools {
	private static _instance: Tools;
	/**单例 */
	public static get instance(): Tools {
		if (!this._instance) this._instance = new Tools();
		return this._instance;
	}

	/**数据适配器 */
	public dbAdapter: DBAdapter = new DBAdapter();

	/**裁剪字符串 超出len（汉字标准 双字节）部分用...代替 */
	beautySub(str, len): string {
		var reg = /[\u4e00-\u9fa5]/g;
		//汉字数量
		var chineseCharNum = ~~(str.match(reg) && str.match(reg).length);
		//真实长度
		var realen = str.length + chineseCharNum;
		//限制的长度
		var limitlen = len * 2;
		if (limitlen >= realen) return str;
		else {
			//裁剪
			var slice = str.substr(0, limitlen);
			//剩余汉字数量
			chineseCharNum = ~~(slice.match(reg) && slice.match(reg).length);
			//去掉汉字多余的长度
			limitlen -= chineseCharNum;
			return str.substr(0, limitlen) + "...";
		}
	}
}
