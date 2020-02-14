import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";

import { StatusInterceptor } from "filters/status.interceptor";
import { StatusFilter } from "filters/status.filter";
import AppDF from "./app.define";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: ["log", "error", "warn", "debug", "verbose"]
	});

	app.useGlobalFilters(new StatusFilter());
	app.useGlobalInterceptors(new StatusInterceptor());
	app.enableCors();
	app.setGlobalPrefix(AppDF.GLOBAL_PREFIX);

	app.useStaticAssets("uploads", {
		prefix: "/uploads"
	});
	const options = new DocumentBuilder()
		.setTitle("Nestjs漫画服务器前端API-接口文档")
		.setDescription("漫画前端界面使用")
		.setVersion("1.0")
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup("api-docs", app, document);

	await app.listen(AppDF.SERVER_PORT);
	console.log("http://localhost:" + AppDF.SERVER_PORT);
}
bootstrap();
