import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address of the user requesting password reset.',
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
}
