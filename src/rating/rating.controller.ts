import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { RatingService } from './rating.service';
import { RatingDto } from './reating.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../user/decorators/user.decorator';
import { IdValidationPipe } from '../pipes/id.validation.pipe';

@Controller('ratings')
export class RatingController {
  constructor(private readonly RatingService: RatingService) {}
  // GET MOVIE RATING
  @Get(':movieId')
  @Auth()
  async getMovieRating(
    @User('_id') _id: Types.ObjectId,
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
  ) {
    return this.RatingService.getMovieRating(movieId, _id);
  }
  // Get Favorites
  @Get('profile/favorites')
  @Auth()
  async getFavorites(@User('_id') _id: Types.ObjectId) {}
  // SET MOVIE RATING
  @Put(':movieId')
  @UsePipes(new ValidationPipe())
  @Auth()
  async setMovieRating(
    @Body() { value }: RatingDto,
    @User('_id') _id: Types.ObjectId,
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
  ) {
    return this.RatingService.setMovieRating(_id, value, movieId);
  }
}
