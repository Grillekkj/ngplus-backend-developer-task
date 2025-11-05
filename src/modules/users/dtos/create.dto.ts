import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateDto {
  @IsOptional()
  @IsString({ message: 'Profile picture URL must be a string.' })
  @MaxLength(255, {
    message: 'Profile picture URL must not exceed 255 characters.',
  })
  profilePictureUrl?: string;

  @IsNotEmpty({ message: 'The username field is required.' })
  @IsString({ message: 'Username must be a string.' })
  @MaxLength(255, { message: 'Username must not exceed 255 characters.' })
  username: string;

  @IsNotEmpty({ message: 'The email field is required.' })
  @IsEmail(
    {},
    { message: 'The email field must contain a valid email address.' },
  )
  @MaxLength(255, { message: 'Email must not exceed 255 characters.' })
  email: string;

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
