import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    });
  }

  validate(req: Request) {
    const token = req.get('authorization').replace('Bearer', '').trim();
    if (!token) throw new ForbiddenException('token token malformed');
    const verify = this.jwtService.verify(token, {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
    });

    if (verify.role === 0) {
      throw new HttpException(
        {
          message: 'access denied',
        },
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
    return { ...verify };
  }
}
