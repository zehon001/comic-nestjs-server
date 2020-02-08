import { Controller, Get } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { AdminUser } from "@lib/db/models/adminuser.model";
import { Crud } from "nestjs-mongoose-crud";
import { ApiTags } from "@nestjs/swagger";
import AppDF from "../app.define";

@Crud({
	model: AdminUser
})
@Controller("users")
@ApiTags("用户列表")
export class UsersController {
	constructor(@InjectModel(AdminUser) private readonly model) {}

	@Get("option")
	option() {
		return AppDF.WebOption.users_list;
	}
}
