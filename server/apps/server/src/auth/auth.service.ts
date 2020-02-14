import { Injectable } from "@nestjs/common";
import { AuthRegisterDto } from "./auth.dto";
import { InjectModel } from "nestjs-typegoose";
import { User } from "@lib/db/models/user.model";
import { ModelType, DocumentType } from "@typegoose/typegoose/lib/types";
import { StatusException } from "filters/status.exception";
import { compareSync } from "bcryptjs";

@Injectable()
export class AuthService {
	constructor(@InjectModel(User) private readonly userModel: ModelType<User>) {}
	async validateUser(username: string, password: string): Promise<DocumentType<User> | null> {
		const user = await this.userModel.findOne({ username }).select("+password");
		if (user) {
			if (!compareSync(password, user.password)) throw new StatusException("密码不正确");
		} else throw new StatusException("用户名不存在!");
		return user;
	}
	async validateUserById(id: string): Promise<DocumentType<User> | null> {
		const user = await this.userModel.findById(id);
		return user;
	}
	async register(registerDto: AuthRegisterDto) {
		const count = await this.userModel.find({ username: registerDto.username }).countDocuments();
		if (count > 0) throw new StatusException("用户名已存在");
		else {
			return this.userModel.create(registerDto);
		}
	}
}
