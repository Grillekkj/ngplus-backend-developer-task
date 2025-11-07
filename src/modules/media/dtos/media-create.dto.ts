import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsEnum,
} from 'class-validator';

import { MediaCategory } from '../enums/category.enum';

export class CreateMediaDto {
  @ApiProperty({
    description: 'Title of the media.',
    example: 'My First Game',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString({ message: 'Title must be a string.' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters.' })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the media.',
    example: 'This is a game about...',
  })
  @IsNotEmpty({ message: 'Description is required.' })
  @IsString({ message: 'Description must be a string.' })
  description: string;

  @ApiPropertyOptional({
    description: 'URL for the media thumbnail.',
    example: 'https://example.com/images/my-thumbnail.png',
    maxLength: 255,
  })
  @IsOptional()
  @MaxLength(255, {
    message: 'Thumbnail URL must not exceed 255 characters.',
  })
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'URL for the media content (e.g., S3 link, video link).',
    example: 'https://s3.example.com/mybucket/username/game-file.zip',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Content URL is required.' })
  @MaxLength(255, {
    message: 'Content URL must not exceed 255 characters.',
  })
  contentUrl: string;

  @ApiProperty({
    description: 'Category of the media.',
    enum: MediaCategory,
    example: MediaCategory.GAME,
  })
  @IsNotEmpty({ message: 'Media category is required.' })
  @IsEnum(MediaCategory, { message: 'Must be a valid media category.' })
  mediaCategory: MediaCategory;
}
