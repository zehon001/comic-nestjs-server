import { prop } from "@typegoose/typegoose";
import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model";
import { hashSync } from "bcryptjs";

export class AdminUser extends BaseModel {
	@prop()
	@ApiProperty({ description: "用户名", example: "user" })
	username: string;

	@prop({
		get(val) {
			return val;
		},
		set(val) {
			return hashSync(val, 1);
		}
	})
	@ApiProperty({ description: "密码", example: "pwd" })
	password: string;
}
