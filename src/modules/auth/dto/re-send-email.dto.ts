import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ReSendEmailDto {
    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    @IsString()
    email: string;
}