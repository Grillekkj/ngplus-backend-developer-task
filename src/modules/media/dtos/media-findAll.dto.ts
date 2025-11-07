import { IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindAllMediaDto {
  @ApiPropertyOptional({
    description: 'The page number for pagination.',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a valid number.' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'The number of items per page.',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a valid number.' })
  limit: number = 10;
}
