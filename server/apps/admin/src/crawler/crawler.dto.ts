import { ApiProperty } from "@nestjs/swagger";

export class CrawlerSearchDto {
	@ApiProperty({ description: "搜索内容", example: "进击的巨人" })
	content?: string;
	@ApiProperty({ description: "指定搜索的解析器", example: "" })
	useParser?: string;
}
