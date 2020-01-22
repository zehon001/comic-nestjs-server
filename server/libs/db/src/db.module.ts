import { Module, Global } from "@nestjs/common";
import { DbService } from "./db.service";
import { TypegooseModule } from "nestjs-typegoose";
import { User } from "./models/user.model";
import { Comic } from "./models/comic.model";

const models = TypegooseModule.forFeature([User, Comic]);

@Global()
@Module({
	imports: [
		TypegooseModule.forRoot("mongodb://localhost:27017/nestjs-comic-test", {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		}),
		models
	],
	providers: [DbService],

	exports: [DbService, models]
})
export class DbModule {}
