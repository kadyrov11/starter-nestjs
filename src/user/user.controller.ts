import {
  Controller,
  Get,
  Put,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { Types } from 'mongoose';
import { UserModel } from './user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // Get Profile
  @Get('profile')
  @Auth()
  async getProfile(@User('_id') _id: Types.ObjectId) {
    return this.userService.getById(_id);
  }
  // Get Favorites
  @Get('profile/favorites')
  @Auth()
  async getFavorites(@User('_id') _id: Types.ObjectId) {
    return this.userService.getFavorites(_id);
  }
  // Set Favorites
  @Patch('profile/favorites/:movieId')
  @Auth()
  async toggleFavorite(
    @User() user: UserModel,
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
  ) {
    return this.userService.toggleFavorite(movieId, user);
  }
  // Get All Users(Admin)
  @Get()
  @Auth('admin')
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.userService.getAll(searchTerm);
  }
  // Get Users Count(Admin)
  @Get('count')
  @Auth('admin')
  async getUsersCount() {
    return this.userService.getCount();
  }
  // Get User Profile(Admin)
  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id', IdValidationPipe) id: Types.ObjectId) {
    return this.userService.getById(id);
  }
  // Update Profile
  @Put('profile')
  @UsePipes(new ValidationPipe())
  @Auth()
  async updateProfile(
    @User('_id') _id: Types.ObjectId,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(_id, dto, _id);
  }
  // Update User Profile(Admin)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) id: Types.ObjectId,
    @Body() dto: UpdateUserDto,
    @User('_id') adminId: Types.ObjectId,
  ) {
    return this.userService.updateProfile(id, dto, adminId);
  }
  // Delete User Profile(Admin)
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @Auth('admin')
  async deleteUser(@Param('id', IdValidationPipe) id: Types.ObjectId) {
    return this.userService.delete(id);
  }
}
