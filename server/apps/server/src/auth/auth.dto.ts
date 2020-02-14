import { ApiProperty } from "@nestjs/swagger";

export class AuthRegisterDto {
	/**用户名 */
	@ApiProperty({ description: "用户名", example: "user" })
	username: string;
	/**密码 */
	@ApiProperty({ description: "密码", example: "password" })
	password: string;
}

export class AuthLoginDto extends AuthRegisterDto {}
