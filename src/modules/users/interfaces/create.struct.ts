import { AccountType } from '../enums/account-type.enum';

export interface ICreate {
  profilePictureUrl?: string;
  username: string;
  email: string;
  password: string;
  accountType?: AccountType;
}
