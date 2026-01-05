import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class LanguageDto {

    @ApiProperty({ default: '' })
    @IsOptional()
    @IsString()
    uz: string;

    @ApiProperty({ default: '' })
    @IsOptional()
    @IsString()
    ru: string;

    @ApiProperty({ default: '' })
    @IsOptional()
    @IsString()
    en: string;

    @ApiProperty({ default: '' })
    @IsOptional()
    @IsString()
    krill: string;
}