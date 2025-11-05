import { AccountType } from 'src/modules/users/enums/account-type.enum';

export interface IRequest extends Request {
  user?: {
    userId?: string;
    email?: string;
    username?: string;
    accountType?: AccountType;
    refreshToken?: string;
    jti?: string;
  };
}
