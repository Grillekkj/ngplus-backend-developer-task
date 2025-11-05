import { SetMetadata } from '@nestjs/common';

import { AccountType } from 'src/modules/users/enums/account-type.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AccountType[]) => SetMetadata(ROLES_KEY, roles);
