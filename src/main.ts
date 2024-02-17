import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.enableCors();
  // @ts-ignore
  await app.listen(process.env.PORT, hostname: '0.0.0.0');
}
bootstrap();
