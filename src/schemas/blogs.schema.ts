import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class Blog {
  _id: ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  slug: string;
  @Prop({ required: false })
  description: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  thumbnail: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  })
  book_id: mongoose.Schema.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  })
  author_id: mongoose.Schema.Types.ObjectId;
  
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
