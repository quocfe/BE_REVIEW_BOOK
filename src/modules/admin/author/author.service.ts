import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from 'src/schemas/books.schema';
import { Model, SortOrder } from 'mongoose';
import { Author, AuthorDocument } from 'src/schemas/authors.schema';
import { QuerysDto } from 'src/modules/admin/book/dto/params.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name)
    private readonly authorModel: Model<AuthorDocument>,
  ) {}
  async create(createAuthorDto: CreateAuthorDto) {
    const author = await this.authorModel
      .findOne({
        name: createAuthorDto.name,
      })
      .collation({ locale: 'en', strength: 2 });
    if (author) {
      throw new Error('Author exists');
    }
    const res = await this.authorModel.create(createAuthorDto);
    return res;
  }

  async findAll(querys: QuerysDto) {
    const { page = 1, limit = 5, sort, order } = querys;
    const orderField: SortOrder = order === 'asc' ? 1 : -1;
    const sortField = sort ? sort : 'createdAt';
    const condition = { [sortField]: orderField };
    const [authors, count] = await Promise.all([
      this.authorModel
        .find()
        .sort(condition)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .exec(),
      this.authorModel.countDocuments(),
    ]);

    return {
      authors: authors,
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
    const author = await this.authorModel.findById(id);
    if (!author) {
      throw new Error('Author not found');
    }
    return author;
  }

  update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = this.authorModel.findByIdAndUpdate(id, updateAuthorDto);
    return author;
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
