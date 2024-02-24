import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { MovieModel } from './movie.model';
import { MovieDto } from './dto/movie.dto';
import { GenreIdsDto } from './dto/genre-ids.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
  ) {}

  // Get All
  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.MovieModel.find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('genres actors')
      .exec();
  }
  // Get One By Slug
  async getBySlug(slug: string) {
    const movie = await this.MovieModel.findOne({ slug })
      .populate('genres actors')
      .exec();

    if (!movie) throw new NotFoundException('Movie is not found.');

    return movie;
  }
  // Get Movies By Genres
  async getByGenres({ genreIds }: GenreIdsDto) {
    const movies = await this.MovieModel.find({
      genres: { $in: genreIds },
    }).exec();

    if (!movies) throw new NotFoundException('Movies are not found.');

    return movies;
  }
  // Get Movies By Actor
  async getByActor(actorId: Types.ObjectId) {
    const movies = await this.MovieModel.find({ actors: actorId }).exec();

    if (!movies) throw new NotFoundException('Movies are not found.');

    return movies;
  }
  // Set Views
  async setViews(slug: string) {
    const movie = await this.MovieModel.findOneAndUpdate(
      { slug },
      {
        $inc: { views: 1 },
      },
      { new: true },
    ).exec();

    if (!movie) throw new NotFoundException('Movie is not found');

    return movie;
  }
  // Set Rating
  async setRating(movieId: Types.ObjectId, rating: number) {
    return this.MovieModel.findByIdAndUpdate(
      movieId,
      { rating },
      { new: true },
    ).exec();
  }
  // Get Most Watched Movies
  async getMostWatched() {
    return await this.MovieModel.find({ views: { $gt: 0 } })
      .sort({ views: -1 })
      .populate('genres')
      .exec();
  }

  // ADMIN

  // Create Default value
  async create() {
    const defaultValue: MovieDto = {
      poster: '',
      bigPoster: '',
      title: '',
      slug: '',
      videoUrl: '',
      genres: [],
      actors: [],
      // parameters: {
      //     year: new Date().getFullYear(),
      //     duration: 0,
      //     country: ''
      // }
    };
    const movie = await this.MovieModel.create(defaultValue);

    return movie._id;
  }
  // Get One By Id
  async getById(_id: string) {
    const movie = await this.MovieModel.findById(_id);

    if (!movie) throw new NotFoundException('Movie is not found.');

    return movie;
  }
  // Get Collections
  async getCollections() {
    const movies = await this.getAll();
    const collections = movies;

    return collections;
  }
  // Update
  async update(_id: string, data: MovieDto) {
    // Telegram Notification

    const movie = await this.MovieModel.findByIdAndUpdate(_id, data, {
      new: true,
    }).exec();

    if (!movie) throw new NotFoundException('Movie is not found');

    return movie;
  }
  // Delete
  async delete(id: string) {
    await this.MovieModel.findByIdAndDelete(id).exec();
    return { message: 'Movie has been deleted' };
  }
}
