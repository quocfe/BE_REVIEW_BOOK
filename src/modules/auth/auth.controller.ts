import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/decorators/public-decorator';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { AuthService } from './auth.service';
import { User, UserDocument } from 'src/schemas/users.schema';
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

    const result = await this.authService.login(user_id);
    return {
      data: result,
      message: 'login success',
      statusCode: 200,
    };
  }

  @Public()
  @Post('/refresh_token')
  async refresh_token(@Req() req: Request): Promise<ResType> {
    const { user_id, exp } = req.decode_refresh_token;
    const refresh_token = req.body.refresh_token;
    const result = await this.authService.refresh_token(
      user_id,
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
