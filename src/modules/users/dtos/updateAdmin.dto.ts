import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { UpdateDto } from './update.dto';
import { AccountType } from '../enums/account-type.enum';

export class UpdateAdminDto extends UpdateDto {
  @IsOptional()
  @IsEnum(AccountType, { message: 'accountType must be a valid AccountType.' })
  accountType?: AccountType;

  @IsOptional()
  @IsString({ message: 'refreshTokenHash must be a string.' })
  refreshTokenHash?: string;

  @IsOptional()
  @IsInt({ message: 'ratingCount must be a number.' })
  ratingCount?: number;

  @IsOptional()
  @ValidateIf((o) => o.lastLogin !== null)
  @IsDateString(
    {},
    { message: 'lastLogin must be a valid ISO date string or null.' },
  )
  lastLogin?: Date | null;
}
