import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class Category {
  _id: ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
