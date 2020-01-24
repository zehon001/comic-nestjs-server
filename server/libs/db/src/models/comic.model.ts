import { prop, arrayProp, Ref } from "@typegoose/typegoose";
import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model";
import { Season } from "./season.model";

/**漫画信息 */
export class Comic extends BaseModel {
	@prop()
	@ApiProperty({ description: "漫画名称", example: "name" })
	name: string;

	@prop({ unique: true })
	@ApiProperty({ description: "漫画源地址", example: "http://www.baidu.com" })
	srcUrl: string;

	@prop()
	@ApiProperty({ description: "作者", example: "http://www.baidu.com" })
	author: string;

	@prop()
	@ApiProperty({ description: "类型", example: "热血" })
	tag: string;

	@prop()
	@ApiProperty({ description: "最后更新", example: "2020-01-23 01:44:42" })
	lastUpdateAt: string;

	@prop()
	@ApiProperty({ description: "封面地址", example: "http://www.baidu.com" })
	cover: string;

	@arrayProp({ itemsRef: "Season" })
	@ApiProperty({ description: "所有集" })
	seasons: Ref<Season>[];
}
