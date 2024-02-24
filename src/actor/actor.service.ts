import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { ActorModel } from './actor.model';
import { ActorDto } from './actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>,
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
        ],
      };
    }

    return await this.ActorModel.aggregate()
      .match(options)
      .lookup({
        from: 'Movie',
        localField: '_id',
        foreignField: 'actors',
        as: 'movies',
      })
      .addFields({
        moviesCount: {
          $size: '$movies',
        },
      })
      .project({ __v: 0, updatedAt: 0, movies: 0 })
      .sort({ createdAt: -1 })
      .exec();
  }
  // Get One By Slug
  async getBySlug(slug: string) {
    const actor = await this.ActorModel.findOne({ slug }).exec();

    if (!actor) throw new NotFoundException('Actor is not found.');

    return actor;
  }
  // ADMIN

  // Create Default value
  async create() {
    const defaultValue: ActorDto = {
      name: '',
      slug: '',
      image: '',
    };
    const actor = await this.ActorModel.create(defaultValue);

    return actor._id;
  }
  // Get One By Id
  async getById(_id: string) {
    const actor = await this.ActorModel.findById(_id);

    if (!actor) throw new NotFoundException('Actor is not found.');

    return actor;
  }
  // Get Collections
  async getCollections() {
    const actors = await this.getAll();
    const collections = actors;

    return collections;
  }
  // Update
  async update(_id: string, data: ActorDto) {
    const actor = await this.ActorModel.findByIdAndUpdate(_id, data, {
      new: true,
    }).exec();

    if (!actor) throw new NotFoundException('Actor is not found');

    return actor;
  }
  // Delete
  async delete(id: string) {
    await this.ActorModel.findByIdAndDelete(id).exec();
    return { message: 'Genre has been deleted' };
  }
}
