import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyEmailDto {

    @ApiProperty({
        description: 'User email address',
        example: 'user@example.com',
    })
    @IsString()
    email: string;

    @ApiProperty({
        description: 'OTP code sent to user email',
        example: '123456',
    })
    @IsString()
    otpCode: string;
}