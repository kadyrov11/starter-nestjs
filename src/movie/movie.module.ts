import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { MovieModel } from './movie.model';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  providers: [MovieService],
  controllers: [MovieController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: MovieModel,
        schemaOptions:{
          collection: 'Movie'
        }
      }
    ]) 
  ], 
  exports: [MovieService]
})
export class MovieModule {}
