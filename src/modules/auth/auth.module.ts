import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database/database.module';

import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { UserService } from 'src/modules/user/user.service';
import { User, UserSchema } from 'src/schemas/users.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/schemas/refreshTokens.schema';
import { LoginMiddleware } from 'src/middlewares/user.middleware';
import { RefreshTokenMiddleware } from 'src/middlewares/refresh_token.middleware';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes('/auth/login');
    consumer.apply(RefreshTokenMiddleware).forRoutes('/auth/refresh_token');
    consumer.apply(RefreshTokenMiddleware).forRoutes('/auth/logout');
  }
}
