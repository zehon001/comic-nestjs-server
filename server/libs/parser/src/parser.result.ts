import { Comic } from "@lib/db/models/comic.model";
import { Season } from "@lib/db/models/season.model";
import { DocumentType } from "@typegoose/typegoose";

/**基础返回结构 */
export class ParseRet {
	/**是否出错 */
	public err: boolean = false;
	/**出错信息 */
	public msg: string = "";
	error(msg?: string) {
		this.err = true;
		this.msg = msg || "";
		return this;
	}
}

/**解析集返回结构 */
export class ParseSeasonRet extends ParseRet {
	/**所属漫画链接 */
	public comicUrl: string = "";
	/**集名称 */
	public name: string = "";
	/**集索引 */
	public sidx: number = -1;
	/**集源链接 */
	public srcUrl: string = "";
	/**集类型 */
	public type: string = "";
	/**图片链接列表 */
	public images: Array<string> = [];
}

/**解析漫画的返回结构 */
export class ParseComicRet extends ParseRet {
	/**漫画预览链接 */
	public cover: string = "";
	/**漫画名称 */
	public name: string = "";
	/**漫画标签 */
	public tag: string = "";
	/**漫画作者 */
	public author: string = "";
	/**漫画源链接 */
	public srcUrl: string = "";
	/**漫画最后更新时间 */
	public lastUpdateAt: string = "";
	/**该漫画所有集 */
	public seasons: ParseSeasonRet[] = []; //必须要有 防止为空
}

/**解析服务的漫画返回结构 */
export class ParseComicSVCRet extends ParseRet {
	/**漫画模型 */
	public comic: DocumentType<Comic>;
}

/**解析服务的集返回结构 */
export class ParseSeasonSVCRet extends ParseRet {
	/**集模型 */
	public season: DocumentType<Season>;
}
