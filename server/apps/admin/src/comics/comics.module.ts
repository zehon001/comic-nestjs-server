import { Module } from "@nestjs/common";
import { ComicsController } from "./comics.controller";

@Module({
	controllers: [ComicsController]
})
export class ComicsModule {}
