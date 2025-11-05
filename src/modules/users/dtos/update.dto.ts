import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsString({ message: 'Profile picture URL must be a string.' })
  @MaxLength(255, {
    message: 'Profile picture URL must not exceed 255 characters.',
  })
  profilePictureUrl?: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string.' })
  @MaxLength(255, { message: 'Username must not exceed 255 characters.' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters.' })
  email?: string;
}
