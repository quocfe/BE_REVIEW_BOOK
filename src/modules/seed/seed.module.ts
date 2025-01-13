import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/users.schema';
import { Category, CategorySchema } from 'src/schemas/categories.schema';
import { Author, AuthorSchema } from 'src/schemas/authors.schema';
import { Blog, BlogSchema } from 'src/schemas/blogs.schema';
import { Book, BookSchema } from 'src/schemas/books.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
