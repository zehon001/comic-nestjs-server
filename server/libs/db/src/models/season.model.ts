import { prop, Ref, arrayProp } from "@typegoose/typegoose";
import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model";
import { Comic } from "./comic.model";

/**集信息 */
export class Season extends BaseModel {
	@prop({ ref: "Comic" })
	@ApiProperty({ description: "所属漫画", example: "comic" })
	comic: Ref<Comic>;

	@prop()
	@ApiProperty({ description: "集名称", example: "name" })
	name: string;

	@prop()
	@ApiProperty({ description: "集索引", example: 0 })
	sidx: number;

	@prop({ unique: true })
	@ApiProperty({ description: "集的源地址", example: "name" })
	srcUrl: string;

	@prop()
	@ApiProperty({ description: "集类型(normal/other)", example: "normal" })
	type: string;

	@arrayProp({ type: String })
	@ApiProperty({ description: "所有图片" })
	images: Array<string>;

	// @prop()
	// @ApiProperty({ description: "状态"})
	// state: Array<string>;
}
