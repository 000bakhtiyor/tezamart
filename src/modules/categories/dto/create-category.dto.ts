import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { LanguageDto } from "src/common/dtos/language.dto";

export class CreateCategoryDto {

    @ApiProperty({ type: LanguageDto })
    @ValidateNested()
    @Type(() => LanguageDto)
    name: LanguageDto;
}
