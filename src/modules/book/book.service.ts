import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from 'src/schemas/books.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  create(createBookDto: CreateBookDto) {
    return this.bookModel.create(createBookDto);
  }

  async findAll() {
    return await this.bookModel
      .find()
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
      });
  }

  async findOne(id: string) {
    return await this.bookModel
      .findById({ _id: id })
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

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
