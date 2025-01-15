import { IsOptional, IsString } from 'class-validator';

export class QuerysDto {
  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  limit: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  order: string;
}
