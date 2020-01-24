import { Controller, Get } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Season } from "@lib/db/models/season.model";
import { Crud } from "nestjs-mongoose-crud";
import { ApiTags } from "@nestjs/swagger";

@Crud({
	model: Season
})
@Controller("seasons")
@ApiTags("集")
export class SeasonsController {
	constructor(@InjectModel(Season) private readonly model) {}

	@Get("option")
	option() {
		return {
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
		};
	}
}
