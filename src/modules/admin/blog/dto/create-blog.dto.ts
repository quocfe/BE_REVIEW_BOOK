import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsMongoId()
  book_id: mongoose.Types.ObjectId;

  @IsString()
  @IsMongoId()
  author_id: mongoose.Types.ObjectId;
}
