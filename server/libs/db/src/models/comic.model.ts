import { prop } from "@typegoose/typegoose";
import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model";

export class Comic extends BaseModel {
	@prop()
	@ApiProperty({ description: "漫画名称", example: "name" })
	name: string;

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
}
