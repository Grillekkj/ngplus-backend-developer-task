import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsDateString,
  ValidateIf,
} from 'class-validator';

import { AccountType } from '../enums/account-type.enum';
import { UpdateDto } from './update.dto';

export class UpdateAdminDto extends UpdateDto {
  @ApiPropertyOptional({
    description: "Admin only: The user's account type.",
    enum: AccountType,
  })
  @IsOptional()
  @IsEnum(AccountType, { message: 'accountType must be a valid AccountType.' })
  accountType?: AccountType;

  @ApiPropertyOptional({
    description: 'Admin only: The hashed refresh token.',
    example: 'null',
  })
  @IsOptional()
  @IsString({ message: 'refreshTokenHash must be a string.' })
  refreshTokenHash?: string;

  @ApiPropertyOptional({
    description: "Admin only: The user's rating count.",
    example: 10,
  })
  @IsOptional()
  @IsInt({ message: 'ratingCount must be a number.' })
  ratingCount?: number;

  @ApiPropertyOptional({
    description: "Admin only: The user's last login timestamp.",
    example: '2025-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsOptional()
  @ValidateIf((o) => o.lastLogin !== null)
  @IsDateString(
    {},
    { message: 'lastLogin must be a valid ISO date string or null.' },
  )
  lastLogin?: Date | null;
}
