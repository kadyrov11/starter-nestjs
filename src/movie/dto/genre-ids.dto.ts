import { Types } from "mongoose";
import { IsArray } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";

export class GenreIdsDto {
	@IsArray()
	@IsObjectId({message: 'Invalid format of Id'})
	genreIds: Types.ObjectId[]
}