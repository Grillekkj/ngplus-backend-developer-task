import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindAllRatingsDto {
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

  @ApiPropertyOptional({
    description: 'Filter by User ID.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsOptional()
  @IsUUID('4', { message: 'userId must be a valid UUID v4.' })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by Media ID.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsOptional()
  @IsUUID('4', { message: 'mediaId must be a valid UUID v4.' })
  mediaId?: string;
}
