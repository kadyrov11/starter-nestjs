import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { JwtService } from '@nestjs/jwt';
import { genSalt, compare, hashSync } from 'bcryptjs';

import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTER
  async register(dto: AuthDto) {
    const user = await this.UserModel.findOne({ email: dto.email });

    if (user)
      throw new BadRequestException('User with this email already exists!');

    const salt = await genSalt(11);
    const passwordHash = hashSync(dto.password, salt);

    const newUser = await this.UserModel.create({
      email: dto.email,
      password: passwordHash,
    });

    return this.returnUserData(newUser);
  }

  // LOGIN
  async login(dto: AuthDto) {
    const user = await this.validateLoginData(dto);

    const userData = this.returnUserData(user);

    return userData;
  }

  // REFRESH TOKENS
  async refreshTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException();

    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid or expired token.');

    const user = await this.UserModel.findById(result._id);

    const userData = this.returnUserData(user);

    return userData;
  }

  // UTILS
  async validateLoginData(dto: AuthDto): Promise<UserModel> {
    const user = await this.UserModel.findOne({ email: dto.email });

    if (!user) throw new NotFoundException('User is not found.');

    const isPasswordValid = await compare(dto.password, user.password);

    if (!isPasswordValid)
      throw new BadRequestException('Wrong email or password.');

    return user;
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId };

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '3h',
    });

    return { accessToken, refreshToken };
  }

  async returnUserData(userData: UserModel) {
    const tokens = await this.issueTokenPair(`${userData._id}`);

    return {
      user: {
        _id: userData._id,
        email: userData.email,
        isAdmin: userData.isAdmin,
      },
      ...tokens,
    };
  }
}
