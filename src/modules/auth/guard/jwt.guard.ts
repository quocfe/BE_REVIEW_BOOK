import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public-decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Lấy đối tượng request từ context
    const request = context.switchToHttp().getRequest();
    const url: string = request.url;
    // Cho phép truy cập vào các route bắt đầu bằng /public
    if (url.startsWith('/public')) {
      return true;
    }

    return super.canActivate(context);
  }
}
