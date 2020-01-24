import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: ["log", "error", "warn", "debug", "verbose"]
	});
	app.enableCors();
	app.useStaticAssets("uploads", {
		prefix: "/uploads"
	});
	const options = new DocumentBuilder()
		.setTitle("Nestjs漫画后台管理API-接口文档")
		.setDescription("后台管理界面使用")
		.setVersion("1.0")
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup("api-docs", app, document);

	await app.listen(3008);
	console.log("http://localhost:3008");
}
bootstrap();
