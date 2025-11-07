import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindOneMediaDto {
  @ApiProperty({
    description: 'The unique identifier (UUID v4) of the media.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsNotEmpty({ message: 'The id field is required.' })
  @IsString({ message: 'The id must be a string.' })
  @IsUUID('4', { message: 'The id must be a valid UUID v4.' })
  id: string;
}
