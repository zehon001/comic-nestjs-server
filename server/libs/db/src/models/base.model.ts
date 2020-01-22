import { modelOptions } from "@typegoose/typegoose";

@modelOptions({
    schemaOptions:{
        timestamps:true,
    }
})
export class BaseModel{

}