import { IsOptional, IsEnum } from 'class-validator';

import { AccountType } from '../enums/account-type.enum';
import { CreateDto } from './create.dto';

export class CreateAdminDto extends CreateDto {
  @IsOptional()
  @IsEnum(AccountType, { message: 'accountType must be a valid AccountType.' })
  accountType?: AccountType;
}
