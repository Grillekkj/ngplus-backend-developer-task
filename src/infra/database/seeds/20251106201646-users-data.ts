import { QueryRunner } from 'typeorm';

import { AccountType } from 'src/modules/users/enums/account-type.enum';
import UsersEntity from 'src/modules/users/entities/users.entity';

export const UsersData20251106201646Seed = {
  name: 'UsersData20251106201646',
  async up(queryRunner: QueryRunner): Promise<any> {
    const users: Partial<UsersEntity>[] = [
      {
        id: '15b8cd52-22ae-4db4-aab9-335925204850',
        profilePictureUrl: 'https://example.com/images/my-profile.png',
        username: 'john_doe',
        email: 'john.doe@example.com',
        passwordHash:
          '$2b$10$lJur5Ukn8LYF7GkVAbKd5eb7gcOvzNI7QhZSp0y82BvdW5rLhM2ni',
        accountType: AccountType.USER,
        ratingCount: 3,
      },
      {
        id: '38183bdb-b8c9-43c8-866f-26d96621e4b3',
        profilePictureUrl: 'https://example.com/images/my-profile.png',
        username: 'ngplus',
        email: 'ngplus@example.com',
        passwordHash:
          '$2b$10$jdEhRPRR5xpfLQ3lA6jlBOZXpl6vrkmetXzAbtLtmMmbujRb3kGrm',
        accountType: AccountType.USER,
        ratingCount: 3,
      },
      {
        id: '635930e1-406d-4495-8756-deee4e8f1354',
        profilePictureUrl: 'https://example.com/images/my-profile.png',
        username: 'joao_victor',
        email: 'joao_victor@example.com',
        passwordHash:
          '$2b$10$0o0PqewT7bznpMYsKUHYHO5FgriMz7RQl7oGfDkYDZjVvezyq68SS',
        accountType: AccountType.ADMIN,
        ratingCount: 3,
      },
      {
        id: 'a936a457-b197-44c9-9f5f-0b5f4de6f71b',
        profilePictureUrl: 'https://example.com/images/my-profile.png',
        username: 'hr',
        email: 'hr@example.com',
        passwordHash:
          '$2b$10$kte9c3ue4YXQvalM1gc9ge56za5EHnv6qhCJ678htM8eQEOxGXADC',
        accountType: AccountType.USER,
        ratingCount: 3,
      },
    ];

    const usersEntities = users.map((data) => {
      const user = new UsersEntity();
      Object.assign(user, data);
      return user;
    });

    await queryRunner.manager.save(usersEntities);
  },
};
