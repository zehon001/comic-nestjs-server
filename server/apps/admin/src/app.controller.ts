import { Controller, Get, Post, UseInterceptors, Req, UploadedFile } from "@nestjs/common";
import { AppService } from "./app.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Post("upload")
	@UseInterceptors(FileInterceptor("file"))
	async upload(@UploadedFile("file") file) {
		return {
			url: `http://localhost:3008/uploads/${file.filename}`
		};
	}

	@Get("option")
	option() {
		return {
			items: [
				{
					title: "漫画管理",
					items: [
						{ title: "首页", path: "/" },
						{ title: "漫画列表", path: "/comics/list" },
						{ title: "集列表", path: "/seasons/list" }
					]
				},
				{
					title: "用户管理",
					items: [{ title: "用户列表", path: "/users/list" }]
				}
			]
		};
	}
}
