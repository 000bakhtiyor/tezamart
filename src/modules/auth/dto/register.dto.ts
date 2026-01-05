import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, Matches, Min, MinLength } from "class-validator";

export class RegisterDto{

    @ApiProperty({
        description: 'Username of the user',
        example: 'john_doe',
    })
    @MinLength(4, {
        message: 'Username must be between 4 and 20 characters long',
    })
    @IsString()
    username: string;

    @ApiProperty({
        description: 'Password of the user',
        example: 'StrongP@ssw0rd!',
    })
    @MinLength(6, {
        message: 'Password must be at least 6 characters long',
    })
    @IsString()
    password: string;

    @ApiProperty({
        description: 'Email of the user',
        example: 'john_doe@example.com',
    })
    @IsString()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: 'Email format is invalid',
    })
    email: string;
}