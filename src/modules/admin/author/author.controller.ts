import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from 'src/enums/Author.enum';
import { QuerysDto } from 'src/modules/admin/book/dto/params.dto';
import { AdminGuard } from 'src/common/guard/admin.guard';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createAuthorDto: CreateAuthorDto): Promise<ResType> {
    const res = await this.authorService.create(createAuthorDto);
    return {
      data: res,
      message: Author.AUTHOR_CREATED,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  async findAll(@Query() querys: QuerysDto): Promise<ResType> {
    const authors = await this.authorService.findAll(querys);
    return {
      data: authors,
      message: Author.AUTHOR_ALL,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResType> {
    const author = await this.authorService.findOne(id);
    return {
      data: author,
      message: Author.AUTHOR_FIND,
      statusCode: HttpStatus.OK,
    };
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<ResType> {
    await this.authorService.update(id, updateAuthorDto);
    return {
      data: '',
      message: Author.AUTHOR_UPDATED,
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorService.remove(+id);
  }
}
