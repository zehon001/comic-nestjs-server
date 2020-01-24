import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DbModule } from "@lib/db";
import { UsersModule } from "./users/users.module";
import { ComicsModule } from "./comics/comics.module";
import { MulterModule } from "@nestjs/platform-express";
import { CrawlerModule } from './crawler/crawler.module';
import { SeasonsModule } from './seasons/seasons.module';

@Module({
	imports: [
		MulterModule.register({
			dest: "uploads"
		}),
		DbModule,
		UsersModule,
		ComicsModule,
		CrawlerModule,
		SeasonsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
