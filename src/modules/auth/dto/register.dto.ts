import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPasswordMatch', async: false })
class IsPasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(confirm_password: string, args: ValidationArguments) {
    const object = args.object as RegisterDto;
    return confirm_password === object.password; // So sánh với trường password
  }

  defaultMessage(args: ValidationArguments) {
    return 'Mật khẩu xác nhận không khớp với mật khẩu'; // Thông báo lỗi nếu không khớp
  }
}

export class RegisterDto {
  @ApiProperty({
    description: 'email',
    default: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'username',
    default: 'user',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'firstname',
    default: 'firstname',
  })
  @IsEmpty()
  firstname: string;

  @ApiProperty({
    description: 'lastname',
    default: 'lastname',
  })
  @IsEmpty()
  lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @Matches(/^\S+$/, {
    message: 'Mật khẩu không được có khoảng trắng',
  })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Mật khẩu phải có ít nhất một chữ cái và một số',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6, { message: 'Mật khẩu xác nhận phải có ít nhất 8 ký tự' })
  @Validate(IsPasswordMatchConstraint, {
    message: 'Mật khẩu xác nhận không khớp với mật khẩu',
  })
  confirm_password: string;
}
