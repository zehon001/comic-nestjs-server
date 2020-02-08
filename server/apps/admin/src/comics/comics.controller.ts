import { Controller, Get } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Comic } from "@lib/db/models/comic.model";
import { Crud } from "nestjs-mongoose-crud";
import { ApiTags } from "@nestjs/swagger";
import AppDF from "../app.define";

//添加增删改查接口
@Crud({
	model: Comic
})
@Controller("comics")
@ApiTags("漫画列表")
export class ComicsController {
	constructor(@InjectModel(Comic) private readonly model) {}

	@Get("option")
	option() {
		return AppDF.WebOption.comics_list;
	}
}
