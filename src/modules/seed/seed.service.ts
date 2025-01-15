import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthorModule } from 'src/modules/admin/author/author.module';
import { BlogModule } from 'src/modules/admin/blog/blog.module';
import { Author } from 'src/schemas/authors.schema';
import { Blog } from 'src/schemas/blogs.schema';
import { Category, CategoryDocument } from 'src/schemas/categories.schema';
import { User, UserDocument } from 'src/schemas/users.schema';
import { hashValue } from 'src/utils/bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorModule>,
    @InjectModel(Blog.name) private blogModel: Model<BlogModule>,
  ) {}

  async seedUsers() {
    // Xóa dữ liệu cũ nếu cần
    await this.userModel.deleteMany();
    const password = hashValue('123456');
    for (let i = 0; i < 10; i++) {
      const user = new this.userModel({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        firstname: `FirstName ${i}`,
        lastname: `LastName ${i}`,
        password: password,
        avatar: process.env.DEFAULT_AVATAR,
        role: 0,
      });
      await user.save();
    }
    // Thêm dữ liệu mới

    console.log('Seeded users successfully');
  }

  async seedCategories() {
    await this.categoryModel.deleteMany();
    // 'Trinh thám', 'Tiểu thuyết', 'Văn học', 'Khoa học'
    const name = [
      { name: 'Trinh thám', slug: 'trinh-tham' },
      { name: 'Tiểu thuyết', slug: 'tieu-thuyet' },
      { name: 'Văn học', slug: 'van-hoc' },
      { name: 'Khoa học', slug: 'khoa-hoc' },
    ];
    await this.categoryModel.insertMany(name);
    console.log('Seeded categories successfully');
  }

  async seedAuthors() {
    await this.authorModel.deleteMany();

    const name = [
      { name: 'Đoàn Giỏi', slug: 'doan-gioi' },
      { name: 'Nam Cao', slug: 'nam-cao' },
    ];
    await this.authorModel.insertMany(name);
    console.log('Seeded authors successfully');
  }
}
