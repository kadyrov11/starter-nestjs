import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { GenreModel } from './genre.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genreDto } from './dto/genre.dto';
import { MovieService } from 'src/movie/movie.service';
import { ICollection } from './genre.interface';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
    private readonly MovieService: MovieService,
  ) {}
  // Get All
  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return await this.GenreModel.find(options)
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }
  // Get One By Slug
  async getBySlug(slug: string) {
    const genre = await this.GenreModel.findOne({ slug }).exec();

    if (!genre) throw new NotFoundException('Genre is not found.');

    return genre;
  }
  // ADMIN

  // Create Default value
  async create() {
    const defaultValue: genreDto = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    };
    const genre = await this.GenreModel.create(defaultValue);

    return genre._id;
  }
  // Get One By Id
  async getById(_id: string) {
    const genre = await this.GenreModel.findById(_id);

    if (!genre) throw new NotFoundException('Genre is not found.');

    return genre;
  }
  // Get Collections
  async getCollections() {
    const genres = await this.getAll();
    const collections = await Promise.all(
      genres.map(async (genre) => {
        const moviesByGenre = await this.MovieService.getByGenres({
          genreIds: [genre._id],
        });
        const image = moviesByGenre[0] ? moviesByGenre[0].bigPoster : '';

        const result: ICollection = {
          _id: genre._id,
          slug: genre.slug,
          title: genre.name,
          image,
        };

        return result;
      }),
    );

    return collections;
  }
  // Update
  async update(_id: string, data: genreDto) {
    const genre = await this.GenreModel.findByIdAndUpdate(_id, data, {
      new: true,
    }).exec();

    if (!genre) throw new NotFoundException('Genre is not found');

    return genre;
  }
  // Delete
  async delete(id: string) {
    await this.GenreModel.findByIdAndDelete(id).exec();
    return { message: 'Genre has been deleted' };
  }
}
