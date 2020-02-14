import { prop } from "@typegoose/typegoose";
import { ApiProperty } from "@nestjs/swagger";
import { BaseModel } from "./base.model";
import { hashSync } from "bcryptjs";

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
}
