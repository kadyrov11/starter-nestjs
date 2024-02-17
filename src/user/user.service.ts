import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { UserModel } from './user.model';
import { UpdateUserDto } from './dto/updateUser.dto';
import { genSalt, hash } from 'bcryptjs';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
  ) {}

  // GET USER BY ID
  async getById(_id: Types.ObjectId) {
    const user = await this.UserModel.findById(_id);

    if (!user) throw new NotFoundException('User is not found.');

    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
  }

  // UPDATE PROFILE
  async updateProfile(
    _id: Types.ObjectId,
    data: UpdateUserDto,
    adminId: Types.ObjectId,
  ) {
    const user = await this.UserModel.findById(_id);
    const isEmail = await this.UserModel.findOne({ email: data.email });
    const { isAdmin } = await this.UserModel.findById(adminId);

    if (!user) throw new NotFoundException('User is not found.');

    if (isEmail && String(_id) !== String(user._id))
      throw new ForbiddenException('User with this email already exists.');

    user.email = data.email;

    if (data.password) {
      const salt = await genSalt(11);
      user.password = await hash(data.password, salt);
    }

    if (typeof data.IsAdmin === 'boolean' && isAdmin)
      user.isAdmin = data.IsAdmin;

    await user.save();

    return { message: 'Profile has been updated' };
  }
  // TOGGLE FAVORITE
  async toggleFavorite(movieId: Types.ObjectId, user: UserModel) {
    const { _id, favorites } = user;
    const toggleOperator = favorites.includes(movieId) ? '$pull' : '$push';

    await this.UserModel.findByIdAndUpdate(
      _id,
      { [toggleOperator]: { favorites: movieId } },
      { new: true },
    );

    return { message: 'Favorites have been updated' };
  }
  // GET FAVORITES
  async getFavorites(userId: Types.ObjectId) {
    const { favorites } = await this.UserModel.findById(userId, 'favorites')
      .populate({
        path: 'favorites',
        populate: { path: 'genres' },
      })
      .exec();

    return favorites;
  }
  // Get Users Count(Admin)
  async getCount() {
    const usersCount = await this.UserModel.find().count().exec();
    return { usersCount };
  }

  // Get All Users(Admin)
  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return await this.UserModel.find(options)
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  // Delete User Profile(Admin)
  async delete(id: Types.ObjectId) {
    await this.UserModel.findByIdAndDelete(id).exec();
    return { message: 'User has been deleted' };
  }
}
