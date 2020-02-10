import { Controller, Get, Delete, Param, Inject } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Comic } from "@lib/db/models/comic.model";
import { Crud } from "nestjs-mongoose-crud";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import AppDF from "../app.define";
import { ModelType, DocumentType } from "@typegoose/typegoose/lib/types";
import { Season } from "@lib/db/models/season.model";

//添加增删改查接口
@Crud({
	model: Comic
})
@Controller("comics")
@ApiTags("漫画列表")
export class ComicsController {
	constructor(@InjectModel(Comic) private readonly model: ModelType<Comic>) {}

	@Get("option")
	option() {
		return AppDF.WebOption.comics_list;
	}

	@Delete("/:id")
	@ApiOperation({ summary: "删除漫画" })
	async delete(@Param("id") id: string) {
		const comic = await this.model.findById(id);
		if (comic) {
			//删除全部集（因为集被关联过）
			await comic.populate("seasons").execPopulate();
			const seasons: DocumentType<Season>[] = comic.seasons as DocumentType<Season>[];
			if (seasons) {
				for (let i = 0; i < seasons.length; i++) {
					await seasons[i].remove();
				}
			}
			await comic.remove();
		}
		return comic;
	}
}
