import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class RefreshToken {
  _id: ObjectId;
  @Prop({ required: true, unique: true })
  token: string;
  @Prop({ required: true })
  iat: number;
  @Prop({ required: true })
  exp: number;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user_id: ObjectId;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
