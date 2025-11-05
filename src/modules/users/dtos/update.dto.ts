import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDto {
  @ApiPropertyOptional({
    description: 'URL for the user profile picture.',
    example: 'https://example.com/images/new-profile.png',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Profile picture URL must be a string.' })
  @MaxLength(255, {
    message: 'Profile picture URL must not exceed 255 characters.',
  })
  profilePictureUrl?: string;

  @ApiPropertyOptional({
    description: 'Unique username for the user.',
    example: 'john_doe_updated',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Username must be a string.' })
  @MaxLength(255, { message: 'Username must not exceed 255 characters.' })
  username?: string;

  @ApiPropertyOptional({
    description: 'Unique email address for the user.',
    example: 'john.doe.new@example.com',
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters.' })
  email?: string;
}
