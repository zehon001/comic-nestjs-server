import { Controller, Get, Post, UseInterceptors, Req, UploadedFile } from "@nestjs/common";
import { AppService } from "./app.service";
import { FileInterceptor } from "@nestjs/platform-express";
import AppDF from "./app.define";

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
		return AppDF.WebOption.index;
	}
}
