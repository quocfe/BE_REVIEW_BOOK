import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { Auth } from 'src/enums/Auth.enum';
import { UserService } from 'src/modules/user/user.service';
import {
  RefreshToken,
  RefreshTokenDocument,
} from 'src/schemas/refreshTokens.schema';
import { compareValue } from 'src/utils/bcrypt';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpException(Auth.EMAIL_NOT_EXISTS, HttpStatus.BAD_REQUEST);
    }

    if (!compareValue(body.password, user.password)) {
      throw new HttpException(Auth.PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
    }
    req.user = user;
    next();
  }
}

// @Injectable()
// export class RefreshTokenMiddleware implements NestMiddleware {
//   constructor(
//     @InjectModel(RefreshToken.name)
//     private readonly refreshTokenModel: Model<RefreshTokenDocument>,
//     private userService: UserService,
//     private jwtService: JwtService,
//   ) {}
//   async use(req: Request, res: Response, next: NextFunction) {
//     const { refresh_token } = req.body;
//     console.log('middleware);
//     if (!refresh_token) {
//       throw new HttpException(Auth.REFRESH_IS_REQUIRED, HttpStatus.BAD_REQUEST);
//     }
//     const [verify, token] = await Promise.all([
//       this.jwtService.verify(refresh_token, {
//         secret: process.env.REFRESH_TOKEN_SECRET_KEY,
//       }),
//       this.refreshTokenModel.findOne({ token: refresh_token }),
//     ]);

//     if (!token) {
//       throw new HttpException(
//         Auth.REFRESH_TOKEN_NOT_EXISTS,
//         HttpStatus.NOT_FOUND,
//       );
//     }
//     console.log('verify in middleware', verify);
//     next();
//   }
// }
