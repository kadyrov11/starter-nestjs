import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { RatingModel } from './rating.model';
import { MovieModule } from '../movie/movie.module';

@Module({
  providers: [RatingService],
  controllers: [RatingController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RatingModel,
        schemaOptions: {
          collection: 'Rating',
        },
      },
    ]),
    MovieModule,
  ],
})
export class RatingModule {}
