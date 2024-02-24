import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Query,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { genreDto } from './dto/genre.dto';
import { GenreService } from './genre.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { IdValidationPipe } from '../pipes/id.validation.pipe';
@Controller('genres')
export class GenreController {
  constructor(private readonly GenreService: GenreService) {}
  // Get By Slug
  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.GenreService.getBySlug(slug);
  }
  // Get Collections
  @Get('collections')
  async getCollections() {
    return this.GenreService.getCollections();
  }
  // Get All
  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.GenreService.getAll(searchTerm);
  }
  // Create(Admin)
  @Post()
  @UsePipes(new ValidationPipe())
  @Auth('admin')
  async create() {
    return this.GenreService.create();
  }
  //Get By Id(Admin)
  @Get(':id')
  @Auth('admin')
  async getById(@Param('id', IdValidationPipe) id: string) {
    return this.GenreService.getById(id);
  }
  // Update(Admin)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: genreDto,
  ) {
    return this.GenreService.update(id, dto);
  }
  // Delete(Admin)
  @Delete(':id')
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.GenreService.delete(id);
  }
}
