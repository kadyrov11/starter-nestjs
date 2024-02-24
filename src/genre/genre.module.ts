import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';

import { GenreModel } from './genre.model';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { MovieModule } from '../movie/movie.module';
@Module({
  providers: [GenreService],
  controllers: [GenreController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: GenreModel,
        schemaOptions: {
          collection: 'Genre',
        },
      },
    ]),
    MovieModule,
    ConfigModule,
  ],

})
export class GenreModule {}
