import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'src/decorators/public-decorator';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { AuthService } from './auth.service';
import { User, UserDocument } from 'src/schemas/users.schema';
import { GoogleOAuthGuard } from 'src/modules/auth/guard/google-oauth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<ResType> {
    const result = await this.authService.register(registerDto);
    return {
      data: result,
      message: 'Register success',
      statusCode: 200,
    };
  }

  @Public()
  @Post('/login')
  async login(@Req() req: Request): Promise<ResType> {
    const user = req.user as UserDocument;
    const user_id = user._id.toString();
    const role = user.role;
    const result = await this.authService.login({ user_id, role });
    return {
      data: result,
      message: 'login success',
      statusCode: 200,
    };
  }

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('/google/login')
  async googleAuth(@Req() req: Request) {
    console.log('req in googleAuth', req);
  }

  @Public()
  @UseGuards(GoogleOAuthGuard)
  @Get('/google-redirect')
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.googleLogin(req);
    res.redirect(
      `${process.env.CLIENT_URL}/login/?token=${result.asscessToken}&refresh_token=${result.refreshToken}`,
    );
  }

  @Public()
  @Post('/refresh_token')
  async refresh_token(@Req() req: Request): Promise<ResType> {
    const { user_id, exp, role } = req.decode_refresh_token;
    const refresh_token = req.body.refresh_token;
    const result = await this.authService.refresh_token(
      user_id,
      role,
      exp,
      refresh_token,
    );
    return {
      data: { result },
      message: 'refresh success',
      statusCode: 200,
    };
  }

  @Post('/logout')
  async logout(@Req() req: Request): Promise<ResType> {
    const { user_id } = req.decode_refresh_token;
    const { refresh_token } = req.body;
    await this.authService.logout(user_id, refresh_token);
    return {
      data: { user_id },
      message: 'logout success',
      statusCode: 200,
    };
  }
}
