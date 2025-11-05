import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteDto {
  //@IsUrl() does not work since the url ends with the file extension and it bugs the validation
  @IsNotEmpty({ message: 'File URL is required.' })
  @IsString({ message: 'File URL must be a string.' })
  fileUrl: string;
}
