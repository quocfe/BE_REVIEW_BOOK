import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type AuthorDocument = Author & Document;

@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class Author {
  _id: ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  slug: string;
  @Prop({ required: false })
  avatar: string;
  @Prop({ required: false })
  date_of_birth: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
