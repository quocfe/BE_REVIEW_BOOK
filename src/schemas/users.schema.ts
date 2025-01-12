import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class User {
  _id: ObjectId;
  @Prop({ required: true }) // `username` phải có và duy nhất
  username: string;

  @Prop({ required: true, unique: true }) // `email` phải có và duy nhất
  email: string;

  @Prop({ required: true }) // `password` là trường bắt buộc
  password: string;

  @Prop({
    default:
      'https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper.png',
  }) // `avatar` có giá trị mặc định là rỗng
  avatar: string;

  @Prop({ required: false, default: 0 })
  role: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
