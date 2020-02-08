import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DbModule } from "@lib/db";
import { MulterModule } from "@nestjs/platform-express";
import { ComicModule } from "./comic/comic.module";

@Module({
	imports: [
		MulterModule.register({
			dest: "uploads"
		}),
		DbModule,
		ComicModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
