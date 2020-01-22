import { Controller, Get } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { User } from "@lib/db/models/user.model";
import { ReturnModelType } from "@typegoose/typegoose";
import { Crud } from "nestjs-mongoose-crud";
import { ApiTags } from "@nestjs/swagger";

@Crud({
	model: User
})
@Controller("users")
@ApiTags("用户")
export class UsersController {
	constructor(@InjectModel(User) private readonly model) {}

	@Get("option")
	option() {
		return {
			title: "用户列表",
			searchMenuSpan: 8, //搜索框占位
			menuType: "icon",
			selection: true,
			column: [
				{
					label: "用户名",
					prop: "username",
					search: true,
					sortable: true,
					regex: true
				},
				{
					label: "密码",
					prop: "password"
				}
			]
		};
	}
}
