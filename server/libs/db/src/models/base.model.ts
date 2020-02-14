import { modelOptions } from "@typegoose/typegoose";

@modelOptions({
	schemaOptions: {
		timestamps: true,
		toJSON: { virtuals: true, versionKey: false },
		toObject: { virtuals: true, versionKey: false }
	}
})
export class BaseModel {}
