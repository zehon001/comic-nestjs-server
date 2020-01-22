import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DbModule } from "@lib/db";
import { UsersModule } from "./users/users.module";
import { ComicsModule } from "./comics/comics.module";
import { MulterModule } from "@nestjs/platform-express";

@Module({
	imports: [
		MulterModule.register({
			dest: "uploads"
		}),
		DbModule,
		UsersModule,
		ComicsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
