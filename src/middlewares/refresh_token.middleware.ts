import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { Auth } from 'src/enums/Auth.enum';
import {
  RefreshToken,
  RefreshTokenDocument,
} from 'src/schemas/refreshTokens.schema';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw new HttpException(Auth.REFRESH_IS_REQUIRED, HttpStatus.BAD_REQUEST);
    }
    const [verify, token] = await Promise.all([
      this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      }),
      this.refreshTokenModel.findOne({ token: refresh_token }),
    ]);
    if (!token) {
      throw new HttpException(
        Auth.REFRESH_TOKEN_NOT_EXISTS,
        HttpStatus.NOT_FOUND,
      );
    }
    req.decode_refresh_token = verify as Token;
    next();
  }
}
