import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book } from 'src/modules/admin/book/entities/book.entity';
import { BookSchema } from 'src/schemas/books.schema';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
