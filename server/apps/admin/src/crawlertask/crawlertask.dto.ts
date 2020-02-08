import { ApiProperty } from "@nestjs/swagger";

export class CrawtaskCreateDto {}

export class CrawtaskModifyDto extends CrawtaskCreateDto {}

export class CrawtaskFindQuery {
	@ApiProperty({})
	page?: number;
	@ApiProperty()
	limit?: number;
}
