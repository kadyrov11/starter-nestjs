import { Module } from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static'
import { path } from 'app-root-path';

import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
    providers: [FileService],
    controllers: [FileController],
    imports: [
        ServeStaticModule.forRoot({
            rootPath: `${path}/uploads`,
            serveRoot: '/uploads'
        })
    ]
})
export class FileModule {}
