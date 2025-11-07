import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { MediaCategory } from '../enums/category.enum';

export class UpdateMediaDto {
  @ApiPropertyOptional({
    description: 'Title of the media.',
    example: 'My Updated Game',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters.' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the media.',
    example: 'A new description...',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL for the media thumbnail.',
    example: 'https://example.com/images/new-thumbnail.png',
    maxLength: 255,
  })
  @IsOptional()
  @MaxLength(255, {
    message: 'Thumbnail URL must not exceed 255 characters.',
  })
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'URL for the media content.',
    example: 'https://s3.example.com/mybucket/username/new-file.zip',
    maxLength: 255,
  })
  @IsOptional()
  @MaxLength(255, {
    message: 'Content URL must not exceed 255 characters.',
  })
  contentUrl?: string;

  @ApiPropertyOptional({
    description: 'Category of the media.',
    enum: MediaCategory,
    example: MediaCategory.VIDEO,
  })
  @IsOptional()
  @IsEnum(MediaCategory, { message: 'Must be a valid media category.' })
  mediaCategory?: MediaCategory;
}
