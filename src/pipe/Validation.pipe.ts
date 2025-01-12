import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  ValidationPipe,
  ValidationError,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        const firstError = errors[0]; // Lấy lỗi đầu tiên
        const errorMessages = Object.values(firstError.constraints || {});
        const message = errorMessages[0]; // Lấy thông báo lỗi đầu tiên

        return new UnprocessableEntityException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message,
        });
      },
    });
  }
}
