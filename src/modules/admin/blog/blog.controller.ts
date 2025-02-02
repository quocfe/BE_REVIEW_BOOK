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
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QuerysDto } from 'src/modules/admin/book/dto/params.dto';
import { AdminGuard } from 'src/common/guard/admin.guard';
import { Public } from 'src/decorators/public-decorator';

@Controller('admin/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto): Promise<ResType> {
    await this.blogService.create(createBlogDto);
    return {
      data: 'ok',
      message: 'Blog created',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Public()
  @Get()
  async findAll(@Query() querys: QuerysDto): Promise<ResType> {
    const blogs = await this.blogService.findAll(querys);
    return {
      data: blogs,
      message: 'Blogs found',
      statusCode: HttpStatus.OK,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResType> {
    const result = await this.blogService.findOne(id);
    return {
      data: result,
      message: 'Blog found',
      statusCode: HttpStatus.OK,
    };
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<ResType> {
    const result = await this.blogService.update(id, updateBlogDto);
    return {
      data: result,
      message: 'Blog updated',
      statusCode: HttpStatus.OK,
    };
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResType> {
    const result = await this.blogService.remove(id);
    return {
      data: result,
      message: 'Blog deleted',
      statusCode: HttpStatus.OK,
    };
  }
}
