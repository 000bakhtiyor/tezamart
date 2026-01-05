import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, Matches, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({ example: 'johndoe', description: 'The username of the user' })
    @IsString()
    @Length(6, 20, {
        message: 'Username uzunligi kamida 6 ta va maksimal 20 ta belgi bo\'lishi kerak',
    })
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'Username faqat harflar, raqamlar va pastki chiziqlarni o\'z ichiga olishi mumkin',
    })
    username: string;

    @ApiProperty({ example: 'strongpassword123', description: 'The password of the user' })
    @IsString()
    @Length(8, 50, {
        message: 'Parol uzunligi kamida 8 ta va maksimal 50 ta belgi bo\'lishi kerak',
    })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, {
        message: 'Parol kamida bitta harf va bitta raqamni o\'z ichiga olishi kerak',
    })
    password: string;

    @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
    @IsString()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
        message: 'Email formati noto\'g\'ri',
    })
    email: string;
}
