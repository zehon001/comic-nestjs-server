import { prop, arrayProp, Ref } from "@typegoose/typegoose";
import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model";
import { Season } from "./season.model";
// import { isWithVirtualPOP, includesAllVirtualPOP } from "@typegoose/typegoose/lib/internal/utils";

/**漫画信息 */

export class Comic extends BaseModel {
	@prop()
	@ApiProperty({ description: "漫画名称", example: "name" })
	name: string;

	@prop({ unique: true })
	@ApiProperty({ description: "漫画源地址", example: "http://www.baidu.com" })
	srcUrl: string;

	@prop()
	@ApiProperty({ description: "解析器名称", example: "" })
	parserName: string;

	@prop()
	@ApiProperty({ description: "作者", example: "http://www.baidu.com" })
	author: string;

	@prop()
	@ApiProperty({ description: "类型", example: "热血" })
	tag: string;

	@prop()
	@ApiProperty({ description: "最后更新", example: "" })
	lastUpdateAt: string;

	@prop()
	@ApiProperty({ description: "封面地址", example: "http://www.baidu.com" })
	cover: string;

	@prop()
	@ApiProperty({ description: "最后解析时间" })
	lastParseAt: Date;

	// @arrayProp({ itemsRef: "Season" })
	//使用虚拟字段
	@arrayProp({ ref: "Season", localField: "_id", foreignField: "comic" })
	@ApiProperty({ description: "所有集" })
	// @isWithVirtualPOP({})
	// @includesAllVirtualPOP({ref:'Season',localField:'_id',foreignField:'comic',overwrite:false})
	seasons: Ref<Season>[];
}
