import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a valid number.' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a valid number.' })
  limit: number = 10;
}
