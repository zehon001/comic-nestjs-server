export default class AppDF {
	/**管理后台端口 */
	static readonly ADMIN_PORT = 3008;
	/**解析任务队列名称 */
	static readonly PARSE_QUEUE = "parseQueue";

	/**管理后台界面配置 */
	static WebOption = {
		index: {
			items: [
				{
					title: "漫画管理",
					items: [
						{ title: "首页", path: "/" },
						{ title: "漫画列表", path: "/comics/list" },
						{ title: "分集列表", path: "/seasons/list" },
						{ title: "漫画预览", path: "/comics/preview" }
					]
				},
				{
					title: "用户管理",
					items: [{ title: "用户列表", path: "/users/list" }]
				},
				{
					title: "爬虫管理",
					items: [{ title: "任务列表", path: "/crawlertask/list" }]
				}
			]
		},

		/**漫画管理/漫画列表 */
		comics_list: {
			title: "漫画列表",
			searchMenuSpan: 8, //搜索框占位
			menuType: "icon",
			selection: true,
			column: [
				{
					label: "漫画名称",
					prop: "name",
					search: true,
					sortable: true,
					regex: true,
					row: true
				},
				{
					label: "作者",
					prop: "author"
				},
				{
					label: "类型",
					prop: "tag"
				},
				{
					label: "最后更新",
					prop: "lastUpdateAt",
					type: "datetime",
					format: "yyyy-MM-dd hh:mm:ss",
					valueFormat: "yyyy-MM-dd hh:mm:ss"
				},
				{
					label: "封面",
					prop: "cover",
					type: "upload",
					listType: "picture-img",
					row: true,
					action: "upload",
					width: "80"
				}
			]
		},
		/**漫画管理/分集列表 */
		seasons_list: {
			title: "漫画列表",
			searchMenuSpan: 8, //搜索框占位
			menuType: "icon",
			selection: true,
			column: [
				{
					label: "集索引",
					prop: "sidx",
					sortable: true
				},
				{
					label: "所属漫画",
					prop: "comic",
					search: true,
					sortable: true,
					row: true
				},
				{
					label: "集名称",
					prop: "name"
				},
				{
					label: "集类型",
					prop: "type"
				}
			]
		},
		/**用户管理/用户列表*/
		users_list: {
			title: "用户列表",
			searchMenuSpan: 8, //搜索框占位
			menuType: "icon",
			selection: true,
			column: [
				{
					label: "用户名",
					prop: "username",
					search: true,
					sortable: true,
					regex: true
				},
				{
					label: "密码",
					prop: "password"
				}
			]
		},

		/**爬虫管理/任务列表 */
		crawlertask_list: {
			title: "任务列表",
			searchMenuSpan: 8, //搜索框占位
			menuType: "icon",
			selection: true,

			column: [
				{
					label: "ID",
					prop: "id",
					search: true,
					sortable: true,
					row: true,
					formslot: true
				},
				{
					label: "漫画名称",
					prop: "name",
					row: true
				},
				{
					label: "漫画地址",
					prop: "parseUrl",
					row: true
				},
				{
					label: "进度",
					prop: "progress",
					row: true
				},
				{
					label: "状态",
					prop: "state",
					row: true
				},
				{
					label: "开始时间",
					prop: "processedOn",
					row: true
				},
				{
					label: "完成时间",
					prop: "finishedOn",
					row: true
				}
			]
		}
	};
}
