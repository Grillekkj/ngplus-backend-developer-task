import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
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
