import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class LoginDto {

    @ApiProperty({
        example: 'johndoe',
        description: 'The username of the user',
    })
    @IsString()
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'Username faqat harflar, raqamlar va pastki chiziqlarni o\'z ichiga olishi mumkin',
    })
    username: string;

    @ApiProperty({
        example: 'strongpassword123',
        description: 'The password of the user',
    })
    @IsString()
    password: string;
}