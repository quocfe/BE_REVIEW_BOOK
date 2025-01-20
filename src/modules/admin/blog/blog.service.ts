import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Blog, BlogDocument } from 'src/schemas/blogs.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QuerysDto } from 'src/modules/admin/book/dto/params.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>,
  ) {}
  create(createBlogDto: CreateBlogDto) {
    const blog = this.blogModel.create(createBlogDto);
    return blog;
  }

  async findAll(querys: QuerysDto) {
    const { page = 1, limit = 10, sort, order } = querys;
    const orderField: SortOrder = order === 'asc' ? 1 : -1;
    const sortField = sort ? sort : 'createdAt';
    const condition = { [sortField]: orderField };

    const [blogs, count] = await Promise.all([
      this.blogModel
        .find()
        .sort(condition)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('book_id', 'name slug')
        .populate('author_id', 'name slug avatar')
        .exec()
        .then((blogs) => {
          // Đổi tên trường từ 'author_id' thành 'author'
          return blogs.map((blog) => ({
            ...blog.toObject(),
            author: blog.author_id,
            book: blog.book_id,
            author_id: undefined,
            book_id: undefined,
          }));
        }),
      this.blogModel.countDocuments(),
    ]);

    return {
      blogs: blogs,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalItems: count,
        hasNextPage: Number(page) * Number(limit) < count,
        hasPreviousPage: Number(page) > 1,
      },
    };
  }

  async findOne(id: string) {
    const blog = await this.blogModel
      .findByIdAndUpdate(id, { $inc: { view: 1 } }, { new: true })
      .populate('book_id', 'name slug')
      .populate('author_id', 'name slug avatar')
      .exec();

    if (!blog) {
      throw new Error('Blog not found');
    }

    return {
      ...blog.toObject(),
      author: blog.author_id,
      book: blog.book_id,
      author_id: undefined,
      book_id: undefined,
    };
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const result = await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true })
      .exec();
    if (!result) {
      throw new Error('Blog not found');
    }
    return result;
  }

  async remove(id: string) {
    const deletedBlog = await this.blogModel.findByIdAndDelete(id).exec();

    if (!deletedBlog) {
      throw new Error('Blog not found');
    }

    return {
      message: 'Blog deleted successfully',
      blog: deletedBlog,
    };
  }
}
