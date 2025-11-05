import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';
export class CreateDto {
  @ApiPropertyOptional({
    description: 'URL for the user profile picture.',
    example: 'https://example.com/images/my-profile.png',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'Profile picture URL must be a string.' })
  @MaxLength(255, {
    message: 'Profile picture URL must not exceed 255 characters.',
  })
  profilePictureUrl?: string;

  @ApiProperty({
    description: 'Unique username for the user.',
    example: 'john_doe',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'The username field is required.' })
  @IsString({ message: 'Username must be a string.' })
  @MaxLength(255, { message: 'Username must not exceed 255 characters.' })
  username: string;

  @ApiProperty({
    description: 'Unique email address for the user.',
    example: 'john.doe@example.com',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'The email field is required.' })
  @IsEmail(
    {},
    { message: 'The email field must contain a valid email address.' },
  )
  @MaxLength(255, { message: 'Email must not exceed 255 characters.' })
  email: string;

  @ApiProperty({
    description:
      'User password. Must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
    example: 'StrongP@ss123',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'The password field is required.' })
  @IsString({ message: 'Password must be a string.' })
  @MaxLength(255, { message: 'Password must not exceed 255 characters.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
    },
  )
  password: string;
}
