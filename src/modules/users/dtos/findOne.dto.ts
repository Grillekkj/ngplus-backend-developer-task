import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneDto {
  @IsNotEmpty({ message: 'The id field is required.' })
  @IsString({ message: 'The id must be a string.' })
  @IsUUID('4', { message: 'The id must be a valid UUID v4.' })
  id: string;
}
