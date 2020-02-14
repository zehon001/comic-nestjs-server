export class DBSeasonType {
	/**集id */
	_id: string;
	/**所属漫画id */
	comic: string;
	/**集名称 */
	name: string;
	/**集索引*/
	sidx: number;
	/**集的源地址 */
	srcUrl: string;
	/**集类型 */
	type: string;
	/**所有图片 */
	images: Array<string> = [];

	/**总页数 */
	pages: number;
	/**上一集id */
	pre: string;
	/**下一集id */
	next: string;
}

/**漫画数据类型 */
export class DBComicType {
	/**漫画id */
	_id: string;
	/**名称 */
	name: string;
	/**图标 */
	cover: string;
	/**类型 */
	tag: string;
	/**作者 */
	author: string;
	/**最后更新时间*/
	lastUpdateAt: string;
	/**分集列表 */
	seasons: DBSeasonType[] = [];
	/**番外列表 */
	seasons_other: DBSeasonType[] = [];
	/**单行本列表 */
	seasons_book: DBSeasonType[] = [];
}

export class DBUserType {}
