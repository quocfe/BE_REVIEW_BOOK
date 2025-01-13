import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Author } from 'src/schemas/authors.schema';

export type BookDocument = Book & Document;

@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class Book {
  _id: ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  slug: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  thumbnail: string;
  @Prop({ required: true })
  year_of_publication: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category_id: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  })
  author_id: mongoose.Schema.Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);
