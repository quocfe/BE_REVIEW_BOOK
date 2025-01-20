import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Book } from 'src/enums/Book.enum';
import { QuerysDto } from 'src/modules/admin/book/dto/params.dto';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { Public } from 'src/decorators/public-decorator';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(AdminGuard)
  @Post('/create')
  async create(@Body() createBookDto: CreateBookDto): Promise<ResType> {
    const res = await this.bookService.create(createBookDto);
    return {
      data: res,
      message: Book.BOOK_CREATED,
      statusCode: HttpStatus.OK,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResType> {
    const res = await this.bookService.findOne(id);

    return {
      data: res,
      message: Book.BOOK_FIND,
      statusCode: HttpStatus.OK,
    };
  }

  @Public()
  @Get()
  async findAll(@Query() querys: QuerysDto): Promise<ResType> {
    const res = await this.bookService.findAll(querys);

    return {
      data: res,
      message: Book.BOOK_ALL,
      statusCode: HttpStatus.OK,
    };
  }

  @UseGuards(AdminGuard)
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<ResType> {
    await this.bookService.update(id, updateBookDto);
    return {
      data: 'ok',
      message: Book.BOOK_UPDATED,
      statusCode: HttpStatus.OK,
    };
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResType> {
    await this.bookService.disable(id);
    return {
      data: '',
      message: Book.BOOK_DISABLED,
      statusCode: HttpStatus.OK,
    };
  }
}
