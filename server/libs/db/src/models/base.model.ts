import { modelOptions } from "@typegoose/typegoose";

@modelOptions({
	schemaOptions: {
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
})
export class BaseModel {}
