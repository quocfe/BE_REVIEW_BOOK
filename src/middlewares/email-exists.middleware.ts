import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class EmailExistsMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UserService) {}

  async use(req: Request, res: Response, next: () => void) {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }

    next();
  }
}
