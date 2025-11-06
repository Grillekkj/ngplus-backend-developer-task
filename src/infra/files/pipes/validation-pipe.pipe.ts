import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

import { FileValidationOptions } from '../interfaces/validation-option.struct';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions = {}) {}

  transform(file: Express.Multer.File) {
    if (!file && this.options.required) {
      throw new BadRequestException('File is required');
    }

    if (!file) {
      return file;
    }

    if (this.options.maxByteSize && file.size > this.options.maxByteSize) {
      const maxSizeMB = (this.options.maxByteSize / 1024 / 1024).toFixed(2);
      throw new BadRequestException(
        `File is too large. Maximum size: ${maxSizeMB}MB`,
      );
    }

    if (
      this.options.allowedMimeTypes &&
      !this.options.allowedMimeTypes.includes(file.mimetype)
    ) {
      throw new BadRequestException(
        `File type not allowed. Accepted types: ${this.options.allowedMimeTypes.join(', ')}`,
      );
    }

    return file;
  }
}
