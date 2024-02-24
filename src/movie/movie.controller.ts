import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Query,
  Param,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { MovieDto } from './dto/movie.dto';
import { MovieService } from './movie.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { IdValidationPipe } from '../pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { GenreIdsDto } from './dto/genre-ids.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly MovieService: MovieService) {}
  // Get By Slug
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.MovieService.getBySlug(slug);
  }
  // Get Movies By Actor
  @Get('actor/:actorId')
  async getByActor(
    @Param('actorId', IdValidationPipe) actorId: Types.ObjectId,
  ) {
    return this.MovieService.getByActor(actorId);
  }
  // Get Movies By Genres
  @Post('by-genres')
  @HttpCode(200)
  // @UsePipes(new ValidationPipe())
  async getByGenres(@Body() dto: GenreIdsDto) {
    return this.MovieService.getByGenres(dto);
  }
  // Get All
  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.MovieService.getAll(searchTerm);
  }
  // Get Most Watched
  @Get('most-popular')
  async getMostWatched() {
    return this.MovieService.getMostWatched();
  }
  // Set Views
  @Put('set-views/:slug')
  async setViews(@Param('slug') slug: string) {
    return this.MovieService.setViews(slug);
  }
  // Create(Admin)
  @Post()
  @UsePipes(new ValidationPipe())
  @Auth('admin')
  async create() {
    return this.MovieService.create();
  }
  //Get By Id(Admin)
  @Get(':id')
  @Auth('admin')
  async getById(@Param('id', IdValidationPipe) id: string) {
    return this.MovieService.getById(id);
  }
  // Update(Admin)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: MovieDto,
  ) {
    return this.MovieService.update(id, dto);
  }
  // Delete(Admin)
  @Delete(':id')
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.MovieService.delete(id);
  }
}
