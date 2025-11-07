import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

import { AccountType } from '../enums/account-type.enum';
import { CreateDto } from './create.dto';

export class CreateAdminDto extends CreateDto {
  @ApiPropertyOptional({
    description: "The user's account type.",
    enum: AccountType,
    default: AccountType.USER,
  })
  @IsOptional()
  @IsEnum(AccountType, { message: 'accountType must be a valid AccountType.' })
  accountType?: AccountType;
}
