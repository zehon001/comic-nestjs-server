import { Controller, Get } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Season } from "@lib/db/models/season.model";
import { Crud } from "nestjs-mongoose-crud";
import { ApiTags } from "@nestjs/swagger";
import AppDF from "../app.define";

@Crud({
	model: Season
})
@Controller("seasons")
@ApiTags("分集列表")
export class SeasonsController {
	constructor(@InjectModel(Season) private readonly model) {}

	@Get("option")
	option() {
		return AppDF.WebOption.seasons_list;
	}
}
