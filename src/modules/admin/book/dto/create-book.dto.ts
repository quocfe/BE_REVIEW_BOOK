import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateBookDto {
  @ApiProperty({
    description: 'name',
    default: 'Người đua diều',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'slug',
    default: 'nguoi-dua-dieu',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'thumbnail',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'thumbnail',
  })
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty({
    description: 'year_of_publication',
    default: '10/10/2022',
  })
  @IsString()
  @IsNotEmpty()
  year_of_publication: string;

  @ApiProperty({
    description: 'category_id',
  })
  @IsString()
  @IsNotEmpty()
  category_id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: 'category_id',
  })
  @IsString()
  @IsNotEmpty()
  author_id: mongoose.Types.ObjectId;
}
