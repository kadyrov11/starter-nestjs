import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

import { Types } from 'mongoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { RatingModel } from './rating.model';
import { MovieService } from '../movie/movie.service';
@Injectable()
export class RatingService {
  constructor(
    @InjectModel(RatingModel)
    private readonly ratingModel: ModelType<RatingModel>,
    private readonly movieService: MovieService,
  ) {}
  // GET MOVIE RATING
  async getMovieRating(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return this.ratingModel
      .findOne({ movieId, userId })
      .select('value')
      .exec()
      .then((data) => (data ? data.value : 0));
  }
  // GET AVERAGE RATING
  async getAverageRating(movieId: Types.ObjectId | string) {
    const ratingsMovie: RatingModel[] = await this.ratingModel
      .aggregate()
      .match({ movieId: new Types.ObjectId(movieId) })
      .exec();

    return (
      ratingsMovie.reduce((acc, item) => acc + item.value, 0) /
        ratingsMovie.length || 0
    );
  }
  // SET MOVIE RATING
  async setMovieRating(
    userId: Types.ObjectId,
    value: number,
    movieId: Types.ObjectId,
  ) {
    const newRating = await this.ratingModel.findOneAndUpdate(
      { movieId, userId },
      {
        userId,
        movieId,
        value,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const rating = await this.getAverageRating(movieId);

    await this.movieService.setRating(movieId, rating);

    return newRating;
  }
}
