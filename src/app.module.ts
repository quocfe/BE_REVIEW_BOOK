import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AllExceptionsFilter } from 'src/common/filter/all-exceptions.filter';
import { AuthorModule } from 'src/modules/admin/author/author.module';
import { BlogModule } from 'src/modules/admin/blog/blog.module';
import { BookModule } from 'src/modules/admin/book/book.module';
import { CategoryModule } from 'src/modules/admin/category/category.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JwtGuard } from 'src/modules/auth/guard/jwt.guard';
import { SeedModule } from 'src/modules/seed/seed.module';
import { UserModule } from 'src/modules/user/user.module';
import { CustomValidationPipe } from 'src/pipe/Validation.pipe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { AdminStrategy } from 'src/common/strategies/admin.strategy';
import { UserService } from 'src/modules/user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    UserModule,
    BookModule,
    AuthorModule,
    BlogModule,
    CategoryModule,
    JwtModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AdminStrategy,
    AdminGuard,
    JwtService,
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
