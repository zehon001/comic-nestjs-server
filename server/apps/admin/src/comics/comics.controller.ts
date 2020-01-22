import { Controller, Get } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Comic } from "@lib/db/models/comic.model";
import { Crud } from "nestjs-mongoose-crud";
import { ApiTags } from "@nestjs/swagger";

@Crud({
	model: Comic
})
@Controller("comics")
@ApiTags("漫画")
export class ComicsController {
	constructor(@InjectModel(Comic) private readonly model) {}

	@Get("option")
	option() {
		return {
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
		};
	}
}
