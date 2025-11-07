import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteDto {
  @ApiProperty({
    description: 'Public URL of the file to be deleted',
    example: 'https://s3.example.com/mybucket/username/file-uuid.jpg',
  })
  //@IsUrl() does not work since the url ends with the file extension and it bugs the validation
  @IsNotEmpty({ message: 'File URL is required.' })
  @IsString({ message: 'File URL must be a string.' })
  fileUrl: string;
}
