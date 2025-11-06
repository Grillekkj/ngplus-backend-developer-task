import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRatingDto {
  @ApiProperty({
    description: 'The new rating value (integer, 1 to 5).',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsInt({ message: 'Rating must be an integer.' })
  @Min(1, { message: 'Rating must be at least 1.' })
  @Max(5, { message: 'Rating must be at least 5.' })
  rating: number;
}
