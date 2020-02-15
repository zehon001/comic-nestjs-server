import { prop, arrayProp, Ref } from "@typegoose/typegoose";
import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model";
import { hashSync } from "bcryptjs";
import { Season } from "./season.model";
import { Comic } from "./comic.model";

export class User extends BaseModel {
	@prop({ unique: true })
	@ApiProperty({ description: "用户名", example: "user" })
	username: string;

	@prop({
		select: false,
		get(val) {
			return val;
		},
		set(val) {
			return hashSync(val, 1);
		}
	})
	@ApiProperty({ description: "密码", example: "pwd" })
	password: string;

	@arrayProp({ itemsRef: "Season" })
	@ApiProperty({ description: "观看的集历史记录" })
	seasonhistory: Ref<Season>[];

	@arrayProp({ itemsRef: "Comic" })
	@ApiProperty({ description: "收藏的漫画" })
	stars: Ref<Comic>[];
}
