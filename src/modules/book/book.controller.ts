import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from 'src/enums/Book.enum';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('/create')
  async create(@Body() createBookDto: CreateBookDto): Promise<ResType> {
    const res = await this.bookService.create(createBookDto);
    return {
      data: res,
      message: Book.BOOK_CREATED,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResType> {
    const res = await this.bookService.findOne(id);

    return {
      data: res,
      message: Book.BOOK_FIND,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  async findAll(): Promise<ResType> {
    const res = await this.bookService.findAll();

    return {
      data: res,
      message: Book.BOOK_ALL,
      statusCode: HttpStatus.OK,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
