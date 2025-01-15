import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from 'src/schemas/books.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QuerysDto } from 'src/modules/admin/book/dto/params.dto';
import { SortOrder } from 'mongoose';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  create(createBookDto: CreateBookDto) {
    return this.bookModel.create(createBookDto);
  }

  async findAll(querys: QuerysDto) {
    const { page, limit, sort, order } = querys;
    const orderField: SortOrder = order === 'asc' ? 1 : -1;
    const sortField = sort ? sort : 'createdAt';
    const condition = { [sortField]: orderField };
    const [books, count] = await Promise.all([
      this.bookModel
        .find()
        .sort(condition)
        .where({ status: true })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('author_id', 'name slug')
        .populate('category_id', 'name slug avatar')
        .exec()
        .then((books) => {
          // Đổi tên trường từ 'author_id' thành 'author'
          return books.map((book) => ({
            ...book.toObject(),
            author: book.author_id,
            category: book.category_id,
            author_id: undefined,
            category_id: undefined,
          }));
        }),
      this.bookModel.countDocuments(),
    ]);

    return {
      books: books,
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
    return await this.bookModel
      .findById({ _id: id })
      .where({ status: true })
      .populate('author_id', 'name slug')
      .populate('category_id', 'name slug avatar')
      .exec()
      .then((book: any) => {
        return {
          ...book.toObject(),
          author: book.author_id,
          category: book.category_id,
          author_id: undefined,
          category_id: undefined,
        };
      });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    return await this.bookModel.findByIdAndUpdate(id, updateBookDto);
  }

  async disable(id: string) {
    return await this.bookModel.findByIdAndUpdate(id, { status: false });
  }
}
