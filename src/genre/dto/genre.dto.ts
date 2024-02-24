import { IsString } from "class-validator"

export class genreDto {
    @IsString()
    name: string
    @IsString()
    slug: string
    @IsString()
    description: string
    @IsString()
    icon: string
}