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
    ValidationPipe 
    } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';

import { ActorDto } from './actor.dto';
import { ActorService } from './actor.service';

    
@Controller('actors')
export class ActorController {
    constructor( private readonly ActorService: ActorService) { }
    // Get By Slug
    @Get('slug/:slug')
    async getBySlug(@Param('slug') slug: string){
        return this.ActorService.getBySlug(slug)
    }
    // Get All 
    @Get()
    async getAll(@Query('search') search?: string){
        return this.ActorService.getAll(search)
    }
    // Create(Admin)
    @Post()
    @UsePipes(new ValidationPipe())
    @Auth('admin')
    async create() {
        return this.ActorService.create()
    }
    //Get By Id(Admin)    
    @Get(':id')
    @Auth('admin')
    async getById(@Param('id', IdValidationPipe) id: string) {
        return this.ActorService.getById(id)
    }
    // Update(Admin)
    @Put(':id')
    @UsePipes(new ValidationPipe())
    @Auth('admin')
    async update(@Param('id', IdValidationPipe) id: string, @Body() dto: ActorDto) {
        return this.ActorService.update(id, dto)
    }
    // Delete(Admin)
    @Delete(':id')
    @Auth('admin')
    async delete(@Param('id', IdValidationPipe) id: string) {
        return this.ActorService.delete(id)
    }
}
