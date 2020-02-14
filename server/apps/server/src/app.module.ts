import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DbModule } from "@lib/db";
import { MulterModule } from "@nestjs/platform-express";
import { ComicModule } from "./comic/comic.module";
import { AuthModule } from "./auth/auth.module";
@Module({
	imports: [
		MulterModule.register({
			dest: "uploads"
		}),
		// CommonModule,
		DbModule,
		ComicModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
