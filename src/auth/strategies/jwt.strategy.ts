import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { InjectModel } from "nestjs-typegoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserModel } from "src/user/user.model";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
        ){
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: true, 
                secretOrKey: 'jwt1101'   
            })
        }
    
    
    async validate({_id}: Pick<UserModel, '_id'>){
        return this.userModel.findById(_id).exec()
    }
}

// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { jwtConstants } from './constants';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: jwtConstants.secret,
//     });
//   }

//   async validate(payload: any) {
//     return { userId: payload.sub, username: payload.username };
//   }
// }