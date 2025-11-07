import UsersEntity from '../entities/users.entity';

export interface IReturnPaginated {
  data: Omit<UsersEntity, 'passwordHash' | 'refreshTokenHash'>[];
  currentPage: number;
  total: number;
}
