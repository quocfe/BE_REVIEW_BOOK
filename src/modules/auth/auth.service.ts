import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from 'src/enums/Auth.enum';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { UserService } from 'src/modules/user/user.service';
import {
  RefreshToken,
  RefreshTokenDocument,
} from 'src/schemas/refreshTokens.schema';
import { User, UserDocument } from 'src/schemas/users.schema';
import { hashValue } from 'src/utils/bcrypt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private signAccessToken({ user_id }: { user_id: string }) {
    return this.jwtService.sign(
      { user_id },
      {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        expiresIn: '1d',
      },
    );
  }

  private signRefeshToken({ user_id, exp }: { user_id: string; exp?: number }) {
    if (exp) {
      const currentTimestamp = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại (UNIX timestamp)
      const expiresIn = exp - currentTimestamp; // Thời gian hết hạn tính bằng giây từ thời điểm hiện tại
      return this.jwtService.sign(
        { user_id },
        {
          secret: process.env.REFRESH_TOKEN_SECRET_KEY,
          expiresIn: expiresIn,
        },
      );
    }
    return this.jwtService.sign(
      { user_id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
        expiresIn: '10d',
      },
    );
  }

  async signTokens({ user_id }: { user_id: string }) {
    return await Promise.all([
      this.signAccessToken({ user_id }),
      this.signRefeshToken({ user_id }),
    ]);
  }

  async signAndSaveRefreshToken(user_id: string) {
    const [asscessToken, refreshToken] = await this.signTokens({ user_id });
    const { exp, iat } = await this.decodeRefreshToken(refreshToken);

    new this.refreshTokenModel({
      token: refreshToken,
      exp,
      iat,
      user_id,
    }).save();

    return { asscessToken, refreshToken };
  }

  async decodeRefreshToken(refreshToken: string) {
    return this.jwtService.decode(refreshToken);
  }

  async register(body: RegisterDto) {
    const checkEmail = await this.userService.findByEmail(body.email);

    if (checkEmail) {
      throw new HttpException(Auth.EMAIL_EXISTS, HttpStatus.BAD_REQUEST);
    }

    const hashPassword = hashValue(body.password);

    const user = new this.userModel({
      ...body,
      password: hashPassword,
    });

    return user.save();
  }

  async login(user_id: string) {
    const [asscessToken, refreshToken] = await this.signTokens({
      user_id,
    });
    const { exp, iat } = await this.decodeRefreshToken(refreshToken);

    new this.refreshTokenModel({
      token: refreshToken,
      exp,
      iat,
      user_id,
    }).save();

    return { asscessToken, refreshToken };
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new HttpException(Auth.USER_NOT_EXISTS, HttpStatus.BAD_REQUEST);
    }

    const userDb = await this.userService.findByEmail(req.user.email);

    if (userDb) {
      const user_id = userDb._id.toString();
      const { asscessToken, refreshToken } =
        await this.signAndSaveRefreshToken(user_id);

      return { asscessToken, refreshToken };
    } else {
      const username = req.user.email.split('@')[0];

      const user = {
        email: req.user.email,
        username: username,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        avatar: req.user.picture,
      };

      const newUser = await this.userModel.create(user);

      const { asscessToken, refreshToken } = await this.signAndSaveRefreshToken(
        newUser._id.toString(),
      );

      return { asscessToken, refreshToken };
    }
  }

  async refresh_token(user_id: string, exp: number, refresh_token: string) {
    const [asscessToken, refreshToken] = await Promise.all([
      this.signAccessToken({ user_id }),
      this.signRefeshToken({ user_id, exp }),
      this.refreshTokenModel.deleteOne({ token: refresh_token }).exec(),
    ]);

    return { asscessToken, refreshToken };
  }

  async logout(user_id: string, refresh_token: string) {
    await this.refreshTokenModel
      .findOneAndDelete({
        token: refresh_token,
        user_id,
      })
      .exec();
  }
}
